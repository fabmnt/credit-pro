import { LoginForm } from './components/login-form'
export default function LoginPage() {
	return (
		<div className='flex flex-col items-center justify-center h-screen w-lg mx-auto space-y-8'>
			<h1 className='text-2xl font-bold'>Bienvenido de nuevo</h1>
			<LoginForm />
		</div>
	)
}
