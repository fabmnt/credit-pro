'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatCurrency } from '@/lib/utils'
import type { CreditRequest } from '../schema'

interface DeleteCreditRequestWarningProps {
	creditRequest: CreditRequest
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
}

export function DeleteCreditRequestWarning({
	creditRequest,
	isOpen,
	onClose,
	onConfirm,
}: DeleteCreditRequestWarningProps) {
	const handleConfirm = () => {
		onConfirm()
		onClose()
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
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirm}
						className='bg-destructive hover:bg-destructive/90'
					>
						Eliminar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
