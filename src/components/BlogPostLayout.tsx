import { Layout } from './Layout'
import { PostDataType } from './PostCard'
import { SEO } from 'components/SEO'
import { baseURL } from 'src/config'

type BlogPostLayoutType = {
  children: React.ReactNode
  frontmatter: PostDataType
}

export function BlogPostLayout({ frontmatter, children }: BlogPostLayoutType) {
  return (
    <Layout>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description}
        image={baseURL + frontmatter.image}
        canonicalURL={frontmatter.canonicalURL}
      />

      <div
        className="content-padding prose m-auto pb-14 dark:prose-invert"
        style={{ maxWidth: '55rem' }}
      >
        <h1>{frontmatter.title}</h1>
        {children}
      </div>
    </Layout>
  )
}
