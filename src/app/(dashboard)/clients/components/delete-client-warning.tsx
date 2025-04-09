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
import { Loader } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { deleteClient } from '../actions'
import type { Client } from '../schema'

interface DeleteClientWarningProps {
	client: Client
	isOpen: boolean
	onClose: () => void
	onDelete: () => void
}

export function DeleteClientWarning({ client, isOpen, onClose, onDelete }: DeleteClientWarningProps) {
	const [isPending, startTransition] = useTransition()

	const handleDelete = () => {
		startTransition(async () => {
			try {
				const { error } = await deleteClient(client.id)
				if (error) {
					throw new Error(error)
				}
				toast.success('Cliente eliminado correctamente')
				onDelete()
			} catch (error) {
				toast.error('Error al eliminar el cliente')
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
					<AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<Button
						onClick={handleDelete}
						className='bg-red-800 ml-2 hover:bg-red-800/90 text-white'
						type='submit'
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
