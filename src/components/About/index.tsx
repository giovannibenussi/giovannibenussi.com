import { Layout } from 'components/Layout'
import { SEO } from 'components/SEO'
import { Description } from './Description'
import { Profile } from './Profile'
import avatar from 'images/giovanni-benussi-avatar.jpg'
import { baseURL } from 'src/config'

export function About() {
  return (
    <Layout>
      <SEO
        title="About"
        description="About Giovanni Benussi"
        image={baseURL + avatar.src}
        canonicalURL={baseURL + '/about'}
      />
      <div className="content prose grid grid-cols-[1fr] gap-4 dark:prose-invert md:grid-cols-[1fr_2fr]">
        <Profile />
        <Description />
      </div>
    </Layout>
  )
}
