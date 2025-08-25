import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
type Role = 'CUSTOMER' | 'OWNER' | 'ADMIN'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })
  // Try to find existing DB user
  let user = (await prisma.user.findUnique({ where: { clerkId: userId } })) as
    | { id: string; role?: Role; onboarded?: boolean; email?: string }
    | null

  // Lazily create user if missing (webhook might be disabled locally)
  if (!user) {
    try {
      const client = await clerkClient()
      const cu = await client.users.getUser(userId)
      const email = cu.emailAddresses?.find(e => e.id === cu.primaryEmailAddressId)?.emailAddress || ''
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
      const emailLower = email?.toLowerCase()
      const role: Role = adminEmail && emailLower && adminEmail === emailLower ? 'ADMIN' : 'CUSTOMER'
      const onboarded = role === 'ADMIN' ? true : false

      user = (await prisma.user.create({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Prisma Client types may be stale during build in CI
        data: {
          clerkId: userId,
          email,
          name: [cu.firstName, cu.lastName].filter(Boolean).join(' ') || null,
          imageUrl: cu.imageUrl || null,
          role,
          onboarded,
        },
      })) as unknown as { id: string; role?: Role; onboarded?: boolean }
  } catch {
      // If Clerk fetch fails, still respond with defaults
      return Response.json({ role: 'CUSTOMER', onboarded: false })
    }
  }

  return Response.json({ role: user?.role ?? 'CUSTOMER', onboarded: Boolean(user?.onboarded) })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })
  const { role } = (await req.json().catch(() => ({ role: undefined }))) as { role?: Role }
  if (!role || !(['CUSTOMER', 'OWNER'] as Role[]).includes(role)) return new Response('Invalid role', { status: 400 })
  // Prevent downgrading ADMIN via API
  let user = (await prisma.user.findUnique({ where: { clerkId: userId } })) as (| { id: string; role?: Role } | null)
  if (!user) {
    // Create the user lazily if missing
    try {
      const client = await clerkClient()
      const cu = await client.users.getUser(userId)
      const email = cu.emailAddresses?.find(e => e.id === cu.primaryEmailAddressId)?.emailAddress || ''
      user = (await prisma.user.create({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Prisma Client types may be stale during build in CI
        data: {
          clerkId: userId,
          email,
          name: [cu.firstName, cu.lastName].filter(Boolean).join(' ') || null,
          imageUrl: cu.imageUrl || null,
          role: 'CUSTOMER',
          onboarded: false,
        },
      })) as unknown as { id: string; role?: Role }
    } catch {
      return new Response('Unable to create user', { status: 500 })
    }
  }
  if (user.role === 'ADMIN') return new Response('Admin role locked', { status: 403 })
  await prisma.user.update({
    where: { id: user.id },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Prisma Client types may be stale during build in CI
    data: { role, onboarded: true },
  })
  return Response.json({ ok: true })
}
