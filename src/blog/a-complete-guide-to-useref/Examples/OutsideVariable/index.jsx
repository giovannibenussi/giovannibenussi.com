import React, { useState } from "react"
import styles from "./styles.module.css"

let clicks = 0

const Button = () => (
  <button className={styles.button} onClick={() => (clicks += 1)}>
    Clicks: {clicks}
  </button>
)

export default function App() {
  const [dummy, setDummy] = useState(0)

  return (
    <div className={styles.wrapper}>
      <Button />
      <button className={styles.button} onClick={() => setDummy(dummy + 1)}>
        Re-render
      </button>
    </div>
  )
}
