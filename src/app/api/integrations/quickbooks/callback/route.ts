import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/auth'
import { QB_CONFIG } from '../../../../../lib/quickbooks-config'

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

interface StateData {
  entity_id: string
  user_id: string
  integration_id: string
  timestamp: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Log ALL parameters received for debugging
    const allParams = Object.fromEntries(searchParams.entries())
    console.log('🔍 QuickBooks Callback Debug - All parameters received:', {
      url: request.url,
      params: allParams,
      timestamp: new Date().toISOString()
    })

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const realmId = searchParams.get('realmId')
    const error = searchParams.get('error')

    // Enhanced parameter logging
    console.log('🔍 QuickBooks Callback Debug - Parameter check:', {
      code: code ? `${code.substring(0, 10)}...` : 'MISSING',
      state: state ? `${state.substring(0, 20)}...` : 'MISSING',
      realmId: realmId || 'MISSING',
      error: error || 'NONE',
      hasAllRequired: !!(code && state && realmId)
    })

    // Handle OAuth error
    if (error) {
      console.error('❌ QuickBooks OAuth error received:', error)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=${encodeURIComponent(error)}&debug=oauth_error`
      )
    }

    if (!code || !state || !realmId) {
      console.error('❌ QuickBooks Callback - Missing required parameters:', {
        missing: {
          code: !code,
          state: !state,
          realmId: !realmId
        },
        received_params: allParams,
        environment: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          QB_REDIRECT_URI: QB_CONFIG.REDIRECT_URI,
          QB_CLIENT_ID: QB_CONFIG.CLIENT_ID ? 'SET' : 'MISSING'
        }
      })

      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=missing_parameters&debug=callback_debug&missing=${JSON.stringify({code: !code, state: !state, realmId: !realmId})}`
      )
    }

    // Decode and validate state
    let stateData: StateData
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString()) as StateData
      console.log('✅ State decoded successfully:', stateData)
    } catch (e) {
      console.error('❌ Failed to decode state parameter:', {
        state: state,
        error: e instanceof Error ? e.message : 'Unknown error'
      })
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=invalid_state&debug=state_decode_failed`
      )
    }

    // Validate state timestamp (should be within 10 minutes)
    const stateAge = Date.now() - stateData.timestamp
    if (stateAge > 10 * 60 * 1000) {
      console.error('❌ State parameter expired:', {
        stateAge: stateAge,
        ageMinutes: Math.floor(stateAge / (60 * 1000)),
        stateData: stateData
      })
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=expired_state&debug=state_expired`
      )
    }

    // Find the integration record
    const integration = await prisma.quickBooksIntegration.findUnique({
      where: { id: stateData.integration_id }
    })

    if (!integration) {
      console.error('❌ Integration record not found:', {
        integration_id: stateData.integration_id,
        entity_id: stateData.entity_id
      })
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=integration_not_found&debug=no_integration`
      )
    }

    console.log('✅ Found integration record:', {
      id: integration.id,
      entityId: integration.entityId,
      status: integration.status
    })

    // Exchange authorization code for access token
    const tokenPayload = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: QB_CONFIG.REDIRECT_URI
    }

    console.log('🔄 Attempting token exchange with:', {
      endpoint: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
      redirect_uri: QB_CONFIG.REDIRECT_URI,
      client_id: QB_CONFIG.CLIENT_ID ? 'SET' : 'MISSING',
      client_secret: QB_CONFIG.CLIENT_SECRET ? 'SET' : 'MISSING'
    })

    const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${QB_CONFIG.CLIENT_ID}:${QB_CONFIG.CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams(tokenPayload)
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ QuickBooks token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
        config: {
          redirect_uri: QB_CONFIG.REDIRECT_URI,
          client_id_set: !!QB_CONFIG.CLIENT_ID,
          client_secret_set: !!QB_CONFIG.CLIENT_SECRET
        }
      })

      await prisma.quickBooksIntegration.update({
        where: { id: integration.id },
        data: { status: 'ERROR' }
      })

      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=token_exchange_failed&debug=token_error&status=${tokenResponse.status}`
      )
    }

    const tokens = await tokenResponse.json() as TokenResponse
    console.log('✅ Token exchange successful')

    // Get company info from QuickBooks
    let companyInfo = null
    try {
      const companyInfoResponse = await fetch(
        `${QB_CONFIG.BASE_URL}/v3/company/${realmId}/companyinfo/${realmId}`,
        {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Accept': 'application/json'
          }
        }
      )

      if (companyInfoResponse.ok) {
        const companyData = await companyInfoResponse.json()
        companyInfo = companyData.QueryResponse?.CompanyInfo?.[0] || null
        console.log('✅ Company info retrieved:', companyInfo?.CompanyName)
      }
    } catch (e) {
      console.warn('⚠️ Failed to fetch company info:', e)
    }

    // Update integration with credentials and company info
    await prisma.quickBooksIntegration.update({
      where: { id: integration.id },
      data: {
        status: 'CONNECTED',
        companyId: realmId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        companyInfo: companyInfo ? JSON.parse(JSON.stringify(companyInfo)) : null,
        lastSyncStatus: null,
        syncErrors: []
      }
    })

    console.log('🎉 QuickBooks integration completed successfully:', {
      entity_id: stateData.entity_id,
      company_id: realmId,
      company_name: companyInfo?.CompanyName,
      integration_id: integration.id
    })

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?success=connected&company=${encodeURIComponent(companyInfo?.CompanyName || 'Unknown')}`
    )

  } catch (error) {
    console.error('💥 Error handling QuickBooks OAuth callback:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=callback_failed&debug=exception`
    )
  }
}
