import Chat from "./Chat";

export default function GenerateOutfit() {
  return (
    <div>
      <Chat
        onSend={(msg) => {
          console.log(msg);
        }}
      />
    </div>
  );
}
