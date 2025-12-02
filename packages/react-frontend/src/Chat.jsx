import React, { useState } from "react";
import "./Chat.css";

function Chat({}) {
  const[text,setText]=useState("");
  const[chat,setChat]=useState([])

  async function onSubmit(event){
    console.log("entering chat.js onSubmit")
    event.preventDefault()
    setChat(prev => [...prev, text])

    const res=await fetch("http://localhost:8000/gemini/response/123/"+text)
    const data=await res.json()

    setText("")
    setChat(prev => [...prev, data.reply]);
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
      {chat.map((t,i)=>(<p key={i}>{t}</p>))}
    </div>
  );
}
export default Chat;
