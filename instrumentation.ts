import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.NODE_ENV !== 'development') {
      Sentry.init({
        dsn: 'https://43d100c8834532a9181bf49fcb828a08@o4505799392165888.ingest.sentry.io/4505799394525184',
        tracesSampleRate: 1,
        debug: false,
      })
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    if (process.env.NODE_ENV !== 'development') {
      Sentry.init({
        dsn: 'https://43d100c8834532a9181bf49fcb828a08@o4505799392165888.ingest.sentry.io/4505799394525184',
        tracesSampleRate: 1,
        debug: false,
      })
    }
  }
}

export const onRequestError = Sentry.captureRequestError
