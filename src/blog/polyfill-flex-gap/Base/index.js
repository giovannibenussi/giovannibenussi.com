import React from "react"
import styles from "./index.module.css"
import c from "classnames"
import Boxes from "../Boxes"
import { wrapperClassname } from "../constants"

function Base() {
  return (
    <div className={c(styles.wrapper, wrapperClassname)}>
      <Boxes />
    </div>
  )
}

export default Base
