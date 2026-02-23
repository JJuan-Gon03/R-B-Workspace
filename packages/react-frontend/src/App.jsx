import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Saved from "./Saved";
import Wardrobe from "./Wardrobe";
import Assistant from "./Assistant";
import Homepage from "./Homepage";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthModal";

function App() {
  const [wardrobeImages, setWardrobeImages] = useState([]);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If they log in while on /homepage, send them to /wardrobe automatically
  useEffect(() => {
    if (isAuthenticated && location.pathname === "/homepage") {
      // let router handle it with a redirect route below
      // (keeping this effect is optional, but it helps if auth flips true in-place)
    }
  }, [isAuthenticated, location.pathname]);

  return (
    <div className="app">
      <Navbar />

      {/* AI button should ONLY appear when logged in */}
      {isAuthenticated && <Assistant />}

      <main className="page-wrap">
        <Routes>
          {/* PUBLIC landing */}
          <Route
            path="/homepage"
            element={
              isAuthenticated ? <Navigate to="/wardrobe" replace /> : <Homepage />
            }
          />

          {}
          <Route
            path="/wardrobe"
            element={
              isAuthenticated ? (
                <Wardrobe
                  clothImgUrls={wardrobeImages}
                  setWardrobeImages={setWardrobeImages}
                />
              ) : (
                <Navigate to="/homepage" replace />
              )
            }
          />

          <Route
            path="/saved"
            element={
              isAuthenticated ? <Saved /> : <Navigate to="/homepage" replace />
            }
          />

          {/* Root path: send to wardrobe if logged in, otherwise homepage */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/wardrobe" replace />
              ) : (
                <Navigate to="/homepage" replace />
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/homepage" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
