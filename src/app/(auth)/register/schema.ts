import { z } from 'zod'

export const registerSchema = z
	.object({
		email: z.string({ message: 'Email es requerido' }).email({ message: 'Email inválido' }),
		password: z
			.string({ message: 'Contraseña es requerida' })
			.min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
		confirmPassword: z
			.string({ message: 'Confirmar contraseña es requerida' })
			.min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
		name: z.string({ message: 'Nombre es requerido' }).min(1, { message: 'Nombre es requerido' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['confirmPassword'],
	})

export type RegisterSchema = z.infer<typeof registerSchema>
