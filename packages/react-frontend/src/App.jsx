import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Saved from "./Saved";
import Wardrobe from "./Wardrobe";
import Assistant from "./Assistant";
import Homepage from "./homepage";
import { Routes, Route } from "react-router-dom";

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
      <Assistant />

      <main className="page-wrap">
        <Routes>
          <Route path="/homepage" element={<Homepage />} />
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
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
