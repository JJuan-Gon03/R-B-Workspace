import { useState } from "react";
import "./AddTagButton.css";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";

export default function AddTagButton({
  setUnselectedTags,
  setSearchPrefix,
  userId,
}) {
  const [newTag, setNewTag] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function postNewTag() {
    if (!newTag.trim()) return;

    try {
      setIsSubmitting(true);

      const res = await fetch(API_BASE + "/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name: newTag.trim(),
        }),
      });

      if (!res.ok) throw new Error();

      const tag = await res.json();
      setUnselectedTags((prev) => [...prev, tag]);

      setNewTag("");
      setSearchPrefix("");
      setIsOpen(false);
    } catch {
      setNewTag("");
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <button className="addTag" onClick={() => setIsOpen(true)}>
        + Add tag
      </button>
    );
  }

  return (
    <div className="addTag-inline">
      <div className="addTag-bar">
        <input
          className="addTag-input"
          type="text"
          autoFocus
          placeholder="New tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") postNewTag();
            if (e.key === "Escape") {
              setNewTag("");
              setIsOpen(false);
            }
          }}
        />

        <button
          className="addTag-confirm"
          onClick={postNewTag}
          disabled={isSubmitting}
        >
          Add
        </button>

        <button
          className="addTag-cancel"
          onClick={() => {
            setNewTag("");
            setIsOpen(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
