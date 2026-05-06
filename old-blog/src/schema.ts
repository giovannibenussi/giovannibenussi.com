import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

export const subscribers = sqliteTable('subscribers', {
  email: text('email'),
})
