import type { CreateCreditPaymentPlan, CreditRequest } from '@/app/(dashboard)/credits/schema'
import { addDays, addMonths, addWeeks, addYears } from 'date-fns'
import Decimal from 'decimal.js'

export const termFrequencyMap: Record<CreditRequest['termFrequency'], number> = {
	daily: 30,
	weekly: 4,
	monthly: 1,
	yearly: 1 / 12,
}

export function getTotalPayments(totalMonths: number, termFrequency: CreditRequest['termFrequency']) {
	// Calculate total payments based on months and frequency
	const paymentsPerMonth = termFrequencyMap[termFrequency]
	return Math.ceil(totalMonths * (paymentsPerMonth ?? 1))
}

export function generatePaymentPlan(creditRequest: CreditRequest): CreateCreditPaymentPlan[] {
	const { amount, interestRate, monthsTerm, termFrequency, id: creditId } = creditRequest

	const totalPayments = getTotalPayments(monthsTerm, termFrequency)
	const paymentSchedule: CreateCreditPaymentPlan[] = []
	const totalInterest = new Decimal(amount).mul(new Decimal(interestRate).div(100))
	const amountWithInterest = new Decimal(amount).add(totalInterest)

	const paymentFee = amountWithInterest.div(totalPayments)
	const paymentInterest = paymentFee.mul(new Decimal(interestRate).div(100))
	const paymentBase = paymentFee.sub(paymentInterest)

	let remainingCredit = amountWithInterest
	const startDate = creditRequest.creditStartDate

	for (let i = 0; i < totalPayments; i++) {
		let paymentDate: Date

		// Calculate payment date based on frequency and iteration
		switch (termFrequency) {
			case 'daily':
				paymentDate = addDays(startDate, i)
				break
			case 'weekly':
				paymentDate = addWeeks(startDate, i)
				break
			case 'monthly':
				paymentDate = addMonths(startDate, i)
				break
			case 'yearly':
				// Using addYears based on the frequency mapping. Adjust if business logic differs.
				paymentDate = addYears(startDate, i)
				break
			default:
				// Fallback for safety, though should not be reached with validated data
				paymentDate = startDate
				break
		}

		remainingCredit = remainingCredit.sub(paymentFee)
		paymentSchedule.push({
			status: 'pending',
			paymentDate,
			paymentFee: paymentFee.toNumber(),
			paymentInterest: paymentInterest.toNumber(),
			paymentBase: paymentBase.toNumber(),
			remainingCredit: remainingCredit.toNumber(),
			paymentReceived: 0,
			creditId,
		})
	}

	return paymentSchedule
}
