import { Layout } from './Layout'
import { PostDataType } from './PostCard'

type BlogPostLayoutType = {
  children: React.ReactNode
  frontmatter: PostDataType
}

export function BlogPostLayout({ frontmatter, children }: BlogPostLayoutType) {
  return (
    <Layout>
      <div className="prose dark:prose-invert m-auto">
        <h1>{frontmatter.title}</h1>
        {children}
      </div>
    </Layout>
  )
}
