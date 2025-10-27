import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Chat from "./Chat";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <Chat
        onSend={(msg) => {
          console.log(msg);
        }}
      />
    </div>
  );
}

export default App;
