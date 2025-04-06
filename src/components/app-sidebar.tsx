'use client'

import { CreditCard, Home, Loader, LogOut, PieChart, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth-client'
import { useMutation } from '@tanstack/react-query'
export function AppSidebar() {
	const pathname = usePathname()
	const router = useRouter()
	const { mutateAsync: signOut, isPending } = useMutation({
		mutationFn: async () => {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push('/login')
					},
				},
			})
		},
	})

	const navItems = [
		{
			title: 'Inicio',
			icon: Home,
			href: '/',
			isActive: (path: string) => path === '/',
		},
		{
			title: 'Clientes',
			icon: Users,
			href: '/clients',
			isActive: (path: string) => path.startsWith('/clients'),
		},
		{
			title: 'Créditos',
			icon: CreditCard,
			href: '/credits',
			isActive: (path: string) => path.startsWith('/credits'),
		},
		{
			title: 'Reportes',
			icon: PieChart,
			href: '/reports',
			isActive: (path: string) => path.startsWith('/reports'),
		},
	]

	return (
		<Sidebar className='border-r'>
			<SidebarHeader>
				<div className='flex h-14 items-center px-4'>
					<Link
						href='/'
						className='flex items-center gap-2 font-semibold'
					>
						<CreditCard className='h-6 w-6 text-primary' />
						<span className='text-xl'>CreditPro</span>
					</Link>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{navItems.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								isActive={item.isActive(pathname)}
							>
								<Link
									href={item.href}
									prefetch
								>
									<item.icon className='h-5 w-5' />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<div className='flex flex-col gap-4 py-4'>
					<Button
						variant='outline'
						disabled={isPending}
						className='cursor-pointer flex items-center justify-start gap-2 w-full'
						onClick={() => signOut()}
					>
						<LogOut className='h-4 w-4' />
						{isPending ? <span>Cerrando sesión...</span> : <span>Cerrar sesión</span>}
						{isPending && <Loader className='h-4 w-4 animate-spin' />}
					</Button>
					<p className='text-xs text-muted-foreground'>© 2025 CreditPro</p>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
