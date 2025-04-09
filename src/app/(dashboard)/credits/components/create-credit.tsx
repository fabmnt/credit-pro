'use client'

import type { Client } from '@/app/(dashboard)/clients/schema'
import { type CreateCreditRequest, createCreditRequestSchema } from '@/app/(dashboard)/credits/schema'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function CreateCredit() {
	const [isOpen, setIsOpen] = useState(false)
	const [formData, setFormData] = useState<Partial<CreateCreditRequest>>({
		amount: 0,
		interestRate: 0,
		latePaymentRate: 0,
		monthsTerm: 1,
		termFrequency: 'monthly',
		creditStartDate: new Date(),
		clientId: '',
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const router = useRouter()
	// Fetch clients for dropdown
	const { data: clients, isLoading: isLoadingClients } = useQuery({
		queryKey: ['clients'],
		queryFn: async () => {
			const res = await fetch('/api/clients')
			return res.json() as Promise<Client[]>
		},
	})

	// Create credit mutation
	const { mutate: createCredit, isPending } = useMutation({
		mutationFn: async (creditRequest: CreateCreditRequest) => {
			const res = await fetch('/api/credits/create-request', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(creditRequest),
			})

			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.error)
			}

			return res.json()
		},
		onSuccess: () => {
			toast.success('Crédito creado correctamente')
			setIsOpen(false)
			setFormData({
				amount: 0,
				interestRate: 0,
				latePaymentRate: 0,
				monthsTerm: 1,
				termFrequency: 'monthly',
				creditStartDate: new Date(),
				clientId: '',
			})
			setErrors({})
			router.refresh()
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string | number | Date }) => {
		const { name, value } = 'target' in e ? e.target : e
		setFormData((prev) => ({ ...prev, [name]: value }))

		// Clear error for this field if it exists
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev }
				delete newErrors[name]
				return newErrors
			})
		}
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const result = createCreditRequestSchema.safeParse(formData)

		if (!result.success) {
			const formattedErrors: Record<string, string> = {}
			for (const err of result.error.errors) {
				if (err.path[0]) {
					formattedErrors[err.path[0].toString()] = err.message
				}
			}
			setErrors(formattedErrors)
			return
		}

		createCredit(result.data)
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger asChild>
				<Button size='lg'>Nuevo crédito</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>Crear nuevo crédito</DialogTitle>
					<DialogDescription>Complete el formulario para crear una nueva solicitud de crédito.</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className='space-y-6'
				>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='clientId'>Cliente</Label>
							<Select
								value={formData.clientId}
								onValueChange={(value) => handleChange({ name: 'clientId', value })}
								disabled={isLoadingClients || isPending}
							>
								<SelectTrigger
									id='clientId'
									className='w-full'
								>
									<SelectValue placeholder='Seleccione un cliente' />
								</SelectTrigger>
								<SelectContent>
									{clients?.map((client) => (
										<SelectItem
											key={client.id}
											value={client.id}
										>
											{client.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.clientId && <p className='text-sm text-destructive'>{errors.clientId}</p>}
						</div>

						<div className='grid grid-cols-2 gap-8'>
							<div className='space-y-2'>
								<Label htmlFor='amount'>Monto (C$)</Label>
								<Input
									id='amount'
									name='amount'
									type='number'
									step='0.01'
									min='1'
									value={formData.amount || ''}
									onChange={(e) => handleChange({ name: 'amount', value: Number(e.target.value) })}
									placeholder='0.00'
									disabled={isPending}
								/>
								{errors.amount && <p className='text-sm text-destructive'>{errors.amount}</p>}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='interestRate'>Tasa de interés (%)</Label>
								<Input
									id='interestRate'
									name='interestRate'
									type='number'
									step='0.01'
									min='1'
									max='100'
									value={formData.interestRate || ''}
									onChange={(e) => handleChange({ name: 'interestRate', value: Number(e.target.value) })}
									placeholder='0.00'
									disabled={isPending}
								/>
								{errors.interestRate && <p className='text-sm text-destructive'>{errors.interestRate}</p>}
							</div>
						</div>

						<div className='grid grid-cols-2 gap-8'>
							<div className='space-y-2'>
								<Label htmlFor='latePaymentRate'>Tasa de mora (%)</Label>
								<Input
									id='latePaymentRate'
									name='latePaymentRate'
									type='number'
									step='0.01'
									min='1'
									max='100'
									value={formData.latePaymentRate || ''}
									onChange={(e) => handleChange({ name: 'latePaymentRate', value: Number(e.target.value) })}
									placeholder='0.00'
									disabled={isPending}
								/>
								{errors.latePaymentRate && <p className='text-sm text-destructive'>{errors.latePaymentRate}</p>}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='creditStartDate'>Fecha de inicio</Label>
								<Input
									id='creditStartDate'
									name='creditStartDate'
									type='date'
									value={formData.creditStartDate ? format(new Date(formData.creditStartDate), 'yyyy-MM-dd') : ''}
									onChange={(e) => {
										const date = new Date(e.target.value)
										date.setHours(12, 0, 0, 0)
										handleChange({ name: 'creditStartDate', value: date })
									}}
									min={format(new Date(), 'yyyy-MM-dd')}
									disabled={isPending}
								/>
								{errors.creditStartDate && <p className='text-sm text-destructive'>{errors.creditStartDate}</p>}
							</div>
						</div>

						<div className='grid grid-cols-2 gap-8'>
							<div className='space-y-2'>
								<Label htmlFor='termFrequency'>Frecuencia de pago</Label>
								<Select
									value={formData.termFrequency || ''}
									onValueChange={(value) => handleChange({ name: 'termFrequency', value })}
									disabled={isPending}
								>
									<SelectTrigger
										id='termFrequency'
										className='w-full'
									>
										<SelectValue placeholder='Seleccione una frecuencia' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='daily'>Diaria</SelectItem>
										<SelectItem value='weekly'>Semanal</SelectItem>
										<SelectItem value='monthly'>Mensual</SelectItem>
										<SelectItem value='yearly'>Anual</SelectItem>
									</SelectContent>
								</Select>
								{errors.termFrequency && <p className='text-sm text-destructive'>{errors.termFrequency}</p>}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='monthsTerm'>Plazo (meses)</Label>
								<Select
									value={formData.monthsTerm?.toString() || ''}
									onValueChange={(value) => handleChange({ name: 'monthsTerm', value: Number(value) })}
									disabled={isPending}
								>
									<SelectTrigger
										id='monthsTerm'
										className='w-full'
									>
										<SelectValue placeholder='Seleccione un plazo' />
									</SelectTrigger>
									<SelectContent>
										{Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
											<SelectItem
												key={month}
												value={month.toString()}
											>
												{month} {month === 1 ? 'mes' : 'meses'}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.monthsTerm && <p className='text-sm text-destructive'>{errors.monthsTerm}</p>}
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							className='w-full'
							type='submit'
							disabled={isPending}
						>
							{isPending ? 'Creando...' : 'Crear solicitud'}
							{isPending && <Loader className='h-4 w-4 animate-spin' />}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
