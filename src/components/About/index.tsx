import { Layout } from 'components/Layout'
import {SEO} from 'components/SEO'
import { Description } from './Description'
import { Profile } from './Profile'

export function About() {
  return (
    <Layout>
      <SEO title='About' description='About Giovanni Benussi' image={null}/>
      <div className="content prose grid grid-cols-[1fr] gap-4 dark:prose-invert md:grid-cols-[1fr_2fr]">
        <Profile />
        <Description />
      </div>
    </Layout>
  )
}
