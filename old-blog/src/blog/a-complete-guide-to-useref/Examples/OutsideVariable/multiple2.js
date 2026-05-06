import React, { useState } from "react"
import styles from "./styles.module.css"
import OutsideButton from "../Buttons/OutsideVariable"
import StateButton from "../Buttons/StateButton"
import RefButton from "../Buttons/RefButton"

export default function App() {
  const [dummy, setDummy] = useState(0)

  return (
    <div className={styles.namedGrid}>
      <span>outside variable</span>
      <OutsideButton />
      <span>outside variable 2</span>
      <OutsideButton />
      <span>state</span>
      <StateButton />
      <span>ref</span>
      <RefButton />
      <span>ref</span>
      <RefButton />
      <button
        className="btn btn-purple col-span-2"
        onClick={() => setDummy(dummy + 1)}
      >
        Re-render
      </button>
    </div>
  )
}
