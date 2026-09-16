import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import MobileNav from "./components/layout/MobileNav";
import DashboardPage from "./pages/Dashboard";
import ApplicationsPage from "./pages/Applications";
import InterviewsPage from "./pages/Interviews";
import CompaniesPage from "./pages/Companies";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/applications": "Applications",
  "/interviews": "Interviews",
  "/companies": "Companies",
  "/profile": "Profile",
  "/settings": "Settings",
};

function AppShell() {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user: authUser, profile, logout, loading } = useAuth();

  if (loading) {
    return <div className="auth-page">Checking session...</div>;
  }

  if (!authUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const user = profile ?? {
    uid: authUser.uid,
    firstName: authUser.displayName?.split(" ")[0] ?? "",
    lastName: authUser.displayName?.split(" ").slice(1).join(" ") ?? "",
    displayName: authUser.displayName || authUser.email?.split("@")[0] || "User",
    email: authUser.email || "",
    country: "",
    photoURL: authUser.photoURL || "",
  };

  async function handleLogout() {
    await logout();
  }

  const title = pageTitles[location.pathname] ?? "JobTrack";

  return (
    <div className="app-shell">
      <Sidebar onLogout={handleLogout} />
      {mobileNavOpen && (
        <MobileNav onClose={() => setMobileNavOpen(false)} onLogout={handleLogout} />
      )}

      <div className="main-column">
        <Header
          title={title}
          user={user}
          onLogout={handleLogout}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage user={user} />} />
            <Route path="/applications" element={<ApplicationsPage user={user} />} />
            <Route path="/interviews" element={<InterviewsPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
