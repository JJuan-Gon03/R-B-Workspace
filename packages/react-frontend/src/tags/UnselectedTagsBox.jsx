import AddTagButton from "./AddTagButton";
import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";

export default function UnselectedTagsBox({
  unselectedTags,
  setUnselectedTags,
  setSelectedTags,
  userId,
}) {
  const [searchPrefix, setSearchPrefix] = useState("");

  function addToSelected(event, tagJsonToAdd) {
    event.preventDefault();
    setSelectedTags((prev) => [...prev, tagJsonToAdd]);
    setUnselectedTags((prev) =>
      prev.filter((tagJson) => tagJson != tagJsonToAdd)
    );
  }

  async function deleteTag(event, tagJsonToDelete) {
    event.preventDefault();
    try {
      const res = await fetch(API_BASE + "/tags/" + tagJsonToDelete._id, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message);
      }

      setUnselectedTags((prev) =>
        prev.filter((tagJson) => tagJson != tagJsonToDelete)
      );
    } catch (err) {
      console.log(err?.message || err);
    }
  }

  return (
    <div className="tags">
      <input
        className="tag-search"
        type="text"
        value={searchPrefix}
        onChange={(e) => setSearchPrefix(e.target.value)}
        placeholder="Search tags..."
      />
      {unselectedTags
        .filter((tagJson) => {
          return (
            !searchPrefix ||
            tagJson.name
              .toLowerCase()
              .startsWith(searchPrefix.trim().toLowerCase())
          );
        })
        .map((tagJson) => (
          <div key={tagJson._id}>
            <button
              className="tagName"
              title="Click to select"
              onClick={(event) => addToSelected(event, tagJson)}
            >
              {tagJson.name}
            </button>
            <button
              className="tagDelete"
              title="Delete tag permanently"
              onClick={(event) => deleteTag(event, tagJson)}
            >
              🗑
            </button>
          </div>
        ))}
      <AddTagButton
        setUnselectedTags={setUnselectedTags}
        setSearchPrefix={setSearchPrefix}
        userId={userId}
      />
    </div>
  );
}
