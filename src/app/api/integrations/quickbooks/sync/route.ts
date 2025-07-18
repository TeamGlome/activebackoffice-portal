import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/auth'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../../lib/auth'
import { QB_CONFIG } from '../../../../../lib/quickbooks-config'

async function getCurrentUser(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return null

    return await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { entity: true }
    })
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

async function refreshTokenIfNeeded(integration: any) {
  if (!integration.tokenExpiresAt || !integration.refreshToken) {
    return integration
  }

  const expiresAt = new Date(integration.tokenExpiresAt)
  const now = new Date()

  // Refresh if expires within 30 minutes
  if (expiresAt.getTime() - now.getTime() < 30 * 60 * 1000) {
    try {
      const refreshResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${QB_CONFIG.CLIENT_ID}:${QB_CONFIG.CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: integration.refreshToken
        })
      })

      if (refreshResponse.ok) {
        const tokens = await refreshResponse.json()

        // Update integration with new tokens
        const updatedIntegration = await prisma.quickBooksIntegration.update({
          where: { id: integration.id },
          data: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || integration.refreshToken,
            tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000)
          }
        })

        return updatedIntegration
      } else {
        console.error('Token refresh failed:', await refreshResponse.text())
        // Mark integration as expired
        await prisma.quickBooksIntegration.update({
          where: { id: integration.id },
          data: { status: 'EXPIRED' }
        })
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
    }
  }

  return integration
}

