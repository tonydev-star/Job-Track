import { useState, type FormEvent } from "react";
import type {
  ApplicationStatus,
  EmploymentType,
  JobApplication,
  JobApplicationInput,
} from "../../types";
import { APPLICATION_STATUSES, EMPLOYMENT_TYPES } from "../../types";
import Modal from "../common/Modal";
import Button from "../common/Button";

interface ApplicationModalProps {
  application?: JobApplication | null;
  onClose: () => void;
  onSave: (input: JobApplicationInput) => void;
}

interface FormState {
  company: string;
  jobTitle: string;
  location: string;
  employmentType: EmploymentType;
  status: ApplicationStatus;
  applicationDate: string;
  jobUrl: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function toFormState(application?: JobApplication | null): FormState {
  if (!application) {
    return {
      company: "",
      jobTitle: "",
      location: "",
      employmentType: "Full-time",
      status: "Applied",
      applicationDate: todayIsoDate(),
      jobUrl: "",
      notes: "",
    };
  }
  return {
    company: application.company,
    jobTitle: application.jobTitle,
    location: application.location,
    employmentType: application.employmentType,
    status: application.status,
    applicationDate: application.applicationDate,
    jobUrl: application.jobUrl ?? "",
    notes: application.notes ?? "",
  };
}

export default function ApplicationModal({ application, onClose, onSave }: ApplicationModalProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(application));
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = Boolean(application);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!form.company.trim()) nextErrors.company = "Company is required.";
    if (!form.jobTitle.trim()) nextErrors.jobTitle = "Job title is required.";
    if (!form.location.trim()) nextErrors.location = "Location is required.";
    if (!form.applicationDate) nextErrors.applicationDate = "Application date is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    onSave({
      company: form.company.trim(),
      jobTitle: form.jobTitle.trim(),
      location: form.location.trim(),
      employmentType: form.employmentType,
      status: form.status,
      applicationDate: form.applicationDate,
      jobUrl: form.jobUrl.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
  }

  return (
    <Modal title={isEditing ? "Edit application" : "Add application"} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(event) => update("company", event.target.value)}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "company-error" : undefined}
            />
            {errors.company && (
              <span className="field-error" id="company-error">
                {errors.company}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              id="jobTitle"
              type="text"
              value={form.jobTitle}
              onChange={(event) => update("jobTitle", event.target.value)}
              aria-invalid={Boolean(errors.jobTitle)}
              aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
            />
            {errors.jobTitle && (
              <span className="field-error" id="jobTitle-error">
                {errors.jobTitle}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(event) => update("location", event.target.value)}
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {errors.location && (
              <span className="field-error" id="location-error">
                {errors.location}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="employmentType">Employment Type</label>
            <select
              id="employmentType"
              value={form.employmentType}
              onChange={(event) => update("employmentType", event.target.value as EmploymentType)}
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(event) => update("status", event.target.value as ApplicationStatus)}
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="applicationDate">Application Date</label>
            <input
              id="applicationDate"
              type="date"
              value={form.applicationDate}
              onChange={(event) => update("applicationDate", event.target.value)}
              aria-invalid={Boolean(errors.applicationDate)}
              aria-describedby={errors.applicationDate ? "applicationDate-error" : undefined}
            />
            {errors.applicationDate && (
              <span className="field-error" id="applicationDate-error">
                {errors.applicationDate}
              </span>
            )}
          </div>

          <div className="field field-full">
            <label htmlFor="jobUrl">Job URL</label>
            <input
              id="jobUrl"
              type="url"
              placeholder="https://"
              value={form.jobUrl}
              onChange={(event) => update("jobUrl", event.target.value)}
            />
          </div>

          <div className="field field-full">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
            />
          </div>
        </div>

        <div className="modal-form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}
