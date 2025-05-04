import { TERM_FREQUENCY_LABEL } from '@/app/constants/frequencies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
		<div className='space-y-6'>
			<header className='flex justify-between items-center pb-4 py-4 px-6 border-b'>
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
						<h1 className='text-2xl font-medium'>Crédito #{credit.id.substring(0, 8)}</h1>
						<p className='text-sm text-muted-foreground'>Detalles del crédito y su estado actual</p>
					</div>
				</div>
				<div>{credit.status === 'pending' && <Button>Aceptar crédito</Button>}</div>
			</header>
			<div className='grid grid-cols-5 gap-y-8 gap-x-4 py-4 px-6'>
				<Card className='rounded-sm'>
					<CardHeader>
						<CardDescription>Cliente</CardDescription>
						<CardTitle className='text-lg font-medium'>
							<Link
								className='hover:underline'
								href={`/clients/${credit.client.id}`}
							>
								{credit.client.name}
							</Link>
						</CardTitle>
					</CardHeader>
				</Card>
				<Card className='rounded-sm col-span-2'>
					<div className='grid grid-cols-2'>
						<CardHeader>
							<CardDescription className='text-sm text-muted-foreground'>Fecha de inicio</CardDescription>
							<CardTitle className='text-lg font-medium'>{formatDate(credit.creditStartDate)}</CardTitle>
						</CardHeader>
						<CardHeader>
							<CardDescription className='text-sm text-muted-foreground'>Frecuencia</CardDescription>
							<CardTitle className='text-lg font-medium'>{TERM_FREQUENCY_LABEL[credit.termFrequency]}</CardTitle>
						</CardHeader>
					</div>
				</Card>
				<Card className='rounded-sm col-span-2'>
					<div className='grid grid-cols-2'>
						<CardHeader>
							<CardDescription className='text-sm text-muted-foreground'>Plazo</CardDescription>
							<CardTitle className='text-lg font-medium'>{credit.monthsTerm} meses</CardTitle>
						</CardHeader>
						<CardHeader>
							<CardDescription className='text-sm text-muted-foreground'>Total de pagos</CardDescription>
							<CardTitle className='text-lg font-medium'>{paymentPlan.length} pagos</CardTitle>
						</CardHeader>
					</div>
				</Card>
				<div className='col-span-5'>
					<CreditRequestDetails credit={credit} />
				</div>
				<Card className='col-span-5 rounded-sm'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>Plan de pagos</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea className='relative max-h-80'>
							<PaymentPlanTable paymentPlans={paymentPlan} />
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
