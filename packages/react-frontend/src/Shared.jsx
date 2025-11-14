import { useState } from "react";

export default function Shared({ sharedImgUrls = [] }) {
  const [hovered, setHovered] = useState(null);
  const [copied, setCopied] = useState(null);

  const copyLink = async (url) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
  };

  if (!sharedImgUrls.length) return <p>No shared items yet.</p>;

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {sharedImgUrls.map((url, i) => (
        <div
          key={url + i}
          style={{ position: "relative", display: "inline-block" }}
          onMouseEnter={() => setHovered(url)}
          onMouseLeave={() => setHovered(null)}
        >
          <img
            src={url}
            alt={`Shared item ${i + 1}`}
            style={{
              maxWidth: 220,
              borderRadius: 8,
              display: "block",
            }}
          />
          {hovered === url && (
            <button
              onClick={() => copyLink(url)}
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
              {copied === url ? "Copied!" : "Copy Link"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
