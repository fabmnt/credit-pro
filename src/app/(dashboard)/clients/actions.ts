'use server'

import { db } from '@/db'
import { client } from '@/db/schema'
import type { StandardResponse } from '@/types/response'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { type Client, createClientSchema, updateClientSchema } from './schema'

export async function updateClient(prevState: unknown, clientToUpdate: FormData): Promise<StandardResponse<Client>> {
	// Validate the data
	const rawData = Object.fromEntries(clientToUpdate.entries())
	const { success, data, error } = updateClientSchema.safeParse(rawData)
	if (!success) {
		return {
			message: null,
			error: error?.errors.map((error) => error.message).join('. '),
			data: null,
		}
	}

	// Update timestamp
	const now = new Date()

	try {
		// Update in database
		const [updatedClient] = await db
			.update(client)
			.set({
				...data,
				updatedAt: now,
			})
			.where(eq(client.id, data.id))
			.returning()

		// Revalidate clients path to update the UI
		if (!updatedClient) {
			return { message: null, data: null, error: 'Error al actualizar el cliente' }
		}

		revalidatePath('/clients')
		revalidatePath(`/clients/${data.id}`)

		return { message: 'Cliente actualizado correctamente', data: updatedClient, error: null }
	} catch (error) {
		return {
			message: null,
			error: error instanceof Error ? error.message : 'Failed to update client',
			data: null,
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
			return { message: null, data: null, error: 'Error al crear el cliente' }
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

export async function deleteClient(id: string): Promise<StandardResponse<void>> {
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
