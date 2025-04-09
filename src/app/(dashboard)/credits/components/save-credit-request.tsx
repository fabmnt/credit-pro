'use client'

import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import {
	type CreateCreditRequest,
	type CreditPaymentPlan,
	type CreditRequest,
	createCreditRequestSchema,
} from '../schema'
import { useCreditRequest } from '../stores'
export function SaveCreditRequest() {
	const client = useCreditRequest((state) => state.client)
	const creditRequest = useCreditRequest((state) => state.creditRequest)
	const setPaymentPlan = useCreditRequest((state) => state.setPaymentPlan)
	const paymentPlan = useCreditRequest((state) => state.paymentPlan)
	const { mutate: createCreditRequest, isPending } = useMutation({
		mutationFn: async (creditRequest: CreateCreditRequest) => {
			const res = await fetch('/api/credits/create-request', {
				method: 'POST',
				body: JSON.stringify(creditRequest),
			})

			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.error)
			}

			const result = await res.json()
			return result as { credit: CreditRequest; paymentPlan: CreditPaymentPlan[] }
		},
		onSuccess: (data) => {
			setPaymentPlan(data.paymentPlan)
			toast.success('Solicitud de crédito creada correctamente')
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const handleSaveCreditRequest = () => {
		if (!client || !creditRequest) {
			return
		}

		creditRequest.clientId = client.id
		const { success, error, data: parsedCreditRequest } = createCreditRequestSchema.safeParse(creditRequest)
		if (!success) {
			toast.error(error.errors.map((err) => err.message).join('. '))
			return
		}

		createCreditRequest(parsedCreditRequest)
	}

	return (
		<Button
			className='cursor-pointer'
			variant='outline'
			size='lg'
			disabled={!client || !creditRequest || isPending || paymentPlan != null}
			onClick={handleSaveCreditRequest}
		>
			{isPending ? 'Guardando...' : 'Guardar solicitud'}
			{isPending && <Loader className='w-4 h-4 animate-spin' />}
		</Button>
	)
}
