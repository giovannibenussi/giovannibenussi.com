import { Layout } from 'components/Layout'
import { SEO } from 'components/SEO'
import { Profile } from './About/Profile'
import avatar from 'images/giovanni-benussi-avatar.jpg'
import { baseURL } from 'src/config'
import SubscribeCard from 'components/SubscribeCard'

export function Subscribe() {
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
        <div>
          <p>
            Subscribe to my content to get notified when I publish new articles.
          </p>
          <SubscribeCard />
        </div>
      </div>
    </Layout>
  )
}
