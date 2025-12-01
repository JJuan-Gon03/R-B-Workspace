import Upload from "./Upload.jsx";
import { useState } from "react";
import "./Wardrobe.css";

export default function Wardrobe({
  clothImgUrls = [],
  updateClothesDisplay,
  onShare,
}) {
  const [hovered, setHovered] = useState(null);
  const [shared, setShared] = useState(null);

  const handleShare = (url) => {
    onShare?.(url);
    setShared(url);
    setTimeout(() => setShared(null), 1500);
  };

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
            style={{
              position: "relative",
              display: "inline-block",
            }}
            onMouseEnter={() => setHovered(url)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={url}
              alt={`Wardrobe item ${i + 1}`}
              style={{
                maxWidth: 220,
                borderRadius: 8,
                display: "block",
              }}
            />

            {hovered === url && (
              <button
                onClick={() => handleShare(url)}
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                {shared === url ? "Shared!" : "Share"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
