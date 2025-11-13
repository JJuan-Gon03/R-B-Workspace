import Upload from "./Upload.jsx";
import { useState } from "react";
import "./Wardrobe.css";

export default function Wardrobe({
  clothImgUrls = [],
  updateClothesDisplay,
  onShare,
}) {
  const [selectedUrl, setSelectedUrl] = useState(null);

  return (
    <div>
      <Upload updateClothesDisplay={updateClothesDisplay} />

      <div
        className="clothesDisplay"
        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        {clothImgUrls.map((url, i) => (
          <div
            key={url + i}
            style={{ position: "relative", display: "inline-block" }}
          >
            <img
              className="clothImage"
              src={url}
              alt={`Wardrobe item ${i + 1}`}
              style={{
                maxWidth: 220,
                borderRadius: 8,
                cursor: "pointer",
                display: "block",
              }}
              onClick={() =>
                setSelectedUrl((prev) => (prev === url ? null : url))
              }
            />

            {selectedUrl === url && (
              <button
                type="button"
                onClick={() => {
                  onShare?.(url);
                  setSelectedUrl(null);
                }}
                style={{
                  position: "absolute",
                  right: 8,
                  bottom: 8,
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  background: "white",
                }}
              >
                Share
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
