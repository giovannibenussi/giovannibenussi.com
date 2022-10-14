import { Layout } from './Layout'
import { PostDataType } from './PostCard'
import { SEO } from 'components/SEO'

type BlogPostLayoutType = {
  children: React.ReactNode
  frontmatter: PostDataType
}

export function BlogPostLayout({ frontmatter, children }: BlogPostLayoutType) {
  console.log('frontmatter:', frontmatter)
  return (
    <Layout>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description}
        image={frontmatter.image}
      />

      <div
        className="content-padding prose m-auto dark:prose-invert"
        style={{ maxWidth: '55rem' }}
      >
        <h1>{frontmatter.title}</h1>
        {children}
      </div>
    </Layout>
  )
}
