import React from "react"
import Button from "../Button"
import Experiment from "../Experiment"
import styles from "./styles.module.css"

function FinalButton() {
  return (
    <Button className={styles.button}>
      <Experiment /> I&apos;m an Experiment!
    </Button>
  )
}

export default FinalButton
