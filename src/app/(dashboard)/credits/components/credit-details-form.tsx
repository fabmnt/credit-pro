'use client'

import { useCreditRequest } from '@/app/(dashboard)/credits/stores'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatNumber } from '@/lib/utils'
import { format, parse } from 'date-fns'

export function CreditDetailsForm() {
	const creditRequest = useCreditRequest((state) => state.creditRequest)
	const setCreditRequest = useCreditRequest((state) => state.setCreditRequest)
	const paymentPlan = useCreditRequest((state) => state.paymentPlan)

	const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = formatNumber(e.target.value)
		setCreditRequest({ ...creditRequest, amount: value })
	}

	const handleChangeInterestRate = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = formatNumber(e.target.value)
		setCreditRequest({ ...creditRequest, interestRate: value })
	}

	const handleChangeLatePaymentRate = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = formatNumber(e.target.value)
		setCreditRequest({ ...creditRequest, latePaymentRate: value })
	}

	const handleChangeCreditStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputDate = e.target.value
		const parsedDate = parse(inputDate, 'yyyy-MM-dd', new Date())
		// Establecemos la hora a mediodía para evitar problemas con zonas horarias
		parsedDate.setHours(12, 0, 0, 0)
		setCreditRequest({ ...creditRequest, creditStartDate: parsedDate })
	}

	const handleChangePaymentFrequency = (value: string) => {
		setCreditRequest({ ...creditRequest, termFrequency: value as 'daily' | 'weekly' | 'monthly' | 'yearly' })
	}

	const handleChangeTerm = (value: string) => {
		setCreditRequest({ ...creditRequest, monthsTerm: Number.parseInt(value) })
	}

	return (
		<div>
			<form className='grid grid-cols-3 gap-8'>
				<div className='space-y-2'>
					<Label>Monto (C$)</Label>
					<Input
						type='number'
						step='0.01'
						value={creditRequest?.amount ?? ''}
						onChange={handleChangeAmount}
						placeholder='0.00'
						required
						disabled={paymentPlan != null}
					/>
				</div>
				<div className='space-y-2'>
					<Label>Tasa de interés (%)</Label>
					<Input
						type='number'
						step='0.01'
						value={creditRequest?.interestRate ?? ''}
						onChange={handleChangeInterestRate}
						placeholder='0.00'
						required
						disabled={paymentPlan != null}
					/>
				</div>
				<div className='space-y-2'>
					<Label>Tasa de mora (%)</Label>
					<Input
						type='number'
						step='0.01'
						value={creditRequest?.latePaymentRate ?? ''}
						onChange={handleChangeLatePaymentRate}
						placeholder='0.00'
						required
						disabled={paymentPlan != null}
					/>
				</div>
				<div className='space-y-2'>
					<Label>Fecha de inicio</Label>
					<Input
						type='date'
						value={creditRequest?.creditStartDate ? format(creditRequest.creditStartDate, 'yyyy-MM-dd') : ''}
						onChange={handleChangeCreditStartDate}
						required
						disabled={paymentPlan != null}
					/>
				</div>
				<div className='space-y-2'>
					<Label>Frecuencia de pago</Label>
					<Select
						value={creditRequest?.termFrequency ?? ''}
						onValueChange={handleChangePaymentFrequency}
						required
						disabled={paymentPlan != null}
					>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Seleccione una frecuencia' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='daily'>Diaria</SelectItem>
							<SelectItem value='weekly'>Semanal</SelectItem>
							<SelectItem value='monthly'>Mensual</SelectItem>
							<SelectItem value='yearly'>Anual</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className='space-y-2'>
					<Label>Plazo</Label>
					<Select
						value={creditRequest?.monthsTerm?.toString() ?? ''}
						onValueChange={handleChangeTerm}
						required
						disabled={paymentPlan != null}
					>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Seleccione un plazo' />
						</SelectTrigger>
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
					</Select>
				</div>
			</form>
		</div>
	)
}
