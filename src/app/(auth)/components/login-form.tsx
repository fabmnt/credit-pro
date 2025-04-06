'use client'

import { login } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
export function LoginForm() {
	const [state, formAction, isPending] = useActionState(login, {
		error: null,
		message: null,
		data: null,
	})

	const router = useRouter()

	useEffect(() => {
		if (state.error) {
			toast.error(state.error)
		}
		if (state.message) {
			toast.success(state.message)
			router.push('/')
		}
	}, [state, router])

	return (
		<Form
			action={formAction}
			className='space-y-10 w-full'
		>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='login-email'>Email</Label>
					<Input
						required
						id='login-email'
						type='email'
						placeholder='Email'
						name='email'
						disabled={isPending}
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='login-password'>Password</Label>
					<Input
						required
						id='login-password'
						type='password'
						placeholder='Password'
						name='password'
						disabled={isPending}
					/>
				</div>
				<div>
					<p>
						¿No tienes una cuenta?{' '}
						<Link
							href='/register'
							className='font-bold underline'
						>
							Regístrate
						</Link>
					</p>
				</div>
			</div>
			<Button
				className='w-full'
				type='submit'
				disabled={isPending}
			>
				{isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
				{isPending && <Loader className='h-4 w-4 animate-spin' />}
			</Button>
		</Form>
	)
}
