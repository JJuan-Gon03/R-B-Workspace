import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import GenerateOutfit from "./GenerateOutfit";
import Saved from "./Saved";
import Wardrobe from "./Wardrobe";
import Shared from "./Shared";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [wardrobeImages, setWardrobeImages] = useState([]);
  const [sharedImages, setSharedImages] = useState([]);

  const shareImage = (url) => {
    setWardrobeImages((prev) => prev.filter((u) => u !== url));
    setSharedImages((prev) => [url, ...prev]);
  };

  return (
    <div>
      <Navbar />
      <main classname="page-wrap">
        <Routes>
          <Route path="/" element={<GenerateOutfit replace />} />
          <Route path="/generate" element={<GenerateOutfit />} />
          <Route path="/saved" element={<Saved />} />
          <Route
            path="/wardrobe"
            element={
              <Wardrobe
                clothImgUrls={wardrobeImages}
                setWardrobeImages={setWardrobeImages}
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
