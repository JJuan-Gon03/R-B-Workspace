import React, { useState } from "react";
import "./Assistant.css";

export default function Assistant() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const [ready, setReady] = useState(true);
  const [open, setOpen] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault(); //no page reload
    setReady(false);
    setChat((prev) => [...prev, [text]]);
    setText("");

    try {
      const res = await fetch(
        "http://localhost:8000/gemini/response/123/" + encodeURIComponent(text)
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      const reply = await res.json();

      if (reply.imgs) {
        setChat((prev) => [...prev, [reply.text, reply.imgs]]);
      } else {
        setChat((prev) => [...prev, [reply.text]]);
      }

      setReady(true);
    } catch (err) {
      setChat((prev) => [...prev, ["servers down"]]);
      console.log(err?.message || err);
    }
  }

  if (!open) {
    return (
      <button className="chat-fab" onClick={() => setOpen(true)}>
        AI
      </button>
    );
  }

  return (
    <div className="thriftr-chat-panel chat-floating">
      <div className="thriftr-chat-header">
        <div className="thriftr-chat-title">Assistant</div>
        <div className="thriftr-chat-subtitle">
          Help with items, listings, and questions
        </div>
        <button className="chat-close" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {chat.map((t, i) => {
          return (
            <div key={i} className={`message ${i % 2 === 0 ? "user" : "bot"}`}>
              {t[0]}
              {t.length > 1 &&
                t[1].map((imgurl, idx) => <img key={idx} src={imgurl} />)}
            </div>
          );
        })}
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send a message..."
        />
        <button disabled={!ready || !text.trim()}>Send</button>
      </form>
    </div>
  );
}
