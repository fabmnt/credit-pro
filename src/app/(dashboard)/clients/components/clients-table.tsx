'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import type { Client } from '../schema'
import { DeleteClientWarning } from './delete-client-warning'

interface ClientsTableProps {
	clients: Client[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
	const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

	const handleDeleteClick = (client: Client) => {
		setClientToDelete(client)
	}

	const handleDeleteCancel = () => {
		setClientToDelete(null)
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Cédula</TableHead>
						<TableHead>Nombre</TableHead>
						<TableHead>Ciudad</TableHead>
						<TableHead>Teléfono</TableHead>
						<TableHead>Profesión</TableHead>
						<TableHead>Creado</TableHead>
						<TableHead className='text-right'>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{clients.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={7}
								className='h-24 text-center'
							>
								No se encontraron clientes.
							</TableCell>
						</TableRow>
					) : (
						clients.map((client) => (
							<TableRow key={client.id}>
								<TableCell>
									<Link
										prefetch
										href={`/clients/${client.id}`}
										className='text-primary hover:underline font-medium'
									>
										{client.dni}
									</Link>
								</TableCell>
								<TableCell>{client.name}</TableCell>
								<TableCell>{client.city}</TableCell>
								<TableCell>{client.telephone}</TableCell>
								<TableCell>{client.profession}</TableCell>
								<TableCell>{formatDate(client.createdAt)}</TableCell>
								<TableCell className='text-right'>
									<div className='flex justify-end gap-2'>
										<Button
											size='icon'
											className='bg-transparent hover:bg-destructive/10 text-destructive'
											onClick={() => handleDeleteClick(client)}
											title='Eliminar'
										>
											<Trash2 className='h-4 w-4' />
											<span className='sr-only'>Eliminar</span>
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
			{clientToDelete && (
				<DeleteClientWarning
					client={clientToDelete}
					isOpen={!!clientToDelete}
					onClose={handleDeleteCancel}
					onDelete={handleDeleteCancel}
				/>
			)}
		</div>
	)
}
