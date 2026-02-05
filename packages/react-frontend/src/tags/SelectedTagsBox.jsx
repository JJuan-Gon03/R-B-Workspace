import "./TagBoxSelections.css"

export default function SelectedTagsBox({selectedTags,setSelectedTags,setUnselectedTags}){

    function removeFromSelected(event,tagJsonToRemove){
        event.preventDefault()
        setSelectedTags((prev) => prev.filter((tagJson)=>tagJson!=tagJsonToRemove))
        setUnselectedTags((prev)=>[...prev, tagJsonToRemove])
    }

    return(
        <div className="tags">
            {selectedTags.map((tagJson)=>(
                <div key={tagJson._id}>
                    <button className="tagName">{tagJson.name}</button>
                    <button className="tagRemove" onClick={(event)=>removeFromSelected(event,tagJson)}>x</button>
                </div>
            ))}
        </div>
    )
}