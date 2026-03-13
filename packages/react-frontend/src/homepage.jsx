import { useState, useEffect } from "react";
import "./homepage.css";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
  "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300",
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300",
];

const Homepage = ({ setUserId, userId, setUsername }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [authOpen, setAuthOpen] = useState(false);
  const [authVariant, setAuthVariant] = useState("signin");

  useEffect(() => {
    fetch(API_BASE + "/listings")
      .then((res) => (res.ok ? res.json() : []))
      .then((listings) => {
        const shopImgs = listings
          .filter((l) => l.img_url)
          .slice(0, 5)
          .map((l) => l.img_url);
        if (shopImgs.length > 0) {
          setImages([...FALLBACK_IMAGES, ...shopImgs]);
        }
      })
      .catch(() => {});
  }, []);

  const track = [...images, ...images];

  const duration = `${images.length * 4}s`;

  return (
    <>
      <div className="thriftr-container">
        <section className="hero-section">
          <h1>
            Find Clothes,
            <br />
            You Need.
          </h1>

          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{ animationDuration: duration }}
            >
              {track.map((url, index) => (
                <div key={index} className="clothing-card">
                  <img src={url} alt="Clothing item" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div className="dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </section>

        <section className="how-it-works">
          <div className="content-wrapper">
            <h2>How It Works</h2>
            <p className="description">
              With our shop you swipe right if you like the item. And swipe left
              if you don&apos;t. Careful though, because once you swipe left
              you&apos;ll never see it again!
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
                  <li>
                    Add a description and link to where you&apos;re selling
                  </li>
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

        <section className="cta-section">
          <h2>Ready To Start on THRIFTR?</h2>
          <p>
            {userId
              ? "Jump back into your wardrobe and keep building your style."
              : "Sign up to swipe, save, sell and simplify your closet."}
          </p>
          <button
            className="get-started-btn"
            type="button"
            onClick={() => {
              if (!userId) {
                setAuthVariant("register");
                setAuthOpen(true);
              } else {
                navigate("/wardrobe");
              }
            }}
          >
            {userId ? "Go to Wardrobe" : "Get Started"}
          </button>
        </section>

        <footer className="footer">
          <span>©2025 THRIFTR — Made by R&amp;B</span>
          <div className="footer-links">
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="footer-link-btn"
            >
              Contact
            </button>
            {" | "}
            <button
              type="button"
              onClick={() => navigate("/about")}
              className="footer-link-btn"
            >
              About
            </button>
          </div>
        </footer>
      </div>

      {authOpen && (
        <AuthModal
          variant={authVariant}
          onClose={() => setAuthOpen(false)}
          setUserId={setUserId}
          setUsername={setUsername}
        />
      )}
    </>
  );
};

export default Homepage;
