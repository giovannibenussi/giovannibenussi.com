import React, { useState } from "react"

export const StateButton = () => {
  const [clicks, setClicks] = useState(0)

  return (
    <button className="btn btn-blue" onClick={() => setClicks(clicks + 1)}>
      Clicks: {clicks}
    </button>
  )
}
