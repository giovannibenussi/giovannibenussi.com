import React from "react"
import styles from "./index.module.css"

function CSSCounterNested() {
  return (
    <div className={styles.wrapper}>
      <p>First paragraph</p>
      <p>Second paragraph</p>
      <div>
        <p>Nested paragraph</p>
      </div>
      <p>Third paragraph?</p>
    </div>
  )
}

export default CSSCounterNested
