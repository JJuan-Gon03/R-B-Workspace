import { useState, useEffect } from "react";
import UnselectedTagsBox from "./UnselectedTagsBox";
import SelectedTagsBox from "./SelectedTagsBox";
import "./TagBoxSelections.css";

export default function TagsBox({
  selectedTags,
  setSelectedTags,
  refreshTrigger,
  userId,
}) {
  const [unselectedTags, setUnselectedTags] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net/tags/" +
            userId
        );
        const tags = await res.json();

        if (!res.ok) {
          throw new Error(tags?.message);
        }
        setUnselectedTags(tags);
      } catch (err) {
        console.log(err?.message || err);
      }
    }
    fetchData();
  }, [refreshTrigger, userId]);

  return (
    <div>
      <SelectedTagsBox
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        setUnselectedTags={setUnselectedTags}
      />
      <hr />
      <UnselectedTagsBox
        unselectedTags={unselectedTags}
        setUnselectedTags={setUnselectedTags}
        setSelectedTags={setSelectedTags}
      />
    </div>
  );
}
