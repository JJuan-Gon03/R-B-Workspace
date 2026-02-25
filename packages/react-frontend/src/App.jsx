import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Saved from "./Saved";
import Wardrobe from "./Wardrobe";
import Assistant from "./Assistant";
import Homepage from "./homepage";
import { Routes, Route } from "react-router-dom";

function App() {
  const [wardrobeImages, setWardrobeImages] = useState([]);
  const [userId, setUserId] = useState("");

  return (
    <div className="app">
      <Navbar setUserId={setUserId} userId={userId} />
      {userId && <Assistant userId={userId} />}
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Homepage setUserId={setUserId} />} />
          <Route
            path="/saved"
            element={userId ? <Saved /> : <Homepage setUserId={setUserId} />}
          />
          <Route
            path="/wardrobe"
            element={
              userId ? (
                <Wardrobe
                  userId={userId}
                  clothImgUrls={wardrobeImages}
                  setWardrobeImages={setWardrobeImages}
                />
              ) : (
                <Homepage setUserId={setUserId} />
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
