import React from "react"
import { wrapperClassName as previousExampleClassName } from "./CardWithAvatar"
import { gradientClassName } from "./CardWithGradient"
import profileImage from "../../../assets/profile-pic.jpeg"

export const wrapperClassName = `${previousExampleClassName} `

function CardWithAvatarOrganized() {
  return (
    <div className="max-w-[30rem] shadow-xl">
      <p className="p-4 bg-white rounded-t-xl">Tailwind Rocks! 🤘</p>
      <div className="text-white rounded-b-xl p-4 bg-gradient-to-br from-yellow-500 to-pink-600 p-4 flex items-center gap-4 h-32">
        <img
          src={profileImage}
          className="w-16 h-16 object-cover object-top rounded-full border-4 border-white"
        />
        <div>
          <p>Giovanni Benussi</p>
          <p>Software Developer</p>
        </div>
      </div>
    </div>
  )
}

export default CardWithAvatarOrganized
