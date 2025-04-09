import { Loader } from 'lucide-react'

export default function NewCreditLoading() {
	return (
		<div className='w-full min-h-screen grid place-content-center'>
			<span className='inline-flex text-lg items-center gap-2'>
				<span>Cargando...</span>
				<Loader className='size-4 animate-spin' />
			</span>
		</div>
	)
}
