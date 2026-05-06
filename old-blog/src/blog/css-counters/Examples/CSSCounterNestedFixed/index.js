import React from "react"
import styles from "./index.module.css"

function CSSCounterNestedFixed({ initialValue = 0 }) {
  return (
    <div
      className={styles.wrapper}
      style={{
        counterReset: `paragraph-counter ${initialValue}`,
      }}
    >
      <p>First paragraph</p>
      <p>Second paragraph</p>
      <div>
        <p>Nested paragraph</p>
      </div>
      <p>Third paragraph?</p>
    </div>
  )
}

export default CSSCounterNestedFixed
