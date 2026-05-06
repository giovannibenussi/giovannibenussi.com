import React, { useState } from 'react'
import { DeleteIcon } from '@chakra-ui/icons'

const FILLED_LOG = '<span>👋</span>'
const logsInitialState = [FILLED_LOG]

const Log = React.forwardRef(({ empty, value }, ref) => (
  <div className="px-4 py-2" ref={ref}>
    {'>>'} {!empty && <span className="text-blue-500">ref: </span>}
    {value === 'undefined' || empty ? (
      value
    ) : (
      <span className="text-yellow-500">&quot;{value}&quot;</span>
    )}
  </div>
))

Log.displayName = 'Log'

function UsePreviousExample() {
  const [show, setShow] = useState(true)
  const [logs, setLogs] = useState(logsInitialState)

  return (
    <div className="grid gap-4">
      <button
        onClick={() => {
          setShow(!show)
          setLogs([...logs, show ? 'undefined' : FILLED_LOG])
        }}
        className="btn btn-blue justify-self-center"
      >
        {show ? 'Hide' : 'Show'}
      </button>
      <div className="h-10 text-center">
        {show && (
          <span className="text-4xl" ref={(ref) => console.log('ref:', ref)}>
            👋
          </span>
        )}
      </div>
      <div className="w-full bg-white">
        <button
          className="ml-auto flex w-full items-center border-b-2 border-gray-200 px-4 py-2 text-blue-500"
          onClick={() => setLogs([])}
        >
          <DeleteIcon className="mr-2 ml-auto h-4" /> Clear
        </button>

        <div
          className="grid divide-y-2 justify-self-stretch overflow-scroll"
          style={{ alignContent: 'baseline', height: '15rem' }}
          ref={(ref) => {
            console.log('this is a ref')
            console.log('ref', ref)
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
