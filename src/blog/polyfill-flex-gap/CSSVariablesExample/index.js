import React from "react"
import styles from "./index.module.css"
import c from "classnames"
import Boxes from "../Boxes"
import { wrapperClassname } from "../constants"

function MarginExample() {
  return (
    <div className="" style={{ width: "22rem" }}>
      <div
        className={c(styles.wrapper, wrapperClassname)}
        style={{
          "--row-gap": "3rem",
          "--column-gap": "0.5rem",
        }}
      >
        <Boxes />
      </div>
    </div>
  )
}

export default MarginExample
