import { useEffect, useMemo, useState } from "react";
import type { JobApplication } from "../types";
import { getApplications } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/applications/StatusBadge";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function InterviewsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      setApplications(await getApplications());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const interviews = useMemo(
    () => applications.filter((application) => application.status === "Interview"),
    [applications],
  );

  if (loading) return <Loading message="Loading your interviews..." />;
  if (error) return <ErrorMessage onRetry={load} />;

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>Interviews</h1>
          <p>Every application currently in an interview stage.</p>
        </div>
      </div>

      {interviews.length === 0 ? (
        <EmptyState
          title="No interviews scheduled"
          description="Applications you move to the Interview status will show up here."
        />
      ) : (
        <div className="table-wrapper">
          <table className="applications-table">
            <thead>
              <tr>
                <th scope="col">Company</th>
                <th scope="col">Job Title</th>
                <th scope="col">Location</th>
                <th scope="col">Status</th>
                <th scope="col">Application Date</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((application) => (
                <tr key={application.id}>
                  <td className="cell-company">{application.company}</td>
                  <td>{application.jobTitle}</td>
                  <td className="cell-muted">{application.location}</td>
                  <td>
                    <StatusBadge status={application.status} />
                  </td>
                  <td className="cell-muted">{formatDate(application.applicationDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
