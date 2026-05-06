import React, { useEffect, useRef } from "react"

function AttachingToDomExample() {
  const inputRef = useRef()

  console.log("Render inputRef value:", inputRef)

  useEffect(() => console.log("useEffect inputRef value:", inputRef))

  return <input ref={inputRef} />
}

export default AttachingToDomExample
