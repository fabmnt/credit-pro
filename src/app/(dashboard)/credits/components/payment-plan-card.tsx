import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { db } from '@/db'
import { creditPaymentPlan } from '@/db/schema'
import { formatCurrency, formatDate } from '@/lib/utils'
import { eq } from 'drizzle-orm'
export async function PaymentPlanCard({ creditRequestId }: { creditRequestId: string }) {
	const payments = await getCreditPaymentPlan(creditRequestId)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Plan de Pagos</CardTitle>
				<CardDescription>Datos de las cuotas del crédito</CardDescription>
			</CardHeader>
			<CardContent>
				<div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>N°</TableHead>
								<TableHead>Fecha de pago</TableHead>
								<TableHead>Cuota</TableHead>
								<TableHead>Monto Base</TableHead>
								<TableHead>Interés</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Total Recibido</TableHead>
								<TableHead>Saldo Restante</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{payments.map((payment) => (
								<TableRow key={payment.id}>
									<TableCell>{payment.id}</TableCell>
									<TableCell>{formatDate(payment.paymentDate)}</TableCell>
									<TableCell>{formatCurrency(payment.paymentFee)}</TableCell>
									<TableCell>{formatCurrency(payment.paymentBase)}</TableCell>
									<TableCell>{formatCurrency(payment.paymentInterest)}</TableCell>
									<TableCell>{payment.status}</TableCell>
									<TableCell>{formatCurrency(payment.paymentReceived)}</TableCell>
									<TableCell>{formatCurrency(payment.remainingCredit)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

export async function getCreditPaymentPlan(creditId: string) {
	const results = await db.select().from(creditPaymentPlan).where(eq(creditPaymentPlan.creditId, creditId))

	const resultsMapped = results.map((result) => ({
		...result,
		createdAt: new Date(result.createdAt),
		updatedAt: new Date(result.updatedAt),
		paymentDate: new Date(result.paymentDate),
	}))

	return resultsMapped
}
