import React from "react"
import {
  gradientClassName,
  wrapperClassName as previousExampleClassName,
} from "./CardWithGradient"
import profileImage from "../../../assets/profile-pic.jpeg"

export const wrapperClassName = `${previousExampleClassName} `
;("w-16 h-16 object-cover object-top rounded-full border-4 border-white")

function CardWithAvatar() {
  return (
    <div className="max-w-[30rem] shadow-xl">
      <p className="p-4 bg-white rounded-t-xl">Tailwind Rocks! 🤘</p>
      <div className="text-white rounded-b-xl p-4 bg-gradient-to-br from-yellow-500 to-pink-600 p-4">
        <img
          src={profileImage}
          className="w-16 h-16 object-cover object-top rounded-full border-4 border-white"
        />
        <p>Giovanni Benussi</p>
        <p>Software Developer</p>
      </div>
    </div>
  )
}

export default CardWithAvatar
