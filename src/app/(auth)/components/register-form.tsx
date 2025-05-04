'use client'

import { register } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from 'lucide-react'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
export function RegisterForm() {
	const [state, formAction, isPending] = useActionState(register, {
		error: '',
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
					<Label htmlFor='register-name'>Nombre</Label>
					<Input
						type='text'
						placeholder='Nombre'
						name='name'
						required
						id='register-name'
						disabled={isPending}
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='register-email'>Email</Label>
					<Input
						type='email'
						placeholder='Email'
						name='email'
						required
						id='register-email'
						disabled={isPending}
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='register-password'>Password</Label>
					<Input
						type='password'
						placeholder='Password'
						name='password'
						required
						id='register-password'
						disabled={isPending}
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='register-confirm-password'>Confirm Password</Label>
					<Input
						type='password'
						placeholder='Confirm Password'
						name='confirmPassword'
						required
						id='register-confirm-password'
						disabled={isPending}
					/>
				</div>
			</div>
			<Button
				className='w-full'
				type='submit'
				disabled={isPending}
			>
				{isPending ? 'Registrando...' : 'Registrar'}
				{isPending && <Loader className='h-4 w-4 animate-spin' />}
			</Button>
		</Form>
	)
}
