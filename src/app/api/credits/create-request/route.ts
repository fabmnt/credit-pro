import { createCreditRequestSchema } from '@/app/(dashboard)/credits/schema'
import { generatePaymentPlan } from '@/app/(dashboard)/credits/utils/payment-plan'
import { db } from '@/db'
import { credit, creditPaymentPlan } from '@/db/schema'
import Decimal from 'decimal.js'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const body = await request.json()
	const { success, data, error } = createCreditRequestSchema.safeParse(body)

	if (!success) {
		return NextResponse.json({ error: error.message }, { status: 400 })
	}

	const { clientId, amount, interestRate, latePaymentRate, monthsTerm, termFrequency, creditStartDate } = data
	// Aseguramos que la fecha tenga la hora en mediodía para evitar problemas con zonas horarias
	const startDate = new Date(creditStartDate)
	startDate.setHours(12, 0, 0, 0)

	const totalInterest = new Decimal(amount).mul(new Decimal(interestRate).div(100))
	const totalCredit = new Decimal(amount).add(totalInterest)
	const [newCreditRequest] = await db
		.insert(credit)
		.values({
			amount: new Decimal(amount).toNumber(),
			interestRate: new Decimal(interestRate).toNumber(),
			totalInterest: totalInterest.toNumber(),
			latePaymentRate: new Decimal(latePaymentRate).toNumber(),
			totalCredit: totalCredit.toNumber(),
			creditStartDate: startDate,
			clientId,
			monthsTerm,
			termFrequency,
		})
		.returning()

	if (!newCreditRequest) {
		return NextResponse.json({ error: 'Failed to create credit request' }, { status: 500 })
	}

	const paymentPlan = generatePaymentPlan(newCreditRequest)
	const newPaymentPlan = await db.insert(creditPaymentPlan).values(paymentPlan).returning()

	return NextResponse.json({ credit: newCreditRequest, paymentPlan: newPaymentPlan })
}
