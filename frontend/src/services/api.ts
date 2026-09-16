import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import type { JobApplication, JobApplicationInput } from "../types";
import { auth, db } from "./firebase";

function getCurrentUserId(): string {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("You must be signed in to manage applications.");
  }

  return uid;
}

function normalizeApplicationDate(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "toDate" in value) {
    const maybeDate = value as { toDate: () => Date };
    return maybeDate.toDate().toISOString().slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
}

function fromFirestoreSnapshot(document: { id: string; data: () => Record<string, unknown> }): JobApplication {
  const data = document.data();

  return {
    id: document.id,
    userId: String(data.userId ?? ""),
    company: String(data.company ?? ""),
    jobTitle: String(data.jobTitle ?? ""),
    location: String(data.location ?? ""),
    employmentType: (data.employmentType as JobApplication["employmentType"]) ?? "Full-time",
    status: (data.status as JobApplication["status"]) ?? "Applied",
    applicationDate: normalizeApplicationDate(data.applicationDate),
    jobUrl: typeof data.jobUrl === "string" ? data.jobUrl : undefined,
    notes: typeof data.notes === "string" ? data.notes : undefined,
  };
}

export async function getApplications(userId = getCurrentUserId()): Promise<JobApplication[]> {
  const userApplicationsQuery = query(collection(db, "applications"), where("userId", "==", userId));

  const snapshot = await getDocs(userApplicationsQuery);
  const applications = snapshot.docs.map((document) => fromFirestoreSnapshot(document));

  return applications.sort(
    (a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime(),
  );
}

export async function createApplication(
  input: JobApplicationInput,
  userId = getCurrentUserId(),
): Promise<JobApplication> {
  const applicationRef = doc(collection(db, "applications"));
  const newApplication: JobApplication = {
    ...input,
    id: applicationRef.id,
    userId,
    applicationDate: input.applicationDate || new Date().toISOString().slice(0, 10),
  };

  await setDoc(applicationRef, {
    ...newApplication,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return newApplication;
}

export async function updateApplication(
  id: string,
  input: JobApplicationInput,
): Promise<JobApplication> {
  const applicationRef = doc(db, "applications", id);
  const existing = await getDoc(applicationRef);

  if (!existing.exists()) {
    throw new Error(`Application with id "${id}" was not found.`);
  }

  const currentUserId = getCurrentUserId();
  const data = existing.data();

  if (data.userId !== currentUserId) {
    throw new Error("You are not allowed to update this application.");
  }

  const updatedApplication: JobApplication = {
    ...existing.data(),
    ...input,
    id,
    userId: currentUserId,
    applicationDate: input.applicationDate || existing.data().applicationDate || new Date().toISOString().slice(0, 10),
  } as JobApplication;

  await setDoc(
    applicationRef,
    {
      ...updatedApplication,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return updatedApplication;
}

export async function deleteApplication(id: string): Promise<void> {
  const applicationRef = doc(db, "applications", id);
  const existing = await getDoc(applicationRef);

  if (!existing.exists()) {
    throw new Error(`Application with id "${id}" was not found.`);
  }

  if (existing.data().userId !== getCurrentUserId()) {
    throw new Error("You are not allowed to delete this application.");
  }

  await deleteDoc(applicationRef);
}
