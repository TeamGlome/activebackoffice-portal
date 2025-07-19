import { NextRequest, NextResponse } from 'next/server'
import { QB_CONFIG, isQuickBooksConfigured } from '../../../lib/quickbooks-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const showSecrets = searchParams.get('secrets') === 'true'

    // Check environment variables
    const envVars = {
      QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID ? 'SET' : 'MISSING',
      QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET ? 'SET' : 'MISSING',
      QUICKBOOKS_REDIRECT_URI: process.env.QUICKBOOKS_REDIRECT_URI || 'DEFAULT',
      QUICKBOOKS_SANDBOX: process.env.QUICKBOOKS_SANDBOX || 'undefined',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'undefined'
    }

    // Show actual values if secrets=true (for debugging only)
    const configValues = showSecrets ? {
      CLIENT_ID: QB_CONFIG.CLIENT_ID,
      CLIENT_SECRET: QB_CONFIG.CLIENT_SECRET ? '***HIDDEN***' : 'EMPTY',
      REDIRECT_URI: QB_CONFIG.REDIRECT_URI,
      BASE_URL: QB_CONFIG.BASE_URL,
      SCOPE: QB_CONFIG.SCOPE
    } : {
      CLIENT_ID: QB_CONFIG.CLIENT_ID ? 'SET' : 'EMPTY',
      CLIENT_SECRET: QB_CONFIG.CLIENT_SECRET ? 'SET' : 'EMPTY',
      REDIRECT_URI: QB_CONFIG.REDIRECT_URI,
      BASE_URL: QB_CONFIG.BASE_URL,
      SCOPE: QB_CONFIG.SCOPE
    }

    // Test OAuth URL construction
    const testState = Buffer.from(JSON.stringify({
      entity_id: 'test-entity',
      user_id: 'test-user',
      integration_id: 'test-integration',
      timestamp: Date.now()
    })).toString('base64')

    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
    authUrl.searchParams.append('client_id', QB_CONFIG.CLIENT_ID)
    authUrl.searchParams.append('scope', QB_CONFIG.SCOPE)
    authUrl.searchParams.append('redirect_uri', QB_CONFIG.REDIRECT_URI)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('access_type', 'offline')
    authUrl.searchParams.append('state', testState)

    return NextResponse.json({
      status: 'QuickBooks Configuration Debug',
      timestamp: new Date().toISOString(),
      isConfigured: isQuickBooksConfigured,
      environmentVariables: envVars,
      configValues: configValues,
      testOAuthUrl: authUrl.toString(),
      callbackEndpoint: `/api/integrations/quickbooks/callback`,
      authEndpoint: `/api/integrations/quickbooks/auth`,
      expectedRedirectUri: QB_CONFIG.REDIRECT_URI,
      troubleshooting: {
        common_issues: [
          'Environment variables not set in deployment',
          'Redirect URI mismatch in QuickBooks app settings',
          'OAuth flow not initiated from correct domain',
          'Missing HTTPS in production environment'
        ],
        next_steps: [
          'Verify QuickBooks app redirect URI matches config',
          'Test OAuth initiation from frontend',
          'Check browser console for JavaScript errors',
          'Verify callback receives parameters'
        ]
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('QuickBooks debug error:', error)
    return NextResponse.json(
      {
        error: 'QuickBooks debug failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { test_callback_params } = body

    // Test callback parameter processing
    if (test_callback_params) {
      const { code, state, realmId } = test_callback_params

      if (!code || !state || !realmId) {
        return NextResponse.json({
          error: 'Missing required parameters',
          received: { code: !!code, state: !!state, realmId: !!realmId },
          message: 'Authorization code, state, and realm ID are required'
        })
      }

      // Test state decoding
      let stateData
      try {
        stateData = JSON.parse(Buffer.from(state, 'base64').toString())
      } catch (e) {
        return NextResponse.json({
          error: 'Invalid state parameter',
          state_received: state,
          decode_error: e instanceof Error ? e.message : 'Unknown error'
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Callback parameters are valid',
        parameters: {
          code: code.substring(0, 10) + '...',
          state_decoded: stateData,
          realmId: realmId
        }
      })
    }

    return NextResponse.json({
      error: 'No test specified',
      available_tests: ['test_callback_params']
    })

  } catch (error) {
    console.error('QuickBooks debug POST error:', error)
    return NextResponse.json(
      {
        error: 'QuickBooks debug test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
