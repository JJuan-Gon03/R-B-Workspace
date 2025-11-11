import React, { useState } from "react";

function Chat({ handle_submit }) {
  const [text, setText] = useState("");

  function onSubmit(){
    event.preventDefault()
    handle_submit(text)
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
    </div>
  );
}

export default Chat;
