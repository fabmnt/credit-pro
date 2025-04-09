'use client'

import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Client } from '../schema'
import { DeleteClientWarning } from './delete-client-warning'

export function DeleteClient({ client }: { client: Client }) {
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()

	const handleDelete = () => {
		setIsOpen(false)
		console.log('delete')
		router.push('/clients')
	}

	return (
		<>
			<Button
				onClick={() => setIsOpen(true)}
				className='cursor-pointer text-red-800 hover:text-red-800/90'
				variant='outline'
				size='lg'
			>
				<Trash className='w-4 h-4' />
				Eliminar
			</Button>
			<DeleteClientWarning
				client={client}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onDelete={handleDelete}
			/>
		</>
	)
}
