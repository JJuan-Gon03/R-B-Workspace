import cloudinary from "./services/cloudinary.js";
import { useState, useRef } from "react";
import TagsBox from "./tags/TagsBox.jsx";
import "./Upload2.css";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function Upload({ setClothes, userId }) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const [confirmClear, setConfirmClear] = useState(false);
  const [skipClearConfirm, setSkipClearConfirm] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fileInputRef = useRef(null);

  function resetData() {
    if (preview) URL.revokeObjectURL(preview);
    setImg(null);
    setPreview("");
    setSelectedTags([]);
    setType("");
    setColor("");
    setName("");
    setError("");
    setSubmitAttempted(false);
    setRefreshTrigger((x) => x + 1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Clears only the image, not the rest of the form
  function clearImage() {
    if (preview) URL.revokeObjectURL(preview);
    setImg(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onClose() {
    resetData();
    setOpen(false);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);
    setError("");

    if (busy || !name || !color || !type || !img) return;

    setBusy(true);

    try {
      const result = await cloudinary.getImgURL(img);

      const res = await fetch(API_BASE + "/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name,
          color,
          type,
          tags: selectedTags.map((t) => t._id),
          img_url: result.img_url,
          public_id: result.public_id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "Upload failed.");
      }

      const new_cloth = await res.json();
      setClothes((prev) => [...prev, new_cloth]);
      resetData();
      setOpen(false);
    } catch (err) {
      setError(err?.message || "Upload failed. Please try again.");
    }

    setBusy(false);
  }

  function handleFile(file) {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }
    setError("");
    setImg(file);
    setPreview(URL.createObjectURL(file));
  }

  if (!open) {
    return (
      <button className="upload-open" onClick={() => setOpen(true)}>
        Upload Item
      </button>
    );
  }

  const missingFields = submitAttempted && (!name || !color || !type || !img);

  return (
    <div className="upload-overlay" onClick={onClose}>
      <div className="upload" onClick={(e) => e.stopPropagation()}>
        <button className="upload-close" onClick={onClose}>
          ✕
        </button>

        <form className="upload-form" onSubmit={onSubmit}>
          <label className="upload-form-label" htmlFor="name-select">
            Item Name *
          </label>
          <input
            id="name-select"
            className="upload-form-field"
            value={name}
            placeholder="e.g. Blue Denim Jacket"
            onChange={(e) => setName(e.target.value)}
          />

          <label className="upload-form-label" htmlFor="color-select">
            Color *
          </label>
          <select
            id="color-select"
            className="upload-form-field"
            value={color}
            onChange={(e) => setColor(e.target.value)}
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

          <label className="upload-form-label" htmlFor="type-select">
            Type *
          </label>
          <select
            id="type-select"
            className="upload-form-field"
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            userId={userId}
          />

          <label className="upload-form-label">Item Image *</label>

          {!preview && (
            <div
              className={`upload-dropzone ${dragActive ? "active" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
            >
              <div className="upload-dropzone-icon">⬆</div>
              <div className="upload-dropzone-text">
                <strong>Drag &amp; drop image here</strong>
                <span>or click to browse · max 2MB</span>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {preview && (
            <div className="upload-image-wrapper">
              <button
                type="button"
                className="upload-image-remove"
                onClick={clearImage}
              >
                ✕
              </button>
              <img
                className="upload-form-imagePreview"
                src={preview}
                alt="preview"
              />
            </div>
          )}

          {missingFields && (
            <p className="upload-form-validation-error">
              Please fill in all required fields and add an image.
            </p>
          )}

          {error && <p className="upload-form-validation-error">{error}</p>}

          <button
            type="button"
            className="upload-form-clear"
            onClick={() =>
              skipClearConfirm ? resetData() : setConfirmClear(true)
            }
          >
            Clear All
          </button>

          <button className="upload-form-submit" type="submit" disabled={busy}>
            {busy ? <span className="spinner" /> : "Upload"}
          </button>
        </form>

        {confirmClear && (
          <div className="clear-confirm-overlay">
            <div className="clear-confirm-box">
              <div className="clear-confirm-title">
                Are you sure you want to clear everything?
              </div>

              <label className="clear-confirm-checkbox">
                <input
                  type="checkbox"
                  checked={skipClearConfirm}
                  onChange={(e) => setSkipClearConfirm(e.target.checked)}
                />
                Don&apos;t ask again
              </label>

              <div className="clear-confirm-actions">
                <button
                  className="clear-confirm-cancel"
                  onClick={() => setConfirmClear(false)}
                >
                  No
                </button>

                <button
                  className="clear-confirm-yes"
                  onClick={() => {
                    resetData();
                    setConfirmClear(false);
                  }}
                >
                  Yes, Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
