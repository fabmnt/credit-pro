import { getClients } from '@/app/(dashboard)/clients/services/get-clients'
import { Card, CardContent } from '@/components/ui/card'
import { SelectCreditClient } from '../components/select-credit-client'
import { SelectedClientDetails } from '../components/selected-client-details'

export default async function NewCreditPage() {
	const clients = await getClients()

	return (
		<div className='p-4 space-y-6'>
			<header className='flex items-center justify-between border-b pb-4'>
				<div>
					<h1 className='text-2xl font-semibold'>Nueva solicitud de crédito</h1>
					<p className='text-muted-foreground'>Crea una nueva solicitud de crédito para un cliente</p>
				</div>
			</header>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card className='rounded-sm'>
					<CardContent>
						<div className='space-y-4'>
							<SelectCreditClient clients={clients} />
							<SelectedClientDetails />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
