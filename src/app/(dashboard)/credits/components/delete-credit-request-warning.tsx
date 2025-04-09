'use client'

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { deleteCreditRequest } from '../actions'
import type { CreditRequest } from '../schema'

interface DeleteCreditRequestWarningProps {
	creditRequest: CreditRequest
	isOpen: boolean
	onClose: () => void
	onDelete: () => void
}

export function DeleteCreditRequestWarning({
	creditRequest,
	isOpen,
	onClose,
	onDelete,
}: DeleteCreditRequestWarningProps) {
	const [isPending, startTransition] = useTransition()

	const handleDeleteCredit = () => {
		startTransition(async () => {
			try {
				const { error } = await deleteCreditRequest(creditRequest.id)
				if (error) {
					throw new Error(error)
				}
				toast.success('Solicitud eliminada')
				onDelete()
			} catch (error) {
				toast.error('Error al eliminar la solicitud de crédito')
			}
		})
	}

	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={onClose}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
					<AlertDialogDescription>
						Se eliminará permanentemente la solicitud de crédito con ID:{' '}
						<span className='font-semibold'>{creditRequest.id.substring(0, 8)}</span> por un monto de{' '}
						<span className='font-semibold'>{formatCurrency(creditRequest.amount)}</span>.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
					<Button
						onClick={handleDeleteCredit}
						className='bg-destructive hover:bg-destructive/90'
						disabled={isPending}
					>
						{isPending ? 'Eliminando...' : 'Eliminar'}
						{isPending && <Loader className='w-4 h-4 animate-spin' />}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
