import type { Client } from '@/app/(dashboard)/clients/schema'
import { create } from 'zustand'
import type { CreateCreditRequest, CreditPaymentPlan } from './schema'

interface CreditRequestStore {
	client: Client | null
	setClient: (client: Client | null) => void
	creditRequest: Partial<CreateCreditRequest> | null
	setCreditRequest: (creditRequest: Partial<CreateCreditRequest> | null) => void
	paymentPlan: CreditPaymentPlan[] | null
	setPaymentPlan: (paymentPlan: CreditPaymentPlan[] | null) => void
}

export const useCreditRequest = create<CreditRequestStore>((set) => ({
	client: null,
	setClient: (client) => set({ client }),
	creditRequest: null,
	setCreditRequest: (creditRequest) => set({ creditRequest }),
	paymentPlan: null,
	setPaymentPlan: (paymentPlan) => set({ paymentPlan }),
}))
