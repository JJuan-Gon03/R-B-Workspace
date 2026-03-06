import Upload2 from "./Upload2.jsx";
import { useEffect, useMemo, useState } from "react";
import "./Wardrobe.css";
import { deleteCloth } from "./services/cloth.service.js";

const CATEGORIES = [
  "All",
  "Shirts",
  "Pants",
  "Jackets",
  "Shoes",
  "Accessories",
];

export default function Wardrobe({ userId }) {
  const [selected, setSelected] = useState("");
  const [deleting, setDeleting] = useState(false);
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

    fetch(import.meta.env.VITE_API_BASE + "/wardrobe/" + userId)
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
  }, [userId]);

  const toggleSelect = (clothId) => {
    setSelected((prev) => (prev === clothId ? "" : clothId));
  };

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCloth(selected);
      setClothes((prev) => prev.filter((c) => c._id !== selected));
      setSelected("");
    } catch (err) {
      console.log(err);
    }
    setDeleting(false);
  }

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
    const stillVisible = filteredClothes.some((c) => c._id === selected);
    if (!stillVisible) setSelected("");
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
          <Upload2 setClothes={setClothes} userId={userId} />
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
              key={String(cloth._id) + i}
              className={`wardrobe-card ${
                selected === String(cloth._id) ? "selected" : ""
              }`}
              onClick={() => toggleSelect(String(cloth._id))}
            >
              <img src={cloth.img_url} alt={`Wardrobe item ${i + 1}`} />
            </div>
          ))}
        </div>
      </main>

      <button
        className={`del-button ${selected ? "active" : ""}`}
        type="button"
        disabled={!selected}
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
}
