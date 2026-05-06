# _api_disabled

Backup of the original `pages/api/` routes from this Next.js app.

These were moved out of `pages/` so the static export (`output: 'export'`) wouldn't fail — Next.js static export can't build API routes.

Files:
- `hello.ts`
- `sentry-example-api.js`
- `subscribe.tsx`

If you bring API routes back, you'll need to drop `output: 'export'` from `next.config.js` and deploy to a host that runs a Node server.
