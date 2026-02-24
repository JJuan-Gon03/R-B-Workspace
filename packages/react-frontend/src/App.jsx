import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Saved from "./Saved";
import Wardrobe from "./Wardrobe";
import Assistant from "./Assistant";
import Homepage from "./Homepage.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  const [wardrobeImages, setWardrobeImages] = useState([]);

  return (
    <div className="app">
      <Navbar />
      <Assistant />

      <main className="page-wrap">
        <Routes>
          <Route
            path="/"
            element={
              <Wardrobe
                clothImgUrls={wardrobeImages}
                setWardrobeImages={setWardrobeImages}
              />
            }
          />
          <Route path="/saved" element={<Saved />} />
          <Route
            path="/wardrobe"
            element={
              <Wardrobe
                clothImgUrls={wardrobeImages}
                setWardrobeImages={setWardrobeImages}
              />
            }
          />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
