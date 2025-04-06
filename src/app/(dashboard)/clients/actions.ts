'use server'

import { db } from '@/db'
import { client } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { type CreateClient, type UpdateClient, createClientSchema, updateClientSchema } from './schema'

export async function updateClient(id: string, data: UpdateClient) {
	// Validate the data
	const validatedData = updateClientSchema.parse(data)

	// Update timestamp
	const now = new Date()

	try {
		// Update in database
		const [updatedClient] = await db
			.update(client)
			.set({
				...validatedData,
				updatedAt: now,
			})
			.where(eq(client.id, id))
			.returning()

		// Revalidate clients path to update the UI
		revalidatePath('/clients')
		revalidatePath(`/clients/${id}`)

		return { success: true, data: updatedClient }
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to update client',
		}
	}
}

export async function createClient(data: CreateClient) {
	// Validate the data
	const validatedData = createClientSchema.parse(data)

	// Add timestamps
	const now = new Date()

	try {
		// Insert into database
		const [newClient] = await db
			.insert(client)
			.values({
				...validatedData,
				createdAt: now,
				updatedAt: now,
			})
			.returning()

		// Revalidate clients path to update the UI
		revalidatePath('/clients')

		return { success: true, data: newClient }
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create client',
		}
	}
}

export async function deleteClient(id: string) {
	try {
		await db.delete(client).where(eq(client.id, id))

		// Revalidate clients path to update the UI
		revalidatePath('/clients')

		return { success: true }
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to delete client',
		}
	}
}
