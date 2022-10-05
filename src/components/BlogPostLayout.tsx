import { Layout } from './Layout'
import { PostDataType } from './PostCard'

type BlogPostLayoutType = {
  children: React.ReactNode
  frontmatter: PostDataType
}

export function BlogPostLayout({ frontmatter, children }: BlogPostLayoutType) {
  return (
    <Layout>
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
