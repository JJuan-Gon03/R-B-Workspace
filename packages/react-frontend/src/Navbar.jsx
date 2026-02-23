import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import AuthModal, { useAuth } from "./AuthModal";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [authOpen, setAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState("signin");

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/homepage", { replace: true });
  };

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          {/* Logo */}
          <Link to="/homepage" className="topbar-brand">
            THRIFTR
          </Link>

          {/* Logged OUT */}
          {!isAuthenticated && (
            <div className="topbar-actions">
              <button
                className="topbar-btn"
                onClick={() => {
                  setAuthVariant("signin");
                  setAuthOpen(true);
                }}
              >
                Sign In
              </button>

              <button
                className="topbar-btn"
                onClick={() => {
                  setAuthVariant("register");
                  setAuthOpen(true);
                }}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Logged IN */}
          {isAuthenticated && (
            <>
              <nav className="topbar-links">
                <NavLink
                  to="/wardrobe"
                  className={({ isActive }) =>
                    `topbar-link${isActive ? " active" : ""}`
                  }
                >
                  Closet
                </NavLink>

                <NavLink
                  to="/saved"
                  className={({ isActive }) =>
                    `topbar-link${isActive ? " active" : ""}`
                  }
                >
                  Saved
                </NavLink>
              </nav>

              <div className="topbar-actions" ref={menuRef}>
                <button
                  className="topbar-btn"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  Account
                </button>

                {menuOpen && (
                  <div className="account-dropdown">
                    <button className="dropdown-item">Profile</button>
                    <button className="dropdown-item">Settings</button>
                    <button
                      className="dropdown-item danger"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {authOpen && (
        <AuthModal
          variant={authVariant}
          onClose={() => setAuthOpen(false)}
        />
      )}
    </>
  );
}
