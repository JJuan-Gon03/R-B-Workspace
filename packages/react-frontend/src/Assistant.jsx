import { useState } from "react";
import "./Assistant.css";

export default function Assistant() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const [ready, setReady] = useState(true);
  const [open, setOpen] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setReady(false);
    setChat((prev) => [...prev, [text]]);
    setText("");

    try {
      const res = await fetch(
        "thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net/gemini/response/123/" +
          encodeURIComponent(text)
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
      setChat((prev) => [
        ...prev,
        ["AI Assistant is unavailable at this time"],
      ]);
      console.log(err?.message || err);
    }
  }

  if (!open) {
    return (
      <button className="chatbox-open" onClick={() => setOpen(true)}>
        AI
      </button>
    );
  }

  return (
    <div className="chatbox">
      <div className="chatbox-header">AI Assistant</div>
      <button className="chatbox-close" onClick={() => setOpen(false)}>
        ✕
      </button>

      <div className="chatbox-messages">
        {chat.map((t, i) => {
          return (
            <div className="chatbox-message" key={i}>
              {t[0]}
              {t.length > 1 &&
                t[1].map((imgurl, idx) => (
                  <img
                    className="chatbox-message-image"
                    key={idx}
                    src={imgurl}
                  />
                ))}
            </div>
          );
        })}
      </div>

      <form className="chatbox-form" onSubmit={handleSubmit}>
        <input
          className="chatbox-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="chatbox-send" disabled={!ready || !text.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
