import React, { useState } from "react";

function Upload({}) {
  const[image,setImage]=useState(null);

  const example_url="https://media.istockphoto.com/id/495204892/photo/sneakers.jpg?s=612x612&w=0&k=20&c=QSkl09_Rx2lvayG93dWBmoCsVPThoAB1VgcSyh6Jy_4="

  async function onSubmit(event){
    console.log("Upload.js onSubmit")
    event.preventDefault()
    const res=await fetch("http://localhost:8000/gemini/parse_cloth/"+encodeURIComponent(example_url))
    const res_text=await res.text()
    console.log(res_text)
  }

  return(
    <div>
      <form onSubmit={onSubmit}>
        <input 
          type="file" 
          accept="image/*"
          />
        <button type="submit">upload</button>
      </form>
    </div>
  );
}
export default Upload;
