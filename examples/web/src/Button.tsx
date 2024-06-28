export function Button({ text, onClick }: { text: string; onClick: () => void; }) {
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
}
