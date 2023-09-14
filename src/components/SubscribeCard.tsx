import React, { useEffect, useState } from 'react'
import { BoltIcon, UsersIcon } from '@heroicons/react/20/solid'
import avatar from 'images/giovanni-benussi-avatar.jpg'
import Image from 'next/image'

export default function Subscribe({
  hideIfAlreadySubscribed,
}: {
  hideIfAlreadySubscribed?: boolean
}) {
  const [storedIsSubscribed, setStoredIsSubscribed] = useState(true)

  useEffect(() => {
    setStoredIsSubscribed(
      window.localStorage.getItem('isSubscribed') === 'true'
    )
  }, [])

  if (storedIsSubscribed && hideIfAlreadySubscribed) {
    return null
  }

  function onSubscribed() {
    window.localStorage.setItem('isSubscribed', 'true')
  }

  return (
    <div className="not-prose bottom-0 m-auto max-w-[500px] rounded-md border border-gray-200 p-4 dark:border-gray-900 dark:bg-gray-900">
      <div className="flex items-center">
        <Image
          src={avatar}
          height={24}
          width={24}
          alt="Giovanni Benussi profile picture"
          className="mr-2 inline-block h-9 w-9 rounded-full"
        />
        <div>
          <h1 className="text-xl font-semibold">Subscribe to My Content</h1>
          <AvatarSection />
        </div>
      </div>
      <InputSection onSubscribed={onSubscribed} />
    </div>
  )
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function InputArea({
  success,
  isLoading,
  error,
}: {
  success: boolean
  isLoading: boolean
  error: string | undefined
}) {
  if (success) {
    return (
      <div className="relative inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white ring-1 ring-inset hover:bg-indigo-600">
        <BoltIcon className="-ml-0.5 h-4 w-4 text-current" aria-hidden="true" />
        Thanks for subscribing!
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-2 rounded-lg shadow-sm md:flex-row md:gap-0">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UsersIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-md rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:ring-gray-700 sm:text-sm sm:leading-6 md:rounded-r-none"
            placeholder="Your email address"
          />
        </div>
        <button
          type="submit"
          className="relative -ml-px inline-flex items-center justify-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset hover:bg-indigo-600 md:rounded-l-none"
        >
          <BoltIcon
            className="-ml-0.5 h-4 w-4 text-current"
            aria-hidden="true"
          />
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {error && (
        <div className="mt-1 text-center text-sm text-red-500">{error}</div>
      )}
    </div>
  )
}

function InputSection({ onSubscribed }: { onSubscribed: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<undefined | string>()
  const MINIMUM_LOADING_TIME_IN_MS = 500

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const startTimestamp = Date.now()
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: e.currentTarget.email.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const millisecondsElapsed = Date.now() - startTimestamp
      const data = await response.json()
      console.log('data:', data)
      if (data.userFacingError) {
        setError(data.userFacingError)
        setIsLoading(false)
        return
      }

      await sleep(MINIMUM_LOADING_TIME_IN_MS - millisecondsElapsed)
      setIsLoading(false)
      setSuccess(true)
      onSubscribed()
    } catch (error) {
      setError('There was an error subscribing. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="email"
          className="my-2 block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
        >
          Type your email address below to receive updates:
        </label>
        <InputArea success={success} isLoading={isLoading} error={error} />
      </form>
    </div>
  )
}

function AvatarSection() {
  return (
    <a href="#" className="group block flex-shrink-0">
      <div className="flex items-center">
        <div></div>
        <div className="flex gap-1 text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-200">
          <span>Giovanni Benussi</span>
          <span>
            (
            <a
              href="https://twitter.com/giovannibenussi"
              target="_blank"
              rel="noopener noreferrer"
              className="link font-medium dark:text-gray-200"
            >
              @giovannibenussi
            </a>
            )
          </span>
        </div>
      </div>
    </a>
  )
}
