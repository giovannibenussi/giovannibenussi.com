import { Layout } from 'components/Layout'
import { Description } from './Description'
import { Profile } from './Profile'

export function About() {
  return (
    <Layout>
      <div className="grid gap-4 grid-cols-[1fr] md:grid-cols-[1fr_2fr] prose dark:prose-invert content">
        <Profile />
        <Description />
      </div>
    </Layout>
  )
}
