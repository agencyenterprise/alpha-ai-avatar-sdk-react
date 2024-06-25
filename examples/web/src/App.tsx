import { Avatar, useAvatarClient } from "alpha-ai-avatar-sdk-react";

function App() {
  const client = useAvatarClient();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Avatar style={{ borderRadius: "20px", width: 250, height: 250 }} />

      <div style={{ display: "flex", gap: "10px" }}>
        <Button text="Say" onClick={() => client.say("Hello, how are you?")} />
        <Button text="Stop Avatar" onClick={() => client.stop()} />
        <Button text="Switch Avatar" onClick={() => client.switchAvatar(4)} />
      </div>
    </div>
  );
}

export default App;

const Button = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        backgroundColor: "#0288D1",
        padding: "10px 20px",
        color: "white",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
};
