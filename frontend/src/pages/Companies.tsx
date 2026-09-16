import { useEffect, useMemo, useState } from "react";
import type { JobApplication } from "../types";
import { getApplications } from "../services/api";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

interface CompanySummary {
  name: string;
  applicationCount: number;
  latestStatus: JobApplication["status"];
  latestDate: string;
}

export default function CompaniesPage() {
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

  const companies = useMemo<CompanySummary[]>(() => {
    const byCompany = new Map<string, JobApplication[]>();
    applications.forEach((application) => {
      const existing = byCompany.get(application.company) ?? [];
      byCompany.set(application.company, [...existing, application]);
    });

    return Array.from(byCompany.entries())
      .map(([name, apps]) => {
        const latest = [...apps].sort(
          (a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime(),
        )[0];
        return {
          name,
          applicationCount: apps.length,
          latestStatus: latest.status,
          latestDate: latest.applicationDate,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [applications]);

  if (loading) return <Loading message="Loading your companies..." />;
  if (error) return <ErrorMessage onRetry={load} />;

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>Companies</h1>
          <p>Every company you've applied to, grouped together.</p>
        </div>
      </div>

      {companies.length === 0 ? (
        <EmptyState
          title="No companies yet"
          description="Companies you apply to will be grouped here automatically."
        />
      ) : (
        <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {companies.map((company) => (
            <div className="stat-card" key={company.name}>
              <div className="stat-card-top">
                <span className="recent-list-logo" aria-hidden="true">
                  {company.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="stat-card-label" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {company.name}
              </span>
              <span className="stat-card-label">
                {company.applicationCount} application{company.applicationCount === 1 ? "" : "s"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
