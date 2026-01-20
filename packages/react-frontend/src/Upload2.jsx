import cloudinary from "./cloudinary.js";
import { useState } from "react";
import "./Upload2.css";

export default function Upload() {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState([]);
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    if (busy || !name || !color || !type || !img) return;
    setBusy(true);
    const formData = new FormData();
    formData.append("file", img);
    formData.append("upload_preset", "uploads");
    const img_url = await cloudinary.uploadImage(formData);
    try {
      const res = await fetch("http://localhost:8000/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 123,
          name: name,
          color: color,
          type: type,
          tags: tags,
          img_url: img_url,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setImg(null);
      setPreview("");
      setTags([]);
      setType("");
      setColor("");
      setName("");
    } catch (err) {
      setError(true);
      console.log(err?.message || err);
    }
    setBusy(false);
  }

  const fileSelected = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setImg(file);
    setPreview(URL.createObjectURL(file));
  };

  if (!open) {
    return (
      <button className="upload-pill" onClick={() => setOpen(true)}>
        <span className="upload-plus">＋</span>
        Upload Item
      </button>
    );
  }

  if (error) {
    return (
      <div className="upload-overlay">
        <div className="upload-card upload-error-card">
          <button
            className="upload-close"
            onClick={() => {
              setError(false);
            }}
          >
            ✕
          </button>

          <div className="upload-error-body">
            <h2 className="upload-title">Upload failed</h2>

            <button
              className="upload-btn"
              onClick={() => {
                setError(false);
                // keep modal open + keep form data so they can hit Upload again
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-overlay">
      <div className="upload-card">
        {/* 🔽 LOADING OVERLAY */}
        {busy && (
          <div className="upload-loading-overlay">
            <div className="upload-loading-box">
              <div className="upload-spinner" />
              <div className="upload-loading-text">Uploading…</div>
            </div>
          </div>
        )}

        <button className="upload-close" onClick={() => setOpen(false)}>
          ✕
        </button>

        <form className="upload-form" onSubmit={onSubmit}>
          <h2 className="upload-title">Upload Item</h2>

          <div className="upload-field">
            <label className="upload-label">Item Name</label>
            <input
              className="upload-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              aria-label="name-select"
            />
          </div>

          <div className="upload-field">
            <label className="upload-label">Color</label>
            <select
              aria-label="color-select"
              className="upload-select"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="" disabled>
                Select color
              </option>
              {[
                "Red",
                "Orange",
                "Yellow",
                "Green",
                "Blue",
                "Purple",
                "Brown",
                "Gray",
                "Black",
                "White",
                "Multi",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="upload-field">
            <label className="upload-label">Type</label>
            <select
              aria-label="type-select"
              className="upload-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" disabled>
                Select type
              </option>
              {["Shirts", "Pants", "Jackets", "Shoes", "Accessories"].map(
                (t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="upload-field">
            <label className="upload-label">Item Image</label>
            <input
              aria-label="file-select"
              className="upload-file"
              type="file"
              accept="image/*"
              onChange={(e) => fileSelected(e)}
            />
            {preview && (
              <img className="upload-preview" src={preview} alt="preview" />
            )}
          </div>

          <button className="upload-btn" type="submit" disabled={busy}>
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
