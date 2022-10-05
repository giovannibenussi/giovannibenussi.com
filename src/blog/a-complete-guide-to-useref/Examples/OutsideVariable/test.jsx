import React, { useRef, useState } from "react"
import styles from "./styles.module.css"

const Square = () => {
  const clicks = useRef(0)

  return (
    <button className={styles.button} onClick={() => (clicks.current += 1)}>
      Clicks: {clicks.current}
    </button>
  )
}

const Circle = () => {
  const clicks = useRef(0)

  return (
    <div
      className={styles.button}
      onClick={() => (clicks.current += 1)}
      style={{ borderRadius: "50%" }}
    >
      Clicks: {clicks.current}
    </div>
  )
}

export default function App() {
  const [dummy, setDummy] = useState(0)
  const [rounded, setType] = useState(false)

  return (
    <div className={styles.wrapper}>
      {rounded ? <Circle /> : <Square />}
      <button className={styles.button} onClick={() => setType(!rounded)}>
        Change type
      </button>
      <button className={styles.button} onClick={() => setDummy(dummy + 1)}>
        Re-render
      </button>
    </div>
  )
}
