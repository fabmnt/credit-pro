'use client'

import { deleteCreditRequest } from '@/app/(dashboard)/credits/actions'
import { DeleteCreditRequestWarning } from '@/app/(dashboard)/credits/components/delete-credit-request-warning'
import type { CreditRequest } from '@/app/(dashboard)/credits/schema'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import Decimal from 'decimal.js'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

// Map term frequency to Spanish
const termFrequencyLabels = {
	daily: 'Diario',
	weekly: 'Semanal',
	monthly: 'Mensual',
	yearly: 'Anual',
}

interface CreditRequestsTableProps {
	creditRequests: CreditRequest[]
	onEdit?: (creditRequest: CreditRequest) => void
}

export function CreditRequestsTable({ creditRequests, onEdit }: CreditRequestsTableProps) {
	const router = useRouter()
	const [requestToDelete, setRequestToDelete] = useState<CreditRequest | null>(null)

	const handleDeleteClick = (creditRequest: CreditRequest) => {
		setRequestToDelete(creditRequest)
	}

	const handleDeleteCancel = () => {
		setRequestToDelete(null)
	}

	const handleDeleteConfirm = async () => {
		if (!requestToDelete) return

		try {
			const result = await deleteCreditRequest(requestToDelete.id)

			if (result.success) {
				toast.success('Solicitud eliminada')

				// Refresh the page data
				router.refresh()
			} else {
				toast.error('Error', {
					description: result.error || 'No se pudo eliminar la solicitud de crédito',
				})
			}
		} catch (error) {
			console.error('Error deleting credit request:', error)
			toast.error('Error', {
				description: 'Ocurrió un error al eliminar la solicitud de crédito',
			})
		}
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>#</TableHead>
						<TableHead>Fecha de Inicio</TableHead>
						<TableHead>Crédito Total</TableHead>
						<TableHead>Monto</TableHead>
						<TableHead>Tasa de Interés</TableHead>
						<TableHead>Plazo (meses)</TableHead>
						<TableHead>Frecuencia</TableHead>
						<TableHead className='text-right'>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{creditRequests.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={8}
								className='h-24 text-center'
							>
								No se encontraron elementos.
							</TableCell>
						</TableRow>
					) : (
						creditRequests.map((request) => (
							<TableRow key={request.id}>
								<TableCell>
									<Link
										prefetch
										href={`/credits/${request.id}`}
										className='text-primary hover:underline font-bold'
									>
										{request.id.substring(0, 8)}
									</Link>
								</TableCell>
								<TableCell>{formatDate(request.creditStartDate)}</TableCell>
								<TableCell>{formatCurrency(request.totalCredit)}</TableCell>
								<TableCell>{formatCurrency(request.amount)}</TableCell>
								<TableCell>{new Decimal(request.interestRate).toFixed(2)}%</TableCell>
								<TableCell>{request.monthsTerm}</TableCell>
								<TableCell>{termFrequencyLabels[request.termFrequency]}</TableCell>
								<TableCell className='text-right'>
									<div className='flex justify-end gap-2'>
										{onEdit && (
											<Button
												variant='outline'
												size='sm'
												onClick={() => onEdit(request)}
											>
												Editar
											</Button>
										)}
										<Button
											size='icon'
											className='bg-transparent hover:bg-destructive/10 text-destructive'
											onClick={() => handleDeleteClick(request)}
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

			{requestToDelete && (
				<DeleteCreditRequestWarning
					creditRequest={requestToDelete}
					isOpen={!!requestToDelete}
					onClose={handleDeleteCancel}
					onConfirm={handleDeleteConfirm}
				/>
			)}
		</div>
	)
}
