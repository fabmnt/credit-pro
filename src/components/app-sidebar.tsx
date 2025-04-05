'use client'

import { CreditCard, Home, PieChart, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

export function AppSidebar() {
	const pathname = usePathname()

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
				<div className='p-4 flex items-center justify-between'>
					<p className='text-xs text-muted-foreground'>© 2025 CreditPro</p>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
