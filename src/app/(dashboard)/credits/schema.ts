import type { Client } from '@/app/(dashboard)/clients/schema'
import { z } from 'zod'
export const creditRequestSchema = z.object({
	id: z.string().uuid(),
	clientId: z.string().uuid({
		message: 'Selecciona un cliente',
	}),
	amount: z
		.number({
			message: 'El monto es requerido',
		})
		.positive({ message: 'El monto debe ser un valor positivo' }),
	totalCredit: z.number({ message: 'El monto total del crédito es requerido' }).positive({
		message: 'El monto total del crédito debe ser un valor positivo',
	}),
	interestRate: z
		.number({
			message: 'La tasa de interés es requerida',
		})
		.min(1, { message: 'La tasa de interés debe ser al menos 1' })
		.max(100, { message: 'La tasa de interés no puede ser mayor a 100' }),
	latePaymentRate: z
		.number({
			message: 'La tasa de pago tardío es requerida',
		})
		.min(1, { message: 'La tasa de pago tardío debe ser al menos 1' })
		.max(100, { message: 'La tasa de pago tardío no puede ser mayor a 100' }),
	monthsTerm: z
		.number({
			message: 'El plazo en meses es requerido',
		})
		.positive({ message: 'El plazo debe ser un valor entero positivo' }),
	termFrequency: z.enum(['daily', 'weekly', 'monthly', 'yearly'], {
		errorMap: () => ({ message: 'La frecuencia debe ser diaria, semanal, mensual o anual' }),
	}),
	totalInterest: z.number({ message: 'El interés total es requerido' }).positive({
		message: 'El interés total debe ser un valor positivo',
	}),
	status: z
		.enum(['pending', 'accepted', 'rejected', 'active'], {
			errorMap: () => ({ message: 'El estado debe ser pendiente, aceptado o rechazado' }),
		})
		.default('pending')
		.nullable(),
	creditStartDate: z
		.union([z.string(), z.date()], { message: 'La fecha de inicio del crédito es requerida' })
		.transform((val) => new Date(val))
		.refine(
			(date) => {
				const today = new Date()
				today.setHours(0, 0, 0, 0)
				date.setHours(0, 0, 0, 0)
				return date >= today
			},
			{ message: 'La fecha de inicio debe ser hoy o una fecha futura' },
		),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createCreditRequestSchema = creditRequestSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	totalCredit: true,
	totalInterest: true,
	status: true,
})

export const updateCreditRequestSchema = createCreditRequestSchema.partial()

export type CreditRequest = z.infer<typeof creditRequestSchema>
export type CreateCreditRequest = z.infer<typeof createCreditRequestSchema>
export type UpdateCreditRequest = z.infer<typeof updateCreditRequestSchema>

export interface CreditRequestWithClient extends Omit<CreditRequest, 'clientId'> {
	client: Client
}

// Credit Payment Schema
export const creditPaymentPlanSchema = z.object({
	id: z.number(),
	creditId: z.string().uuid({
		message: 'La solicitud de crédito es requerida',
	}),
	paymentBase: z
		.number({
			message: 'El pago de capital es requerido',
		})
		.positive({ message: 'El pago de capital debe ser un valor positivo' }),
	paymentFee: z
		.number({
			message: 'El monto total del pago es requerido',
		})
		.positive({ message: 'El monto total del pago debe ser un valor positivo' }),
	paymentInterest: z
		.number({
			message: 'El pago de interés es requerido',
		})
		.positive({ message: 'El pago de interés debe ser un valor positivo' }),
	remainingCredit: z
		.number({
			message: 'El saldo restante es requerido',
		})
		.positive({ message: 'El saldo restante debe ser un valor positivo' }),
	paymentReceived: z
		.number({
			message: 'El monto recibido es requerido',
		})
		.positive({ message: 'El monto recibido debe ser un valor positivo' })
		.default(0),
	status: z.enum(['pending', 'paid', 'late', 'active'], {
		errorMap: () => ({ message: 'El estado debe ser pendiente, pagado, atrasado o activo' }),
	}),
	paymentDate: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createCreditPaymentPlanSchema = creditPaymentPlanSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export const updateCreditPaymentPlanSchema = createCreditPaymentPlanSchema.partial()

export type CreditPaymentPlan = z.infer<typeof creditPaymentPlanSchema>
export type CreateCreditPaymentPlan = z.infer<typeof createCreditPaymentPlanSchema>
export type UpdateCreditPaymentPlan = z.infer<typeof updateCreditPaymentPlanSchema>
