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

  // Cast prisma to any to avoid TS lag when generated client types are not yet picked up
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = await (prisma as any).systemConfig.findUnique({ where: { id: 'system' } }).catch(() => null)
  return NextResponse.json(config ?? { id: 'system' })
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({})) as {
    backupSchedule?: string | null
    dataRetentionDays?: number | null
    lastBackupAt?: string | null
  }

  const data: Record<string, unknown> = {}
  if (typeof body.backupSchedule === 'string' || body.backupSchedule === null) data.backupSchedule = body.backupSchedule
  if (typeof body.dataRetentionDays === 'number' || body.dataRetentionDays === null) data.dataRetentionDays = body.dataRetentionDays
  if (typeof body.lastBackupAt === 'string' || body.lastBackupAt === null) data.lastBackupAt = body.lastBackupAt ? new Date(body.lastBackupAt) : null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upserted = await (prisma as any).systemConfig.upsert({
    where: { id: 'system' },
    update: data,
  create: { id: 'system', ...data },
  })

  return NextResponse.json(upserted)
}
