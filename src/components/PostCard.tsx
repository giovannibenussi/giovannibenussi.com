import Link from 'next/link'
import Image from 'next/image'
import { TimeIcon } from '@chakra-ui/icons'
import { formatDate } from 'lib/util'
import { Badge } from 'components/Badge'

export type PostDataType = {
  bestOf?: boolean
  draft?: boolean
  date: string
  description: string
  featuredImage: string
  hot?: boolean
  image: string | null
  path: string
  slug: string
  title: string
}

export function PostCard({
  newest,
  post,
}: {
  newest: boolean
  post: PostDataType
}) {
  return (
    <li>
      <Link href={post.path}>
        <a>
          <article
            itemScope
            itemType="http://schema.org/Article"
            className="h-full flex flex-col border border-gray-100 shadow-md rounded-xl overflow-hidden hover:shadow-2xl"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            }}
          >
            <Image
              height={15 * 16}
              width={15 * 16}
              alt=""
              src={`/images/blog/${post.slug}.jpg`}
              style={{
                objectFit: 'cover',
                height: '15rem',
              }}
            />
            <section className="px-4 py-4 flex flex-col flex-grow hover:text-blue-500 text-black">
              <div className="h-full flex flex-col justify-between">
                <h2 className="font-bold text-xl">
                  <span itemProp="headline">{post.title}</span>
                </h2>
                <p
                  dangerouslySetInnerHTML={{
                    __html: post.description,
                  }}
                  itemProp="description"
                  className="text-gray-500 mb-4"
                />
              </div>
              <div className="flex mt-auto justify-between items-center">
                <div className="flex items-center text-gray-500">
                  <TimeIcon />
                  &nbsp;
                  <small>{formatDate(post.date)}</small>
                </div>
                <Badge post={post} newest={newest} />
              </div>
            </section>
          </article>
        </a>
      </Link>
    </li>
  )
}
