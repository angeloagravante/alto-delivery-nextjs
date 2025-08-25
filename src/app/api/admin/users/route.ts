import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const user = await currentUser()
  if (!user) return null
  const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } }) as (| { role?: 'ADMIN'|'OWNER'|'CUSTOMER' } | null)
  if (dbUser?.role !== 'ADMIN') return null
  return dbUser
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Return full user objects; cast to allow reading role/onboarded in code that consumes this API
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } }) as Array<{
    id: string; clerkId: string; name?: string | null; email: string; imageUrl?: string | null; role?: 'ADMIN'|'OWNER'|'CUSTOMER'; onboarded?: boolean; createdAt: Date
  }>
  return NextResponse.json(users)
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId, role } = await req.json().catch(() => ({})) as { userId?: string, role?: 'CUSTOMER'|'OWNER'|'ADMIN' }
  if (!userId || !role) return NextResponse.json({ error: 'userId and role are required' }, { status: 400 })
  if (role === 'ADMIN') return NextResponse.json({ error: 'Cannot grant ADMIN via API' }, { status: 400 })

  // Cast to any to avoid Prisma type issues in environments where the generated types lag
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updated = await (prisma.user as any).update({ where: { id: userId }, data: { role } })
  return NextResponse.json({ id: updated.id, role })
}
