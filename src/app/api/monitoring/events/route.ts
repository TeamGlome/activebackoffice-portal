import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const { event, properties, userId, timestamp, source } = body

    // Log analytics event to database
    await prisma.analytics.create({
      data: {
        event,
        properties: properties || {},
        userId: userId || session?.user?.id,
        timestamp: new Date(timestamp),
        source: source || 'web',
        sessionId: session?.user?.id,
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || ''
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}
