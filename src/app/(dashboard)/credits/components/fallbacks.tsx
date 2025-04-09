import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function PaymentPlanSkeleton({
	className,
}: {
	className?: string
}) {
	return (
		<Card className={cn('w-full', className)}>
			<CardContent>
				<div>
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-8 w-full' />
						<Skeleton className='h-8 w-full' />
						<Skeleton className='h-8 w-full' />
						<Skeleton className='h-8 w-full' />
						<Skeleton className='h-8 w-full' />
						<Skeleton className='h-8 w-full' />
						<Skeleton className='h-8 w-full' />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export function CreditInformationSkeleton({
	className,
}: {
	className?: string
}) {
	return (
		<Card className={cn('w-full', className)}>
			<CardContent>
				<div className='flex flex-col gap-2'>
					<Skeleton className='h-10 w-full' />
					<Skeleton className='h-10 w-[80%]' />
					<Skeleton className='h-10 w-[60%]' />
					<Skeleton className='h-10 w-[40%]' />
				</div>
			</CardContent>
		</Card>
	)
}
