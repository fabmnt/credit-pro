import type { Client } from '@/app/(dashboard)/clients/schema'
import { create } from 'zustand'

interface CreditRequestStore {
	client: Client | null
	setClient: (client: Client | null) => void
}

export const useCreditRequest = create<CreditRequestStore>((set) => ({
	client: null,
	setClient: (client) => set({ client }),
}))
