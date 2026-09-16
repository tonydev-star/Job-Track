import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import type { NotificationPreferences, UserProfile } from "../types";
import { auth, db } from "../services/firebase";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  saveProfile: (values: Partial<UserProfile>) => Promise<UserProfile>;
  updateNotificationPreferences: (values: Partial<NotificationPreferences>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function splitName(displayName: string | null | undefined) {
  const safeName = (displayName ?? "").trim();

  if (!safeName) {
    return { firstName: "", lastName: "" };
  }

  const parts = safeName.split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

function toProfile(
  user: User,
  fallbackName?: string,
  existingData: Record<string, unknown> = {},
): UserProfile {
  const safeName = fallbackName?.trim() || user.displayName?.trim() || "";
  const names = splitName(safeName);

  return {
    uid: user.uid,
    firstName: names.firstName,
    lastName: names.lastName,
    displayName: user.displayName || safeName || user.email?.split("@")[0] || "User",
    email: user.email || "",
    country: typeof existingData.country === "string" ? existingData.country : "",
    photoURL: user.photoURL || "",
    notificationPreferences: existingData.notificationPreferences as NotificationPreferences | undefined,
  };
}

async function detectCountryFromIp(): Promise<string> {
  try {
    const response = await fetch("https://ipapi.co/json/");

    if (!response.ok) {
      return "";
    }

    const data = (await response.json()) as { country_name?: unknown };
    return typeof data.country_name === "string" ? data.country_name : "";
  } catch {
    return "";
  }
}

async function syncProfileToFirestore(user: User, explicitDisplayName?: string) {
  const name = explicitDisplayName?.trim() || user.displayName?.trim() || "";
  const { firstName, lastName } = splitName(name);
  const profileRef = doc(db, "users", user.uid);
  const existingProfile = await getDoc(profileRef);
  const existingData = existingProfile.data() ?? {};
  const existingCountry = typeof existingData.country === "string" ? existingData.country : "";
  const detectedCountry = existingCountry || (await detectCountryFromIp());

  const nextProfile: Record<string, unknown> = {
    uid: user.uid,
    firstName: existingData.firstName || firstName || "",
    lastName: existingData.lastName || lastName || "",
    displayName: existingData.displayName || name || user.email?.split("@")[0] || "User",
    email: existingData.email || user.email || "",
    country: detectedCountry,
    photoURL: existingData.photoURL || user.photoURL || "",
    updatedAt: serverTimestamp(),
  };

  if (!existingProfile.exists()) {
    nextProfile.createdAt = serverTimestamp();
  }

  await setDoc(profileRef, nextProfile, { merge: true });

  return toProfile(user, String(nextProfile.displayName ?? ""), existingData);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const syncedProfile = await syncProfileToFirestore(nextUser);
        setProfile(syncedProfile);
      } catch (error) {
        console.error("Failed to sync Firestore profile:", error);
        setProfile(toProfile(nextUser));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
      },
      register: async (displayName: string, email: string, password: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        if (displayName) {
          await updateProfile(result.user, { displayName });
        }

        const preparedProfile = await syncProfileToFirestore(result.user, displayName);
        setProfile(preparedProfile);
      },
      saveProfile: async (values: Partial<UserProfile>) => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("You must be signed in to update your profile.");
        }

        const firstName = values.firstName?.trim() ?? profile?.firstName ?? "";
        const lastName = values.lastName?.trim() ?? profile?.lastName ?? "";
        const displayName =
          values.displayName?.trim() ||
          [firstName, lastName].filter(Boolean).join(" ") ||
          currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "User";

        const profileRef = doc(db, "users", currentUser.uid);
        const existingProfile = await getDoc(profileRef);

        const nextProfile: Record<string, unknown> = {
          uid: currentUser.uid,
          firstName,
          lastName,
          displayName,
          email: currentUser.email || values.email || profile?.email || "",
          country: values.country ?? profile?.country ?? "",
          photoURL: currentUser.photoURL || values.photoURL || profile?.photoURL || "",
          updatedAt: serverTimestamp(),
        };

        if (!existingProfile.exists()) {
          nextProfile.createdAt = serverTimestamp();
        }

        await updateProfile(currentUser, { displayName });
        await setDoc(profileRef, nextProfile, { merge: true });

        const savedProfile: UserProfile = {
          uid: currentUser.uid,
          firstName,
          lastName,
          displayName,
          email: currentUser.email || values.email || profile?.email || "",
          country: values.country ?? profile?.country ?? "",
          photoURL: currentUser.photoURL || values.photoURL || profile?.photoURL || "",
        };

        setProfile(savedProfile);
        return savedProfile;
      },
      updateNotificationPreferences: async (values: Partial<NotificationPreferences>) => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("You must be signed in to update notification preferences.");
        }

        const currentPreferences: NotificationPreferences = {
          interviewReminders: profile?.notificationPreferences?.interviewReminders ?? true,
          weeklySummary: profile?.notificationPreferences?.weeklySummary ?? true,
          productUpdates: profile?.notificationPreferences?.productUpdates ?? false,
        };
        const nextPreferences = { ...currentPreferences, ...values };

        await updateDoc(doc(db, "users", currentUser.uid), {
          notificationPreferences: nextPreferences,
          updatedAt: serverTimestamp(),
        });

        setProfile((currentProfile) =>
          currentProfile
            ? { ...currentProfile, notificationPreferences: nextPreferences }
            : currentProfile,
        );
      },
      resetPassword: async (email: string) => {
        await sendPasswordResetEmail(auth, email);
      },
      logout: async () => {
        await signOut(auth);
      },
      getIdToken: async () => {
        if (!auth.currentUser) {
          return null;
        }

        return auth.currentUser.getIdToken();
      },
    }),
    [user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
