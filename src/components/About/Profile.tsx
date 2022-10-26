import Image from 'next/image'
import avatar from 'images/giovanni-benussi-avatar.jpg'

export function Profile() {
  return (
    <div>
      <div className="w-48 h-48">
        <Image
          className="rounded-full"
          src={avatar}
          alt="Giovanni Benussi's Avatar"
        />
      </div>
      <h2 className="mt-8">Giovanni Benussi</h2>
      <ul>
        <li>
          Twitter:{' '}
          <a href="https://twitter.com/giovannibenussi">@giovannibenussi</a>
        </li>
        <li>
          GitHub:{' '}
          <a href="https://github.com/giovannibenussi">@giovannibenussi</a>
        </li>
        <li>
          Webiste:{' '}
          <a href="https://giovannibenussi.com/">giovannibenussi.com</a>
        </li>
      </ul>
    </div>
  )
}
