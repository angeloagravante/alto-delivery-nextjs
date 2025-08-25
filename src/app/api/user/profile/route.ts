import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  try {
  const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { firstName, lastName, username } = body || {}

    // Only send provided fields
    const payload: Record<string, string> = {}
    if (typeof firstName === 'string' && firstName.trim()) payload.firstName = firstName.trim()
    if (typeof lastName === 'string' && lastName.trim()) payload.lastName = lastName.trim()
    if (typeof username === 'string' && username.trim()) payload.username = username.trim()

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ ok: true, skipped: true })
    }

  const client = await clerkClient()
  await client.users.updateUser(userId, payload)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Profile update failed:', err)
    return NextResponse.json({ error: 'Profile update failed' }, { status: 500 })
  }
}
