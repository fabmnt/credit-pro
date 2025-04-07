import { getClient } from '@/app/(dashboard)/clients/services/get-clients'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Briefcase, Building2, Calendar, Flag, Mail, MapPin, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id
	const client = await getClient(id)

	if (!client) {
		notFound()
	}

	return (
		<div className='p-4 space-y-6'>
			<header className='flex justify-between items-center border-b pb-4'>
				<div className='flex items-center gap-x-4'>
					<Link
						href='/clients'
						className='text-muted-foreground hover:text-primary'
					>
						<ArrowLeft className='h-5 w-5' />
					</Link>
					<div>
						<h1 className='text-2xl font-semibold'>{client.name}</h1>
						<p className='text-sm text-muted-foreground'>Detalles del cliente</p>
					</div>
				</div>
			</header>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card className='rounded-sm'>
					<CardHeader>
						<CardTitle className='text-xl'>Información Personal</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
							<div className='flex items-start gap-2'>
								<User className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Nombre</p>
									<p className='text-sm text-muted-foreground'>{client.name}</p>
								</div>
							</div>

							<div className='flex items-start gap-2'>
								<User className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Cédula</p>
									<p className='text-sm text-muted-foreground'>{client.dni}</p>
								</div>
							</div>

							<div className='flex items-start gap-2'>
								<User className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Sexo</p>
									<p className='text-sm text-muted-foreground'>{client.sex}</p>
								</div>
							</div>

							<div className='flex items-start gap-2'>
								<Flag className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Nacionalidad</p>
									<p className='text-sm text-muted-foreground'>{client.nationality}</p>
								</div>
							</div>

							<div className='flex items-start gap-2'>
								<Briefcase className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Profesión</p>
									<p className='text-sm text-muted-foreground'>{client.profession}</p>
								</div>
							</div>

							<div className='flex items-start gap-2'>
								<Calendar className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Fecha de registro</p>
									<p className='text-sm text-muted-foreground'>{formatDate(client.createdAt)}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='rounded-sm'>
					<CardHeader>
						<CardTitle className='text-xl'>Contacto</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
							<div className='flex items-start gap-2'>
								<MapPin className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Ciudad</p>
									<p className='text-sm text-muted-foreground'>{client.city}</p>
								</div>
							</div>

							<div className='flex items-start gap-2'>
								<Phone className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Teléfono</p>
									<p className='text-sm text-muted-foreground'>{client.telephone}</p>
								</div>
							</div>

							<div className='flex items-start gap-2'>
								<Mail className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Email</p>
									<p className='text-sm text-muted-foreground'>{client.email || 'No registrado'}</p>
								</div>
							</div>

							<div className='flex items-start gap-2'>
								<Building2 className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Empresa</p>
									<p className='text-sm text-muted-foreground'>{client.company || 'No registrado'}</p>
								</div>
							</div>

							<div className='flex items-start gap-2 col-span-2'>
								<MapPin className='h-5 w-5 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-sm font-medium'>Dirección</p>
									<p className='text-sm text-muted-foreground'>{client.address}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Credits section can be added here in the future */}
			<Card className='rounded-sm'>
				<CardHeader className='flex flex-row items-center justify-between'>
					<CardTitle className='text-xl'>Créditos</CardTitle>
					<Link
						href={`/credits/new?clientId=${client.id}`}
						className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
					>
						Nuevo Crédito
					</Link>
				</CardHeader>
				<CardContent>
					<div className='text-center py-6 text-muted-foreground'>No hay créditos asociados a este cliente.</div>
					{/* Credits table would go here */}
				</CardContent>
			</Card>
		</div>
	)
}
