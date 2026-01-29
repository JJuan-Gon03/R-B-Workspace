import {useState,useEffect} from "react"
import UnselectedTagsBox from "./UnselectedTagsBox"
import SelectedTagsBox from "./SelectedTagsBox"

export default function TagsBox({selectedTags,setSelectedTags}){
    const [unselectedTags,setUnselectedTags]=useState([])

    useEffect(()=>{
        async function fetchData(){
            try{
                const res=await fetch("http://localhost:8000/tags/123")
                const res_json=await res.json()

                if(!res.ok){throw new Error(res_json?.message)}
                setUnselectedTags(res_json)
            }catch(err){
                console.log(err?.message || err)
            }
        }
        fetchData()
    },[])

    return(
        <div>
            <SelectedTagsBox selectedTags={selectedTags} setSelectedTags={setSelectedTags} setUnselectedTags={setUnselectedTags}/>
            <hr />
            <UnselectedTagsBox unselectedTags={unselectedTags} setUnselectedTags={setUnselectedTags} setSelectedTags={setSelectedTags}/>
        </div>
    )
}