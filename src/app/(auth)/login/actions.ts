'use server'
import { auth } from '@/lib/auth'
import { loginSchema } from './schema'
import type { StandardResponse } from '@/types/response'

export async function login(prevState: unknown, formData: FormData): Promise<StandardResponse> {
	const { success, data: credentials, error } = loginSchema.safeParse(formData.entries())
	if (!success) {
		return { message: null, error: error.message }
	}

	try {
		await auth.api.signInEmail({
			body: {
				email: credentials.email,
				password: credentials.password,
			},
		})

		return { message: 'Login successful', error: null }
	} catch (error) {
		return { message: null, error: 'Something went wrong' }
	}
}
