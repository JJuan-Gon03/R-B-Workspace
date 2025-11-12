import React, { useState } from "react";
import "./Chat.css";

function Chat({}) {
  const[text,setText]=useState("");
  const[imgData,setimgData]=useState("")
  const[response,setResponse]=useState("")

  async function onSubmit(event){
    console.log("entering chat.js onSubmit")
    event.preventDefault()
    const res=await fetch("http://localhost:8000/gemini/buildOutfit/123",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({preferences:text})})
    const resJson=await res.json();
    setResponse(resJson.reply);
    setimgData(resJson.imgdata);
    console.log("exiting chat.js onSubmit")
  }

  return(
    <div>
      <form onSubmit={onSubmit}>
        <input 
          type="text" 
          value={text}
          onChange={(e)=>setText(e.target.value)}/>
        <button type="submit">Generate Outfit</button>
      </form>
      <p>{response}</p>
      {imgData && (<img src={imgData}/>)}
    </div>
  );
}
export default Chat;
