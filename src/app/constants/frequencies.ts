import type { CreditRequest } from '../(dashboard)/credits/schema'

export const TERM_FREQUENCY_LABEL: Record<CreditRequest['termFrequency'], string> = {
	monthly: 'Mensual',
	weekly: 'Semanal',
	daily: 'Diario',
	yearly: 'Anual',
}
