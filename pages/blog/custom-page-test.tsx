import { BlogPostLayout } from 'components/BlogPostLayout'
import { PostDataType } from 'components/PostCard'

const metaData: PostDataType = {
  title: 'test',
  description: 'test',
  date: '2022-09-07T07:09:05.000Z',
  featuredImage: 'test',
  image: 'test',
}

export default function CustomPageTest() {
  return (
    <BlogPostLayout frontmatter={metaData}>
      <p>
      This is the beginning of my post
      </p>
    </BlogPostLayout>
  )
}
