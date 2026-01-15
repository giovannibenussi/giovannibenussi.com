/** @type {import('next').NextConfig} */

const withMDX = require('@next/mdx')({
  options: {
    remarkPlugins: [require('remark-prism')],
  },
})

const nextConfig = {
  reactStrictMode: true,
}

const mdxConfig = withMDX({
  ...nextConfig,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  async headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=30, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=31536000',
          },
        ],
      },
    ]
  },
})

// Sentry configuration
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(mdxConfig, {
  // Webpack plugin options
  org: 'giovannibenussicom-40b52f7f2',
  project: 'javascript-nextjs',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,

  // SDK build-time options
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
})
