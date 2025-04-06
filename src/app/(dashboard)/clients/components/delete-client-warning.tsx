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
import Form from 'next/form'
import { startTransition, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { deleteClient } from '../actions'
import type { Client } from '../schema'

interface DeleteClientWarningProps {
	client: Client
	isOpen: boolean
	onClose: () => void
}

export function DeleteClientWarning({ client, isOpen, onClose }: DeleteClientWarningProps) {
	const [state, formAction, isPending] = useActionState(deleteClient, {
		data: null,
		message: null,
		error: null,
	})

	const handleDelete = () => {
		startTransition(() => {
			formAction(client.id)
			onClose()
		})
	}

	useEffect(() => {
		if (state.message) {
			toast.success(state.message)
		}

		if (state.error) {
			toast.error(state.error)
		}
	}, [state])

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
					<Form action={() => formAction(client.id)}>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<Button
							onClick={handleDelete}
							className='bg-red-800 ml-2 hover:bg-red-800 text-white'
							type='submit'
							disabled={isPending}
						>
							{isPending ? 'Eliminando...' : 'Eliminar'}
							{isPending && <Loader className='w-4 h-4 animate-spin' />}
						</Button>
					</Form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
