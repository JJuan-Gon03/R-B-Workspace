import Upload2 from "./Upload2.jsx";
import { useEffect, useMemo, useState } from "react";
import "./Wardrobe.css";

const CATEGORIES = [
  "All",
  "Shirts",
  "Pants",
  "Jackets",
  "Shoes",
  "Accessories",
];

export default function Wardrobe({ clothImgUrls = [], setWardrobeImages }) {
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, []);

  const toggleSelect = (url) => {
    setSelected((prev) => (prev === url ? null : url));
  };

  const filteredUrls = useMemo(() => {
    // do filtering next sprint or some
    return clothImgUrls;
  }, [clothImgUrls, activeCategory]);

  return (
    <div className="wardrobe-layout">
      <aside className="wardrobe-sidebar">
        <div className="sidebar-search-wrap">
          <input className="sidebar-search" placeholder="Search..." />
        </div>

        <div className="sidebar-panel">
          <div className="sidebar-panel-header">Filters</div>

          <div className="sidebar-panel-list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`sidebar-item ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span className="sidebar-item-text">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-upload">
          <Upload2/>
        </div>
      </aside>

      <main className="wardrobe-main">
        <div class="wardrobe-header">
          <h1 class="wardrobe-title">My Closet</h1>
          <span class="wardrobe-count">{filteredUrls.length} items</span>
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

        <div className="wardrobe-grid">
          {filteredUrls.map((url, i) => (
            <div
              key={url + i}
              className={`wardrobe-card ${selected === url ? "selected" : ""}`}
              onClick={() => toggleSelect(url)}
            >
              <img src={url} alt={`Wardrobe item ${i + 1}`} />
            </div>
          ))}
        </div>
      </main>
      <button
        className={`sell-button ${selected ? "active" : ""}`}
        type="button"
        disabled={!selected}
      >
        Sell
      </button>
    </div>
    
  );
}
