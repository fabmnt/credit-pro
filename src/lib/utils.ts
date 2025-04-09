import { type ClassValue, clsx } from 'clsx'
import Decimal from 'decimal.js'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date

	return new Intl.DateTimeFormat('es-ES', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(dateObj)
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('es-NI', {
		style: 'currency',
		currency: 'NIO',
		minimumFractionDigits: 2,
	}).format(amount)
}

export function formatNumber(value: string | number) {
	if (value === '') {
		return
	}

	return new Decimal(value).toDecimalPlaces(2).toNumber()
}
