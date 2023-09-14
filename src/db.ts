import { createClient } from '@libsql/client'

export const db = createClient({
  url: process.env.TURSO_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

