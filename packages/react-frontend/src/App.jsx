import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Saved from "./Saved";
import Wardrobe from "./Wardrobe";
import Shop from "./Shop";
import CreateListing from "./CreateListing";
import Assistant from "./Assistant";
import Homepage from "./homepage";
import About from "./About";
import Contact from "./Contact";
import { Routes, Route } from "react-router-dom";

function App() {
  const [wardrobeImages, setWardrobeImages] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("userId");
    if (savedUser) {
      setUserId(savedUser);
    }
  }, []);

  return (
    <div className="app">
      <Navbar setUserId={setUserId} userId={userId} />
      {userId && <Assistant userId={userId} />}
      <main className="page-wrap">
        <Routes>
          <Route
            path="/"
            element={<Homepage setUserId={setUserId} userId={userId} />}
          />
          <Route
            path="/saved"
            element={
              userId ? (
                <Saved />
              ) : (
                <Homepage setUserId={setUserId} userId={userId} />
              )
            }
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
                <Homepage setUserId={setUserId} userId={userId} />
              )
            }
          />
          <Route
            path="/shop"
            element={
              userId ? (
                <Shop userId={userId} />
              ) : (
                <Homepage setUserId={setUserId} userId={userId} />
              )
            }
          />
          <Route
            path="/shop/new"
            element={
              userId ? (
                <CreateListing userId={userId} />
              ) : (
                <Homepage setUserId={setUserId} userId={userId} />
              )
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
