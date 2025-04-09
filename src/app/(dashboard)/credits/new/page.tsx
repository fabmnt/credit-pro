import { getClients } from '@/app/(dashboard)/clients/services/get-clients'
import { CreditDetailsForm } from '@/app/(dashboard)/credits/components/credit-details-form'
import { SelectCreditClient } from '@/app/(dashboard)/credits/components/select-credit-client'
import { SelectedClientDetails } from '@/app/(dashboard)/credits/components/selected-client-details'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditPaymentPlan } from '../components/credit-payment-plan'
import { CreditRequestDetails } from '../components/credit-request-details'
import { SaveCreditRequest } from '../components/save-credit-request'
export default async function NewCreditPage() {
	const clients = await getClients()

	return (
		<div className='p-4 space-y-6'>
			<header className='flex items-center justify-between border-b pb-4'>
				<div>
					<h1 className='text-2xl font-semibold'>Nueva solicitud de crédito</h1>
					<p className='text-muted-foreground'>Crea una nueva solicitud de crédito para un cliente</p>
				</div>
				<div>
					<SaveCreditRequest />
				</div>
			</header>
			<div className='grid grid-cols-1 md:grid-cols-5 gap-8'>
				<Card className='rounded-sm col-span-2'>
					<CardContent>
						<div className='space-y-8'>
							<SelectCreditClient clients={clients} />
							<SelectedClientDetails />
						</div>
					</CardContent>
				</Card>
				<Card className='rounded-sm col-span-3'>
					<CardContent>
						<CreditDetailsForm />
					</CardContent>
				</Card>
				<div className='col-span-5'>
					<CreditRequestDetails />
				</div>

				<Card className='rounded-sm col-span-5'>
					<CardHeader>
						<CardTitle>Plan de pago</CardTitle>
					</CardHeader>
					<CardContent>
						<CreditPaymentPlan />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
