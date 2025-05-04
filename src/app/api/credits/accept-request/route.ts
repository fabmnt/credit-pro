import { creditRequestSchema } from '@/app/(dashboard)/credits/schema'
import { db } from '@/db'
import { credit } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const body = await request.json()
	const { success, data, error } = creditRequestSchema.safeParse(body)

	if (!success) {
		return NextResponse.json({ error: error.errors.map((e) => e.message).join('. ') }, { status: 400 })
	}

	const { id } = data

	const creditRequest = await db.query.credit.findFirst({
		where: and(eq(credit.id, id), eq(credit.status, 'pending')),
	})

	if (!creditRequest) {
		return NextResponse.json({ error: 'Crédito no encontrado o ya ha sido aceptado' }, { status: 404 })
	}

	const updatedCredit = await db.update(credit).set({ status: 'active' }).where(eq(credit.id, id))

	return NextResponse.json({ message: 'Crédito aceptado correctamente' }, { status: 200 })
}
