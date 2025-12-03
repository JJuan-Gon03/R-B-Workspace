import React, { useState, useEffect } from "react";
import cloudinary from "./cloudinary.js"

function Upload({setWardrobeImages}) {
  const[image,setImage]=useState(null);

  useEffect(()=>{
    fetch("http://localhost:8000/wardrobe/123")
    .then(res => res.json())
    .then(data=>setWardrobeImages(data.map(x=>x.imgurl)))
  },[])

  async function onSubmit(event){
    console.log("entering Upload.jsx handle submit")
    event.preventDefault()

    const formData=new FormData()
    formData.append("file", image)
    formData.append("upload_preset", "uploads")

    const imgurl=await cloudinary.uploadImage(formData)

    const res=await fetch("http://localhost:8000/gemini/parse_cloth/"+encodeURIComponent(imgurl))
    const res_text=await res.text()

    fetch("http://localhost:8000/wardrobe", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({description:res_text,imgurl:imgurl,user_id:123}),
    });
    
    setImage(null)
    setWardrobeImages(prev=>[...prev, imgurl])
    console.log("exiting upload.js handle submit")
  }

  return(
    <div>
      <form onSubmit={onSubmit}>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e)=>setImage(e.target.files[0])}/>
        <button type="submit">upload</button>
      </form>
      {image && (<img src={URL.createObjectURL(image)}/>)}
    </div>
  );
}
export default Upload;
