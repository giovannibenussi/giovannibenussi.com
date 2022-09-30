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
    <div>
      <div
        className="w-full pt-6 pb-8 text-gray-800 content"
        style={{
          gridTemplateColumns: 'auto 1fr',
        }}
      >
        <div className="flex flex-wrap items-center	justify-between gap-4 max-content-width m-auto pt-2 pb-4 px-8">
          <div className="m-0" style={{ minWidth: '5rem' }}>
            <div className="flex flex-wrap gap-4">
              <Link href="/">
                <a className="text-3xl font-bold no-underline prose dark:prose-invert">
                  Giovanni Benussi
                </a>
              </Link>
            </div>
          </div>
          <div className="not-prose text-xl flex gap-8 items-center text-gray-800 dark:text-white">
            <MenuLink href="/">Home</MenuLink>
            <MenuLink href="/blog">Blog</MenuLink>
            <MenuLink href="/about">About</MenuLink>
            <ToggleDarkModeButton />
          </div>
        </div>
      </div>
    </div>
  )
}
