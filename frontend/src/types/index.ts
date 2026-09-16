/**
 * Shared domain types for JobTrack.
 *
 * These types describe the shape of data the frontend works with today
 * (backed by mock data / local state) and are designed to map directly
 * onto the future Go API + Firestore documents, so no rewrite is needed
 * when the real backend is wired in.
 */

/** A user's profile. Will eventually be populated from Firestore
 *  at `users/{uid}` after Firebase Authentication resolves a UID. */
export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  country?: string;
  photoURL?: string;
  notificationPreferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  interviewReminders: boolean;
  weeklySummary: boolean;
  productUpdates: boolean;
}

export type ApplicationStatus =
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance";

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

/** A single job application record, owned by a user.
 *  `userId` mirrors the future Firebase UID so the model already
 *  supports multi-user data without any structural change later. */
export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  jobTitle: string;
  location: string;
  employmentType: EmploymentType;
  status: ApplicationStatus;
  applicationDate: string;
  jobUrl?: string;
  notes?: string;
}

/** Fields collected by the add/edit application form.
 *  `id` and `userId` are assigned by the service layer, not the form. */
export type JobApplicationInput = Omit<JobApplication, "id" | "userId">;

/** Aggregate counts shown on the dashboard. Always derived from
 *  `JobApplication[]`, never hard-coded. */
export interface ApplicationStats {
  total: number;
  interviews: number;
  offers: number;
  rejected: number;
}
