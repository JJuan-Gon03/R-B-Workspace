import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import GenerateOutfit from "./GenerateOutfit";
import Saved from "./Saved";
import Wardrobe from "./Wardrobe";
import Shared from "./Shared";
import { Routes, Route, useLocation } from "react-router-dom";
import ActiveBackground from "./ActiveBackground";

// each background color settings
const THEMES = {
  "/": {
    // generate (orange)
    minHeight: 200.0,
    minWidth: 200.0,
    highlightColor: 0xffc300,
    midtoneColor: 0xfcfcfc,
    lowlightColor: 0xf4105a,
    baseColor: 0xffffff,
    blurFactor: 0.6,
    speed: 2,
    zoom: 1,
  },
  "/generate": {
    // orange
    minHeight: 200.0,
    minWidth: 200.0,
    highlightColor: 0xffc300,
    midtoneColor: 0xfcfcfc,
    lowlightColor: 0xf4105a,
    baseColor: 0xffffff,
    blurFactor: 0.6,
    speed: 2,
    zoom: 1,
  },
  "/saved": {
    // blue
    minHeight: 200.0,
    minWidth: 200.0,
    highlightColor: 0x9aa9ed,
    midtoneColor: 0xd2d3ef,
    lowlightColor: 0x7188ef,
    baseColor: 0xffffff,
    blurFactor: 0.6,
    speed: 2,
    zoom: 1,
  },
  "/wardrobe": {
    // green
    minHeight: 200.0,
    minWidth: 200.0,
    highlightColor: 0x9aed9d,
    midtoneColor: 0x0d2d3ef,
    lowlightColor: 0xd8e1a,
    baseColor: 0xffffff,
    blurFactor: 0.6,
    speed: 2,
    zoom: 1,
  },
  "/shared": {
    // pink
    minHeight: 200.0,
    minWidth: 200.0,
    highlightColor: 0xed9acf,
    midtoneColor: 0xefd2ed,
    lowlightColor: 0x8e0c77,
    baseColor: 0xffffff,
    blurFactor: 0.6,
    speed: 2,
    zoom: 1,
  },
};

function App() {
  const [wardrobeImages, setWardrobeImages] = useState([]);
  const [sharedImages, setSharedImages] = useState([]);

  const location = useLocation();
  const theme = THEMES[location.pathname] || THEMES["/"];

  const addWardrobeImage = (url) => {
    if (!url) return;
    setWardrobeImages((prev) => [url, ...prev]);
  };

  const shareImage = (url) => {
    setWardrobeImages((prev) => prev.filter((u) => u !== url));
    setSharedImages((prev) => [url, ...prev]);
  };

  return (
    <div>
      <ActiveBackground theme={theme} />
      <Navbar />
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<GenerateOutfit />} />
          <Route path="/generate" element={<GenerateOutfit />} />
          <Route path="/saved" element={<Saved />} />
          <Route
            path="/wardrobe"
            element={
              <Wardrobe
                clothImgUrls={wardrobeImages}
                updateClothesDisplay={addWardrobeImage}
                onShare={shareImage}
              />
            }
          />
          <Route
            path="/shared"
            element={<Shared sharedImgUrls={sharedImages} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
