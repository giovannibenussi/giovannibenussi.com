import React from "react"
import { avatarClassNames as previousExampleAvatarClassName } from "./CardWithAvatarOrganized"
import { gradientClassName } from "./CardWithGradient"
import profileImage from "../../../assets/profile-pic.jpeg"
import Quote from "./quote.inline.svg"
import Twitter from "./twitter.inline.svg"
import styles from "./styles.module.css"
import c from "classnames"

export const wrapperClassName = `shadow-lg rounded-xl w-96 flex flex-col w-[30rem] h-[18rem]`

function CardWithAvatarOrganized() {
  return (
    <div className="transform rotate-2 duration-300 hover:rotate-0 max-w-[30rem] shadow-xl rounded-xl">
      <div className="rounded-t-xl p-8 text-lg font-semibold">
        <div className="fill-current text-yellow-500 mb-4 opacity-20">
          <Quote />
        </div>
        Tailwind Rocks! 🤘
      </div>
      <div className="text-white rounded-b-xl p-4 bg-gradient-to-br from-yellow-500 to-pink-600 p-4 flex items-center gap-4 h-32">
        <img
          src={profileImage}
          className="w-16 h-16 object-cover object-top rounded-full border-4 border-white mr-2"
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
          <Twitter className="opacity-50 hover:opacity-75 text-white" />
        </a>
      </div>
    </div>
  )
}

export default CardWithAvatarOrganized
