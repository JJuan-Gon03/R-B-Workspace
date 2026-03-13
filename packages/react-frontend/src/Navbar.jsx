import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import AuthModal from "./AuthModal";

export default function Navbar({ setUserId, userId, username, setUsername }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState("signin");
  const navigate = useNavigate();

  function handleLogout() {
    setUserId("");
    setUsername("");
    localStorage.removeItem("username");
    navigate("/");
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/">
            <div className="topbar-brand">THRIFTR</div>
          </NavLink>

          {userId && (
            <nav className="topbar-links" aria-label="Primary">
              <NavLink
                to="/wardrobe"
                className={({ isActive }) =>
                  `topbar-link${isActive ? " active" : ""}`
                }
              >
                Closet
              </NavLink>

              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `topbar-link${isActive ? " active" : ""}`
                }
              >
                Shop
              </NavLink>

              <NavLink
                to="/my-items"
                className={({ isActive }) =>
                  `topbar-link${isActive ? " active" : ""}`
                }
              >
                My Items
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
          )}

          <div className="topbar-actions">
            {userId ? (
              <>
                <span className="topbar-userid">{username || userId}</span>
                <button
                  className="topbar-btn topbar-logout"
                  type="button"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  className="topbar-btn"
                  type="button"
                  onClick={() => {
                    setAuthVariant("signin");
                    setAuthOpen(true);
                  }}
                >
                  Sign in
                </button>

                <button
                  className="topbar-btn"
                  type="button"
                  onClick={() => {
                    setAuthVariant("register");
                    setAuthOpen(true);
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {authOpen && (
        <AuthModal
          variant={authVariant}
          onClose={() => setAuthOpen(false)}
          setUserId={setUserId}
          setUsername={setUsername}
        />
      )}
    </>
  );
}
