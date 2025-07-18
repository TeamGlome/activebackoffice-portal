import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debugging session...')

    // Check session
    const session = await getServerSession(authOptions)
    console.log('Session data:', session)

    // Check cookies
    const cookies = request.cookies.getAll()
    console.log('Request cookies:', cookies.map(c => ({ name: c.name, value: c.value?.substring(0, 20) + '...' })))

    // Check headers
    const authHeader = request.headers.get('authorization')
    console.log('Auth header:', authHeader?.substring(0, 20) + '...')

    return NextResponse.json({
      hasSession: !!session,
      sessionUser: session?.user || null,
      cookieCount: cookies.length,
      cookieNames: cookies.map(c => c.name),
      hasAuthHeader: !!authHeader,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug session error:', error)
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
