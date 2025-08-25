import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
type Role = 'CUSTOMER' | 'OWNER' | 'ADMIN'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })
    const user = await prisma.user.findUnique({ where: { clerkId: userId } }) as (| { role?: Role; onboarded?: boolean } | null)
    return Response.json({ role: user?.role ?? 'CUSTOMER', onboarded: Boolean(user?.onboarded) })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })
  const { role } = (await req.json().catch(() => ({ role: undefined }))) as { role?: Role }
  if (!role || !(['CUSTOMER', 'OWNER'] as Role[]).includes(role)) return new Response('Invalid role', { status: 400 })
  // Prevent downgrading ADMIN via API
  const user = await prisma.user.findUnique({ where: { clerkId: userId } }) as (| { id: string; role?: Role } | null)
  if (!user) return new Response('Not found', { status: 404 })
  if (user.role === 'ADMIN') return new Response('Admin role locked', { status: 403 })
  await prisma.user.update({ where: { id: user.id }, data: { role, onboarded: true } })
  return Response.json({ ok: true })
}
