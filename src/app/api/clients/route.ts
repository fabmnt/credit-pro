import { db } from '@/db'
import { client } from '@/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const clients = await db.select().from(client).orderBy(client.name)

		return NextResponse.json(clients)
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
	}
}
