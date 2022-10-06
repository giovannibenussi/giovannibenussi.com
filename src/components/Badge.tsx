import c from 'classnames'
import {PostDataType} from './PostCard'

function Wrapper({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  return (
    <div
      className={c(`w-max font-bold rounded-full px-2 py-1 text-sm`, className)}
    >
      {children}
    </div>
  )
}

export function Badge({
  post,
  newest,
}: {
  post: PostDataType
  newest: boolean
}) {
  let badge = null
  if (newest) {
    badge = (
      <Wrapper className="bg-green-100 text-green-700 hover:text-green-500">
        New{' '}
        <span role="img" aria-label="party popper">
          🎉
        </span>
      </Wrapper>
    )
  }

  if (post.hot) {
    badge = (
      <Wrapper className="bg-orange-100 text-orange-700 hover:text-orange-500">
        Trending{' '}
        <span role="img" aria-label="sparkles">
          🔥
        </span>
      </Wrapper>
    )
  }
  if (post.bestOf) {
    badge = (
      <Wrapper className="bg-blue-100 text-blue-700">
        Best of{' '}
        <span role="img" aria-label="sparkles">
          ✨
        </span>
      </Wrapper>
    )
  }
  return badge
}
