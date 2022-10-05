/** @type {import('next').NextConfig} */

const withMDX = require('@next/mdx')({
  options: {
    remarkPlugins: [require('remark-prism')],
  },
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/blog',
      },
    ]
  },
}

module.exports = withMDX({
  ...nextConfig,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
})
