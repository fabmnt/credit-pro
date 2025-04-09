import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<NuqsAdapter>
			<SidebarProvider>
				<AppSidebar />
				<main className='flex-1'>{children}</main>
				<Toaster />
			</SidebarProvider>
		</NuqsAdapter>
	)
}
