import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="nav-root">
      <div className="nav-container">
        <nav className="nav-links" role="tablist" aria-label="Primary">
          <NavLink
            to="/generate"
            className={({ isActive }) =>
              `nav-link generate${isActive ? " active" : ""}`
            }
          >
            Generate Outfit
          </NavLink>
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              `nav-link saved${isActive ? " active" : ""}`
            }
          >
            Saved
          </NavLink>
          <NavLink
            to="/wardrobe"
            className={({ isActive }) =>
              `nav-link wardrobe${isActive ? " active" : ""}`
            }
          >
            Wardrobe
          </NavLink>
          <NavLink
            to="/shared"
            className={({ isActive }) =>
              `nav-link shared${isActive ? " active" : ""}`
            }
          >
            Shared
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
