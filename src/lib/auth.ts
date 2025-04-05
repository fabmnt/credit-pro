import { db } from '@/db' // your drizzle instance
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg', // or "mysql", "sqlite"
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [nextCookies()],
})
