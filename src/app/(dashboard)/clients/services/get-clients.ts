import { db } from '@/db'
import { client } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getClients() {
	const clients = await db.select().from(client)

	return clients
}

export async function getClient(id: string) {
	const [clientData] = await db.select().from(client).where(eq(client.id, id))

	return clientData
}
