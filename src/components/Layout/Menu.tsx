import { IconButton, useColorMode } from '@chakra-ui/react'
import { MoonIcon } from '@chakra-ui/icons'
import Link from 'next/link'

function MenuLink({ children, ...props }: any) {
  return (
    <Link {...props} className="hover:text-purple-500">
      {children}
    </Link>
  )
}

function ToggleDarkModeButton() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label={`Toggle dark mode (current mode is ${colorMode})`}
      icon={<MoonIcon />}
      onClick={toggleColorMode}
    >
      Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
    </IconButton>
  )
}

export function Menu() {
  return (
      <div className="content w-full pt-8 pb-4 text-gray-800 sm:pt-6 sm:pb-8">
        <div className="max-content-width m-auto grid	items-center justify-center gap-4 pt-2 pb-4 sm:grid-cols-2 sm:justify-between">
          <div className="m-0" style={{ minWidth: '5rem' }}>
            <div className="flex flex-wrap gap-4">
              <Link href="/">
                <a className="prose text-3xl font-bold text-indigo-500 no-underline dark:prose-invert">
                  Giovanni Benussi
                </a>
              </Link>
            </div>
          </div>
          <div className="not-prose flex items-center justify-end gap-8 text-xl text-gray-800 dark:text-white">
            <MenuLink href="/">Home</MenuLink>
            <MenuLink href="/blog">Blog</MenuLink>
            <MenuLink href="/about">About</MenuLink>
            <ToggleDarkModeButton />
          </div>
        </div>
      </div>
  )
}
