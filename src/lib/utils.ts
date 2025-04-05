import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('es-ES', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(date)
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('es-NI', {
		style: 'currency',
		currency: 'NIO',
		minimumFractionDigits: 2,
	}).format(amount)
}
