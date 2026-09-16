import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user, loading, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (loading) {
    return <div className="auth-page">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in.");
    }
  }

  async function handlePasswordReset() {
    if (!email.trim()) {
      setError("Enter your email first so we can send the reset link.");
      setInfo("");
      return;
    }

    try {
      setError("");
      await resetPassword(email.trim());
      setInfo("Password reset link sent. Check your email inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
      setInfo("");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-panel auth-brand-panel">
          <div className="brand-mark">J</div>
          <p className="eyebrow">JobTrack</p>
          <h1>Stay on top of every opportunity.</h1>
          <p className="brand-copy">
            Track applications, interviews, and next steps in one clear dashboard built for busy job
            seekers.
          </p>
          <ul className="feature-list">
            <li>Application insights</li>
            <li>Interview planning</li>
            <li>Career momentum dashboard</li>
          </ul>
        </div>

        <div className="auth-panel auth-form-panel">
          <div className="auth-header">
            <p className="eyebrow">Welcome back</p>
            <h2>Sign in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((open) => !open)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="auth-row">
              <button type="button" className="text-button" onClick={handlePasswordReset}>
                Forgot password?
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}
            {info && <p className="success-message">{info}</p>}

            <button type="submit" className="submit-button">
              Log in
            </button>
          </form>

          <p className="switch-copy">
            Need an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
