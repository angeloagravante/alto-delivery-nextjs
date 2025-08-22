import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Minimal query to validate connectivity; count on a small collection
    const usersCount = await prisma.user.count()
    return NextResponse.json({ ok: true, usersCount })
  } catch (error) {
    console.error('DB health check failed:', error)
    if (error instanceof Error && error.message.includes('replica set')) {
      return NextResponse.json({ ok: false, error: 'MongoDB needs a replica set. Use a MongoDB Atlas connection string.' }, { status: 500 })
    }
    return NextResponse.json({ ok: false, error: 'Database not reachable' }, { status: 500 })
  }
}
