import type { JobApplication, UserProfile } from "../types";

/**
 * DEVELOPMENT-ONLY MOCK DATA.
 *
 * None of the values below represent a real person, account, or record.
 * They exist purely so the UI has something to render before the Go API
 * and Firebase Authentication/Firestore are wired in.
 *
 * When the backend lands:
 *  - `mockUser` is replaced by the profile loaded from
 *    Firebase Authentication -> Firebase UID -> Firestore `users/{uid}`.
 *  - `mockApplications` is replaced by the response of
 *    `GET /api/applications` for the authenticated user.
 */

export const mockUser: UserProfile = {
  uid: "demo-user",
  firstName: "Demo",
  lastName: "User",
  displayName: "User",
  email: "demo@example.com",
};

export const mockApplications: JobApplication[] = [
  {
    id: "app-1",
    userId: "demo-user",
    company: "Google",
    jobTitle: "Software Engineer",
    location: "Remote",
    employmentType: "Full-time",
    status: "Applied",
    applicationDate: "2026-09-12",
    jobUrl: "https://careers.google.com",
    notes: "Referred by a former teammate.",
  },
  {
    id: "app-2",
    userId: "demo-user",
    company: "Microsoft",
    jobTitle: "Full Stack Developer",
    location: "Remote",
    employmentType: "Full-time",
    status: "Interview",
    applicationDate: "2026-09-10",
    jobUrl: "https://careers.microsoft.com",
    notes: "Technical interview scheduled for next week.",
  },
  {
    id: "app-3",
    userId: "demo-user",
    company: "Andela",
    jobTitle: "Backend Developer",
    location: "Remote",
    employmentType: "Contract",
    status: "Applied",
    applicationDate: "2026-09-08",
  },
  {
    id: "app-4",
    userId: "demo-user",
    company: "Safaricom",
    jobTitle: "Software Engineer",
    location: "Nairobi, Kenya",
    employmentType: "Full-time",
    status: "Rejected",
    applicationDate: "2026-09-05",
    notes: "Didn't move past the first screen.",
  },
  {
    id: "app-5",
    userId: "demo-user",
    company: "Stripe",
    jobTitle: "Frontend Engineer",
    location: "Remote",
    employmentType: "Full-time",
    status: "Offer",
    applicationDate: "2026-08-29",
    jobUrl: "https://stripe.com/jobs",
    notes: "Offer received, negotiating start date.",
  },
  {
    id: "app-6",
    userId: "demo-user",
    company: "Flutterwave",
    jobTitle: "Product Engineer",
    location: "Lagos, Nigeria",
    employmentType: "Full-time",
    status: "Interview",
    applicationDate: "2026-08-24",
  },
  {
    id: "app-7",
    userId: "demo-user",
    company: "Paystack",
    jobTitle: "Backend Engineer",
    location: "Remote",
    employmentType: "Full-time",
    status: "Withdrawn",
    applicationDate: "2026-08-15",
    notes: "Took another offer before this progressed.",
  },
];
