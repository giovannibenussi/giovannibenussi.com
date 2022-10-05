import React, { useState } from "react"
import { DeleteIcon} from '@chakra-ui/icons'

const FILLED_LOG = "<span>👋</span>"
const logsInitialState = [FILLED_LOG]

const Log = React.forwardRef(({ empty, value }, ref) => (
  <div className="px-4 py-2" ref={ref}>
    {">>"} {!empty && <span className="text-blue-500">ref: </span>}
    {value === "undefined" || empty ? (
      value
    ) : (
      <span className="text-yellow-500">"{value}"</span>
    )}
  </div>
))

function UsePreviousExample() {
  const [show, setShow] = useState(true)
  const [logs, setLogs] = useState(logsInitialState)

  return (
    <div className="grid gap-4">
      <button
        onClick={() => {
          setShow(!show)
          setLogs([...logs, show ? "undefined" : FILLED_LOG])
        }}
        className="btn btn-blue justify-self-center"
      >
        {show ? "Hide" : "Show"}
      </button>
      <div className="h-10 text-center">
        {show && (
          <span className="text-4xl" ref={ref => console.log("ref:", ref)}>
            👋
          </span>
        )}
      </div>
      <div className="bg-white w-full">
        <button
          className="flex items-center text-blue-500 px-4 py-2 ml-auto border-b-2 border-gray-200 w-full"
          onClick={() => setLogs([])}
        >
          <DeleteIcon className="h-4 mr-2 ml-auto" /> Clear
        </button>

        <div
          className="grid divide-y-2 justify-self-stretch overflow-scroll"
          style={{ alignContent: "baseline", height: "15rem" }}
          ref={ref => {
            console.log("this is a ref")
            console.log("ref", ref)
            window.ref = ref
            if (ref) {
              ref.scrollTop = ref.scrollHeight
            }
            //ref?.scrollIntoView?.()
          }}
        >
          {logs.map((log, i) => (
            <Log key={i} value={log} />
          ))}
          <Log empty />
        </div>
      </div>
    </div>
  )
}

export default UsePreviousExample
