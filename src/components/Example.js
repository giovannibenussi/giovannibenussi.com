import React from 'react'
import c from 'classnames'

function Example({ className, children }) {
  return (
    <div className={c('rounded border border-blue-500 p-4', className)}>
      {children}
    </div>
  )
}

export default Example
