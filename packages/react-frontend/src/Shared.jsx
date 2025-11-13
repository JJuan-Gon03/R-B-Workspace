export default function Shared({ sharedImgUrls = [] }) {
  if (!sharedImgUrls.length) return <p>No shared items yet.</p>;

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {sharedImgUrls.map((url, i) => (
        <img
          key={url + i}
          src={url}
          alt={`Shared item ${i + 1}`}
          style={{ maxWidth: 220, borderRadius: 8 }}
        />
      ))}
    </div>
  );
}
