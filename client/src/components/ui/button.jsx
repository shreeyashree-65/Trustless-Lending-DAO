const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} style={{ padding: "0.5rem 1rem", background: "#007bff", color: "white", borderRadius: "5px", border: "none" }}>
      {children}
    </button>
  );
};
export default Button;
