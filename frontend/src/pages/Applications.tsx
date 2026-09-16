import { useEffect, useMemo, useState } from "react";
import type { ApplicationStatus, JobApplication, JobApplicationInput, UserProfile } from "../types";
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from "../services/api";
import ApplicationFilters from "../components/applications/ApplicationFilters";
import ApplicationTable from "../components/applications/ApplicationTable";
import ApplicationCard from "../components/applications/ApplicationCard";
import ApplicationModal from "../components/applications/ApplicationModal";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

interface ApplicationsPageProps {
  user: UserProfile;
}

export default function ApplicationsPage({ user }: ApplicationsPageProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState<ApplicationStatus | "All">("All");

  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<JobApplication | null>(null);

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

  const filteredApplications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesStatus = activeStatus === "All" || application.status === activeStatus;
      if (!matchesStatus) return false;
      if (!term) return true;
      return (
        application.company.toLowerCase().includes(term) ||
        application.jobTitle.toLowerCase().includes(term) ||
        application.location.toLowerCase().includes(term) ||
        application.status.toLowerCase().includes(term)
      );
    });
  }, [applications, searchTerm, activeStatus]);

  function openAddForm() {
    setEditingApplication(null);
    setFormOpen(true);
  }

  function openEditForm(application: JobApplication) {
    setEditingApplication(application);
    setFormOpen(true);
  }

  async function handleSave(input: JobApplicationInput) {
    if (editingApplication) {
      const updated = await updateApplication(editingApplication.id, input);
      setApplications((prev) =>
        prev.map((application) => (application.id === updated.id ? updated : application)),
      );
    } else {
      const created = await createApplication(input, user.uid);
      setApplications((prev) => [created, ...prev]);
    }
    setFormOpen(false);
    setEditingApplication(null);
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    await deleteApplication(pendingDelete.id);
    setApplications((prev) => prev.filter((application) => application.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage onRetry={loadApplications} />;

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>Applications</h1>
          <p>Track and manage every role you've applied to.</p>
        </div>
        <Button variant="primary" onClick={openAddForm}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Add Application</span>
        </Button>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Start tracking your job search by adding your first application."
          action={
            <Button variant="primary" onClick={openAddForm}>
              + Add Application
            </Button>
          }
        />
      ) : (
        <>
          <ApplicationFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
          />

          {filteredApplications.length === 0 ? (
            <EmptyState
              title="No matching applications"
              description="Try a different search term or clear your filters."
            />
          ) : (
            <>
              <ApplicationTable
                applications={filteredApplications}
                onEdit={openEditForm}
                onDelete={setPendingDelete}
              />
              <div className="application-cards">
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onEdit={openEditForm}
                    onDelete={setPendingDelete}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {isFormOpen && (
        <ApplicationModal
          application={editingApplication}
          onClose={() => {
            setFormOpen(false);
            setEditingApplication(null);
          }}
          onSave={handleSave}
        />
      )}

      {pendingDelete && (
        <Modal title="Delete application?" onClose={() => setPendingDelete(null)} size="sm">
          <p className="modal-body-text">
            Are you sure you want to remove the application to {pendingDelete.company} for{" "}
            {pendingDelete.jobTitle}? This can't be undone.
          </p>
          <div className="modal-form-actions">
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
