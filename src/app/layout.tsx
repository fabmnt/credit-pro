import { QueryProvider } from '@/providers/query-client-provider'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Credit Pro',
	description: 'Sistema de gestión de créditos',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='es'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Toaster />
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	)
}
