import React, { useState } from "react"
import { useSpring, animated } from "react-spring"
import useInterval from "@use-it/interval"
import c from "classnames"
import { InfoOutlineIcon,WarningIcon } from '@chakra-ui/icons'

const icons = {
  info: InfoOutlineIcon,
  warning: WarningIcon,
}

const classNames = {
  info: {
    wrapper: "bg-blue-200 border-indigo-500",
    title: "text-indigo-700",
    body: "text-blue-900",
  },
  warning: {
    wrapper: "bg-yellow-100 border-yellow-700",
    title: "text-yellow-500",
    body: "text-yellow-900",
  },
}

function Alert({ children, title = "", type }) {
  const [top, setTop] = useState(false)
  useInterval(() => setTop(t => !t), top ? 300 : 1000)
  const props = useSpring({
    config: {
      mass: 2,
    },
    top: top ? -6 : -1,
  })
  const Icon = icons[type]
  const className = classNames[type] || {}

  return (
    <div
      className={c(
        className.wrapper,
        "border-l-4 p-4 rounded font-sans mt-2 mb-2"
      )}
    >
      <h2 className={c(className.title, "font-bold text-base m-0 mb-2")}>
        {Icon && (
          <animated.div style={props} className="inline relative">
            <Icon className="h-4 inline mr-1" />
          </animated.div>
        )}
        {title}
      </h2>
      <div className={c(className.body, "m-0")}>{children}</div>
    </div>
  )
}

export default Alert
