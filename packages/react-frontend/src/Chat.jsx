import React, { useState } from "react";
import "./Chat.css";

function Chat() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [imgData, setImgData] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    if (!text.trim()) return; // prevents empty submits

    console.log("entering chat.js onSubmit");

    const res = await fetch("http://localhost:8000/gemini/buildOutfit/123", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: text }),
    });

    const resJson = await res.json();
    setResponse(resJson.reply);
    setImgData(resJson.imgdata);

    console.log("exiting chat.js onSubmit");
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
      <p>{response}</p>
      {imgData && <img src={imgData} />}
    </div>
  );
}

export default Chat;
