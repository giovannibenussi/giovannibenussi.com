import React from "react"
import styles from "./Margin.module.css"

const Button = ({ children }) => (
  <button className="btn btn-blue">{children}</button>
)

function Margin() {
  return (
    <div className={`border border-blue-500 rounded ${styles.wrapper}`}>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
      <Button>Fourth</Button>
    </div>
  )
}

export default Margin
