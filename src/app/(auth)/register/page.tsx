import { RegisterForm } from './components/register-form'

export default function RegisterPage() {
	return (
		<div className='flex flex-col items-center justify-center w-lg mx-auto h-screen space-y-10'>
			<h1 className='text-2xl font-bold'>Registrarse</h1>
			<RegisterForm />
		</div>
	)
}
