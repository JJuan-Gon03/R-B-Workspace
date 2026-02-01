import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState("signin");
  
  return (
    <>
    <header className="topbar">
      <div className="topbar-inner">
        <a href="/homepage">
        <div className="topbar-brand">THRIFTR</div>
        </a>
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
            to="/shared" //delete shared and turn into shop
            className={({ isActive }) =>
              `topbar-link${isActive ? " active" : ""}`
            }
          >
            Shop
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

        <div className="topbar-actions">
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
        </div>
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
