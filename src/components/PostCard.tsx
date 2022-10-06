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
  slug?: string
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
            className="prose flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 shadow-md hover:shadow-2xl dark:prose-invert dark:border-gray-900 dark:bg-gray-900"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            }}
          >
            <Image
              height={250}
              width={350}
              alt=""
              src={`/images/blog/${post.slug}.jpg`}
              objectFit="cover"
              style={{
                objectFit: 'cover',
                height: '15rem',
              }}
            />
            <section className="flex flex-grow flex-col px-4 py-4">
              <div>
                <h1 className="mt-0 mb-2 text-xl font-bold hover:text-blue-500">
                  <span itemProp="headline">{post.title}</span>
                </h1>
                <p
                  dangerouslySetInnerHTML={{
                    __html: post.description,
                  }}
                  itemProp="description"
                  className="mb-4"
                />
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center">
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
