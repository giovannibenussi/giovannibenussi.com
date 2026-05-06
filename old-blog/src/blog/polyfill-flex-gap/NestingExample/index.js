import React from "react"
import styles from "./index.module.css"
import c from "classnames"
import { wrapperClassname } from "../constants"
import Boxes from "../Boxes"

const Children = () => (
  <div className={c(styles.wrapper, "border-2 border-pink-500 w-24")}>
    <Boxes small />
  </div>
)

function MarginExample() {
  return (
    <div className="" style={{ width: "22rem" }}>
      <div
        className={c(
          styles.wrapper,
          wrapperClassname,
          "border-2 border-green-500 flex flex-wrap"
        )}
      >
        <Children />
        <Children />
        <Children />
        <Children />
      </div>
    </div>
  )
}

export default MarginExample
