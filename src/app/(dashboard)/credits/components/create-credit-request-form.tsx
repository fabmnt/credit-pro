'use client'

import { useClients } from '@/clients/hooks/use-clients'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Decimal from 'decimal.js'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { revalidateCredits } from '../actions'
import type { CreditPaymentPlan, CreditRequest } from '../schema'
import { createCreditRequestSchema } from '../schema'
import { PaymentPlan } from './payment-plan'

interface CreateCreditRequestFormProps {
	onCreditRequestCreated: () => void
}

const formatToTwoDecimals = (value: string): number | string => {
	if (value === '') return ''
	const decimal = new Decimal(value)
	return decimal.toDecimalPlaces(2).toNumber()
}

export function CreateCreditRequestForm({ onCreditRequestCreated }: CreateCreditRequestFormProps) {
	const [showPaymentPlan, setShowPaymentPlan] = useState(false)
	const [credit, setCredit] = useState<CreditRequest | null>(null)
	const [paymentPlans, setPaymentPlans] = useState<CreditPaymentPlan[]>([])
	const { data: clients, isLoading: isLoadingClients, error: clientsError } = useClients()

	if (clientsError) {
		toast.error('Error', {
			description: 'No se pudieron cargar los clientes',
		})
	}

	const form = useForm<z.infer<typeof createCreditRequestSchema>>({
		resolver: zodResolver(createCreditRequestSchema),
		defaultValues: {
			clientId: '',
			amount: 0,
			interestRate: 0,
			latePaymentRate: 0,
			monthsTerm: 1,
			termFrequency: 'monthly',
			creditStartDate: new Date(),
		},
	})

	// Create credit request mutation
	const createCreditMutation = useMutation({
		mutationFn: async (data: z.infer<typeof createCreditRequestSchema>) => {
			const response = await fetch('/api/credit/request', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Failed to create credit request')
			}

			const { credit, paymentPlan } = (await response.json()) as {
				credit: CreditRequest
				paymentPlan: CreditPaymentPlan[]
			}
			const mappedPaymentPlan = paymentPlan.map((payment) => ({
				...payment,
				paymentDate: new Date(payment.paymentDate),
				createdAt: new Date(payment.createdAt),
				updatedAt: new Date(payment.updatedAt),
			}))

			const mappedCredit = {
				...credit,
				creditStartDate: new Date(credit.creditStartDate),
				createdAt: new Date(credit.createdAt),
				updatedAt: new Date(credit.updatedAt),
			}

			return { paymentPlan: mappedPaymentPlan, credit: mappedCredit }
		},
		onSuccess: async ({ paymentPlan, credit }) => {
			setPaymentPlans(paymentPlan)
			setCredit(credit)
			setShowPaymentPlan(true)
			toast.success('Solicitud creada')
			await revalidateCredits()
		},
		onError: (error) => {
			toast.error('Error', {
				description: error instanceof Error ? error.message : 'No se pudo crear la solicitud de crédito',
			})
		},
	})

	const onSubmit = async (data: z.infer<typeof createCreditRequestSchema>) => {
		const formattedData = {
			...data,
			amount: new Decimal(data.amount).toNumber(),
			interestRate: new Decimal(data.interestRate).toNumber(),
			latePaymentRate: new Decimal(data.latePaymentRate).toNumber(),
		}

		await createCreditMutation.mutateAsync(formattedData)
	}

	// Extract form values for payment plan calculation
	const formValues = form.watch()

	// Set monthsTerm to 12 when termFrequency changes to yearly
	useEffect(() => {
		if (formValues.termFrequency === 'yearly') {
			form.setValue('monthsTerm', 12)
		}
	}, [formValues.termFrequency, form])

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6'
			>
				{!showPaymentPlan && (
					<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
						<FormField
							control={form.control}
							name='clientId'
							render={({ field }) => (
								<FormItem className='col-span-2'>
									<FormLabel>Cliente</FormLabel>
									{isLoadingClients ? (
										<Skeleton className='h-10 w-full' />
									) : (
										<Select
											disabled={!clients?.length}
											value={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className='w-full overflow-hidden'>
													<SelectValue placeholder='Seleccione un cliente' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{!clients?.length ? (
													<SelectItem
														value='empty'
														disabled
													>
														No hay clientes disponibles
													</SelectItem>
												) : (
													clients.map((client) => (
														<SelectItem
															key={client.id}
															value={client.id}
														>
															{client.name} - {client.dni}
														</SelectItem>
													))
												)}
											</SelectContent>
										</Select>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='creditStartDate'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha de Inicio</FormLabel>
									<FormControl>
										<Input
											type='date'
											{...field}
											value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
											onChange={(e) => {
												const value = e.target.value
												field.onChange(value ? new Date(value) : null)
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Monto del Crédito</FormLabel>
									<FormControl>
										<Input
											type='number'
											step='0.01'
											inputMode='decimal'
											placeholder='Ingrese el monto del crédito'
											{...field}
											onChange={(e) => {
												const value = e.target.value
												field.onChange(formatToTwoDecimals(value))
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='interestRate'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tasa de Interés (%)</FormLabel>
									<FormControl>
										<Input
											type='number'
											step='0.01'
											placeholder='Ingrese la tasa de interés'
											{...field}
											onChange={(e) => {
												const value = e.target.value
												field.onChange(formatToTwoDecimals(value))
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='latePaymentRate'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tasa de Pago Tardío (%)</FormLabel>
									<FormControl>
										<Input
											type='number'
											placeholder='Ingrese la tasa de pago tardío'
											{...field}
											onChange={(e) => {
												const value = e.target.value
												field.onChange(formatToTwoDecimals(value))
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='termFrequency'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Frecuencia de Pago</FormLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
									>
										<FormControl>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Seleccione la frecuencia de pago' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='daily'>Diaria</SelectItem>
											<SelectItem value='weekly'>Semanal</SelectItem>
											<SelectItem value='monthly'>Mensual</SelectItem>
											<SelectItem value='yearly'>Anual</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='monthsTerm'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Plazo en {formValues.termFrequency === 'yearly' ? 'Años' : 'Meses'}</FormLabel>
									<Select
										value={field.value.toString()}
										onValueChange={(value) => field.onChange(Number(value))}
									>
										<FormControl>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Seleccione el plazo en años' />
											</SelectTrigger>
										</FormControl>
										{formValues.termFrequency === 'yearly' ? (
											<SelectContent>
												<SelectItem value='12'>1 año</SelectItem>
												<SelectItem value='24'>2 años</SelectItem>
												<SelectItem value='36'>3 años</SelectItem>
												<SelectItem value='48'>4 años</SelectItem>
												<SelectItem value='60'>5 años</SelectItem>
											</SelectContent>
										) : (
											<SelectContent>
												<SelectItem value='1'>1 mes</SelectItem>
												<SelectItem value='2'>2 meses</SelectItem>
												<SelectItem value='3'>3 meses</SelectItem>
												<SelectItem value='4'>4 meses</SelectItem>
												<SelectItem value='5'>5 meses</SelectItem>
												<SelectItem value='6'>6 meses</SelectItem>
												<SelectItem value='7'>7 meses</SelectItem>
												<SelectItem value='8'>8 meses</SelectItem>
												<SelectItem value='9'>9 meses</SelectItem>
												<SelectItem value='10'>10 meses</SelectItem>
												<SelectItem value='11'>11 meses</SelectItem>
												<SelectItem value='12'>12 meses</SelectItem>
											</SelectContent>
										)}
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				)}
				{showPaymentPlan && credit && (
					<div>
						<PaymentPlan
							credit={credit}
							paymentPlans={paymentPlans}
						/>
					</div>
				)}

				<div className='flex justify-between'>
					{!showPaymentPlan && (
						<Button
							type='button'
							variant='outline'
							onClick={() => {
								onCreditRequestCreated()
							}}
						>
							Cancelar
						</Button>
					)}

					{!showPaymentPlan && (
						<Button
							type='submit'
							disabled={createCreditMutation.isPending || isLoadingClients || !clients?.length}
						>
							{createCreditMutation.isPending ? 'Procesando...' : 'Crear'}
						</Button>
					)}
				</div>
				{showPaymentPlan && (
					<div className='flex justify-end'>
						<Button
							type='button'
							onClick={() => {
								onCreditRequestCreated()
							}}
						>
							Aceptar
						</Button>
					</div>
				)}
			</form>
		</Form>
	)
}
