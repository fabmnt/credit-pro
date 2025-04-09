import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDate } from '@/lib/utils'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CreditRequestDetails } from '../components/credit-request-details'
import { PaymentPlanTable } from '../components/payment-plan'
import { getCreditById, getCreditPaymentPlan } from '../services/get-credits'
export default async function CreditPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const credit = await getCreditById(id)
	const paymentPlan = await getCreditPaymentPlan(id)

	if (!credit) {
		notFound()
	}

	return (
		<div className='py-4 px-6 space-y-6'>
			<header className='flex justify-between items-center border-b pb-4'>
				<div>
					<Button
						variant='outline'
						size='icon'
						className='py-1 px-2 h-6 mb-2 justify-start'
						asChild
					>
						<Link href='/credits'>
							<ArrowLeftIcon className='w-4 h-4' />
						</Link>
					</Button>
					<div>
						<h1 className='text-base font-medium'>Crédito #{credit.id.substring(0, 8)}</h1>
						<p className='text-sm text-muted-foreground'>Detalles del crédito y su estado actual</p>
					</div>
				</div>
			</header>
			<div className='grid grid-cols-5 gap-y-8 gap-x-4'>
				<Card className='col-span-5 rounded-sm'>
					<CardContent>
						<div className='grid grid-cols-5 gap-4'>
							<div className='flex flex-col gap-2'>
								<span className=''>Cliente</span>
								<div className='flex flex-col gap-1'>
									<span className='text-muted-foreground'>{credit.client.name}</span>
								</div>
							</div>
							<div className='flex flex-col gap-2'>
								<span className=''>Fecha de inicio</span>
								<span className='text-muted-foreground'>{formatDate(credit.creditStartDate)}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className=''>Frecuencia</span>
								<span className='text-muted-foreground'>{credit.termFrequency}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className=''>Plazo</span>
								<span className='text-muted-foreground'>{credit.monthsTerm} meses</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className=''>Total de pagos</span>
								<span className='text-muted-foreground'>{paymentPlan.length} pagos</span>
							</div>
						</div>
					</CardContent>
				</Card>
				<div className='col-span-5'>
					<CreditRequestDetails credit={credit} />
				</div>
				<div className='col-span-5'>
					<h2 className='text-lg font-medium mb-3'>Plan de pagos</h2>
					<ScrollArea className='relative h-80'>
						<PaymentPlanTable paymentPlans={paymentPlan} />
					</ScrollArea>
				</div>
			</div>
		</div>
	)
}
