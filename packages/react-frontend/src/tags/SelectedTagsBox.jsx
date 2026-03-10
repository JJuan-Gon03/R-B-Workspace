export default function SelectedTagsBox({
  selectedTags,
  setSelectedTags,
  setUnselectedTags,
}) {
  function removeFromSelected(event, tagJsonToRemove) {
    event.preventDefault();
    setSelectedTags((prev) =>
      prev.filter((tagJson) => tagJson != tagJsonToRemove)
    );
    setUnselectedTags((prev) => [...prev, tagJsonToRemove]);
  }

  if (selectedTags.length === 0) {
    return (
      <p className="tags-empty-hint">
        No tags selected — click a tag below to add it.
      </p>
    );
  }

  return (
    <div className="tags">
      {selectedTags.map((tagJson) => (
        <div key={tagJson._id} className="selected-pill">
          <button className="tagName" title="Click × to remove">
            {tagJson.name}
          </button>
          <button
            className="tagRemove"
            title="Remove from selection"
            onClick={(event) => removeFromSelected(event, tagJson)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
