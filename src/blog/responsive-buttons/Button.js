import React from "react"

function Button({ children, className = "", style }) {
  return (
    <button
      className={`rounded bg-pink-500 text-white ${className}`}
      style={{ lineHeight: "1", ...style }}
    >
      {children || "I'm just a simple button"}
    </button>
  )
}

export default Button
