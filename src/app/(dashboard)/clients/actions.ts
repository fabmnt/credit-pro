'use server'

import { db } from '@/db'
import { client } from '@/db/schema'
import type { StandardResponse } from '@/types/response'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { type Client, type UpdateClient, createClientSchema, updateClientSchema } from './schema'

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

export async function createClient(prevState: unknown, formData: FormData): Promise<StandardResponse<Client>> {
	// Validate the data
	const rawData = Object.fromEntries(formData.entries())
	const validatedData = createClientSchema.safeParse(rawData)

	if (!validatedData.success) {
		return {
			message: null,
			error: validatedData.error.errors.map((error) => error.message).join('. '),
			data: null,
		}
	}
	// Add timestamps
	const now = new Date()

	try {
		// Insert into database
		const [newClient] = await db
			.insert(client)
			.values({
				...validatedData.data,
				createdAt: now,
				updatedAt: now,
			})
			.returning()

		// Revalidate clients path to update the UI
		if (!newClient) {
			return { message: 'Error al crear el cliente', data: null, error: 'Error al crear el cliente' }
		}

		revalidatePath('/clients')
		return { message: 'Cliente creado correctamente', data: newClient, error: null }
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Failed to create client',
			message: null,
			data: null,
		}
	}
}

export async function deleteClient(prevState: unknown, id: string): Promise<StandardResponse<void>> {
	try {
		await db.delete(client).where(eq(client.id, id))

		// Revalidate clients path to update the UI
		revalidatePath('/clients')

		return { data: null, message: 'Cliente eliminado correctamente', error: null }
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : 'Failed to delete client',
			message: null,
		}
	}
}
