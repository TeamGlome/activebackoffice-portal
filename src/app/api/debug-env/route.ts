import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check required environment variables
    const envCheck = {
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      SUPABASE_JWT_SECRET: !!process.env.SUPABASE_JWT_SECRET,
      QUICKBOOKS_CLIENT_ID: !!process.env.QUICKBOOKS_CLIENT_ID,
      QUICKBOOKS_CLIENT_SECRET: !!process.env.QUICKBOOKS_CLIENT_SECRET,
      QUICKBOOKS_REDIRECT_URI: !!process.env.QUICKBOOKS_REDIRECT_URI,
      QUICKBOOKS_SANDBOX: !!process.env.QUICKBOOKS_SANDBOX,
    }

    // Show partial values (first 10 chars) for debugging
    const envValues = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
      QUICKBOOKS_REDIRECT_URI: process.env.QUICKBOOKS_REDIRECT_URI || 'NOT_SET',
      QUICKBOOKS_SANDBOX: process.env.QUICKBOOKS_SANDBOX || 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
    }

    console.log('🔍 Environment variables check:', envCheck)
    console.log('📝 Environment values:', envValues)

    return NextResponse.json({
      environmentVariables: envCheck,
      values: envValues,
      allRequired: Object.values(envCheck).every(Boolean),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Environment debug error:', error)
    return NextResponse.json(
      { error: 'Environment debug failed' },
      { status: 500 }
    )
  }
}
