import { useState } from "react";
import "./AddTagButton.css";

export default function AddTagButton({
  setUnselectedTags,
  setSearchPrefix,
  userId,
}) {
  const [newTag, setNewTag] = useState("");
  const [busyPostingNewTag, setBusyPostingNewTag] = useState(false);
  const [typingNewTag, setTypingNewTag] = useState(false);

  async function postNewTag(event) {
    event.preventDefault();
    if (!newTag.trim()) {
      return;
    }
    setBusyPostingNewTag(true);
    try {
      const res = await fetch(
        "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net/tags",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            name: newTag.trim(),
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message);
      }
      const tag = await res.json();

      setUnselectedTags((prev) => [...prev, tag]);
      setNewTag("");
      setTypingNewTag(false);
      setSearchPrefix("");
    } catch (err) {
      console.log(err?.message || err);
    }
    setBusyPostingNewTag(false);
  }

  if (!typingNewTag) {
    return (
      <button className="addTag" onClick={() => setTypingNewTag(true)}>
        +
      </button>
    );
  }

  if (busyPostingNewTag) {
    return (
      <div className="addTag">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <input
      className="addTag"
      type="text"
      value={newTag}
      onChange={(e) => setNewTag(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") postNewTag(e);
      }}
    />
  );
}
