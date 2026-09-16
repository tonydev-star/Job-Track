import { useEffect, useRef, useState } from "react";
import type { JobApplication } from "../../types";
import StatusBadge from "./StatusBadge";

interface ApplicationTableProps {
  applications: JobApplication[];
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

function RowActions({
  application,
  onEdit,
  onDelete,
}: {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="row-actions" ref={ref}>
      <button
        type="button"
        className="row-actions-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${application.company} application`}
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="5" r="1.6" fill="currentColor" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <circle cx="12" cy="19" r="1.6" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div className="row-actions-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onEdit(application);
              setOpen(false);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            className="danger"
            onClick={() => {
              onDelete(application);
              setOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function ApplicationTable({ applications, onEdit, onDelete }: ApplicationTableProps) {
  return (
    <div className="table-wrapper">
      <table className="applications-table">
        <thead>
          <tr>
            <th scope="col">Company</th>
            <th scope="col">Job Title</th>
            <th scope="col">Location</th>
            <th scope="col">Status</th>
            <th scope="col">Application Date</th>
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td className="cell-company">{application.company}</td>
              <td>{application.jobTitle}</td>
              <td className="cell-muted">{application.location}</td>
              <td>
                <StatusBadge status={application.status} />
              </td>
              <td className="cell-muted">{formatDate(application.applicationDate)}</td>
              <td>
                <RowActions application={application} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
