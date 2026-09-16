import type { ApplicationStatus } from "../../types";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusClassMap: Record<ApplicationStatus, string> = {
  Applied: "status-badge--applied",
  Interview: "status-badge--interview",
  Offer: "status-badge--offer",
  Rejected: "status-badge--rejected",
  Withdrawn: "status-badge--withdrawn",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${statusClassMap[status]}`}>
      <span className="status-badge-dot" aria-hidden="true" />
      {status}
    </span>
  );
}
