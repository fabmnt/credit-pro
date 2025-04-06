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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader, Plus } from 'lucide-react'
import Form from 'next/form'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { createClient } from '../actions'

export function CreateClient() {
	const [state, formAction, isPending] = useActionState(createClient, {
		message: null,
		error: null,
		data: null,
	})

	useEffect(() => {
		if (state.message) {
			toast.success(state.message)
		}

		if (state.error) {
			toast.error(state.error)
		}
	}, [state])

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className='cursor-pointer bg-blue-800 hover:bg-blue-800'
					size='lg'
				>
					<span>Crear cliente</span>
					<Plus className='w-4 h-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-3xl'>
				<DialogHeader className='border-b pb-4 mb-4'>
					<DialogTitle>Crear cliente</DialogTitle>
					<DialogDescription>Agrega un nuevo cliente a tu lista de clientes</DialogDescription>
				</DialogHeader>
				<Form action={formAction}>
					<div className='grid grid-cols-4 gap-6 mb-8'>
						<div className='space-y-2 col-span-2'>
							<Label>Nombre</Label>
							<Input
								name='name'
								type='text'
								placeholder='Nombre del cliente'
								disabled={isPending}
							/>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Cédula</Label>
							<Input
								name='dni'
								type='text'
								placeholder='Cédula del cliente'
								disabled={isPending}
							/>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Profesión</Label>
							<Input
								name='profession'
								type='text'
								placeholder='Profesión del cliente'
								disabled={isPending}
							/>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Ciudad</Label>
							<Select
								name='city'
								disabled={isPending}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Selecciona una ciudad' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='Managua'>Managua</SelectItem>
									<SelectItem value='León'>León</SelectItem>
									<SelectItem value='Granada'>Granada</SelectItem>
									<SelectItem value='Masaya'>Masaya</SelectItem>
									<SelectItem value='Chinandega'>Chinandega</SelectItem>
									<SelectItem value='Matagalpa'>Matagalpa</SelectItem>
									<SelectItem value='Estelí'>Estelí</SelectItem>
									<SelectItem value='Jinotega'>Jinotega</SelectItem>
									<SelectItem value='Bluefields'>Bluefields</SelectItem>
									<SelectItem value='Puerto Cabezas'>Puerto Cabezas</SelectItem>
									<SelectItem value='Rivas'>Rivas</SelectItem>
									<SelectItem value='Boaco'>Boaco</SelectItem>
									<SelectItem value='Juigalpa'>Juigalpa</SelectItem>
									<SelectItem value='Ocotal'>Ocotal</SelectItem>
									<SelectItem value='Somoto'>Somoto</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Teléfono</Label>
							<Input
								name='telephone'
								type='text'
								placeholder='Teléfono del cliente'
								disabled={isPending}
							/>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Sexo</Label>
							<Select
								name='sex'
								disabled={isPending}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Selecciona un sexo' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='male'>Masculino</SelectItem>
									<SelectItem value='female'>Femenino</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Nacionalidad</Label>
							<Input
								name='nationality'
								type='text'
								placeholder='Nacionalidad del cliente'
								disabled={isPending}
							/>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Email (opcional)</Label>
							<Input
								name='email'
								type='email'
								placeholder='Email del cliente'
								disabled={isPending}
							/>
						</div>
						<div className='col-span-4 space-y-2'>
							<Label>Dirección</Label>
							<Textarea
								name='address'
								placeholder='Dirección del cliente'
								disabled={isPending}
							/>
						</div>
					</div>
					<Button
						className='w-full bg-blue-800 hover:bg-blue-800 cursor-pointer'
						type='submit'
						disabled={isPending}
					>
						{isPending ? 'Creando cliente...' : 'Crear cliente'}
						{isPending && <Loader className='h-4 w-4 ml-2 animate-spin' />}
					</Button>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
