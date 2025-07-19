import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return new Response(`Environment Check:
QUICKBOOKS_CLIENT_ID: ${process.env.QUICKBOOKS_CLIENT_ID ? 'SET' : 'MISSING'}
QUICKBOOKS_CLIENT_SECRET: ${process.env.QUICKBOOKS_CLIENT_SECRET ? 'SET' : 'MISSING'}
QUICKBOOKS_REDIRECT_URI: ${process.env.QUICKBOOKS_REDIRECT_URI || 'NOT_SET'}
QUICKBOOKS_SANDBOX: ${process.env.QUICKBOOKS_SANDBOX || 'NOT_SET'}

Time: ${new Date().toISOString()}
`, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache'
    }
  })
}
