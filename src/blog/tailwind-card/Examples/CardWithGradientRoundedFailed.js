import React from "react"

export const wrapperClassName = "shadow-xl rounded-xl"
//export const wrapperClassName = "shadow-xl rounded-xl w-[30rem] h-[18rem]"

//<blockquote className='bg-white px-6 py-8 text-lg font-bold text-lg m-0'>Hello world</blockquote>
function CardBase() {
  return (
    <div className="max-w-[30rem] shadow-xl rounded-xl">
      <p className="p-4 bg-white">Tailwind Rocks! 🤘</p>
      <div className="p-4 text-white bg-gradient-to-br from-yellow-500 to-pink-600">
        <p>Giovanni Benussi</p>
        <p>Software Developer</p>
      </div>
    </div>
  )
}

export default CardBase
