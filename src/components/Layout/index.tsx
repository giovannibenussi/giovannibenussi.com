import { Menu } from './Menu'
import { useColorMode } from '@chakra-ui/react'
import Link from 'next/link'

type LayoutProps = {
  children: React.ReactNode
}

function A({ href, children }: { children: React.ReactNode; href: string }) {
  return (
    <Link href={href}>
      <a
        className="text-gray-500 no-underline hover:text-indigo-500"
        target={href.startsWith('http') ? '_blank' : '_self'}
      >
        {children}
      </a>
    </Link>
  )
}

export function Layout({ children }: LayoutProps) {
  const { colorMode } = useColorMode()

  return (
    <div className={colorMode}>
      <Menu />
      {children}
      <footer className="content mt-8 border-t border-gray-200 py-8">
        <div className="content prose grid grid-cols-2 dark:prose-invert">
          <ul className="m-0 list-none">
            <li>
              <A href="/">Home</A>
            </li>
            <li>
              <A href="/blog">Blog</A>
            </li>
            <li>
              <A href="/about">About</A>
            </li>
          </ul>
          <ul className="m-0 list-none">
            <li>
              <A href="https://twitter.com/giovannibenussi">Twitter</A>
            </li>
            <li>
              <A href="https://github.com/giovannibenussi">GitHub</A>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
