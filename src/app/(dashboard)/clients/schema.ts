import { z } from 'zod'

export const clientSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, { message: 'El nombre es requerido' }),
	dni: z.string().min(1, { message: 'El DNI es requerido' }),
	profession: z.string().min(1, { message: 'La profesión es requerida' }),
	address: z.string().min(1, { message: 'La dirección es requerida' }),
	city: z.string().min(1, { message: 'La ciudad es requerida' }),
	telephone: z.string().min(1, { message: 'El teléfono es requerido' }),
	sex: z.string().min(1, { message: 'El sexo es requerido' }),
	nationality: z.string().min(1, { message: 'La nacionalidad es requerida' }),
	email: z.string().email({ message: 'Formato de email inválido' }).nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createClientSchema = clientSchema.omit({ id: true, createdAt: true, updatedAt: true })

export const updateClientSchema = createClientSchema.partial()

export type Client = z.infer<typeof clientSchema>
export type CreateClient = z.infer<typeof createClientSchema>
export type UpdateClient = z.infer<typeof updateClientSchema>
