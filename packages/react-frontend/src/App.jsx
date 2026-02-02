
import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Saved from "./Saved";
import Wardrobe from "./Wardrobe";
import Assistant from "./Assistant";
import Homepage from "./homepage"
import { Routes, Route } from "react-router-dom";


import Shop from "./Shop.jsx";
import CreateListing from "./CreateListing.jsx";

function App() {
  const [wardrobeImages, setWardrobeImages] = useState([]);

  return (
    <div className="app">
      <Navbar />
      <Assistant />
      <Routes>
        <Route path="/homepage" element={<Homepage />}/>
      </Routes>
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

          
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/new" element={<CreateListing />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
