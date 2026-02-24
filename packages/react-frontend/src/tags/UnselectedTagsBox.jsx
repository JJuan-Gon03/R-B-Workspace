import AddTagButton from "./AddTagButton";
import { useState } from "react";

export default function UnselectedTagsBox({
  unselectedTags,
  setUnselectedTags,
  setSelectedTags,
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
      const res = await fetch(
        "thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net/tags/" +
          tagJsonToDelete._id,
        { method: "DELETE" }
      );
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
        type="text"
        value={searchPrefix}
        onChange={(e) => setSearchPrefix(e.target.value)}
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
              onClick={(event) => addToSelected(event, tagJson)}
            >
              {tagJson.name}
            </button>
            <button
              className="tagRemove"
              onClick={(event) => deleteTag(event, tagJson)}
            >
              x
            </button>
          </div>
        ))}
      <AddTagButton
        setUnselectedTags={setUnselectedTags}
        setSearchPrefix={setSearchPrefix}
      />
    </div>
  );
}
