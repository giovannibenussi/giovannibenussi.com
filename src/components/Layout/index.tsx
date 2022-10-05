import { Footer } from './Footer'
import { Menu } from './Menu'
import { useColorMode } from '@chakra-ui/react'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { colorMode } = useColorMode()

  return (
    <div className={colorMode}>
      <Menu />
      {children}
      <Footer />
    </div>
  )
}
