import { useEffect, useState } from "react";
import "./AuthModal.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function AuthModal({ variant = "signin", onClose }) {
  const isRegister = variant === "register";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const payload = Object.fromEntries(form.entries());

      // client-side password match check for register
      if (isRegister && payload.password !== payload.confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      // If you don’t want to send confirmPassword to backend:
      if (payload.confirmPassword) delete payload.confirmPassword;

      const endpoint = isRegister ? "/auth/register" : "/auth/login";

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // IMPORTANT if backend sets cookie
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || "Authentication failed");
        setLoading(false);
        return;
      }

      onClose?.();
      window.location.href = "/homepage";
    } catch (err) {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  function handleGoogle() {
    // pass mode through so backend can treat register/signin differently if you want
    window.location.href = `${API_BASE}/auth/google?mode=${variant}`;
  }

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button className="modal-close" type="button" aria-label="Close" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2 className="modal-title" id="auth-modal-title">
            {isRegister ? "Register" : "Sign in"}
          </h2>
          <p className="modal-subtitle">
            {isRegister
              ? "Create an account to start thrifting smarter"
              : "Welcome back — sign in to your account"}
          </p>
        </div>

        <div className="modal-body">
          <div className="modal-left">
            <div className="modal-left-box">
              <div className="modal-left-icon">👕</div>
              <div className="modal-left-text">{isRegister ? "Join THRIFTR" : "Welcome back"}</div>
              <div className="modal-left-hint">
                {isRegister ? "Save & shop your style" : "Pick up where you left off"}
              </div>
            </div>
          </div>

          <form className="modal-form" onSubmit={handleSubmit}>
            <button className="google-btn" type="button" onClick={handleGoogle}>
              Continue with Google
            </button>

            <div className="divider" role="separator" aria-label="or">
              <span>or</span>
            </div>

            {isRegister && (
              <label className="field">
                <span className="field-label">Name*</span>
                <input
                  className="field-input"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  disabled={loading}
                />
              </label>
            )}

            <label className="field">
              <span className="field-label">Email*</span>
              <input
                className="field-input"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </label>

            <label className="field">
              <span className="field-label">Password*</span>
              <input
                className="field-input"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </label>

            {isRegister && (
              <label className="field">
                <span className="field-label">Confirm Password*</span>
                <input
                  className="field-input"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </label>
            )}

            {error && <div className="form-error">{error}</div>}

            <div className="modal-footer">
              <button className="modal-btn ghost" type="button" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button className="modal-btn primary" type="submit" disabled={loading}>
                {loading ? "Working..." : isRegister ? "Create account" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
