import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav-root">
      <div className="nav-container">
        <nav className="nav-links" role="tablist" aria-label="Primary">
          <NavLink
            to="/generate"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Generate Outfit
          </NavLink>
          <NavLink
            to="/saved"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Saved
          </NavLink>
          <NavLink
            to="/wardrobe"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Wardrobe
          </NavLink>
          <NavLink
            to="/shared"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Shared
          </NavLink>

        </nav>
      </div>
    </header>
  );
}
