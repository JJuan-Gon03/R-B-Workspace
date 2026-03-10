import { useState, useEffect } from "react";
import CreateListing from "./CreateListing.jsx";
import "./Wardrobe.css";
import "./Shop.css";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";

export default function MyItems({ userId }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editListing, setEditListing] = useState(null);

  useEffect(() => {
    fetch(API_BASE + "/listings/user/" + userId)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load your listings.");
        return r.json();
      })
      .then(setListings)
      .catch((err) => setError(err?.message || "Something went wrong."))
      .finally(() => setLoading(false));
  }, [userId]);

  function handleDelete(id) {
    setListings((prev) => prev.filter((l) => l._id !== id));
    fetch(`${API_BASE}/listings/${id}?user_id=${userId}`, {
      method: "DELETE",
    }).catch(() => {
      fetch(API_BASE + "/listings/user/" + userId)
        .then((r) => r.json())
        .then(setListings);
    });
  }

  return (
    <div className="shop-layout">
      <main className="shop-main" style={{ width: "100%" }}>
        <div className="wardrobe-header">
          <h1 className="wardrobe-title">My Items</h1>
          {!loading && (
            <span className="wardrobe-count">
              {listings.length} listing{listings.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading && <p className="shop-status-msg">Loading…</p>}
        {error && <p className="shop-status-msg shop-error-msg">{error}</p>}

        {!loading && listings.length === 0 && !error && (
          <div className="shop-empty-state">
            <p>You haven&apos;t listed anything yet.</p>
          </div>
        )}

        <div className="wardrobe-grid">
          {listings.map((listing) => (
            <div key={listing._id} className="wardrobe-card shop-listing-card">
              <img src={listing.img_url} alt={listing.title} />
              <div className="shop-card-info">
                <span className="shop-card-title">{listing.title}</span>
                <span className="shop-card-price">
                  ${Number(listing.price).toFixed(2)}
                </span>
                {listing.marketplace && (
                  <span className="shop-marketplace-badge">
                    {listing.marketplace}
                  </span>
                )}
              </div>
              <div className="my-items-actions">
                <button type="button" onClick={() => setEditListing(listing)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(listing._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {editListing && (
        <CreateListing
          userId={userId}
          listingId={editListing._id}
          initialData={editListing}
          onClose={() => setEditListing(null)}
          onSuccess={(updated) => {
            setListings((prev) =>
              prev.map((l) => (l._id === updated._id ? updated : l))
            );
            setEditListing(null);
          }}
        />
      )}
    </div>
  );
}
