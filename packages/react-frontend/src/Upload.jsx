import React, { useState } from "react";

function Upload({}) {
  const[image,setImage]=useState(null);

  async function onSubmit(event){
    console.log("Upload.js onSubmit")
    event.preventDefault()

    const formData=new FormData()
    formData.append("file", image)
    formData.append("upload_preset", "uploads")

    const upload=await fetch(`https://api.cloudinary.com/v1_1/dviu8ll3d/image/upload`, {
      method:"POST",
      body:formData,
    });

    const data=await upload.json()
    console.log("url: ", data.secure_url)

    const res=await fetch("http://localhost:8000/gemini/parse_cloth/"+encodeURIComponent(data.secure_url))
    const res_text=await res.text()
    console.log(res_text)
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
