export type StandardResponse<T> = {
	data: T | null
} & ({ message: string; error: null } | { message: null; error: string })
