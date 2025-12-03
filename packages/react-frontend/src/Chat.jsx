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

  return (
    <div>
      <form onSubmit={onSubmit} className="chat-form">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask me something"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="chat-button"
          disabled={!text.trim()} // disable when empty
          style={{
            opacity: text.trim() ? 0.8 : 0.5,
            cursor: text.trim() ? "pointer" : "default",
          }}
        >
          Generate Response
        </button>
      </form>
      {chat.map((t,i)=>(<p key={i}>{t}</p>))}
    </div>
  );
}

export default Chat;
