'use client'
import { useCreditRequest } from '@/app/(dashboard)/credits/stores'
import Link from 'next/link'

export function SelectedClientDetails() {
	const client = useCreditRequest((state) => state.client)

	if (!client) return null

	return (
		<article className='grid grid-cols-2'>
			<div className='space-y-2'>
				<p className='text-sm font-medium'>Cédula</p>
				<p>
					<Link
						href={`/clients/${client.id}`}
						className='text-sm text-muted-foreground hover:underline'
					>
						{client.dni}
					</Link>
				</p>
			</div>
			<div className='space-y-2'>
				<p className='text-sm font-medium'>Nombre</p>
				<p className='text-sm text-muted-foreground'>{client.name}</p>
			</div>
		</article>
	)
}
