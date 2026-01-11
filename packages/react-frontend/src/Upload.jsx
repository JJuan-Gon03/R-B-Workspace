import { useId, useRef, useState } from "react";
import "./Upload.css";

export default function Upload({
  setWardrobeImages,
  label = "Upload Item",
  fullWidth = true,
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const onPick = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setBusy(true);

    try {
      // Create local preview URLs (works instantly)
      const urls = files.map((f) => URL.createObjectURL(f));

      // Prepend new uploads
      setWardrobeImages?.((prev) => [...urls, ...(prev || [])]);
    } finally {
      setBusy(false);

      // allow selecting same file again
      e.target.value = "";
    }
  };

  return (
    <div className={`upload-wrap ${fullWidth ? "full" : ""}`}>
      {/* hidden file input */}
      <input
        id={inputId}
        ref={inputRef}
        className="upload-input"
        type="file"
        accept="image/*"
        multiple
        onChange={onPick}
      />

      {/* figma-style button */}
      <button
        type="button"
        className="upload-btn"
        onClick={openPicker}
        disabled={busy}
        aria-controls={inputId}
      >
        <span className="upload-plus" aria-hidden="true">
          +
        </span>
        <span className="upload-label">{busy ? "Uploading..." : label}</span>
      </button>
    </div>
  );
}
