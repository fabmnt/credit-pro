import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string({ message: 'Email es requerido' }).email({ message: 'Email inválido' }),
	password: z
		.string({ message: 'Contraseña es requerida' })
		.min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
})

export type LoginSchema = z.infer<typeof loginSchema>
