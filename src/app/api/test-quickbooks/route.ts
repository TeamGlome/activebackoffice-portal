import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simple environment check without imports that might fail
    const envCheck = {
      QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID ? 'SET' : 'MISSING',
      QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET ? 'SET' : 'MISSING',
      QUICKBOOKS_REDIRECT_URI: process.env.QUICKBOOKS_REDIRECT_URI || 'DEFAULT',
      QUICKBOOKS_SANDBOX: process.env.QUICKBOOKS_SANDBOX || 'undefined',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'undefined'
    }

    const response = {
      status: 'QuickBooks Test Endpoint Working',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      callbackUrl: `${process.env.NEXTAUTH_URL || 'https://app.activebackoffice.com'}/api/integrations/quickbooks/callback`,
      diagnosis: {
        configurationComplete: !!(process.env.QUICKBOOKS_CLIENT_ID && process.env.QUICKBOOKS_CLIENT_SECRET),
        missingVars: Object.entries(envCheck)
          .filter(([key, value]) => value === 'MISSING' || value === 'undefined')
          .map(([key]) => key),
        nextSteps: process.env.QUICKBOOKS_CLIENT_ID && process.env.QUICKBOOKS_CLIENT_SECRET
          ? ['Configuration looks good', 'Test OAuth flow from frontend']
          : ['Add QUICKBOOKS_CLIENT_ID to Vercel', 'Add QUICKBOOKS_CLIENT_SECRET to Vercel']
      }
    }

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Test endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
