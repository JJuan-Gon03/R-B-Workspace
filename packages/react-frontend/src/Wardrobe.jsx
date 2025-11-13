import Upload from "./Upload.jsx";
import{useState}from"react"
import "./Wardrobe.css"

export default function Wardrobe() {
  const[clothImgUrls,setClothImgUrls]=useState([]);

  const updateClothesDisplay=(url)=>{setClothImgUrls(prev=>[url,...prev])}

  return (
    <div>
      <Upload updateClothesDisplay={updateClothesDisplay}/>
      <div className="clothesDisplay">
        {clothImgUrls.map((url,i)=>(<img className="clothImage" key={i} src={url}/>))}
      </div>
    </div>
  );
}
