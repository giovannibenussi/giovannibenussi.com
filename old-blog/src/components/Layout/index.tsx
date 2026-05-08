import { Footer } from './Footer'
import { Menu } from './Menu'
import { NewBlogBanner } from './NewBlogBanner'
import { useColorMode } from '@chakra-ui/react'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { colorMode } = useColorMode()

  return (
    <div className={colorMode}>
      <NewBlogBanner />
      <Menu />
      {children}
      <Footer />
    </div>
  )
}
