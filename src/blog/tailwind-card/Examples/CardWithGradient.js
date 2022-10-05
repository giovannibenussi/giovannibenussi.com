import React from "react"
import { wrapperClassName as previousExampleClassName } from "./CardBase"

export const gradientClassName = `text-white bg-gradient-to-br from-yellow-500 to-pink-600`
export const wrapperClassName = previousExampleClassName

function CardWithGradient() {
  return (
    <div className="max-w-[30rem] shadow-xl">
      <p className="p-4 bg-white">Tailwind Rocks! 🤘</p>
      <div className="p-4 text-white bg-gradient-to-br from-yellow-500 to-pink-600">
        <p>Giovanni Benussi</p>
        <p>Software Developer</p>
      </div>
    </div>
  )
}

export default CardWithGradient
