'use server'
import { auth } from '@/lib/auth'
import type { StandardResponse } from '@/types/response'
import type { User } from 'better-auth'
import { APIError } from 'better-auth/api'
import { loginSchema } from './login/schema'
import { registerSchema } from './register/schema'

export async function login(prevState: unknown, formData: FormData): Promise<StandardResponse<User>> {
	const credentialsRaw = Object.fromEntries(formData.entries())
	const { success, data: credentials, error } = loginSchema.safeParse(credentialsRaw)

	if (!success) {
		return { message: null, error: error.errors.map((err) => err.message).join('. '), data: null }
	}

	try {
		const { user } = await auth.api.signInEmail({
			body: {
				email: credentials.email,
				password: credentials.password,
			},
		})

		return { message: 'Login successful', error: null, data: user }
	} catch (error) {
		if (error instanceof APIError) {
			return { message: null, error: error.message, data: null }
		}

		return { message: null, error: 'Something went wrong', data: null }
	}
}

export async function register(prevState: unknown, formData: FormData): Promise<StandardResponse<User>> {
	const credentialsRaw = Object.fromEntries(formData.entries())
	const { success, data: credentials, error } = registerSchema.safeParse(credentialsRaw)

	if (!success) {
		return { message: null, error: error.errors.map((err) => err.message).join('. '), data: null }
	}

	try {
		const { user } = await auth.api.signUpEmail({
			body: {
				name: credentials.name,
				email: credentials.email,
				password: credentials.password,
			},
		})

		return { message: 'Register successful', error: null, data: user }
	} catch (error) {
		if (error instanceof APIError) {
			return { message: null, error: error.message, data: null }
		}

		return { message: null, error: 'Something went wrong', data: null }
	}
}
