'use client'
import { DeleteCreditRequestWarning } from '@/app/(dashboard)/credits/components/delete-credit-warning'
import type { CreditRequest } from '@/app/(dashboard)/credits/schema'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import Decimal from 'decimal.js'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Map term frequency to Spanish
const termFrequencyLabels = {
	daily: 'Diario',
	weekly: 'Semanal',
	monthly: 'Mensual',
	yearly: 'Anual',
}

interface CreditRequestsTableProps {
	creditRequests: CreditRequest[]
}

export function CreditRequestsTable({ creditRequests }: CreditRequestsTableProps) {
	const [requestToDelete, setRequestToDelete] = useState<CreditRequest | null>(null)

	const handleDeleteClick = (creditRequest: CreditRequest) => {
		setRequestToDelete(creditRequest)
	}

	const handleDeleteCancel = () => {
		setRequestToDelete(null)
	}

	const handleDeleteConfirm = () => {
		setRequestToDelete(null)
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead />
						<TableHead className='py-2'>Fecha de Inicio</TableHead>
						<TableHead className='py-2'>Crédito Total</TableHead>
						<TableHead className='py-2'>Monto</TableHead>
						<TableHead className='py-2'>Tasa de Interés</TableHead>
						<TableHead className='py-2'>Plazo (meses)</TableHead>
						<TableHead className='py-2'>Frecuencia</TableHead>
						<TableHead className='py-2 text-right'>Acciones</TableHead>
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
								<TableCell className='py-4'>
									<Link
										prefetch
										href={`/credits/${request.id}`}
										className='text-primary hover:underline font-bold'
									>
										#{request.id.substring(0, 8)}
									</Link>
								</TableCell>
								<TableCell className='py-4'>{formatDate(request.creditStartDate)}</TableCell>
								<TableCell className='py-4'>{formatCurrency(request.totalCredit)}</TableCell>
								<TableCell className='py-4'>{formatCurrency(request.amount)}</TableCell>
								<TableCell className='py-4'>{new Decimal(request.interestRate).toFixed(2)}%</TableCell>
								<TableCell className='py-4'>{request.monthsTerm}</TableCell>
								<TableCell className='py-4'>{termFrequencyLabels[request.termFrequency]}</TableCell>
								<TableCell className='py-4 text-right'>
									<div className='flex justify-end gap-2'>
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
					onDelete={handleDeleteConfirm}
				/>
			)}
		</div>
	)
}
