'use client'
import { useCreditRequest } from '../stores'

export function SelectedClientDetails() {
	const client = useCreditRequest((state) => state.client)

	if (!client) return null

	return (
		<article className='grid grid-cols-3'>
			<div className='flex items-start gap-2'>
				<div>
					<p className='text-sm font-medium'>Nombre</p>
					<p className='text-sm text-muted-foreground'>{client.name}</p>
				</div>
			</div>
			<div className='flex items-start gap-2'>
				<div>
					<p className='text-sm font-medium'>Cédula</p>
					<p className='text-sm text-muted-foreground'>{client.dni}</p>
				</div>
			</div>
			<div className='flex items-start gap-2'>
				<div>
					<p className='text-sm font-medium'>Teléfono</p>
					<p className='text-sm text-muted-foreground'>{client.telephone}</p>
				</div>
			</div>
		</article>
	)
}
