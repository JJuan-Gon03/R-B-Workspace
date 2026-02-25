import { useEffect } from "react";
import "./AuthModal.css";

export default function AuthModal({ variant = "signin", onClose, setUserId }) {
  const isRegister = variant === "register";

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

          <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
            {/* Google sign-in */}
            <button
              className="google-btn"
              type="button"
              onClick={() => {
                window.location.href =
                  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net/auth/google?mode=signin";
              }}
            >
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
                  type="text"
                  placeholder="Your name"
                  required
                />
              </label>
            )}

            <label className="field">
              <span className="field-label">Email*</span>
              <input
                className="field-input"
                type="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Password*</span>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
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
                  required
                />
              </label>
            )}

            <div className="modal-footer">
              <button className="modal-btn" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="modal-btn primary" type="submit">
                {isRegister ? "Create account" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
