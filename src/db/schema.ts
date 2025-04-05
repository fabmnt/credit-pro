import { boolean, integer, pgEnum, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
})

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
})

export const client = pgTable('client', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	dni: text('dni').notNull().unique(),
	profession: text('profession').notNull(),
	address: text('address').notNull(),
	city: text('city').notNull(),
	telephone: text('telephone').notNull(),
	sex: text('sex').notNull(),
	nationality: text('nationality').notNull(),
	email: text('email'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const termFrequency = pgEnum('term_frequency', ['daily', 'weekly', 'monthly', 'yearly'])

export const creditStatus = pgEnum('credit_status', ['pending', 'rejected', 'active'])

export const credit = pgTable('credit', {
	id: uuid('id').primaryKey().defaultRandom(),
	clientId: uuid('client_id')
		.notNull()
		.references(() => client.id, { onDelete: 'cascade' }),
	amount: real('amount').notNull(),
	totalCredit: real('total_credit').notNull(),
	totalInterest: real('total_interest').notNull(),
	interestRate: real('interest_rate').notNull(),
	latePaymentRate: real('late_payment_rate').notNull(),
	monthsTerm: integer('months_term').notNull(),
	termFrequency: termFrequency('term_frequency').notNull(),
	creditStartDate: timestamp('credit_start_date').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
	status: creditStatus('status').default('pending'),
})

export const creditPaymentStatus = pgEnum('credit_payment_status', ['pending', 'active', 'paid', 'late'])

export const creditPaymentPlan = pgTable('credit_payment_plan', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	creditId: uuid('credit_id')
		.notNull()
		.references(() => credit.id, { onDelete: 'cascade' }),
	paymentBase: real('payment_base').notNull(),
	paymentFee: real('payment_fee').notNull(),
	paymentInterest: real('payment_interest').notNull(),
	remainingCredit: real('remaining_credit').notNull(),
	paymentReceived: real('payment_received').notNull(),
	status: creditPaymentStatus('status').default('pending'),
	paymentDate: timestamp('payment_date').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
