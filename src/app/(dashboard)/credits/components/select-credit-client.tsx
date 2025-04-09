'use client'
import type { Client } from '@/app/(dashboard)/clients/schema'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { useCreditRequest } from '../stores'

export function SelectCreditClient({ clients }: { clients: Client[] }) {
	const [clientId, setClientId] = useQueryState('clientId')
	const setClient = useCreditRequest((state) => state.setClient)

	const handleSelectClient = (value: string) => {
		const client = clients.find((client) => client.id === value)
		setClient(client ?? null)
		setClientId(value)
	}

	useEffect(() => {
		if (clientId) {
			const client = clients.find((client) => client.id === clientId)
			setClient(client ?? null)
		}
	}, [clientId, clients, setClient])

	return (
		<div className='space-y-2'>
			<Label>Selecciona el cliente</Label>
			<Select
				value={clientId ?? undefined}
				onValueChange={handleSelectClient}
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
