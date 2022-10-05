import React from "react"
import styles from "./index.module.css"
import c from "classnames"
import Boxes from "../Boxes"
import { wrapperClassname } from "../constants"

function GapExample() {
  return (
    <div className="" style={{ width: "22rem" }}>
      <div
        className={c(
          styles.wrapper,
          wrapperClassname,
        )}
      >
        <Boxes />
      </div>
    </div>
  )
}

export default GapExample
