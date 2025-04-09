'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { CreateCreditRequestForm } from '@/credits/components/create-credit-request-form'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export function CreateCreditRequestModal() {
	const [open, setOpen] = useState(false)

	const onCreditRequestCreated = () => {
		setOpen(false)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button
					size='lg'
					className='cursor-pointer'
				>
					<Plus className='size-5' />
					Nueva solicitud de crédito
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-3xl'>
				<DialogHeader>
					<DialogTitle>Crear nueva solicitud de crédito</DialogTitle>
					<DialogDescription>
						Complete la información de la solicitud. Haga clic en guardar cuando termine.
					</DialogDescription>
				</DialogHeader>
				<div className='mt-4'>
					<CreateCreditRequestForm onCreditRequestCreated={onCreditRequestCreated} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
