import { useState } from "react";
import "./Upload2.css"; 
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const MARKETPLACES = ["eBay", "Grailed"];
const BRANDS = ["Nike", "Adidas", "Levi's", "Uniqlo", "Other"];
const CATEGORIES = ["Tops", "Bottoms", "Jackets", "Shoes", "Accessories"];
const GENDERS = ["Men", "Women", "Unisex"];
const COLORS = ["Black", "White", "Gray", "Blue", "Red", "Green", "Yellow", "Brown", "Purple"];

export default function CreateListing({ onCreated }) {
  const [form, setForm] = useState({
    user_id: 1,
    title: "",
    price: "",
    marketplace: MARKETPLACES[0],
    url: "",
    brand: BRANDS[0],
    category: CATEGORIES[0],
    size: "",
    gender: GENDERS[2],
    color: "White",
    description: "",
    img_url: "/vite.svg",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function validate() {
    if (!form.title || form.title.length < 2) return "Title required (min 2 chars)";
    if (!form.price || Number(form.price) < 0) return "Price must be >= 0";
    if (!form.url) return "A listing URL is required";
    if (!form.size) return "Size required";
    if (!form.description || form.description.length > 50) return "Description required (<=50 chars)";
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
      };
      const res = await fetch(`${API_BASE}/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create listing");
      const created = await res.json();
      setSubmitting(false);
      if (onCreated) onCreated(created);
      // clear or navigate away
      setForm({
        user_id: form.user_id,
        title: "",
        price: "",
        marketplace: MARKETPLACES[0],
        url: "",
        brand: BRANDS[0],
        category: CATEGORIES[0],
        size: "",
        gender: GENDERS[2],
        color: "White",
        description: "",
        img_url: "/vite.svg",
      });
      alert("Listing created!");
    } catch (err) {
      console.error(err);
      setError("Server error creating listing");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 700, margin: "24px auto" }}>
      <h2>Create listing</h2>

      <label>Title</label>
      <input className="sidebar-input" value={form.title} onChange={(e) => update("title", e.target.value)} />

      <label>Price (USD)</label>
      <input type="number" className="sidebar-input" value={form.price} onChange={(e) => update("price", e.target.value)} />

      <label>Marketplace</label>
      <select className="sidebar-select" value={form.marketplace} onChange={(e) => update("marketplace", e.target.value)}>
        {MARKETPLACES.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      <label>Marketplace URL (required)</label>
      <input className="sidebar-input" value={form.url} onChange={(e) => update("url", e.target.value)} placeholder="https://..." />

      <label>Brand</label>
      <select className="sidebar-select" value={form.brand} onChange={(e) => update("brand", e.target.value)}>
        {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>

      <label>Category</label>
      <select className="sidebar-select" value={form.category} onChange={(e) => update("category", e.target.value)}>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <label>Size</label>
      <input className="sidebar-input" value={form.size} onChange={(e) => update("size", e.target.value)} placeholder="e.g. M, L, 32" />

      <label>Gender</label>
      <select className="sidebar-select" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
        {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>

      <label>Color</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {COLORS.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => update("color", c)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 20,
              border: form.color === c ? "3px solid #333" : "1px solid #aaa",
              background: c.toLowerCase(),
              cursor: "pointer",
            }}
            title={c}
          />
        ))}
        <div style={{ alignSelf: "center", color: "#999" }}>{form.color}</div>
      </div>

      <label>Short description (≤ 50 chars)</label>
      <input className="sidebar-input" value={form.description} onChange={(e) => update("description", e.target.value)} maxLength={50} />

      <label>Image URL (optional)</label>
      <input className="sidebar-input" value={form.img_url} onChange={(e) => update("img_url", e.target.value)} />

      {error && <div style={{ color: "salmon", margin: "8px 0" }}>{error}</div>}

      <button type="submit" className="sidebar-clear" disabled={submitting}>
        {submitting ? "Creating…" : "Create listing"}
      </button>
    </form>
  );
}
