<p align="center" width="100%">
  <img src="https://raw.githubusercontent.com/giovannibenussi/giovannibenussi.com/main/public/favicon.ico">
</p>

# **giovannibenussi.com**

Hi! I'm [Giovanni Benussi](https://twitter.com/giovannibenussi) and this is the repository for my personal blog that you can see at https://www.giovannibenussi.com/.

This is a Next.js project that reads MDX files to generate blog entries dynamically.

# Installation

To install this repository locally, you just need to install the dependencies and then run the `dev` script:

```bash
yarn install
yarn dev
```

Now you can go to http://localhost:3002/ to see the site.

# Archived inside giovannibenussi-com-2026

This copy of the blog lives inside the new site repo and is built as a static export served at `/old`. The following changes were made to make that work — revert them if you ever want to run this as a standalone Next.js app again:

- `next.config.js`: added `output: 'export'`, `basePath: '/old'`, `assetPrefix: '/old'`, `images.unoptimized`, `trailingSlash: true`; removed the `headers()` block (incompatible with `output: 'export'`).
- `pages/api/` was moved to `_api_disabled/` at the repo root because static export can't build API routes.
- `package.json` build script changed from `next build && cp _headers .next/.` to `next build && cp _headers out/.` since static export writes to `out/` instead of `.next/`.

To rebuild and publish into the new site, from the new repo root run `pnpm run build-old-blog`.

