'use client'
import { useCreditRequest } from '@/app/(dashboard)/credits/stores'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export function SelectedClientDetails() {
	const client = useCreditRequest((state) => state.client)

	if (!client) return null

	return (
		<article className='grid grid-cols-2 gap-4'>
			<Card className='flex flex-col gap-y-2 rounded-sm border-none shadow-none'>
				<CardContent>
					<p className='text-sm font-medium'>Cédula</p>
					<p>
						<Link
							href={`/clients/${client.id}`}
							className='text-sm text-muted-foreground hover:underline'
						>
							{client.dni}
						</Link>
					</p>
				</CardContent>
			</Card>
			<Card className='flex flex-col gap-y-2 rounded-sm border-none shadow-none'>
				<CardContent>
					<p className='text-sm font-medium'>Nombre</p>
					<p className='text-sm text-muted-foreground'>{client.name}</p>
				</CardContent>
			</Card>
		</article>
	)
}
