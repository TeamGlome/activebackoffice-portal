import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const envStatus = {
    QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID ? 'SET ✅' : 'MISSING ❌',
    QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET ? 'SET ✅' : 'MISSING ❌',
    QUICKBOOKS_REDIRECT_URI: process.env.QUICKBOOKS_REDIRECT_URI || 'DEFAULT',
    QUICKBOOKS_SANDBOX: process.env.QUICKBOOKS_SANDBOX || 'undefined',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'undefined'
  }

  const isConfigured = !!(process.env.QUICKBOOKS_CLIENT_ID && process.env.QUICKBOOKS_CLIENT_SECRET)

  return Response.json({
    timestamp: new Date().toISOString(),
    environment_status: envStatus,
    is_configured: isConfigured,
    oauth_flow_urls: {
      auth_endpoint: '/api/integrations/quickbooks/auth',
      callback_endpoint: '/api/integrations/quickbooks/callback',
      frontend_page: '/dashboard/integrations/quickbooks'
    },
    next_step: isConfigured
      ? 'Environment configured - test OAuth flow from frontend'
      : 'Add QUICKBOOKS_CLIENT_ID and QUICKBOOKS_CLIENT_SECRET to Vercel'
  })
}
