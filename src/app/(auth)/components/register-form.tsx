'use client'

import { register } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
export function RegisterForm() {
	const [state, formAction, isPending] = useActionState(register, {
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
					<Label htmlFor='register-name'>Nombre</Label>
					<Input
						type='text'
						placeholder='Nombre'
						name='name'
						required
						id='register-name'
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
					/>
				</div>
			</div>
			<Button
				className='w-full'
				type='submit'
				disabled={isPending}
			>
				{isPending ? 'Registrando...' : 'Registrar'}
			</Button>
		</Form>
	)
}