async function fetchQuickBooksData(endpoint: string, integration: any) {
  const response = await fetch(
    `${QB_CONFIG.BASE_URL}/v3/company/${integration.companyId}/${endpoint}`,
    {
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
        'Accept': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`QuickBooks API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized - no valid session', success: false },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const entity_id = searchParams.get('entity_id')

    // Validate entity access
    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'

    if (!isPlatformAdmin && entity_id !== currentUser.entityId) {
      return NextResponse.json(
        { error: 'Cannot access QuickBooks data for other entities', success: false },
        { status: 403 }
      )
    }

    const finalEntityId = entity_id || currentUser.entityId

    // Get integration for entity
    const integration = await prisma.quickBooksIntegration.findUnique({
      where: { entityId: finalEntityId }
    })

    if (!integration) {
      return NextResponse.json({
        connected: false,
        error: 'No QuickBooks integration found for this entity',
        success: false
      })
    }

    if (integration.status !== 'CONNECTED') {
      return NextResponse.json({
        connected: false,
        error: `QuickBooks integration status: ${integration.status}`,
        success: false
      })
    }

    // Return connection status and company info
    const companyInfo = integration.companyInfo ? {
      companyName: integration.companyInfo?.CompanyName || 'Unknown',
      address: integration.companyInfo?.CompanyAddr?.Line1 || '',
      phone: integration.companyInfo?.PrimaryPhone?.FreeFormNumber || '',
      email: integration.companyInfo?.Email?.Address || ''
    } : null

    return NextResponse.json({
      connected: true,
      company_info: companyInfo,
      last_sync: integration.lastSyncAt?.toISOString() || null,
      sync_results: integration.lastSyncStatus === 'success' ? {
        customers: 0, // Would be populated from actual sync data
        vendors: 0,
        items: 0,
        transactions: 0,
        last_sync: integration.lastSyncAt?.toISOString() || '',
        errors: integration.syncErrors || []
      } : null,
      success: true
    })
  } catch (error) {
    console.error('Error getting QuickBooks sync status:', error)
    return NextResponse.json(
      {
        connected: false,
        error: 'Failed to get sync status',
        success: false
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized - no valid session', success: false },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { entity_id, sync_type = 'full' } = body

    // Validate entity access
    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'

    if (!isPlatformAdmin && entity_id !== currentUser.entityId) {
      return NextResponse.json(
        { error: 'Cannot sync QuickBooks data for other entities', success: false },
        { status: 403 }
      )
    }

    const finalEntityId = entity_id || currentUser.entityId

    // Get integration for entity
    const integration = await prisma.quickBooksIntegration.findUnique({
      where: { entityId: finalEntityId }
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'No QuickBooks integration found for this entity', success: false },
        { status: 404 }
      )
    }

    if (integration.status !== 'CONNECTED') {
      return NextResponse.json(
        { error: `Cannot sync: QuickBooks integration status is ${integration.status}`, success: false },
        { status: 400 }
      )
    }

    // Refresh token if needed
    const refreshedIntegration = await refreshTokenIfNeeded(integration)

    if (refreshedIntegration.status === 'EXPIRED') {
      return NextResponse.json(
        { error: 'QuickBooks integration has expired. Please reconnect.', success: false },
        { status: 401 }
      )
    }

    const syncResults = {
      customers: 0,
      vendors: 0,
      items: 0,
      transactions: 0,
      last_sync: new Date().toISOString(),
      errors: [] as string[]
    }

    try {
      // Sync Customers
      try {
        const customersData = await fetchQuickBooksData('customers', refreshedIntegration)
        const customers = customersData.QueryResponse?.Customer || []
        syncResults.customers = customers.length
        console.log(`Synced ${customers.length} customers for entity ${finalEntityId}`)
      } catch (error) {
        syncResults.errors.push(`Failed to sync customers: ${error}`)
      }

      // Sync Vendors
      try {
        const vendorsData = await fetchQuickBooksData('vendors', refreshedIntegration)
        const vendors = vendorsData.QueryResponse?.Vendor || []
        syncResults.vendors = vendors.length
        console.log(`Synced ${vendors.length} vendors for entity ${finalEntityId}`)
      } catch (error) {
        syncResults.errors.push(`Failed to sync vendors: ${error}`)
      }

      // Sync Items
      try {
        const itemsData = await fetchQuickBooksData('items', refreshedIntegration)
        const items = itemsData.QueryResponse?.Item || []
        syncResults.items = items.length
        console.log(`Synced ${items.length} items for entity ${finalEntityId}`)
      } catch (error) {
        syncResults.errors.push(`Failed to sync items: ${error}`)
      }

      // Sync Recent Transactions (last 30 days)
      try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const dateFilter = thirtyDaysAgo.toISOString().split('T')[0]

        let totalTransactions = 0
        const transactionTypes = ['invoice', 'payment', 'bill', 'expense']

        for (const txnType of transactionTypes) {
          try {
            const query = `SELECT * FROM ${txnType} WHERE TxnDate >= '${dateFilter}' MAXRESULTS 100`
            const txnData = await fetchQuickBooksData(`query?query=${encodeURIComponent(query)}`, refreshedIntegration)
            const capitalizedType = txnType.charAt(0).toUpperCase() + txnType.slice(1)
            const transactions = txnData.QueryResponse?.[capitalizedType] || []
            totalTransactions += transactions.length
          } catch (error) {
            syncResults.errors.push(`Failed to sync ${txnType}: ${error}`)
          }
        }

        syncResults.transactions = totalTransactions
        console.log(`Synced ${totalTransactions} transactions for entity ${finalEntityId}`)
      } catch (error) {
        syncResults.errors.push(`Failed to sync transactions: ${error}`)
      }

      // Update integration with sync results
      await prisma.quickBooksIntegration.update({
        where: { id: refreshedIntegration.id },
        data: {
          lastSyncAt: new Date(),
          lastSyncStatus: syncResults.errors.length === 0 ? 'success' : 'partial',
          syncErrors: syncResults.errors
        }
      })

      return NextResponse.json({
        sync_results: syncResults,
        success: true,
        message: `Sync completed with ${syncResults.errors.length} errors`
      })

    } catch (error) {
      console.error('Error during QuickBooks sync:', error)

      // Update integration with error status
      await prisma.quickBooksIntegration.update({
        where: { id: refreshedIntegration.id },
        data: {
          lastSyncAt: new Date(),
          lastSyncStatus: 'error',
          syncErrors: [`Sync failed: ${error}`]
        }
      })

      return NextResponse.json(
        { error: 'Failed to sync QuickBooks data', success: false },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error syncing QuickBooks data:', error)
    return NextResponse.json(
      { error: 'Failed to sync QuickBooks data', success: false },
      { status: 500 }
    )
  }
}
