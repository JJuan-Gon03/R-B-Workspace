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

export default function Wardrobe() {
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [clothes, setClothes] = useState([]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.height = "100%";
    document.body.classList.add("wardrobe-page");

    fetch(
      "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net/wardrobe/123"
    )
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message);
          });
        }
        return res.json();
      })
      .then((clothes) => {
        setClothes(clothes);
      })
      .catch((err) => {
        console.log(err?.message || err);
      });

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
      document.body.style.height = "";
      document.body.classList.remove("wardrobe-page");
    };
  }, []);

  const toggleSelect = (url) => {
    setSelected((prev) => (prev === url ? null : url));
  };

  const normalizeCategory = (v) =>
    String(v || "")
      .trim()
      .toLowerCase();

  const filteredClothes = useMemo(() => {
    if (activeCategory === "All") return clothes;
    const target = normalizeCategory(activeCategory);
    return clothes.filter((c) => normalizeCategory(c.type) === target);
  }, [clothes, activeCategory]);

  useEffect(() => {
    if (!selected) return;
    const stillVisible = filteredClothes.some((c) => c.img_url === selected);
    if (!stillVisible) setSelected(null);
  }, [activeCategory, filteredClothes, selected]);

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
                className={`sidebar-item ${
                  activeCategory === cat ? "active" : ""
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                <span className="sidebar-item-text">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-upload">
          <Upload2 setClothes={setClothes} />
        </div>
      </aside>

      <main className="wardrobe-main">
        <div className="wardrobe-header">
          <h1 className="wardrobe-title">My Closet</h1>
          <span className="wardrobe-count">{filteredClothes.length} items</span>
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
          {filteredClothes.map((cloth, i) => (
            <div
              key={cloth.img_url + i}
              className={`wardrobe-card ${
                selected === cloth.img_url ? "selected" : ""
              }`}
              onClick={() => toggleSelect(cloth.img_url)}
            >
              <img src={cloth.img_url} alt={`Wardrobe item ${i + 1}`} />
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
