import { useEffect, useState } from "react";
import "./AuthModal.css";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";

export default function AuthModal({ variant = "signin", onClose, setUserId }) {
  const isRegister = variant === "register";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setBusy(true);
    try {
      const endpoint = isRegister
        ? `${API_BASE}/users`
        : `${API_BASE}/users/login`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong");
      }

      const userId = await res.text();
      setUserId(userId);
      onClose?.();
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
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
              <div className="modal-left-text">
                {isRegister ? "Join THRIFTR" : "Welcome back"}
              </div>
              <div className="modal-left-hint">
                {isRegister
                  ? "Save & shop your style"
                  : "Pick up where you left off"}
              </div>
            </div>
          </div>

          <form className="modal-form" onSubmit={handleSubmit}>
            {/* Google sign-in */}
            <button
              className="google-btn"
              type="button"
              onClick={() => {
                window.location.href = `${API_BASE}/auth/google?mode=${variant}`;
              }}
            >
              Continue with Google
            </button>

            <div className="divider" role="separator" aria-label="or">
              <span>or</span>
            </div>

            <label className="field">
              <span className="field-label">Username*</span>
              <input
                className="field-input"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Password*</span>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {isRegister && (
              <label className="field">
                <span className="field-label">Confirm Password*</span>
                <input
                  className="field-input"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>
            )}

            {error && (
              <p
                style={{
                  color: "#e53e3e",
                  fontSize: "0.85rem",
                  margin: "0 0 8px",
                }}
              >
                {error}
              </p>
            )}

            <div className="modal-footer">
              <button className="modal-btn" type="button" onClick={onClose}>
                Cancel
              </button>
              <button
                className="modal-btn primary"
                type="submit"
                disabled={busy}
              >
                {busy
                  ? "Please wait…"
                  : isRegister
                    ? "Create account"
                    : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}