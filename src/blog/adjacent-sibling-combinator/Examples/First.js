import React from "react"
import styles from "./First.module.css"

function Example() {
  return (
    <div className={`border border-blue-500 rounded p-4 ${styles.wrapper}`}>
      <button className="btn">First</button>
      <button className="btn">Second</button>
      <p>Paragraph content</p>
      <button className="btn">Third</button>
      <button className="btn">Fourth</button>
    </div>
  )
}

export default Example
