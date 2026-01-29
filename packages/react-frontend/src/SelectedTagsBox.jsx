export default function SelectedTagsBox({selectedTags,setSelectedTags,setUnselectedTags}){

    function removeFromSelected(tagJsonToRemove){
        setSelectedTags((prev) => prev.filter((tagJson)=>tagJson!=tagJsonToRemove))
        setUnselectedTags((prev)=>[...prev, tagJsonToRemove])
    }

    return(
        <div>
            {selectedTags.map((tagJson)=>(
                <div key={tagJson._id}>
                    <button>{tagJson.name}</button>
                    <button onClick={()=>removeFromSelected(tagJson)}>x</button>
                </div>
            ))}
        </div>
    )
}