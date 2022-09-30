import Link from 'next/link'
import Image from 'next/image'

export type PostDataType = {
  featuredImage: string
  image: string | null
  path: string
  slug: string
  title: string
}

export function PostCard({ post }: { post: PostDataType }) {
  return (
    <li>
      <Link href={post.path}>
        <a>
          <article
            itemScope
            itemType="http://schema.org/Article"
            className="h-full flex flex-col bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden hover:shadow-2xl"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            }}
          >
            <Image
              height={15 * 16}
              width={15 * 16}
              alt="Example description"
              src={`/images/blog/${post.slug}.jpg`}
              style={{
                objectFit: 'cover',
                height: '15rem',
              }}
            />
            <section className="px-4 py-4 flex flex-col flex-grow hover:text-blue-500 text-black">
              <div>
                <h2 className="font-bold text-xl">
                  <span itemProp="headline">{post.title}</span>
                </h2>
              </div>
            </section>
          </article>
        </a>
      </Link>
    </li>
  )
}
