import React, { useRef } from "react"

const RefButton = () => {
  const clicks = useRef(0)

  return (
    <button className="btn btn-green" onClick={() => (clicks.current += 1)}>
      Clicks: {clicks.current}
    </button>
  )
}

export default RefButton
