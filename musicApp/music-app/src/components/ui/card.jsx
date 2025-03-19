import React from "react";

export function Card({ children }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "10px" }}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
