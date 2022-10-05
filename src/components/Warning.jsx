import React from "react"
import Alert from "./Alert"

function Warning({ children }) {
  return (
    <Alert type="warning" title="Warning">
      {children}
    </Alert>
  )
}

export default Warning
