import React, { useState } from "react";
import cloudinary from "./cloudinary.js"

function Upload({}) {
  const[image,setImage]=useState(null);

  async function onSubmit(event){
    console.log("Upload.js onSubmit")
    event.preventDefault()

    const formData=new FormData()
    formData.append("file", image)
    formData.append("upload_preset", "uploads")

    const imgurl=await cloudinary.uploadImage(formData)
    console.log(imgurl)

    const res=await fetch("http://localhost:8000/gemini/parse_cloth/"+encodeURIComponent(imgurl))
    const res_text=await res.text()
    console.log(res_text)

    fetch("http://localhost:8000/wardrobe", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({description:res_text,imgurl:imgurl,user_id:123}),
    });

    const wardrobe=await fetch("http://localhost:8000/wardrobe/123")
    const wardrobe_json = await wardrobe.json()
    console.log(wardrobe_json)
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
