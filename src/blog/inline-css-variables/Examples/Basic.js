import React from "react"
import styles from "./Basic.module.css"
import c from "classnames"

function Basic() {
  return (
    <button className={c("rounded px-2 p-1", styles.wrapper)}>Click Me!</button>
  )
}

export default Basic
