import React, { useEffect, useRef, useState } from "react"

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function UsePreviousExample() {
  const [clicks, setClicks] = useState(0)
  const previousClicks = usePrevious(clicks)

  return (
    <div>
      <button className="btn btn-blue" onClick={() => setClicks(clicks + 1)}>
        Clicks: {clicks} - Before:{" "}
        {previousClicks === undefined ? "undefined" : previousClicks}
      </button>
    </div>
  )
}

export default UsePreviousExample
