import type { JobApplication } from "../../types";
import StatusBadge from "./StatusBadge";

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ApplicationCard({ application, onEdit, onDelete }: ApplicationCardProps) {
  return (
    <div className="application-card">
      <div className="application-card-top">
        <div>
          <div className="application-card-company">{application.company}</div>
          <div className="application-card-title">{application.jobTitle}</div>
          <div className="application-card-location">{application.location}</div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="application-card-meta">
        <span>Applied {formatDate(application.applicationDate)}</span>
      </div>

      <div className="application-card-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(application)}>
          Edit
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDelete(application)}>
          Delete
        </button>
      </div>
    </div>
  );
}
