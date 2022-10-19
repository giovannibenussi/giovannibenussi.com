import type { GetStaticProps, NextPage } from 'next'
import { Layout } from 'components/Layout'
import { PostCard, PostDataType } from 'components/PostCard'
import { getAllMDXFiles, pageSlug } from './blog/[...slug]'
import { serialize } from 'next-mdx-remote/serialize'
import { SEO } from 'components/SEO'
import { getPlaiceholder } from 'plaiceholder'
import { baseURL } from 'src/config'

export const slugToImageSRC = (slug: string) => `/images/blog/${slug}.jpg`

export const getStaticProps: GetStaticProps = async () => {
  const fg = require('fast-glob')
  const fs = require('fs')
  const pages = await getAllMDXFiles(fg)
  let posts: Array<PostDataType> = []
  for (const page of pages) {
    const data = fs.readFileSync(page.toString())
    const mdxSource = await serialize(data.toString(), {
      parseFrontmatter: true,
    })
    const { frontmatter } = mdxSource
    const slug = pageSlug(page)
    const imageSRC = slugToImageSRC(slug)
    const { base64, img } = await getPlaiceholder(imageSRC, { size: 10 })

    // @ts-ignore
    posts.push({
      ...frontmatter,
      path: `/blog/${pageSlug(page)}`,
      img, // Can't be undefined
      imageBase64: base64 === null ? undefined : base64,
      slug,
    })
  }
  posts = posts.filter((post) => !post?.draft)
  posts = posts.sort((post1, post2) => (post2?.date > post1?.date ? 1 : -1))

  return {
    props: { posts },
  }
}

type HomeProps = {
  posts: Array<PostDataType>
}

const Home: NextPage<HomeProps> = ({ posts }) => {
  const newestIndex = posts.findIndex((post) => !post.draft)

  return (
    <div>
      <SEO
        title="All posts"
        description="Giovanni Benussi Blog"
        image={null}
        canonicalURL={baseURL + '/'}
      />

      <Layout>
        <div className="dark:bg-gray-800">
          <div className="content py-8">
            <ol
              className="grid gap-4"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
              }}
            >
              {posts.map((post: PostDataType, i) => {
                return (
                  <PostCard key={i} post={post} newest={i === newestIndex} />
                )
              })}
            </ol>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Home
