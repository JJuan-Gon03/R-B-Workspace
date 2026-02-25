import React from "react";
import "./homepage.css";
import { useState } from "react";
import AuthModal from "./AuthModal";

const Homepage = ({ setUserId }) => {
  const images = [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300",
  ];
  const [authOpen, setAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState("signin");

  return (
    <>
      <div className="thriftr-container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1>
            Find Clothes
            <br />
            You Want.
          </h1>
          <div className="image-row">
            {images.map((url, index) => (
              <div key={index} className="clothing-card">
                <img src={url} alt="Clothing item" />
              </div>
            ))}
          </div>
          <div className="dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="content-wrapper">
            <h2>How It Works</h2>
            <p className="description">
              With our shop you swipe right if you like the item. And swipe left
              if you don't. Careful though, because once you swipe left you'll
              never see it again!
            </p>

            <div className="info-grid">
              <div className="info-box">
                <h3>Buy</h3>
                <ul>
                  <li>Go to our shop to buy</li>
                  <li>Scroll through our shop to find listings you want!</li>
                  <li>
                    You can receive feedback if the item you want goes with
                    anything you have on our closet page
                  </li>
                </ul>
              </div>

              <div className="info-box">
                <h3>Sell</h3>
                <ul>
                  <li>List items from your closet</li>
                  <li>Add a description and link to where you're selling</li>
                  <li>Keep everything organized and easy to update</li>
                </ul>
              </div>

              <div className="info-box">
                <h3>Closet</h3>
                <ul>
                  <li>Know what you own</li>
                  <li>Get pairing ideas to create amazing outfits</li>
                  <li>Decide on what to keep vs what to list</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready To Start on THRIFTR?</h2>
          <p>Sign up to swipe, save, sell and simplify your closet.</p>
          <button
            className="get-started-btn"
            type="button"
            onClick={() => {
              setAuthVariant("register");
              setAuthOpen(true);
            }}
          >
            Get Started
          </button>
        </section>

        {/* Footer */}
        <footer className="footer">
          <span>©2025 THRIFTR</span>
          <div className="footer-links">
            <a href="#signup">Sign up</a> | <a href="#contact">Contact</a> |{" "}
            <a href="#about">About</a>
          </div>
        </footer>
      </div>
      {authOpen && (
        <AuthModal
          variant={authVariant}
          onClose={() => setAuthOpen(false)}
          setUserId={setUserId}
        />
      )}
    </>
  );
};

export default Homepage;
