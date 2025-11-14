import React, { useState } from "react";
import "./Chat.css";

function Chat() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (!text.trim()) return; // prevents empty submits
    const res = await fetch(
      "http://localhost:8000/gemini/response/" + encodeURIComponent(text)
    );
    const res_text = await res.text();
    setResponse(res_text);
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
            opacity: text.trim() ? 1 : 0.5,
            cursor: text.trim() ? "pointer" : "default",
          }}
        >
          Generate Response
        </button>
      </form>
      <p>{response}</p>
    </div>
  );
}

export default Chat;
