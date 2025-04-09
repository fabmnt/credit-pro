'use client'

import { useCreditRequest } from '../stores'
import { PaymentPlan } from './payment-plan'
export function CreditPaymentPlan() {
	const paymentPlan = useCreditRequest((state) => state.paymentPlan)

	if (paymentPlan == null) {
		return <p className='text-center text-sm text-muted-foreground'>Guarda la solicitud para generar el plan de pago</p>
	}

	return <PaymentPlan paymentPlans={paymentPlan} />
}
