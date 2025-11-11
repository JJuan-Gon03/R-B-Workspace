import Chat from "./Chat";

export default function GenerateOutfit() {
  return (
    <div>
      <Chat
        handle_submit={(msg) => {
          console.log(msg);
        }}
      />
    </div>
  );
}
