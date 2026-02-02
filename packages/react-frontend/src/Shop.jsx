import { useEffect, useMemo, useRef, useState } from "react";
import "./Wardrobe.css";
import "./Upload2.css";


const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";


const MARKETPLACES = ["eBay", "Grailed"];
const BRANDS = ["Nike", "Adidas", "Levi's", "Uniqlo", "Other"];
const CATEGORIES = ["Tops", "Bottoms", "Jackets", "Shoes", "Accessories"];
const GENDERS = ["Men", "Women", "Unisex"];
const COLORS = [
  { key: "Black", value: "#111" },
  { key: "White", value: "#fff" },
  { key: "Gray", value: "#9ca3af" },
  { key: "Blue", value: "#3b82f6" },
  { key: "Red", value: "#ef4444" },
  { key: "Green", value: "#22c55e" },
  { key: "Yellow", value: "#eab308" },
  { key: "Brown", value: "#92400e" },
  { key: "Purple", value: "#a855f7" },
];


function getHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "external link";
  }
}


function normalizeSizes(listing) {
  if (Array.isArray(listing?.sizes)) return listing.sizes;
  if (typeof listing?.size === "string" && listing.size.trim())
    return [listing.size.trim()];
  return [];
}


function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function Shop() {
  // -----------------------------
  // listing modal selection
  // -----------------------------
  const [selected, setSelected] = useState(null);

  // -----------------------------
  // create listing modal control
  // -----------------------------
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // drag/drop ui 
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    user_id: 1, 
    title: "",
    price: "",
    marketplace: "", 
    url: "",
    brand: "", 
    category: "", 
    size: "",
    gender: "", 
    color: "", 
    description: "",
    img_url: "", 
  });

  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // filters filters
  // -----------------------------
  const [q, setQ] = useState(""); // search query
  const [category, setCategory] = useState("All"); // All or specific category
  const [marketplaces, setMarketplaces] = useState({}); // {eBay:false, Grailed:false}
  const [brands, setBrands] = useState({}); // {Nike:false, ...}
  const [sizes, setSizes] = useState({}); // derived from listing sizes
  const [genders, setGenders] = useState({}); // {Men:false, Women:false, Unisex:false}
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(9999);
  const [color, setColor] = useState(null); 
  const [sort, setSort] = useState("newest"); // price-asc, price-desc, newest


  async function refreshListings() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/listings`);
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load listings:", e);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshListings();
  }, []);

  // ---------------------------------------------------------
  // Build filter option sets from actual listings (dynamic)
  // ---------------------------------------------------------
  const allCategories = useMemo(() => {
    const set = new Set((listings || []).map((l) => l.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [listings]);

  const allMarketplaces = useMemo(() => {
    const set = new Set((listings || []).map((l) => l.marketplace).filter(Boolean));
    return Array.from(set);
  }, [listings]);

  const allBrands = useMemo(() => {
    const set = new Set((listings || []).map((l) => l.brand).filter(Boolean));
    return Array.from(set);
  }, [listings]);

  const allSizes = useMemo(() => {
    const s = new Set();
    (listings || []).forEach((l) => normalizeSizes(l).forEach((sz) => s.add(sz)));
    return Array.from(s);
  }, [listings]);

  const allGenders = useMemo(() => {
    const set = new Set((listings || []).map((l) => l.gender).filter(Boolean));
    return Array.from(set);
  }, [listings]);


  useEffect(() => {
    if (Object.keys(marketplaces).length === 0 && allMarketplaces.length > 0) {
      const mp = {};
      allMarketplaces.forEach((m) => (mp[m] = false));
      setMarketplaces(mp);
    }

    if (Object.keys(brands).length === 0 && allBrands.length > 0) {
      const b = {};
      allBrands.forEach((x) => (b[x] = false));
      setBrands(b);
    }

    if (Object.keys(sizes).length === 0 && allSizes.length > 0) {
      const s = {};
      allSizes.forEach((x) => (s[x] = false));
      setSizes(s);
    }

    if (Object.keys(genders).length === 0 && allGenders.length > 0) {
      const g = {};
      allGenders.forEach((x) => (g[x] = false));
      setGenders(g);
    }

    if (priceMax === 9999 && listings.length > 0) {
      const max = listings.reduce(
        (acc, it) => Math.max(acc, Number(it.price || 0)),
        0
      );
      setPriceMax(max || 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings.length]);

  // ---------------------------------------------------------
  // toggle helpers
  // ---------------------------------------------------------
  const toggleMarketplace = (key) =>
    setMarketplaces((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleBrand = (key) =>
    setBrands((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleSize = (key) =>
    setSizes((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleGender = (key) =>
    setGenders((prev) => ({ ...prev, [key]: !prev[key] }));


  const resetFilters = () => {
    setQ("");
    setCategory("All");
    setMarketplaces(Object.fromEntries(Object.keys(marketplaces).map((k) => [k, false])));
    setBrands(Object.fromEntries(Object.keys(brands).map((k) => [k, false])));
    setSizes(Object.fromEntries(Object.keys(sizes).map((k) => [k, false])));
    setGenders(Object.fromEntries(Object.keys(genders).map((k) => [k, false])));
    setPriceMin(0);

    const max = listings.reduce((acc, it) => Math.max(acc, Number(it.price || 0)), 0);
    setPriceMax(max || 100);

    setColor(null);
    setSort("newest");
  };

  // ---------------------------------------------------------
  // color style
  // ---------------------------------------------------------
  const colorSwatchStyle = (hexOrName, isActive) => ({
    width: 28,
    height: 28,
    borderRadius: 999,
    display: "inline-block",
    border: isActive ? "3px solid #6B46C1" : "2px solid rgba(255,255,255,0.12)",
    background: hexOrName,
    cursor: "pointer",
  });

  
  function updateForm(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateCreate() {
    if (!form.title.trim()) return "Title is required.";
    if (form.title.trim().length > 60) return "Title too long (max 60).";
    if (form.price === "" || Number(form.price) < 0) return "Price must be 0 or more.";
    if (!form.url.trim()) return "Marketplace link is required.";
    if (!form.size.trim()) return "Size is required.";
    if (!form.description.trim()) return "Description is required.";
    if (form.description.trim().length > 50) return "Description must be 50 characters or less.";

    if (!form.marketplace) return "Marketplace is required.";
    if (!form.brand) return "Brand is required.";
    if (!form.category) return "Category is required.";
    if (!form.gender) return "Gender is required.";
    if (!form.color) return "Color is required.";

    return null;
  }

  async function submitCreate(e) {
    e.preventDefault();
    const err = validateCreate();
    if (err) {
      setCreateError(err);
      return;
    }
    setCreateError("");
    setCreating(true);

    try {
      const payload = {
        user_id: Number(form.user_id || 1),
        title: form.title.trim(),
        price: Number(form.price),
        marketplace: form.marketplace,
        url: form.url.trim(),
        brand: form.brand,
        category: form.category,
        size: form.size.trim(),
        gender: form.gender,
        color: form.color,
        description: form.description.trim(),
        img_url: form.img_url?.trim() || "/vite.svg",
      };

      const res = await fetch(`${API_BASE}/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create listing");
      }

      await refreshListings();

      setCreateOpen(false);
      setImageError("");
      setIsDragging(false);


      setForm((f) => ({
        ...f,
        title: "",
        price: "",
        url: "",
        size: "",
        description: "",
        img_url: "",
        marketplace: "",
        brand: "",
        category: "",
        gender: "",
        color: "",
      }));
    } catch (e2) {
      console.error(e2);
      setCreateError("Server error creating listing. Check backend console.");
    } finally {
      setCreating(false);
    }
  }

 
  async function handleFiles(files) {
    setImageError("");
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setImageError("Please drop an image file (png/jpg/webp).");
      return;
    }

    // 2MB limit (keep small since it becomes a big base64 string)
    const MAX_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setImageError("Image too large. Please use an image under 2MB for now.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      updateForm("img_url", dataUrl);
    } catch {
      setImageError("Could not read image file. Try another image.");
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function onDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  // ---------------------------------------------------------
  // filtering
  // ---------------------------------------------------------
  const filtered = useMemo(() => {
    let result = (listings || []).slice();

    // search query
    if (q.trim()) {
      const tq = q.trim().toLowerCase();
      result = result.filter(
        (l) =>
          (l.title && l.title.toLowerCase().includes(tq)) ||
          (l.description && l.description.toLowerCase().includes(tq))
      );
    }

    // category
    if (category && category !== "All") {
      result = result.filter((l) => l.category === category);
    }

    // marketplaces
    const selectedMP = Object.entries(marketplaces).filter(([, v]) => v).map(([k]) => k);
    if (selectedMP.length > 0) {
      result = result.filter((l) => selectedMP.includes(l.marketplace));
    }

    // brands
    const selectedBrands = Object.entries(brands).filter(([, v]) => v).map(([k]) => k);
    if (selectedBrands.length > 0) {
      result = result.filter((l) => selectedBrands.includes(l.brand));
    }

    // sizes
    const selectedSizes = Object.entries(sizes).filter(([, v]) => v).map(([k]) => k);
    if (selectedSizes.length > 0) {
      result = result.filter((l) => normalizeSizes(l).some((s) => selectedSizes.includes(s)));
    }

    // genders
    const selectedGenders = Object.entries(genders).filter(([, v]) => v).map(([k]) => k);
    if (selectedGenders.length > 0) {
      result = result.filter((l) => selectedGenders.includes(l.gender));
    }

    // color
    if (color) {
      result = result.filter((l) => (l.color || "").toLowerCase() === color.toLowerCase());
    }

    // price range
    result = result.filter((l) => {
      const p = Number(l.price || 0);
      return p >= Number(priceMin || 0) && p <= Number(priceMax || 999999);
    });

    // sort
    if (sort === "price-asc") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sort === "price-desc") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sort === "newest") {
      result.sort((a, b) => {
        const da = new Date(a.createdAt || a.created_at || 0).getTime();
        const db = new Date(b.createdAt || b.created_at || 0).getTime();
        return db - da;
      });
    }

    return result;
  }, [listings, q, category, marketplaces, brands, sizes, genders, color, priceMin, priceMax, sort]);

  return (
    <div className="wardrobe-layout" style={{ minHeight: "80vh" }}>
      {/* 
          create lsiting button
          */}
      <button
        onClick={() => setCreateOpen(true)}
        style={{
          position: "fixed",
          left: 22,
          bottom: 22,
          zIndex: 3000,
          background: "#5B46D9",
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "12px 16px",
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        + Create Listing
      </button>

      {}
      <aside className="wardrobe-sidebar" style={{ width: 300 }}>
        <div className="sidebar-panel">
          <div className="sidebar-panel-header">Shop</div>

          <div style={{ padding: "12px 14px" }}>
            {/* search */}
            <input
              placeholder="Search for anything"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "#121212",
                color: "#fff",
                outline: "none",
                marginBottom: 12,
              }}
            />

            {/* Reset */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 18 }}>Filters</div>
              <button
                onClick={resetFilters}
                style={{
                  background: "#111",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>

            {/* category */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "#ddd", marginBottom: 8 }}>Category</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 14,
                      background: category === cat ? "#2D2D2D" : "#111",
                      color: "#fff",
                      border:
                        category === cat
                          ? "2px solid #3B82F6"
                          : "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <hr
              style={{
                border: "none",
                height: 1,
                background: "rgba(255,255,255,0.03)",
                margin: "8px 0 12px",
              }}
            />

            {/* Marketplace */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#ddd", marginBottom: 8 }}>Marketplace</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allMarketplaces.length === 0 ? (
                  <div style={{ color: "#777" }}>No marketplaces yet</div>
                ) : (
                  allMarketplaces.map((m) => (
                    <label
                      key={m}
                      style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}
                    >
                      <input
                        type="checkbox"
                        checked={!!marketplaces[m]}
                        onChange={() => toggleMarketplace(m)}
                      />
                      <span style={{ marginLeft: 6 }}>{m}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <hr
              style={{
                border: "none",
                height: 1,
                background: "rgba(255,255,255,0.03)",
                margin: "8px 0 12px",
              }}
            />

            {/* brand */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#ddd", marginBottom: 8 }}>Brand</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allBrands.length === 0 ? (
                  <div style={{ color: "#777" }}>No brands yet</div>
                ) : (
                  allBrands.map((b) => (
                    <label
                      key={b}
                      style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}
                    >
                      <input type="checkbox" checked={!!brands[b]} onChange={() => toggleBrand(b)} />
                      <span style={{ marginLeft: 6 }}>{b}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <hr
              style={{
                border: "none",
                height: 1,
                background: "rgba(255,255,255,0.03)",
                margin: "8px 0 12px",
              }}
            />

            {/* size */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#ddd", marginBottom: 8 }}>Size</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allSizes.length === 0 ? (
                  <div style={{ color: "#777" }}>No sizes yet</div>
                ) : (
                  allSizes.map((s) => (
                    <label
                      key={s}
                      style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}
                    >
                      <input type="checkbox" checked={!!sizes[s]} onChange={() => toggleSize(s)} />
                      <span style={{ marginLeft: 6 }}>{s}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <hr
              style={{
                border: "none",
                height: 1,
                background: "rgba(255,255,255,0.03)",
                margin: "8px 0 12px",
              }}
            />

            {/* Gender */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#ddd", marginBottom: 8 }}>Gender</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allGenders.length === 0 ? (
                  <div style={{ color: "#777" }}>No genders yet</div>
                ) : (
                  allGenders.map((g) => (
                    <label
                      key={g}
                      style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}
                    >
                      <input type="checkbox" checked={!!genders[g]} onChange={() => toggleGender(g)} />
                      <span style={{ marginLeft: 6 }}>{g}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <hr
              style={{
                border: "none",
                height: 1,
                background: "rgba(255,255,255,0.03)",
                margin: "8px 0 12px",
              }}
            />

            {/* price */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#ddd", marginBottom: 8 }}>Price</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="number"
                  value={priceMin}
                  min="0"
                  onChange={(e) => setPriceMin(Number(e.target.value || 0))}
                  style={{
                    width: 90,
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "#121212",
                    color: "#fff",
                  }}
                />
                <div style={{ color: "#888" }}>—</div>
                <input
                  type="number"
                  value={priceMax}
                  min="0"
                  onChange={(e) => setPriceMax(Number(e.target.value || 0))}
                  style={{
                    width: 90,
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "#121212",
                    color: "#fff",
                  }}
                />
              </div>
            </div>

            <hr
              style={{
                border: "none",
                height: 1,
                background: "rgba(255,255,255,0.03)",
                margin: "8px 0 12px",
              }}
            />

            {/* color */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#ddd", marginBottom: 8 }}>Color</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {COLORS.map((c) => (
                  <div
                    key={c.key}
                    title={c.key}
                    role="button"
                    onClick={() => setColor(color === c.key ? null : c.key)}
                    style={colorSwatchStyle(c.value, color === c.key)}
                  />
                ))}
                <button
                  onClick={() => setColor(null)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: "#111",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.04)",
                    cursor: "pointer",
                  }}
                >
                  Any
                </button>
              </div>
            </div>

            <hr
              style={{
                border: "none",
                height: 1,
                background: "rgba(255,255,255,0.03)",
                margin: "8px 0 12px",
              }}
            />

            {/* sort */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ color: "#ddd", marginBottom: 8 }}>Sort</div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "#121212",
                  color: "#fff",
                }}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>

            <div style={{ height: 20 }} />
          </div>
        </div>
      </aside>

      {/*
          main
     */}
      <main className="wardrobe-main" style={{ padding: "28px 48px" }}>
        <div className="wardrobe-header" style={{ marginBottom: 18 }}>
          <h1 className="wardrobe-title">Shop</h1>
          <span className="wardrobe-count" style={{ marginLeft: 12, color: "#777" }}>
            {loading ? "Loading..." : `${filtered.length} listings`}
          </span>
        </div>

        {loading ? (
          <div style={{ color: "#666" }}>Loading listings...</div>
        ) : (
          <div
            className="wardrobe-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 28,
            }}
          >
            {filtered.map((item) => {
              const idKey = item._id || item.id;
              const link = item.url || item.link;

              return (
                <article
                  key={idKey}
                  className="wardrobe-card"
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 18,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelected(item)}
                >
                  <img
                    src={item.img_url || "/vite.svg"}
                    alt={item.title}
                    style={{ width: "100%", borderRadius: 12 }}
                  />

                  <div style={{ paddingTop: 12 }}>
                    <strong style={{ display: "block", marginBottom: 6 }}>{item.title}</strong>
                    <div style={{ color: "#666", marginBottom: 8 }}>
                      ${item.price} • {item.marketplace}
                    </div>

                    {link && (
                      <div style={{ marginTop: 6 }}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ textDecoration: "underline", fontWeight: 700 }}
                        >
                          {getHost(link)} link
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ color: "#666" }}>No listings match your filters.</div>
            )}
          </div>
        )}
      </main>

      {}
      {selected && (
        <div
          className="upload-overlay"
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: 24,
          }}
        >
          <div
            className="upload-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(900px, 96%)",
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              display: "flex",
              gap: 20,
              position: "relative",
            }}
          >
            <button
              className="upload-close"
              onClick={() => setSelected(null)}
              style={{
                position: "absolute",
                right: 16,
                top: 16,
                background: "#eee",
                border: "none",
                padding: 8,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <div style={{ flex: 1 }}>
              <img
                src={selected.img_url || "/vite.svg"}
                alt={selected.title}
                style={{ width: "100%", borderRadius: 12 }}
              />
            </div>

            <div style={{ width: 360 }}>
              <h2 style={{ marginTop: 4 }}>{selected.title}</h2>
              <p style={{ fontSize: 24, fontWeight: 700 }}>${selected.price}</p>
              <p style={{ color: "#666" }}>{selected.description}</p>

              <div style={{ marginTop: 12 }}>
                <strong>Marketplace: </strong>
                <a href={selected.url || selected.link} target="_blank" rel="noopener noreferrer">
                  {selected.marketplace}
                </a>
              </div>

              <div style={{ marginTop: 18 }}>
                <button
                  className="upload-btn"
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: 10,
                    background: "#5B46D9",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Add to Closet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {createOpen && (
        <div
          className="upload-overlay"
          onClick={() => {
            setCreateOpen(false);
            setCreateError("");
            setImageError("");
            setIsDragging(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4000,

            //   scrolling 
            overflowY: "auto",
            padding: 24,
          }}
        >
          <div
            className="upload-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(860px, 96%)",
              background: "#fff",
              borderRadius: 12,
              padding: 22,
              position: "relative",

              maxHeight: "calc(100vh - 48px)",
              overflowY: "auto",
            }}
          >
            <button
              className="upload-close"
              onClick={() => {
                setCreateOpen(false);
                setCreateError("");
                setImageError("");
                setIsDragging(false);
              }}
              style={{
                position: "absolute",
                right: 16,
                top: 16,
                background: "#eee",
                border: "none",
                padding: 8,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <h2 style={{ marginTop: 0 }}>Create Listing</h2>
            <p style={{ color: "#666", marginTop: 6 }}>
              Fill this out and it will appear in the Shop.
            </p>

            <form onSubmit={submitCreate} style={{ display: "grid", gap: 12 }}>
              {}
              <div>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Image (drag & drop)</div>

                {/* hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFiles(e.target.files)}
                />

                <div
                  onClick={openFilePicker}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  role="button"
                  style={{
                    borderRadius: 12,
                    border: isDragging ? "2px solid #5B46D9" : "2px dashed #cbd5e1",
                    padding: 14,
                    cursor: "pointer",
                    background: isDragging ? "rgba(91,70,217,0.08)" : "#f8fafc",
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 92,
                      height: 92,
                      borderRadius: 10,
                      background: "#e5e7eb",
                      overflow: "hidden",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {}
                    {form.img_url ? (
                      <img
                        src={form.img_url}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ color: "#64748b", fontWeight: 900, fontSize: 12, textAlign: "center", padding: 10 }}>
                        Drag & Drop
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontWeight: 900 }}>
                      {isDragging ? "Drop the image here" : "Click or drag an image here"}
                    </div>
                    <div style={{ color: "#64748b", marginTop: 4 }}>
                      PNG / JPG / WEBP • under 2MB for now
                    </div>
                  </div>
                </div>

                {imageError && (
                  <div style={{ color: "#ef4444", fontWeight: 800, marginTop: 8 }}>
                    {imageError}
                  </div>
                )}

                {}
                <button
                  type="button"
                  onClick={() => updateForm("img_url", "")}
                  style={{
                    marginTop: 10,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "#111827",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 900,
                  }}
                >
                  Reset image
                </button>
              </div>

              {}
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Title</div>
                <input
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  placeholder="e.g. Vintage Denim Jacket"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                  }}
                />
              </div>

              {/* Price + marketplace */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Price</div>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateForm("price", e.target.value)}
                    placeholder="e.g. 45"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Marketplace</div>
                  <select
  value={form.marketplace}
  onChange={(e) => updateForm("marketplace", e.target.value)}
  style={{
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#111827",                // changed
    color: form.marketplace ? "#fff" : "#9ca3af", 
  }}
>
  <option value="" disabled>
    Select marketplace…
  </option>
  {MARKETPLACES.map((m) => (
    <option key={m} value={m} style={{ color: "#111" }}>
      {m}
    </option>
  ))}
</select>

                </div>
              </div>

              {/* URL */}
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Listing Link (Required)</div>
                <input
                  value={form.url}
                  onChange={(e) => updateForm("url", e.target.value)}
                  placeholder="https://www.ebay.com/..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                  }}
                />
              </div>

              {/* Brand + category */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Brand</div>
                  <select
  value={form.brand}
  onChange={(e) => updateForm("brand", e.target.value)}
  style={{
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#111827",
    color: form.brand ? "#fff" : "#9ca3af",
  }}
>
  <option value="" disabled>
    Select brand…
  </option>
  {BRANDS.map((b) => (
    <option key={b} value={b} style={{ color: "#111" }}>
      {b}
    </option>
  ))}
</select>

                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Category</div>
                  <select
  value={form.category}
  onChange={(e) => updateForm("category", e.target.value)}
  style={{
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#111827",
    color: form.category ? "#fff" : "#9ca3af",
  }}
>
  <option value="" disabled>
    Select category…
  </option>
  {CATEGORIES.map((c) => (
    <option key={c} value={c} style={{ color: "#111" }}>
      {c}
    </option>
  ))}
</select>

                </div>
              </div>

              {/* Size + gender */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Size</div>
                  <input
                    value={form.size}
                    onChange={(e) => updateForm("size", e.target.value)}
                    placeholder="e.g. S, M, L, 32"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Gender</div>
                  <select
  value={form.gender}
  onChange={(e) => updateForm("gender", e.target.value)}
  style={{
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#111827",
    color: form.gender ? "#fff" : "#9ca3af",
  }}
>
  <option value="" disabled>
    Select gender…
  </option>
  {GENDERS.map((g) => (
    <option key={g} value={g} style={{ color: "#111" }}>
      {g}
    </option>
  ))}
</select>

                </div>
              </div>

              {}
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Color</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {COLORS.map((c) => {
                    const active = form.color === c.key;
                    return (
                      <div
                        key={c.key}
                        title={c.key}
                        onClick={() => updateForm("color", c.key)}
                        role="button"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 999,
                          background: c.value,
                          border: active ? "3px solid #5B46D9" : "2px solid rgba(0,0,0,0.15)",
                          cursor: "pointer",
                        }}
                      />
                    );
                  })}

        <button
  type="button"
  onClick={() => updateForm("color", "")}
  style={{
    padding: "6px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.25)",
    background: "#111827",     
    color: "#fff",            
    cursor: "pointer",
    fontWeight: 900,
  }}
>
  None
</button>


                  <div style={{ color: "#666", marginLeft: 6 }}>
                    {form.color ? form.color : "No color selected"}
                  </div>
                </div>
              </div>

              {/* Description (<= 50 chars) */}
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  Description (max 50 characters)
                </div>
                <input
                  value={form.description}
                  maxLength={50}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Short description..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                  }}
                />
                <div style={{ color: "#999", marginTop: 4 }}>{form.description.length}/50</div>
              </div>

              {createError && <div style={{ color: "#ef4444", fontWeight: 900 }}>{createError}</div>}

              <button
                type="submit"
                disabled={creating}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: creating ? "#999" : "#5B46D9",
                  color: "#fff",
                  border: "none",
                  cursor: creating ? "not-allowed" : "pointer",
                  fontWeight: 900,
                  marginTop: 6,
                }}
              >
                {creating ? "Creating..." : "Create Listing"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
