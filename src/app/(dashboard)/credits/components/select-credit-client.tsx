'use client'
import type { Client } from '@/app/(dashboard)/clients/schema'
import { useCreditRequest } from '@/app/(dashboard)/credits/stores'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'

export function SelectCreditClient({ clients }: { clients: Client[] }) {
	const [clientId, setClientId] = useQueryState('clientId')
	const setClient = useCreditRequest((state) => state.setClient)
	const paymentPlan = useCreditRequest((state) => state.paymentPlan)

	const handleSelectClient = (value: string) => {
		const client = clients.find((client) => client.id === value)
		setClient(client ?? null)
		setClientId(value)
	}

	useEffect(() => {
		const client = clients.find((client) => client.id === clientId)
		setClient(client ?? null)
	}, [clientId, clients, setClient])

	return (
		<div className='space-y-2'>
			<Label>Selecciona el cliente</Label>
			<Select
				value={clientId ?? undefined}
				onValueChange={handleSelectClient}
				disabled={paymentPlan != null}
			>
				<SelectTrigger className='w-full'>
					<SelectValue placeholder='Selecciona un cliente' />
				</SelectTrigger>
				<SelectContent>
					{clients.map((client) => (
						<SelectItem
							key={client.id}
							value={client.id}
						>
							{client.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
