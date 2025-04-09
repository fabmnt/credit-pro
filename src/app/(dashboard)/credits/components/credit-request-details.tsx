'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useCreditRequest } from '../stores'

export function CreditRequestDetails() {
	const creditRequestCreated = useCreditRequest((state) => state.creditRequestCreated)

	if (!creditRequestCreated) {
		return null
	}

	return (
		<div className='space-y-4'>
			<h4 className='text-lg font-semibold'>Detalles de la solicitud</h4>
			<div className='grid grid-cols-5 gap-4'>
				<Card className='rounded-sm'>
					<CardContent>
						<h5 className='text-sm font-medium'>Monto solicitado</h5>
						<p>{formatCurrency(creditRequestCreated.amount)}</p>
					</CardContent>
				</Card>
				<Card className='rounded-sm'>
					<CardContent>
						<h5 className='text-sm font-medium'>Total saldo</h5>
						<p>{formatCurrency(creditRequestCreated.totalCredit)}</p>
					</CardContent>
				</Card>
				<Card className='rounded-sm'>
					<CardContent>
						<h5 className='text-sm font-medium'>Interés total</h5>
						<p>{formatCurrency(creditRequestCreated.totalInterest)}</p>
					</CardContent>
				</Card>
				<Card className='rounded-sm'>
					<CardContent>
						<h5 className='text-sm font-medium'>Tasa de interés</h5>
						<p>{creditRequestCreated.interestRate}%</p>
					</CardContent>
				</Card>
				<Card className='rounded-sm'>
					<CardContent>
						<h5 className='text-sm font-medium'>Tasa de mora</h5>
						<p>{creditRequestCreated.latePaymentRate}%</p>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
