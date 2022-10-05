import React from "react"
import Alert from "../components/Alert"

export function InteractiveExample({ children }) {
  return (
    <Alert type="info" title="Interactive Example">
      {children}
    </Alert>
  )
}
