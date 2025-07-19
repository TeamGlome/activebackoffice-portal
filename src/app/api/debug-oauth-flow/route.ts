import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Check if this is a callback test
    const testCallback = searchParams.get('test_callback')

    if (testCallback === 'true') {
      // Simulate what the callback should receive
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const realmId = searchParams.get('realmId')
      const error = searchParams.get('error')

      return NextResponse.json({
        test_type: 'callback_simulation',
        received_parameters: {
          code: code || 'MISSING',
          state: state || 'MISSING',
          realmId: realmId || 'MISSING',
          error: error || 'NONE'
        },
        parameter_analysis: {
          has_required_params: !!(code && state && realmId),
          missing_params: [
            !code && 'code',
            !state && 'state',
            !realmId && 'realmId'
          ].filter(Boolean)
        },
        callback_url_format: 'https://app.activebackoffice.com/api/integrations/quickbooks/callback?code=AUTH_CODE&state=BASE64_STATE&realmId=QB_COMPANY_ID',
        next_steps: !!(code && state && realmId)
          ? ['Parameters look good', 'Check state decoding', 'Verify integration exists']
          : ['QuickBooks not sending required parameters', 'Check OAuth URL configuration', 'Verify app settings in Intuit dashboard']
      })
    }

    // Default: Show OAuth flow debug info
    return NextResponse.json({
      test_type: 'oauth_flow_debug',
      environment: {
        QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID ? 'SET ✅' : 'MISSING ❌',
        QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET ? 'SET ✅' : 'MISSING ❌',
        QUICKBOOKS_REDIRECT_URI: process.env.QUICKBOOKS_REDIRECT_URI,
        QUICKBOOKS_SANDBOX: process.env.QUICKBOOKS_SANDBOX
      },
      oauth_endpoints: {
        intuit_oauth_url: 'https://appcenter.intuit.com/connect/oauth2',
        app_auth_endpoint: '/api/integrations/quickbooks/auth',
        app_callback_endpoint: '/api/integrations/quickbooks/callback',
        frontend_page: '/dashboard/integrations/quickbooks'
      },
      test_urls: {
        'Check environment': '/api/check-qb-env',
        'Test callback params': '/api/debug-oauth-flow?test_callback=true&code=test123&state=dGVzdA==&realmId=123456',
        'Test auth endpoint': '/api/integrations/quickbooks/auth'
      },
      troubleshooting_steps: [
        '1. Verify environment variables are set in Vercel',
        '2. Check QuickBooks app redirect URI matches exactly',
        '3. Test OAuth initiation from frontend',
        '4. Check browser network tab during OAuth flow',
        '5. Look for JavaScript errors in browser console'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, test_data } = body

    if (action === 'test_state_decode') {
      const { state } = test_data

      try {
        const decoded = JSON.parse(Buffer.from(state, 'base64').toString())
        return NextResponse.json({
          success: true,
          decoded_state: decoded,
          message: 'State decoded successfully'
        })
      } catch (e) {
        return NextResponse.json({
          success: false,
          error: 'Failed to decode state',
          details: e instanceof Error ? e.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      error: 'Unknown action',
      available_actions: ['test_state_decode']
    })

  } catch (error) {
    return NextResponse.json({
      error: 'POST request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
