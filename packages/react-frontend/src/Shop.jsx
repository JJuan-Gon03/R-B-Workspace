import { useState, useEffect, useMemo } from "react";
import CreateListing from "./CreateListing.jsx";
import "./Wardrobe.css";
import "./Upload2.css";
import "./Shop.css";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";

const CATEGORIES = [
  "All",
  "Tops",
  "Bottoms",
  "Jackets",
  "Shoes",
  "Accessories",
];
const MARKETPLACES = ["eBay", "Grailed"];
const BRANDS = ["Nike", "Adidas", "Levi's", "Uniqlo", "Other"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const GENDERS = ["Men", "Women", "Unisex"];
const COLORS = [
  "Black",
  "White",
  "Gray",
  "Blue",
  "Red",
  "Green",
  "Yellow",
  "Brown",
  "Purple",
];
const COLOR_HEX = {
  Black: "#111",
  White: "#f5f5f5",
  Gray: "#888",
  Blue: "#3b6fd4",
  Red: "#d43b3b",
  Green: "#3bad5a",
  Yellow: "#e8c12a",
  Brown: "#8b5e3c",
  Purple: "#8b3bd4",
};
const SORT_OPTIONS = ["Newest", "Price Low-High", "Price High-Low"];

function toggleItem(arr, item) {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function BookmarkIcon({ filled }) {
  return filled ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#5B46D9">
      <path d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" />
    </svg>
  );
}

export default function Shop({ userId }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [savedIds, setSavedIds] = useState(new Set());
  const [savingIds, setSavingIds] = useState(new Set());

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMarketplaces, setSelectedMarketplaces] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  const [openSections, setOpenSections] = useState(
    new Set(["Marketplace", "Brand", "Size", "Gender", "Price", "Color", "Sort"])
  );

  const [detailListing, setDetailListing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    document.body.classList.add("shop-page");

    Promise.all([
      fetch(API_BASE + "/listings").then((r) => {
        if (!r.ok) throw new Error("Failed to load listings.");
        return r.json();
      }),
      fetch(API_BASE + "/saved/1").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([listingsData, savedData]) => {
        setListings(listingsData);
        setSavedIds(
          new Set(
            savedData.map((s) => String(s.listing_id?._id ?? s.listing_id))
          )
        );
      })
      .catch((err) => setFetchError(err?.message || "Failed to load."))
      .finally(() => setLoading(false));

    return () => {
      document.body.classList.remove("shop-page");
    };
  }, []);

  function toggleSection(name) {
    setOpenSections((prev) => {
      const s = new Set(prev);
      s.has(name) ? s.delete(name) : s.add(name);
      return s;
    });
  }

  function toggleSave(listing_id, e) {
    e.stopPropagation();
    if (savingIds.has(listing_id)) return;
    const isSaved = savedIds.has(listing_id);

    setSavedIds((prev) => {
      const s = new Set(prev);
      isSaved ? s.delete(listing_id) : s.add(listing_id);
      return s;
    });
    setSavingIds((prev) => new Set([...prev, listing_id]));

    const req = isSaved
      ? fetch(`${API_BASE}/saved/1/${listing_id}`, { method: "DELETE" })
      : fetch(`${API_BASE}/saved`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: 1, listing_id }),
        });

    req
      .catch(() => {
        setSavedIds((prev) => {
          const s = new Set(prev);
          isSaved ? s.add(listing_id) : s.delete(listing_id);
          return s;
        });
      })
      .finally(() => {
        setSavingIds((prev) => {
          const s = new Set(prev);
          s.delete(listing_id);
          return s;
        });
      });
  }

  function handleReset() {
    setSearch("");
    setActiveCategory("All");
    setSelectedMarketplaces([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedGenders([]);
    setSelectedColors([]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("Newest");
  }

  const filteredListings = useMemo(() => {
    let result = listings;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.description && l.description.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== "All") {
      result = result.filter((l) => l.category === activeCategory);
    }

    if (selectedMarketplaces.length) {
      result = result.filter((l) =>
        selectedMarketplaces.includes(l.marketplace)
      );
    }

    if (selectedBrands.length) {
      result = result.filter((l) => selectedBrands.includes(l.brand));
    }

    if (selectedSizes.length) {
      result = result.filter((l) => selectedSizes.includes(l.size));
    }

    if (selectedGenders.length) {
      result = result.filter((l) => selectedGenders.includes(l.gender));
    }

    if (selectedColors.length) {
      result = result.filter((l) => selectedColors.includes(l.color));
    }

    if (minPrice !== "") {
      result = result.filter((l) => l.price >= Number(minPrice));
    }

    if (maxPrice !== "") {
      result = result.filter((l) => l.price <= Number(maxPrice));
    }

    if (sortBy === "Price Low-High") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price High-Low") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    listings,
    search,
    activeCategory,
    selectedMarketplaces,
    selectedBrands,
    selectedSizes,
    selectedGenders,
    selectedColors,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  return (
    <div className="shop-layout">

      <aside className="shop-sidebar">
        <div className="sidebar-search-wrap">
          <input
            className="sidebar-search"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="shop-sidebar-scroll">

        {/* Marketplace */}
        <div className="shop-filter-section">
          <button
            type="button"
            className="shop-filter-header"
            onClick={() => toggleSection("Marketplace")}
          >
            <span>Marketplace</span>
            <span className={`shop-filter-chevron ${openSections.has("Marketplace") ? "open" : ""}`}>›</span>
          </button>
          <div className={`shop-filter-body ${openSections.has("Marketplace") ? "open" : ""}`}>
            {MARKETPLACES.map((m) => (
              <label key={m} className="shop-filter-option">
                <input
                  type="checkbox"
                  checked={selectedMarketplaces.includes(m)}
                  onChange={() =>
                    setSelectedMarketplaces((prev) => toggleItem(prev, m))
                  }
                />
                <span className="shop-filter-check" />
                <span>{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="shop-filter-section">
          <button
            type="button"
            className="shop-filter-header"
            onClick={() => toggleSection("Brand")}
          >
            <span>Brand</span>
            <span className={`shop-filter-chevron ${openSections.has("Brand") ? "open" : ""}`}>›</span>
          </button>
          <div className={`shop-filter-body ${openSections.has("Brand") ? "open" : ""}`}>
            {BRANDS.map((b) => (
              <label key={b} className="shop-filter-option">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b)}
                  onChange={() =>
                    setSelectedBrands((prev) => toggleItem(prev, b))
                  }
                />
                <span className="shop-filter-check" />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="shop-filter-section">
          <button
            type="button"
            className="shop-filter-header"
            onClick={() => toggleSection("Size")}
          >
            <span>Size</span>
            <span className={`shop-filter-chevron ${openSections.has("Size") ? "open" : ""}`}>›</span>
          </button>
          <div className={`shop-filter-body ${openSections.has("Size") ? "open" : ""}`}>
            {SIZES.map((s) => (
              <label key={s} className="shop-filter-option">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(s)}
                  onChange={() =>
                    setSelectedSizes((prev) => toggleItem(prev, s))
                  }
                />
                <span className="shop-filter-check" />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="shop-filter-section">
          <button
            type="button"
            className="shop-filter-header"
            onClick={() => toggleSection("Gender")}
          >
            <span>Gender</span>
            <span className={`shop-filter-chevron ${openSections.has("Gender") ? "open" : ""}`}>›</span>
          </button>
          <div className={`shop-filter-body ${openSections.has("Gender") ? "open" : ""}`}>
            {GENDERS.map((g) => (
              <label key={g} className="shop-filter-option">
                <input
                  type="checkbox"
                  checked={selectedGenders.includes(g)}
                  onChange={() =>
                    setSelectedGenders((prev) => toggleItem(prev, g))
                  }
                />
                <span className="shop-filter-check" />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="shop-filter-section">
          <button
            type="button"
            className="shop-filter-header"
            onClick={() => toggleSection("Price")}
          >
            <span>Price</span>
            <span className={`shop-filter-chevron ${openSections.has("Price") ? "open" : ""}`}>›</span>
          </button>
          <div className={`shop-filter-body ${openSections.has("Price") ? "open" : ""}`}>
            <div className="shop-price-inputs">
              <input
                type="number"
                className="shop-price-input"
                placeholder="Min $"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>–</span>
              <input
                type="number"
                className="shop-price-input"
                placeholder="Max $"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <input
              type="range"
              className="shop-price-slider"
              min="0"
              max="1000"
              step="5"
              value={maxPrice === "" ? 1000 : Number(maxPrice)}
              onChange={(e) =>
                setMaxPrice(e.target.value === "1000" ? "" : e.target.value)
              }
            />
          </div>
        </div>

        <div className="shop-filter-section">
          <button
            type="button"
            className="shop-filter-header"
            onClick={() => toggleSection("Color")}
          >
            <span>Color</span>
            <span className={`shop-filter-chevron ${openSections.has("Color") ? "open" : ""}`}>›</span>
          </button>
          <div className={`shop-filter-body ${openSections.has("Color") ? "open" : ""}`}>
            <div className="shop-color-swatches">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  className={`shop-color-swatch ${selectedColors.includes(c) ? "selected" : ""}`}
                  style={{ background: COLOR_HEX[c] }}
                  onClick={() =>
                    setSelectedColors((prev) => toggleItem(prev, c))
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="shop-filter-section">
          <button
            type="button"
            className="shop-filter-header"
            onClick={() => toggleSection("Sort")}
          >
            <span>Sort</span>
            <span className={`shop-filter-chevron ${openSections.has("Sort") ? "open" : ""}`}>›</span>
          </button>
          <div className={`shop-filter-body ${openSections.has("Sort") ? "open" : ""}`}>
            <div className="shop-sort-wrap">
              <select
                className="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        </div>{/* end shop-sidebar-scroll */}

        <button className="shop-reset-btn" type="button" onClick={handleReset}>
          Reset Filters
        </button>
      </aside>

      <main className="shop-main">
        <div className="wardrobe-header">
          <h1 className="wardrobe-title">Shop</h1>
          <span className="wardrobe-count">
            {filteredListings.length} listing
            {filteredListings.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={activeCategory === cat ? "active" : ""}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p className="shop-status-msg">Loading listings…</p>}
        {fetchError && <p className="shop-status-msg shop-error-msg">{fetchError}</p>}

        <div className="wardrobe-grid">
          {filteredListings.map((listing) => (
            <div
              key={listing._id}
              className="wardrobe-card shop-listing-card"
              onClick={() => setDetailListing(listing)}
            >
              <button
                className={`shop-save-btn ${savedIds.has(listing._id) ? "saved" : ""}`}
                type="button"
                title={savedIds.has(listing._id) ? "Unsave" : "Save"}
                onClick={(e) => toggleSave(listing._id, e)}
              >
                <BookmarkIcon filled={savedIds.has(listing._id)} />
              </button>
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
            </div>
          ))}
        </div>

        {!loading && filteredListings.length === 0 && (
          <div className="shop-empty-state">
            <p>No listings match your filters.</p>
            <button type="button" onClick={handleReset}>Clear filters</button>
          </div>
        )}
      </main>

      {detailListing && (
        <div
          className="upload-overlay"
          onClick={() => setDetailListing(null)}
        >
          <div
            className="upload shop-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="upload-close"
              type="button"
              onClick={() => setDetailListing(null)}
            >
              ✕
            </button>

            <img
              className="upload-form-imagePreview"
              src={detailListing.img_url}
              alt={detailListing.title}
            />

            <h2 className="shop-detail-title">{detailListing.title}</h2>
            <p className="shop-detail-price">
              ${Number(detailListing.price).toFixed(2)}
            </p>

            <div className="shop-detail-fields">
              {detailListing.brand && (
                <div className="shop-detail-row">
                  <span className="shop-detail-label">Brand</span>
                  <span>{detailListing.brand}</span>
                </div>
              )}
              {detailListing.category && (
                <div className="shop-detail-row">
                  <span className="shop-detail-label">Category</span>
                  <span>{detailListing.category}</span>
                </div>
              )}
              {detailListing.size && (
                <div className="shop-detail-row">
                  <span className="shop-detail-label">Size</span>
                  <span>{detailListing.size}</span>
                </div>
              )}
              {detailListing.gender && (
                <div className="shop-detail-row">
                  <span className="shop-detail-label">Gender</span>
                  <span>{detailListing.gender}</span>
                </div>
              )}
              {detailListing.color && (
                <div className="shop-detail-row">
                  <span className="shop-detail-label">Color</span>
                  <span>{detailListing.color}</span>
                </div>
              )}
              {detailListing.marketplace && (
                <div className="shop-detail-row">
                  <span className="shop-detail-label">Marketplace</span>
                  <span>{detailListing.marketplace}</span>
                </div>
              )}
              {detailListing.description && (
                <div className="shop-detail-row">
                  <span className="shop-detail-label">Description</span>
                  <span>{detailListing.description}</span>
                </div>
              )}
            </div>

            <a
              href={detailListing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="upload-form-submit shop-external-link"
            >
              View on {detailListing.marketplace || "Site"} ↗
            </a>

            <button
              className={`shop-save-detail-btn ${savedIds.has(detailListing._id) ? "saved" : ""}`}
              type="button"
              onClick={(e) => toggleSave(detailListing._id, e)}
            >
              {savedIds.has(detailListing._id) ? "✓ Saved" : "Save"}
            </button>
          </div>
        </div>
      )}

      {showCreate && (
        <CreateListing
          userId={userId}
          onClose={() => setShowCreate(false)}
          onSuccess={(newListing) => {
            setListings((prev) => [newListing, ...prev]);
            setShowCreate(false);
          }}
        />
      )}

      <button
        className="shop-create-btn"
        type="button"
        onClick={() => setShowCreate(true)}
      >
        + Create Listing
      </button>
    </div>
  );
}
