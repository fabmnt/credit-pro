import { db } from '@/db'
import { client } from '@/db/schema'

export async function getClients() {
	const clients = await db.select().from(client)

	return clients
}
