import React from 'react'

const Box = ({ className, small }) => (
  <div
    className={`${
      small ? 'h-4 w-4 border-2' : 'h-16 w-16 border-4'
    } border-box ${className}`}
  ></div>
)

function Boxes({ small }) {
  return (
    <>
      <Box small={small} className="border-gray-600 bg-gray-500" />
      <Box small={small} className="border-red-600 bg-red-500" />
      <Box small={small} className="border-yellow-600 bg-yellow-500" />
      <Box small={small} className="border-green-600 bg-green-500" />
      <Box small={small} className="border-blue-600 bg-blue-500" />
      <Box small={small} className="border-indigo-600 bg-indigo-500" />
      <Box small={small} className="border-purple-600 bg-purple-500" />
      <Box small={small} className="border-pink-600 bg-pink-500" />
    </>
  )
}

export default Boxes
