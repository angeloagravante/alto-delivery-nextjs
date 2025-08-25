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
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true, email: true } } }
  })
  return NextResponse.json(stores)
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { storeId, action } = await req.json().catch(() => ({})) as { storeId?: string; action?: 'approve'|'disable'|'enable' }
  if (!storeId || !action) return NextResponse.json({ error: 'storeId and action are required' }, { status: 400 })

  if (action === 'approve') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = await (prisma.store as any).update({ where: { id: storeId }, data: { isApproved: true } })
    return NextResponse.json({ id: s.id, isApproved: true })
  }
  if (action === 'disable') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = await (prisma.store as any).update({ where: { id: storeId }, data: { isActive: false } })
    return NextResponse.json({ id: s.id, isActive: false })
  }
  if (action === 'enable') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = await (prisma.store as any).update({ where: { id: storeId }, data: { isActive: true } })
    return NextResponse.json({ id: s.id, isActive: true })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
