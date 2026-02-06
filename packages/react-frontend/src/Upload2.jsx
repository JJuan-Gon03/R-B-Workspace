import cloudinary from "./services/cloudinary.js";
import { useState } from "react";
import TagsBox from "./tags/TagsBox.jsx";
import "./Upload2.css";

export default function Upload({ setClothes }) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState("");

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function resetData() {
    setImg(null);
    setPreview("");
    setSelectedTags([]);
    setType("");
    setColor("");
    setName("");
    setRefreshTrigger((x) => x + 1);
  }

  function onClose() {
    setOpen(false);
    resetData();
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (busy || !name || !color || !type || !img) return;

    setBusy(true);

    try {
      const img_url = await cloudinary.getImgURL(img);
      const res = await fetch("http://localhost:8000/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 123,
          name: name,
          color: color,
          type: type,
          tags: selectedTags,
          img_url: img_url,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message);
      }

      const new_cloth = await res.json();

      setClothes((prev) => [...prev, new_cloth]);

      resetData();
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
      <button className="upload-open" onClick={() => setOpen(true)}>
        Upload Item
      </button>
    );
  }

  if (error) {
    return (
      <div className="upload-error">
        <button
          className="upload-close"
          onClick={() => {
            setError(false);
          }}
        >
          ✕
        </button>

        <div className="upload-error-message">Upload failed</div>

        <button
          className="upload-error-tryAgain"
          onClick={() => {
            setError(false);
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="upload-overlay">
      <div className="upload">
        {busy && <div>Uploading…</div>}

        <button className="upload-close" onClick={() => onClose()}>
          ✕
        </button>

        <form className="upload-form" onSubmit={onSubmit}>
          <label className="upload-form-label">Item Name</label>
          <input
            className="upload-form-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="name-select"
          />

          <label className="upload-form-label">Color</label>
          <select
            className="upload-form-field"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="color-select"
          >
            <option value="" disabled>
              Select color
            </option>
            <option value="Red">Red</option>
            <option value="Orange">Orange</option>
            <option value="Yellow">Yellow</option>
            <option value="Green">Green</option>
            <option value="Blue">Blue</option>
            <option value="Purple">Purple</option>
            <option value="Brown">Brown</option>
            <option value="Gray">Gray</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Multi">Multi</option>
          </select>

          <label className="upload-form-label">Type</label>
          <select
            className="upload-form-field"
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="type-select"
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="Shirts">Shirts</option>
            <option value="Pants">Pants</option>
            <option value="Jackets">Jackets</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>

          <TagsBox
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            refreshTrigger={refreshTrigger}
          />

          <label className="upload-form-label">Item Image</label>
          <input
            className="upload-form-field"
            type="file"
            accept="image/*"
            onChange={(e) => fileSelected(e)}
            aria-label="file-select"
          />
          {preview && <img className="upload-form-imagePreview" src={preview} aria-label="preview"/>}

          <button className="upload-form-submit" type="submit" disabled={busy}>
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
