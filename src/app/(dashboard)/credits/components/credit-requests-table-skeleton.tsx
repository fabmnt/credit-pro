import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Generate skeleton rows with simple indices
const SKELETON_ROWS = Array.from({ length: 5 }, (_, index) => index)

export function CreditRequestsTableSkeleton() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>#</TableHead>
					<TableHead>Crédito Total</TableHead>
					<TableHead>Monto</TableHead>
					<TableHead>Tasa de Interés</TableHead>
					<TableHead>Plazo (meses)</TableHead>
					<TableHead>Frecuencia</TableHead>
					<TableHead>Creado</TableHead>
					<TableHead className='text-right'>Acciones</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{SKELETON_ROWS.map((id) => (
					<TableRow key={id}>
						<TableCell>
							<Skeleton className='h-8 w-[8ch]' />
						</TableCell>
						<TableCell colSpan={7}>
							<Skeleton className='h-8 w-full' />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
