import { ClientsTable } from '@/app/(dashboard)/clients/components/clients-table'
import { getClients } from '@/app/(dashboard)/clients/services/get-clients'
import { Card, CardContent } from '@/components/ui/card'

export default async function ClientsPage() {
	const clients = await getClients()

	return (
		<div className='p-4 space-y-6'>
			<header className='flex justify-between items-center border-b pb-4'>
				<div>
					<h1 className='text-2xl font-semibold'>Clientes</h1>
					<p className='text-sm text-muted-foreground'>Gestiona los clientes de tu empresa</p>
				</div>
			</header>
			<Card className='rounded-sm'>
				<CardContent>
					<ClientsTable clients={clients} />
				</CardContent>
			</Card>
		</div>
	)
}
