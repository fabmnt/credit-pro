'use client'
import { useCreditRequest } from '@/app/(dashboard)/credits/stores'
import Link from 'next/link'

export function SelectedClientDetails() {
	const client = useCreditRequest((state) => state.client)

	if (!client) return null

	return (
		<article className='grid grid-cols-2 gap-4'>
			<div>
				<p className='text-sm font-medium'>Cédula</p>
				<p>
					<Link
						href={`/clients/${client.id}`}
						className='text-sm text-muted-foreground hover:underline block'
					>
						{client.dni}
					</Link>
				</p>
			</div>
			<div>
				<p className='text-sm font-medium'>Nombre</p>
				<p className='text-sm text-muted-foreground'>{client.name}</p>
			</div>
		</article>
	)
}
