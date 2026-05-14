// @ts-check

import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Dev-only middleware: when a request under /old/ resolves to a directory
// (no extension), rewrite to its index.html so the static export works
// the same way most production hosts (Cloudflare Pages, Netlify, Vercel) do.
const oldBlogDevRewrite = {
  name: 'old-blog-dev-rewrite',
  hooks: {
    'astro:server:setup': ({ server }) => {
      server.middlewares.use((req, _res, next) => {
        if (req.url && req.url.startsWith('/old/') && !/\.[a-zA-Z0-9]+(\?|$)/.test(req.url)) {
          const [path, query = ''] = req.url.split('?');
          const withSlash = path.endsWith('/') ? path : path + '/';
          req.url = withSlash + 'index.html' + (query ? '?' + query : '');
        }
        next();
      });
    },
  },
};

export default defineConfig({
  site: 'https://giovannibenussi.com',
  output: 'static',
  adapter: netlify(),
  integrations: [
    mdx(),
    sitemap(),
    react(),
    partytown({ config: { forward: ['dataLayer.push'] } }),
    oldBlogDevRewrite,
  ],
  redirects: {
    '/old': '/old/index.html',
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: 'snazzy-light',
        dark: 'tokyo-night',
      },
    },
  },

  fonts: [
      {
          provider: fontProviders.local(),
          name: 'Atkinson',
          cssVariable: '--font-atkinson',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/atkinson-regular.woff'],
                      weight: 400,
                      style: 'normal',
                      display: 'swap',
                  },
                  {
                      src: ['./src/assets/fonts/atkinson-bold.woff'],
                      weight: 700,
                      style: 'normal',
                      display: 'swap',
                  },
              ],
          },
      },
      {
          provider: fontProviders.local(),
          name: 'Mona Sans',
          cssVariable: '--font-content',
          fallbacks: ['-apple-system', 'system-ui', 'Segoe UI', 'Noto Sans', 'Helvetica', 'Arial', 'sans-serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/Mona-Sans.ttf'],
                      weight: '200 900',
                      style: 'normal',
                      display: 'swap',
                  },
              ],
          },
      },
	],

  vite: {
    plugins: [tailwindcss()],
  },
});