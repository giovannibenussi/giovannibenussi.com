import React from "react"

const Box = ({ className, small }) => (
  <div
    className={`${
      small ? "h-4 w-4 border-2" : "h-16 w-16 border-4"
    } border-box ${className}`}
  ></div>
)

function Boxes({ small }) {
  return (
    <>
      <Box small={small} className="bg-gray-500 border-gray-600" />
      <Box small={small} className="bg-red-500 border-red-600" />
      <Box small={small} className="bg-yellow-500 border-yellow-600" />
      <Box small={small} className="bg-green-500 border-green-600" />
      <Box small={small} className="bg-blue-500 border-blue-600" />
      <Box small={small} className="bg-indigo-500 border-indigo-600" />
      <Box small={small} className="bg-purple-500 border-purple-600" />
      <Box small={small} className="bg-pink-500 border-pink-600" />
    </>
  )
}

export default Boxes
