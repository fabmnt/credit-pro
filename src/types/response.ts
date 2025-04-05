export type StandardResponse<T> = {
	message: string | null
	error: string | null
	data: T | null
}
