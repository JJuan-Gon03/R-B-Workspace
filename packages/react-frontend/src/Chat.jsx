import React, { useState } from "react";

function Chat({}) {
  const[text,setText]=useState("");
  const[response,setResponse]=useState("")

  async function onSubmit(event){
    console.log("chat.js onSubmit")
    event.preventDefault()
    const res=await fetch("http://localhost:8000/gemini/response/"+encodeURIComponent(text))
    const res_text=await res.text();
    setResponse(res_text);
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
    </div>
  );
}
export default Chat;