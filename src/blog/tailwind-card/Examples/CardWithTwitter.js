import React from "react"
import { avatarClassNames as previousExampleAvatarClassName } from "./CardWithAvatarOrganized"
import { gradientClassName } from "./CardWithGradient"
import profileImage from "../../../assets/profile-pic.jpeg"
import Quote from "./quote.inline.svg"
import Twitter from "./twitter.inline.svg"

export const wrapperClassName = `shadow-lg rounded-xl w-96 flex flex-col`

function CardWithAvatarOrganized() {
  return (
    <div className="max-w-[30rem] shadow-xl">
      <div className="p-4 bg-white rounded-t-xl">
        <div className="fill-current text-yellow-500 mb-4 opacity-20">
          <Quote />
        </div>
        Tailwind Rocks! 🤘
      </div>
      <div className="text-white rounded-b-xl p-4 bg-gradient-to-br from-yellow-500 to-pink-600 p-4 flex items-center gap-4 h-32">
        <img
          src={profileImage}
          className="w-16 h-16 object-cover object-top rounded-full border-4 border-white"
        />
        <div>
          <p>Giovanni Benussi</p>
          <p>Software Developer</p>
        </div>
        <a
          className="ml-auto"
          href="https://twitter.com/giovannibenussi"
          target="_blank"
          rel="noreferrer"
        >
          <div className="opacity-50 hover:opacity-75 text-white">
            <Twitter />
          </div>
        </a>
      </div>
    </div>
  )
}

export default CardWithAvatarOrganized
