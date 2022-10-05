import React from "react"

let clicks = 0

const OutsideButton = () => (
  <button className="btn btn-pink" onClick={() => (clicks += 1)}>
    Clicks: {clicks}
  </button>
)

export default OutsideButton
