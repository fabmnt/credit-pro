import { CreditRequestsTable } from '@/app/(dashboard)/credits/components/credit-requests-table'
import { CreditRequestsTableSkeleton } from '@/app/(dashboard)/credits/components/credit-requests-table-skeleton'
import { getActiveCredits, getCreditRequests } from '@/app/(dashboard)/credits/services/get-credits'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default function CreditsPage() {
	return (
		<div className='p-4 space-y-6'>
			<header className='flex items-center justify-between border-b pb-4'>
				<div>
					<h1 className='text-2xl font-semibold'>Créditos</h1>
					<p className='text-muted-foreground'>Administra solicitudes de crédito y términos de financiamiento.</p>
				</div>
				<div>
					<Button
						asChild
						size='lg'
						className='cursor-pointer bg-blue-800 hover:bg-blue-800/90'
					>
						<Link href='/credits/new'>
							Nuevo crédito
							<Plus />
						</Link>
					</Button>
				</div>
			</header>

			<Tabs defaultValue='active-tab'>
				<Card className='rounded-sm'>
					<CardHeader>
						<TabsList>
							<TabsTrigger value='active-tab'>Activos</TabsTrigger>
							<TabsTrigger value='requests-tab'>Solicitudes</TabsTrigger>
						</TabsList>
					</CardHeader>
					<CardContent>
						<TabsContent value='requests-tab'>
							<Suspense fallback={<CreditRequestsTableSkeleton />}>
								<CreditRequestsList />
							</Suspense>
						</TabsContent>
						<TabsContent value='active-tab'>
							<Suspense fallback={<CreditRequestsTableSkeleton />}>
								<ActiveCreditsList />
							</Suspense>
						</TabsContent>
					</CardContent>
				</Card>
			</Tabs>
		</div>
	)
}

async function CreditRequestsList() {
	const creditRequests = await getCreditRequests()

	return <CreditRequestsTable creditRequests={creditRequests} />
}

async function ActiveCreditsList() {
	const activeCredits = await getActiveCredits()

	return <CreditRequestsTable creditRequests={activeCredits} />
}
