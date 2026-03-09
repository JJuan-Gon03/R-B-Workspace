import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Saved.css";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";

function BookmarkIcon({ filled }) {
  return filled ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#5B46D9">
      <path d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5B46D9"
      strokeWidth="2"
    >
      <path d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" />
    </svg>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="saved-empty">
      <div className="saved-empty-icon">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hanger hook */}
          <path
            d="M50 12 C50 12 50 6 56 6 C62 6 62 12 56 16"
            stroke="#5B46D9"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Hanger stem */}
          <path
            d="M50 16 L50 28"
            stroke="#5B46D9"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Hanger shoulders */}
          <path
            d="M50 28 C50 28 20 42 14 48 C10 52 12 56 16 56 L84 56 C88 56 90 52 86 48 C80 42 50 28 50 28Z"
            stroke="#5B46D9"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(91,70,217,0.12)"
          />
          {/* Tag */}
          <rect
            x="38"
            y="60"
            width="24"
            height="30"
            rx="4"
            stroke="#5B46D9"
            strokeWidth="2.5"
            fill="rgba(91,70,217,0.08)"
          />
          <circle cx="50" cy="58" r="2.5" fill="#5B46D9" />
          <line
            x1="44"
            y1="70"
            x2="56"
            y2="70"
            stroke="#5B46D9"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="44"
            y1="77"
            x2="56"
            y2="77"
            stroke="#5B46D9"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>
      <h2 className="saved-empty-heading">Nothing saved yet</h2>
      <p className="saved-empty-sub">
        Browse the Shop and hit the bookmark icon on anything you like
      </p>
      <button
        className="saved-empty-btn"
        type="button"
        onClick={() => navigate("/shop")}
      >
        Browse Shop
      </button>
    </div>
  );
}

export default function Saved() {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_BASE + "/saved/1")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load saved items.");
        return r.json();
      })
      .then((data) => {
        setSavedListings(
          data.filter((s) => s.listing_id).map((s) => s.listing_id)
        );
      })
      .catch((err) => setError(err?.message || "Something went wrong."))
      .finally(() => setLoading(false));
  }, []);

  function handleUnsave(listing_id) {
    setSavedListings((prev) => prev.filter((l) => l._id !== listing_id));
    fetch(`${API_BASE}/saved/1/${listing_id}`, { method: "DELETE" }).catch(
      () => {
        fetch(API_BASE + "/saved/1")
          .then((r) => r.json())
          .then((data) =>
            setSavedListings(
              data.filter((s) => s.listing_id).map((s) => s.listing_id)
            )
          );
      }
    );
  }

  return (
    <div className="saved-page">
      <div className="saved-header">
        <h1 className="saved-title">Saved</h1>
        {!loading && savedListings.length > 0 && (
          <span className="saved-count">
            {savedListings.length} item{savedListings.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {loading && <p className="saved-loading">Loading…</p>}
      {error && <p className="saved-error">{error}</p>}

      {!loading && !error && savedListings.length === 0 && <EmptyState />}

      {!loading && savedListings.length > 0 && (
        <div className="saved-grid">
          {savedListings.map((listing) => (
            <div key={listing._id} className="saved-card">
              <img src={listing.img_url} alt={listing.title} />
              <div className="saved-card-info">
                <span className="saved-card-title">{listing.title}</span>
                <span className="saved-card-price">
                  ${Number(listing.price).toFixed(2)}
                </span>
                {listing.marketplace && (
                  <span className="shop-marketplace-badge">
                    {listing.marketplace}
                  </span>
                )}
              </div>
              <button
                className="saved-unsave-btn"
                type="button"
                onClick={() => handleUnsave(listing._id)}
              >
                <BookmarkIcon filled={true} />
                Unsave
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
