import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import type { NotificationPreferences } from "../types";

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "12px 0",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
      }}
    >
      <span>
        <span style={{ display: "block", fontSize: "13.5px", color: "var(--text-primary)" }}>{label}</span>
        <span style={{ display: "block", fontSize: "12.5px", color: "var(--text-muted)" }}>{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={label}
      />
    </label>
  );
}

export default function SettingsPage() {
  const { user, profile, logout, updateNotificationPreferences } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    interviewReminders: true,
    weeklySummary: true,
    productUpdates: false,
  });

  useEffect(() => {
    if (profile?.notificationPreferences) {
      setPreferences(profile.notificationPreferences);
    }
  }, [profile?.notificationPreferences]);

  const handlePreferenceChange = async (key: keyof NotificationPreferences, checked: boolean) => {
    const nextPreferences = { ...preferences, [key]: checked };
    setPreferences(nextPreferences);

    try {
      await updateNotificationPreferences({ [key]: checked });
    } catch (error) {
      setPreferences(preferences);
      console.error("Failed to save notification preference:", error);
    }
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>Settings</h1>
          <p>Preferences for how JobTrack notifies and displays your search.</p>
        </div>
      </div>

      <div className="settings-card">
        <h2>Notifications</h2>
        <p>Choose what JobTrack should keep you posted about.</p>
        <ToggleRow
          label="Interview reminders"
          description="Get notified the day before a scheduled interview."
          checked={preferences.interviewReminders}
          onChange={(checked) => handlePreferenceChange("interviewReminders", checked)}
        />
        <ToggleRow
          label="Weekly summary"
          description="A recap of new applications and status changes each week."
          checked={preferences.weeklySummary}
          onChange={(checked) => handlePreferenceChange("weeklySummary", checked)}
        />
        <ToggleRow
          label="Product updates"
          description="Occasional news about new JobTrack features."
          checked={preferences.productUpdates}
          onChange={(checked) => handlePreferenceChange("productUpdates", checked)}
        />
      </div>

      <div className="settings-card">
        <h2>Account</h2>
        <div style={{ display: "grid", gap: "10px" }}>
          <div>
            <strong style={{ display: "block", color: "var(--text-primary)" }}>Name</strong>
            <span style={{ color: "var(--text-secondary)" }}>
              {profile?.displayName || user?.displayName || "Not available"}
            </span>
          </div>

          <div>
            <strong style={{ display: "block", color: "var(--text-primary)" }}>Email</strong>
            <span style={{ color: "var(--text-secondary)" }}>{user?.email || profile?.email || "Not available"}</span>
          </div>

          <div>
            <strong style={{ display: "block", color: "var(--text-primary)" }}>User ID</strong>
            <span style={{ color: "var(--text-secondary)" }}>{user?.uid || profile?.uid || "Not available"}</span>
          </div>

          <button
            type="button"
            className="submit-button"
            onClick={() => logout()}
            style={{ width: "fit-content", minWidth: "160px", marginTop: "8px" }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
