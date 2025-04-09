'use server'

import { db } from '@/db'
import { credit } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import type { UpdateCreditRequest } from './schema'

export async function revalidateCreditRequest(id: string) {
	revalidatePath(`/credits/${id}`)
}

export async function revalidateCredits() {
	revalidatePath('/credits')
}

export async function updateCreditRequest(id: string, data: UpdateCreditRequest) {
	try {
		await db.update(credit).set(data).where(eq(credit.id, id))

		revalidatePath('/credits')
		revalidatePath(`/credits/${id}`)
		return { success: true }
	} catch (error) {
		console.error('Error updating credit request:', error)
		return { success: false, error: 'Failed to update credit request' }
	}
}

export async function deleteCreditRequest(id: string) {
	try {
		await db.delete(credit).where(eq(credit.id, id))

		revalidatePath('/credits')
		return { success: true }
	} catch (error) {
		console.error('Error deleting credit request:', error)
		return { success: false, error: 'Failed to delete credit request' }
	}
}

// Accept credit request - changes status to approved
export async function acceptCreditRequest(id: string) {
	try {
		// In a real system, you would update a status field
		// For now, we'll update the creditStartDate to indicate it's been approved
		await db
			.update(credit)
			.set({
				creditStartDate: new Date(),
				updatedAt: new Date(),
				status: 'active',
			})
			.where(eq(credit.id, id))

		revalidatePath('/credits')
		revalidatePath(`/credits/${id}`)
		return { success: true }
	} catch (error) {
		console.error('Error accepting credit request:', error)
		return { success: false, error: 'Failed to accept credit request' }
	}
}
