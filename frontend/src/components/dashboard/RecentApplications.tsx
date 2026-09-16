import type { JobApplication } from "../../types";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../applications/StatusBadge";

interface RecentApplicationsProps {
  applications: JobApplication[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentApplications({ applications }: RecentApplicationsProps) {
  if (applications.length === 0) {
    return (
      <EmptyState
        title="No applications yet"
        description="Start tracking your job search by adding your first application."
      />
    );
  }

  return (
    <ul className="recent-list">
      {applications.map((application) => (
        <li className="recent-list-row" key={application.id}>
          <span className="recent-list-logo" aria-hidden="true">
            {application.company.slice(0, 2).toUpperCase()}
          </span>
          <div className="recent-list-info">
            <div className="recent-list-company">{application.company}</div>
            <div className="recent-list-title">{application.jobTitle}</div>
          </div>
          <StatusBadge status={application.status} />
          <span className="recent-list-date">{formatDate(application.applicationDate)}</span>
        </li>
      ))}
    </ul>
  );
}
