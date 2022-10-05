import React from "react"

const classNameLeft = "bg-white justify-self-start"
const styleLeft = {}
const classNameRight = "justify-self-end"
const styleRight = { background: "#DCF8C6" }
import {CheckIcon} from '@chakra-ui/icons'

const Read = () => (
  <>
    <CheckIcon className="h-4 inline-block" style={{ color: "#34B7F1" }} />
    <CheckIcon
      className="h-4 inline-block"
      style={{ color: "#34B7F1", marginLeft: "-12px" }}
    />
  </>
)

const COLORS = ["text-blue-500", "text-red-500"]

const sumStringLetters = name =>
  name
    .split("")
    .map(c => c.charCodeAt())
    .reduce((a, b) => a + b, 0)

const nameColor = (name = "") => COLORS[sumStringLetters(name) % COLORS.length]

const Message = ({ name, side, children, time }) => {
  return (
    <div
      className={`rounded px-2 py-1 ${
        side === "left" ? classNameLeft : classNameRight
      }`}
      style={side === "left" ? styleLeft : styleRight}
    >
      <div className={`text-sm text-bold ${nameColor(name)}`}>{name}</div>
      {children}
      <span className="text-gray-700 text-xs ml-4">
        {time}
        {side === "right" && <Read />}
      </span>
    </div>
  )
}

export function Chat({ messages = [] }) {
  return (
    <div
      className="font-sans grid gap-2 p-4 rounded"
      style={{ background: "#ECE5DD" }}
    >
      {Object.entries(messages).map(([date, messagesArray]) => (
        <>
          <span
            className="justify-self-center rounded px-2 py-1 "
            style={{ background: "#E1F2FB" }}
          >
            {date}
          </span>
          {messagesArray.map(({ name, message, side, time }) => (
            <Message key={message} side={side} time={time} name={name}>
              {message}
            </Message>
          ))}
        </>
      ))}
    </div>
  )
}
