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
import { Plus } from 'lucide-react'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { createClient } from '../actions'

export function CreateClient() {
	const [state, formAction] = useActionState(createClient, {
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
	}, [state.message, state.error])

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className='cursor-pointer bg-blue-700 hover:bg-blue-800'
					size='lg'
				>
					<span>Crear cliente</span>
					<Plus className='w-4 h-4' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Crear cliente</DialogTitle>
					<DialogDescription>Agrega un nuevo cliente a tu lista de clientes</DialogDescription>
				</DialogHeader>
				<form action={formAction}>
					<div className='grid grid-cols-4 gap-4'>
						<div className='space-y-2 col-span-2'>
							<Label>Nombre</Label>
							<Input
								name='name'
								type='text'
								placeholder='Nombre del cliente'
							/>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Cédula</Label>
							<Input
								name='dni'
								type='text'
								placeholder='Cédula del cliente'
							/>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Profesión</Label>
							<Input
								name='profession'
								type='text'
								placeholder='Profesión del cliente'
							/>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Ciudad</Label>
							<Select>
								<SelectTrigger>
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
								name='phone'
								type='text'
								placeholder='Teléfono del cliente'
							/>
						</div>
						<div className='space-y-2 col-span-2'>
							<Label>Sexo</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder='Selecciona un sexo' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='Hombre'>Hombre</SelectItem>
									<SelectItem value='Mujer'>Mujer</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<Button
						className='w-full'
						type='submit'
					>
						Crear cliente
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
