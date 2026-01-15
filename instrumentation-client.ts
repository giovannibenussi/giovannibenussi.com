import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://43d100c8834532a9181bf49fcb828a08@o4505799392165888.ingest.sentry.io/4505799394525184',
    tracesSampleRate: 1,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
