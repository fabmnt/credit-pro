import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { CreditPaymentPlan } from '../schema'

export interface PaymentPlanProps {
	paymentPlans: CreditPaymentPlan[]
}

export function PaymentPlanTable({ paymentPlans }: PaymentPlanProps) {
	return (
		<div className='relative w-full'>
			<Table>
				<TableHeader className='sticky top-0 bg-background'>
					<TableRow>
						<TableHead className='py-2' />
						<TableHead className='py-2'>Fecha de pago</TableHead>
						<TableHead className='py-2'>Cuota</TableHead>
						<TableHead className='py-2'>Interés</TableHead>
						<TableHead className='py-2'>Abonado</TableHead>
						<TableHead className='py-2'>Saldo</TableHead>
						<TableHead className='py-2'>Estado</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paymentPlans.map((payment) => (
						<TableRow key={payment.id}>
							<TableCell className='py-4 font-medium'>N° {payment.id.toString().slice(0, 8)}</TableCell>
							<TableCell className='py-4'>{formatDate(payment.paymentDate)}</TableCell>
							<TableCell className='py-4'>{formatCurrency(payment.paymentFee)}</TableCell>
							<TableCell className='py-4'>{formatCurrency(payment.paymentInterest)}</TableCell>
							<TableCell className='py-4'>{formatCurrency(payment.paymentReceived)}</TableCell>
							<TableCell className='py-4'>{formatCurrency(payment.remainingCredit)}</TableCell>
							<TableCell className='py-4'>
								<Badge variant='outline'>
									{payment.status === 'paid' ? 'Pagado' : payment.status === 'late' ? 'Atrasado' : 'Pendiente'}
								</Badge>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
