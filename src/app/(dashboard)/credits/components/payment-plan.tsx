import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { CreditPaymentPlan, CreditRequest } from '../schema'

export interface PaymentPlanProps {
	paymentPlans: CreditPaymentPlan[]
	credit: CreditRequest
}

export function PaymentPlan({ paymentPlans, credit }: PaymentPlanProps) {
	return (
		<div className='space-y-4'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div className='rounded-lg border p-3'>
					<div className='text-sm text-muted-foreground'>Total a pagar</div>
					<div className='text-xl font-semibold'>{formatCurrency(credit.totalCredit)}</div>
				</div>
				<div className='rounded-lg border p-3'>
					<div className='text-sm text-muted-foreground'>Monto</div>
					<div className='text-xl font-semibold'>{formatCurrency(credit.amount)}</div>
				</div>
				<div className='rounded-lg border p-3'>
					<div className='text-sm text-muted-foreground'>Total intereses</div>
					<div className='text-xl font-semibold'>{formatCurrency(credit.totalInterest)}</div>
				</div>
				<div className='rounded-lg border p-3'>
					<div className='text-sm text-muted-foreground'>Pagos totales</div>
					<div className='text-xl font-semibold'>{paymentPlans.length}</div>
				</div>
				<div className='rounded-lg border p-3'>
					<div className='text-sm text-muted-foreground'>Tasa de interés</div>
					<div className='text-xl font-semibold flex items-center gap-2'>
						{credit.interestRate}%{' '}
						<span className='text-base font-normal text-muted-foreground'>({credit.latePaymentRate}% de mora)</span>
					</div>
				</div>
				<div className='rounded-lg border p-3'>
					<div className='text-sm text-muted-foreground'>Plazo</div>
					<div className='text-xl font-semibold'>
						{credit.monthsTerm} {credit.monthsTerm === 1 ? 'mes' : 'meses'}
					</div>
				</div>
			</div>

			<div className='p-2'>
				<ScrollArea className='h-48 relative'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>#</TableHead>
								<TableHead>Fecha de pago</TableHead>
								<TableHead>Cuota</TableHead>
								<TableHead>Interés</TableHead>
								<TableHead>Saldo</TableHead>
								<TableHead>Estado</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paymentPlans.map((payment) => (
								<TableRow key={payment.id}>
									<TableCell className='font-bold'>{payment.id.toString().slice(0, 8)}</TableCell>
									<TableCell>{formatDate(payment.paymentDate)}</TableCell>
									<TableCell>{formatCurrency(payment.paymentFee)}</TableCell>
									<TableCell>{formatCurrency(payment.paymentInterest)}</TableCell>
									<TableCell>{formatCurrency(payment.remainingCredit)}</TableCell>
									<TableCell>
										<Badge>
											{payment.status === 'paid' ? 'Pagado' : payment.status === 'late' ? 'Atrasado' : 'Pendiente'}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ScrollArea>
			</div>
		</div>
	)
}
