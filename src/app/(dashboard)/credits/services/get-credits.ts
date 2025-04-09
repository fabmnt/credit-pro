import type { CreditRequestWithClient } from '@/app/(dashboard)/credits/schema'
import { db } from '@/db'
import { client, credit } from '@/db/schema'
import Decimal from 'decimal.js'
import { and, desc, eq } from 'drizzle-orm'

export async function getCreditById(id: string): Promise<CreditRequestWithClient | null> {
	const results = await db
		.select({
			request: credit,
			client: client,
		})
		.from(credit)
		.where(eq(credit.id, id))
		.innerJoin(client, eq(credit.clientId, client.id))
		.limit(1)

	if (!results.length) {
		return null
	}

	const result = results[0]

	if (!result || !result.request || !result.client) {
		return null
	}

	// Convert database record to proper types
	return {
		...result.request,
		client: {
			...result.client,
			createdAt: new Date(result.client.createdAt),
			updatedAt: new Date(result.client.updatedAt),
			// Convert null email to undefined to match the optional schema type
			email: result.client.email,
		},
		createdAt: new Date(result.request.createdAt),
		updatedAt: new Date(result.request.updatedAt),
		// Convert numeric values using Decimal.js for precise calculations
		amount: new Decimal(result.request.amount).toNumber(),
		interestRate: new Decimal(result.request.interestRate).toNumber(),
		latePaymentRate: new Decimal(result.request.latePaymentRate).toNumber(),
	}
}

export async function getCreditRequest(id: string): Promise<CreditRequestWithClient | null> {
	// Fetch credit request with client information
	const results = await db
		.select({
			request: credit,
			client: client,
		})
		.from(credit)
		.where(and(eq(credit.id, id), eq(credit.status, 'pending')))
		.innerJoin(client, eq(credit.clientId, client.id))
		.limit(1)

	if (!results.length) {
		return null
	}

	const result = results[0]

	if (!result || !result.request || !result.client) {
		return null
	}

	// Convert database record to proper types
	return {
		...result.request,
		client: {
			...result.client,
			createdAt: new Date(result.client.createdAt),
			updatedAt: new Date(result.client.updatedAt),
			// Convert null email to undefined to match the optional schema type
			email: result.client.email,
		},
		createdAt: new Date(result.request.createdAt),
		updatedAt: new Date(result.request.updatedAt),
		// Convert numeric values using Decimal.js for precise calculations
		amount: new Decimal(result.request.amount).toNumber(),
		interestRate: new Decimal(result.request.interestRate).toNumber(),
		latePaymentRate: new Decimal(result.request.latePaymentRate).toNumber(),
	}
}

export async function getCreditRequests() {
	// Fetch credit requests from database using Drizzle ORM
	const dbRequests = await db.select().from(credit).where(eq(credit.status, 'pending')).orderBy(desc(credit.createdAt))

	// Convert database records to CreditRequest type
	return dbRequests.map((dbRequest) => ({
		...dbRequest,
		createdAt: new Date(dbRequest.createdAt),
		updatedAt: new Date(dbRequest.updatedAt),
		// Convert numeric values using Decimal.js for precise calculations
		amount: new Decimal(dbRequest.amount).toNumber(),
		interestRate: new Decimal(dbRequest.interestRate).toNumber(),
		latePaymentRate: new Decimal(dbRequest.latePaymentRate).toNumber(),
	}))
}

export async function getActiveCredits() {
	const dbRequests = await db.select().from(credit).where(eq(credit.status, 'active')).orderBy(desc(credit.createdAt))

	return dbRequests.map((dbRequest) => ({
		...dbRequest,
		createdAt: new Date(dbRequest.createdAt),
		updatedAt: new Date(dbRequest.updatedAt),
		// Convert numeric values using Decimal.js for precise calculations
		amount: new Decimal(dbRequest.amount).toNumber(),
		interestRate: new Decimal(dbRequest.interestRate).toNumber(),
		latePaymentRate: new Decimal(dbRequest.latePaymentRate).toNumber(),
	}))
}
