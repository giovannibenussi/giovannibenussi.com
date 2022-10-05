import React from "react"
import Example from "../../../components/Example"
import styles from "./GSCFirstExample.module.css"

function GSCFirstExample() {
  return (
    <Example className={styles.wrapper}>
      <p>Before header 1</p>
      <p>Before header 2</p>
      <h1>Header</h1>
      <p>After header 1</p>
      <p>After header 2</p>
    </Example>
  )
}

export default GSCFirstExample
