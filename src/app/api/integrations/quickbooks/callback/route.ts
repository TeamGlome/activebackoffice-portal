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
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const realmId = searchParams.get('realmId')
    const error = searchParams.get('error')

    // Handle OAuth error
    if (error) {
      console.error('QuickBooks OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=${encodeURIComponent(error)}`
      )
    }

    if (!code || !state || !realmId) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=missing_parameters`
      )
    }

    // Decode and validate state
    let stateData: StateData
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString()) as StateData
    } catch {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=invalid_state`
      )
    }

    // Validate state timestamp (should be within 10 minutes)
    const stateAge = Date.now() - stateData.timestamp
    if (stateAge > 10 * 60 * 1000) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=expired_state`
      )
    }

    // Find the integration record
    const integration = await prisma.quickBooksIntegration.findUnique({
      where: { id: stateData.integration_id }
    })

    if (!integration) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=integration_not_found`
      )
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${QB_CONFIG.CLIENT_ID}:${QB_CONFIG.CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: QB_CONFIG.REDIRECT_URI
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('QuickBooks token exchange failed:', errorText)

      await prisma.quickBooksIntegration.update({
        where: { id: integration.id },
        data: { status: 'ERROR' }
      })

      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=token_exchange_failed`
      )
    }

    const tokens = await tokenResponse.json() as TokenResponse

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
      }
    } catch (e) {
      console.warn('Failed to fetch company info:', e)
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

    console.log('QuickBooks integration completed successfully:', {
      entity_id: stateData.entity_id,
      company_id: realmId,
      company_name: companyInfo?.CompanyName
    })

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?success=connected`
    )

  } catch (error) {
    console.error('Error handling QuickBooks OAuth callback:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/integrations/quickbooks?error=callback_failed`
    )
  }
}
