import React, { useState } from "react"
import styles from "./styles.module.css"
import OutsideButton from "../Buttons/OutsideVariable"
import StateButton from "../Buttons/StateButton"
import RefButton from "../Buttons/RefButton"
const xTimes = (x, callback) => [...Array(x)].map(callback)
import c from "classnames"

export default function App({
  displayType = true,
  displayTitles = true,
  refs = 0,
  state = 0,
  variable = 0,
}) {
  const [dummy, setDummy] = useState(0)

  return (
    <div
      className={c(
        styles.namedGrid,
        "bg-gray-100 p-4 m-auto w-max rounded mt-4 mb-4"
      )}
    >
      {displayTitles && (
        <>
          <strong>Type</strong>
          <strong>Result</strong>
        </>
      )}
      {xTimes(variable, i => (
        <React.Fragment key={i}>
          {displayType && <span>outside variable</span>}
          <OutsideButton />
        </React.Fragment>
      ))}
      {xTimes(state, i => (
        <React.Fragment key={i}>
          {displayType && <span>state</span>}
          <StateButton />
        </React.Fragment>
      ))}
      {xTimes(refs, i => (
        <React.Fragment key={i}>
          {displayType && <span>ref</span>}
          <RefButton />
        </React.Fragment>
      ))}
      <button
        className={c("btn btn-purple", displayType && "col-span-2")}
        onClick={() => setDummy(dummy + 1)}
      >
        Re-render
      </button>
    </div>
  )
}
