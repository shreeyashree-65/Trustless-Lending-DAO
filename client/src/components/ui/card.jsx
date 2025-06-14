const Card = ({ children }) => {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
      {children}
    </div>
  );
};
export default Card;
