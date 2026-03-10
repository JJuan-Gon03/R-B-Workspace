import cloudinary from "./services/cloudinary.js";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload2.css";
import "./CreateListing.css";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";

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

export default function CreateListing({ onClose, onSuccess, userId, initialData, listingId }) {
  const navigate = useNavigate();
  const isEdit = Boolean(listingId);

  const [busy, setBusy] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(initialData?.img_url || "");
  const [img, setImg] = useState(null);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialData?.title || "");
  const [price, setPrice] = useState(initialData?.price ?? "");
  const [marketplace, setMarketplace] = useState(initialData?.marketplace || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [size, setSize] = useState(initialData?.size || "");
  const [gender, setGender] = useState(initialData?.gender || "");
  const [color, setColor] = useState(initialData?.color || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const fileInputRef = useRef(null);

  const handleClose = onClose ?? (() => navigate("/shop"));
  const handleSuccess = (result) => {
    if (onSuccess) {
      onSuccess(result);
    } else {
      navigate("/shop");
    }
  };

  function resetForm() {
    setTitle("");
    setPrice("");
    setMarketplace("");
    setUrl("");
    setBrand("");
    setCategory("");
    setSize("");
    setGender("");
    setColor("");
    setDescription("");
    setImg(null);
    setPreview("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFile(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }
    setError("");
    setImg(file);
    setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (busy || !title || price === "" || !url) return;

    setBusy(true);
    setError("");

    try {
      let img_url = initialData?.img_url || "/vite.svg";

      if (img) {
        const result = await cloudinary.getImgURL(img);
        img_url = result.img_url;
      }

      const body = {
        user_id: userId,
        title,
        price: parseFloat(price),
        url,
        img_url,
      };
      if (marketplace) body.marketplace = marketplace;
      if (brand) body.brand = brand;
      if (category) body.category = category;
      if (size) body.size = size;
      if (gender) body.gender = gender;
      if (color) body.color = color;
      if (description) body.description = description;

      const res = await fetch(
        isEdit
          ? `${API_BASE}/listings/${listingId}`
          : `${API_BASE}/listings`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || `Failed to ${isEdit ? "update" : "create"} listing.`);
      }

      const result = await res.json();
      handleSuccess(result);
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    }

    setBusy(false);
  }

  return (
    <div className="upload-overlay" onClick={handleClose}>
      <div
        className={`upload create-listing-modal${isEdit ? " edit-listing-modal" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="upload-close" type="button" onClick={handleClose}>
          ✕
        </button>

        <form className="upload-form" onSubmit={onSubmit}>
          <label className="upload-form-label" htmlFor="cl-title">
            Title *
          </label>
          <input
            id="cl-title"
            className="upload-form-field"
            value={title}
            maxLength={60}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Nike Air Max 90"
          />


          <label className="upload-form-label" htmlFor="cl-price">
            Price ($) *
          </label>
          <input
            id="cl-price"
            className="upload-form-field"
            type="number"
            min="0"
            step="0.01"
            value={price}
            required
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />

          <label className="upload-form-label" htmlFor="cl-url">
            Listing URL *
          </label>
          <input
            id="cl-url"
            className="upload-form-field"
            value={url}
            required
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />

          <label className="upload-form-label" htmlFor="cl-marketplace">
            Marketplace
          </label>
          <select
            id="cl-marketplace"
            className="upload-form-field"
            value={marketplace}
            onChange={(e) => setMarketplace(e.target.value)}
          >
            <option value="">Select marketplace</option>
            <option value="eBay">eBay</option>
            <option value="Grailed">Grailed</option>
          </select>

          <label className="upload-form-label" htmlFor="cl-brand">
            Brand
          </label>
          <select
            id="cl-brand"
            className="upload-form-field"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">Select brand</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option value="Levi's">Levi&apos;s</option>
            <option value="Uniqlo">Uniqlo</option>
            <option value="Other">Other</option>
          </select>

          <label className="upload-form-label" htmlFor="cl-category">
            Category
          </label>
          <select
            id="cl-category"
            className="upload-form-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Jackets">Jackets</option>
            <option value="Dresses">Dresses</option>
            <option value="Outerwear">Outerwear</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>

          <label className="upload-form-label" htmlFor="cl-size">
            Size
          </label>
          <input
            id="cl-size"
            className="upload-form-field"
            value={size}
            maxLength={10}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. M, 10, 32x30"
          />

          <label className="upload-form-label" htmlFor="cl-gender">
            Gender
          </label>
          <select
            id="cl-gender"
            className="upload-form-field"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>

          <label className="upload-form-label">Color</label>
          <div className="color-swatch-row">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                className={`color-swatch ${color === c ? "selected" : ""}`}
                style={{ background: COLOR_HEX[c] }}
                onClick={() => setColor(color === c ? "" : c)}
              />
            ))}
          </div>

          <label className="upload-form-label" htmlFor="cl-description">
            Description
          </label>
          <textarea
            id="cl-description"
            className="upload-form-field"
            value={description}
            maxLength={50}
            rows={2}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description (max 50 chars)"
            style={{ resize: "none" }}
          />

          <label className="upload-form-label">Item Image</label>

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
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {preview && (
            <div className="upload-image-wrapper">
              <button
                type="button"
                className="upload-image-remove"
                onClick={() => {
                  setImg(null);
                  setPreview("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
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

          {error && <p className="cl-error">{error}</p>}

          <button
            type="button"
            className="upload-form-clear"
            onClick={resetForm}
          >
            Clear All
          </button>

          <button
            className="upload-form-submit"
            type="submit"
            disabled={busy}
          >
            {busy ? <span className="spinner" /> : isEdit ? "Save Changes" : "List Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
