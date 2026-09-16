import { useEffect, useState } from "react";
import type { JobApplication, JobApplicationInput, UserProfile } from "../types";
import { createApplication, getApplications } from "../services/api";
import DashboardView from "../components/dashboard/Dashboard";
import ApplicationModal from "../components/applications/ApplicationModal";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

interface DashboardPageProps {
  user: UserProfile;
}

export default function DashboardPage({ user }: DashboardPageProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  async function loadApplications() {
    setLoading(true);
    setError(false);
    try {
      const data = await getApplications();
      setApplications(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleSave(input: JobApplicationInput) {
    const created = await createApplication(input, user.uid);
    setApplications((prev) => [created, ...prev]);
    setModalOpen(false);
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage onRetry={loadApplications} />;

  return (
    <>
      <DashboardView user={user} applications={applications} onAddApplication={() => setModalOpen(true)} />
      {isModalOpen && (
        <ApplicationModal onClose={() => setModalOpen(false)} onSave={handleSave} />
      )}
    </>
  );
}
