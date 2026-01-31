import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-brand">THRIFTR</div>

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
            to="/saved"
            className={({ isActive }) =>
              `topbar-link${isActive ? " active" : ""}`
            }
          >
            Saved
          </NavLink>
        </nav>

        <div className="topbar-actions">
          <button className="topbar-btn" type="button">
            Sign in
          </button>
          <button className="topbar-btn" type="button">
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
