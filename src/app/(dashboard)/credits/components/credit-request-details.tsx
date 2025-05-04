import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { CreditRequestWithClient } from '../schema'

export function CreditRequestDetails({ credit }: { credit: CreditRequestWithClient }) {
	return (
		<div className='grid grid-cols-5 gap-4'>
			<Card className='rounded-sm'>
				<CardHeader>
					<CardDescription>Monto solicitado</CardDescription>
					<CardTitle className='text-lg font-semibold'>{formatCurrency(credit.amount)}</CardTitle>
				</CardHeader>
			</Card>
			<Card className='rounded-sm'>
				<CardHeader>
					<CardDescription>Total saldo</CardDescription>
					<CardTitle className='text-lg font-semibold'>{formatCurrency(credit.totalCredit)}</CardTitle>
				</CardHeader>
			</Card>
			<Card className='rounded-sm'>
				<CardHeader>
					<CardDescription>Interés total</CardDescription>
					<CardTitle className='text-lg font-semibold'>{formatCurrency(credit.totalInterest)}</CardTitle>
				</CardHeader>
			</Card>
			<Card className='rounded-sm'>
				<CardHeader>
					<CardDescription>Tasa de interés</CardDescription>
					<CardTitle className='text-lg font-semibold'>{credit.interestRate}%</CardTitle>
				</CardHeader>
			</Card>
			<Card className='rounded-sm'>
				<CardHeader>
					<CardDescription>Tasa de mora</CardDescription>
					<CardTitle className='text-lg font-semibold'>{credit.latePaymentRate}%</CardTitle>
				</CardHeader>
			</Card>
		</div>
	)
}
