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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Decimal from 'decimal.js'
import { Edit } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { revalidateCreditRequest } from '../actions'
import type { CreditPaymentPlan, CreditRequest } from '../schema'
import { updateCreditRequestSchema } from '../schema'
import { PaymentPlan } from './payment-plan'
interface AcceptCreditRequestModalProps {
	creditRequest: CreditRequest
}

const formatToTwoDecimals = (value: string): number | string => {
	if (value === '') return ''
	const decimal = new Decimal(value)
	return decimal.toDecimalPlaces(2).toNumber()
}

export function AcceptCreditRequestModal({ creditRequest }: AcceptCreditRequestModalProps) {
	const [open, setOpen] = useState(false)
	const [showPaymentPlan, setShowPaymentPlan] = useState(false)
	const [paymentPlan, setPaymentPlan] = useState<CreditPaymentPlan[]>([])
	const [credit, setCredit] = useState<CreditRequest>(creditRequest)

	// Create a form schema for updating credit request
	const updateCreditRequestFormSchema = updateCreditRequestSchema
		.pick({
			amount: true,
			interestRate: true,
			latePaymentRate: true,
			monthsTerm: true,
			termFrequency: true,
			creditStartDate: true,
		})
		.required()

	// Set up form with initial values from the creditRequest
	const form = useForm<z.infer<typeof updateCreditRequestFormSchema>>({
		resolver: zodResolver(updateCreditRequestFormSchema),
		defaultValues: {
			amount: creditRequest.amount,
			interestRate: creditRequest.interestRate,
			latePaymentRate: creditRequest.latePaymentRate,
			monthsTerm: creditRequest.monthsTerm,
			termFrequency: creditRequest.termFrequency,
			creditStartDate: creditRequest.creditStartDate,
		},
	})

	// Reset form when modal opens
	useEffect(() => {
		if (open) {
			// Reset with guaranteed non-null values
			const defaultValues = {
				amount: creditRequest.amount,
				interestRate: creditRequest.interestRate,
				latePaymentRate: creditRequest.latePaymentRate,
				monthsTerm: creditRequest.monthsTerm,
				termFrequency: creditRequest.termFrequency,
				creditStartDate: creditRequest.creditStartDate,
			} as const // Use const assertion to ensure the values are treated as required

			form.reset(defaultValues)
			setShowPaymentPlan(false)
		}
	}, [open, creditRequest, form])

	// Accept credit request mutation
	const acceptCreditMutation = useMutation({
		mutationFn: async () => {
			const result = await fetch(`/api/credit/accept-request/${creditRequest.id}`, {
				method: 'POST',
				body: JSON.stringify(form.getValues()),
			})

			if (!result.ok) {
				throw new Error('Failed to accept credit request')
			}

			return result.json() as Promise<{ message: string; credit: CreditRequest; paymentPlan: CreditPaymentPlan[] }>
		},
		onSuccess: async ({ credit, paymentPlan }) => {
			const mappedPaymentPlan = paymentPlan.map((payment) => ({
				...payment,
				paymentDate: new Date(payment.paymentDate),
				createdAt: new Date(payment.createdAt),
				updatedAt: new Date(payment.updatedAt),
			}))

			setPaymentPlan(mappedPaymentPlan)
			const mappedCredit = {
				...credit,
				creditStartDate: new Date(credit.creditStartDate),
				createdAt: new Date(credit.createdAt),
				updatedAt: new Date(credit.updatedAt),
			}
			setCredit(mappedCredit)
			setShowPaymentPlan(true)
			toast.success('Solicitud de crédito aceptada')
			await revalidateCreditRequest(creditRequest.id)
		},
		onError: (error) => {
			toast.error('Error', {
				description: error instanceof Error ? error.message : 'No se pudo aceptar la solicitud de crédito',
			})
		},
	})

	const handleAcceptCredit = async () => {
		await acceptCreditMutation.mutateAsync()
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
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button className='cursor-pointer'>
					<Edit className='size-4 mr-2' />
					Revisar solicitud
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-3xl'>
				<DialogHeader>
					<DialogTitle>Aceptar solicitud de crédito</DialogTitle>
					<DialogDescription>
						Revise y modifique los términos del crédito si es necesario. Haga clic en aceptar para aprobar la solicitud.
					</DialogDescription>
				</DialogHeader>
				<div className='mt-4'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleAcceptCredit)}
							className='space-y-6'
						>
							{!showPaymentPlan && (
								<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
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
											<FormItem className='col-span-2'>
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
											<FormItem className='col-span-2'>
												<FormLabel>Plazo en {formValues.termFrequency === 'yearly' ? 'Años' : 'Meses'}</FormLabel>
												<Select
													value={String(field.value || creditRequest.monthsTerm)}
													onValueChange={(value) => field.onChange(Number(value))}
												>
													<FormControl>
														<SelectTrigger className='w-full'>
															<SelectValue placeholder='Seleccione el plazo' />
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

							{showPaymentPlan && (
								<PaymentPlan
									paymentPlans={paymentPlan}
									credit={credit}
								/>
							)}

							{!showPaymentPlan && (
								<div className='flex justify-between'>
									<Button
										type='button'
										variant='outline'
										onClick={() => setOpen(false)}
									>
										Cancelar
									</Button>

									<Button
										type='submit'
										disabled={acceptCreditMutation.isPending}
									>
										{acceptCreditMutation.isPending ? 'Procesando...' : 'Aceptar'}
									</Button>
								</div>
							)}
							{showPaymentPlan && (
								<div className='flex justify-end'>
									<Button
										type='button'
										onClick={() => setOpen(false)}
									>
										Aceptar
									</Button>
								</div>
							)}
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}
