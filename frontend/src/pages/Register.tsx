import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return <div className="auth-page">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await register(name.trim(), email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-panel auth-brand-panel">
          <div className="brand-mark">J</div>
          <p className="eyebrow">Join JobTrack</p>
          <h1>Build momentum for your next move.</h1>
          <p className="brand-copy">
            Organize applications, track interviews, and keep your job search focused and stress-free.
          </p>
        </div>

        <div className="auth-panel auth-form-panel">
          <div className="auth-header">
            <p className="eyebrow">Create account</p>
            <h2>Start your profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field">
              <span>Full name</span>
              <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" required />
            </label>

            <label className="field">
              <span>Email address</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </label>

            <label className="field">
              <span>Password</span>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
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

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="submit-button">
              Create account
            </button>
          </form>

          <p className="switch-copy">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
