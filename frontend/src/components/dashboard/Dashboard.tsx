import { useMemo } from "react";
import type { ApplicationStats, JobApplication, UserProfile } from "../../types";
import StatCard from "./StatCard";
import RecentApplications from "./RecentApplications";
import Button from "../common/Button";

interface DashboardProps {
  user: UserProfile;
  applications: JobApplication[];
  onAddApplication: () => void;
}

function computeStats(applications: JobApplication[]): ApplicationStats {
  return {
    total: applications.length,
    interviews: applications.filter((application) => application.status === "Interview").length,
    offers: applications.filter((application) => application.status === "Offer").length,
    rejected: applications.filter((application) => application.status === "Rejected").length,
  };
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

const iconProps = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;

export default function Dashboard({ user, applications, onAddApplication }: DashboardProps) {
  const stats = useMemo(() => computeStats(applications), [applications]);
  const greeting = getGreeting();

  const recent = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
        .slice(0, 5),
    [applications],
  );

  return (
    <div>
      <div className="dashboard-greeting">
        <h1>{greeting}, {user.displayName} 👋</h1>
        <p>Here's your job search overview.</p>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Total Applications"
          value={stats.total}
          accentColor="var(--status-applied)"
          accentBg="var(--status-applied-bg)"
          icon={
            <svg {...iconProps}>
              <path
                d="M7 3h10a1 1 0 0 1 1 1v16l-6-3-6 3V4a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <StatCard
          label="Interviews"
          value={stats.interviews}
          accentColor="var(--status-interview)"
          accentBg="var(--status-interview-bg)"
          icon={
            <svg {...iconProps}>
              <path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          label="Offers"
          value={stats.offers}
          accentColor="var(--status-offer)"
          accentBg="var(--status-offer-bg)"
          icon={
            <svg {...iconProps}>
              <path
                d="m4 12 5 5L20 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          accentColor="var(--status-rejected)"
          accentBg="var(--status-rejected-bg)"
          icon={
            <svg {...iconProps}>
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </div>

      <div className="dashboard-section-header">
        <h2>Recent Applications</h2>
      </div>
      <RecentApplications applications={recent} />

      <div className="dashboard-cta-row">
        <Button variant="primary" onClick={onAddApplication}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Add Application</span>
        </Button>
      </div>
    </div>
  );
}
