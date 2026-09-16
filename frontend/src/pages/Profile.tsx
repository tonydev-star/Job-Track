import type { UserProfile } from "../types";

interface ProfilePageProps {
  user: UserProfile;
}

function getInitials(user: UserProfile): string {
  const first = user.firstName?.[0] ?? "";
  const last = user.lastName?.[0] ?? "";
  return (first + last).toUpperCase() || "U";
}

export default function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>Profile</h1>
          <p>Synced from your Firebase account and Firestore profile.</p>
        </div>
      </div>

      <div className="settings-card">
        <div className="form-grid">
          <div className="profile-identity field-full">
            <span className="user-avatar" aria-hidden="true">
              {getInitials(user)}
            </span>
            <div>
              <h3>{user.displayName || `${user.firstName} ${user.lastName}`.trim() || "User"}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input id="firstName" type="text" value={user.firstName ?? ""} readOnly />
          </div>
          <div className="field">
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" type="text" value={user.lastName ?? ""} readOnly />
          </div>
          <div className="field field-full">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={user.email ?? ""} readOnly />
          </div>
          <div className="field field-full">
            <label htmlFor="country">Country</label>
            <input id="country" type="text" value={user.country ?? ""} readOnly />
          </div>

          <p className="field-full" style={{ color: "var(--text-muted)", margin: 0 }}>
            Profile details are read-only and loaded from Firestore.
          </p>
        </div>
      </div>
    </div>
  );
}
