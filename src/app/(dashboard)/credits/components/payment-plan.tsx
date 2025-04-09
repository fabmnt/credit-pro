import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { CreditPaymentPlan } from '../schema'

export interface PaymentPlanProps {
	paymentPlans: CreditPaymentPlan[]
}

export function PaymentPlan({ paymentPlans }: PaymentPlanProps) {
	return (
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
	)
}
