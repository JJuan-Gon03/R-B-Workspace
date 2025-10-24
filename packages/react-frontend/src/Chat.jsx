import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

function Chat({ onSend }) {
    const [text, setText] = useState("");

    async function handleSend() {
        const value = text.trim();
        if (!value) return;
        if (typeof onSend === "function") {
            await onSend(value);
        } else {
            console.log("Send:", value);
        }
        setText("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
        }
    }

    return (
        <div 
        style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            padding: 12, 
            background: "#f332c9ff"
            }}
        >
            <TextareaAutosize
                minRows={1}
                maxRows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What's the OOTD?"
                style={{
                    width: "100%",
                    flex: 1,
                    resize: "none",
                    border: "none",
                    outline: "none",
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    padding: "8px 10px",
                    background: "#ce2f2fff",
                    borderRadius: 8,
                }}
            />
            <button
                onClick={handleSend}
                disabled={!text.trim()}
                title="Generate Outfit"
                style={{
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontWeight: 600,
                    cursor: !text.trim() ? "not-allowed" : "pointer",
                    opacity: !text.trim() ? 0.5 : 1,
                    background: "#ff00e1ff",
                    color: "white",
                }}
            >
                Generate Outfit!
            </button>
        </div>
    )
}

export default Chat;