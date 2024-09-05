export type ButtonProps = React.ComponentPropsWithoutRef<'button'>;

export function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      style={{
        backgroundColor: "#0288D1",
        padding: "10px 20px",
        color: "white",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
      }}
      {...props}
    />
  );
}
