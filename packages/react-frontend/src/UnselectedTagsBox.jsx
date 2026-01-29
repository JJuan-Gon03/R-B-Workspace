import AddTagButton from "./AddTagButton"
import {useState} from "react"

export default function UnselectedTagsBox({unselectedTags,setUnselectedTags,setSelectedTags}){
    const [searchPrefix,setSearchPrefix]=useState("")

    function addToSelected(tagJsonToAdd){
        setSelectedTags((prev) => [...prev, tagJsonToAdd])
        setUnselectedTags((prev) => prev.filter((tagJson)=>tagJson!=tagJsonToAdd))
    }

    async function deleteTag(tagJsonToDelete){
        try{
            const res=await fetch("http://localhost:8000/tags/"+tagJsonToDelete._id,{method:"DELETE"})
            if(!res.ok){
                const err=await res.json()
                throw new Error(err?.message)
            }else{
                setUnselectedTags((prev)=>prev.filter((tagJson)=>tagJson!=tagJsonToDelete))
            }
        }catch(err){
            console.log(err?.message || err)
        }
    }

    return(
        <div>
            <input type="text" value={searchPrefix} onChange={(e)=>setSearchPrefix(e.target.value)}/>
            {unselectedTags.filter((tagJson)=>{
                return !searchPrefix || tagJson.name.toLowerCase().startsWith(searchPrefix.trim().toLowerCase())}).map((tagJson)=>(
                <div key={tagJson._id}>
                    <button onClick={()=>addToSelected(tagJson)}>{tagJson.name}</button>
                    <button onClick={()=>deleteTag(tagJson)}>x</button>
                </div>
            ))}
            <AddTagButton setUnselectedTags={setUnselectedTags} setSearchPrefix={setSearchPrefix}/>
        </div>
    )
}