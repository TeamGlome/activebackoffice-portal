import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/auth'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../../lib/auth'
import { QB_CONFIG, isQuickBooksConfigured } from '../../../../../lib/quickbooks-config'

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

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized - no valid session', success: false },
        { status: 401 }
      )
    }

    if (!currentUser.entityId) {
      return NextResponse.json(
        { error: 'User must be associated with an entity', success: false },
        { status: 400 }
      )
    }

    if (!isQuickBooksConfigured) {
      return NextResponse.json(
        { error: 'QuickBooks integration is not configured', success: false },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { entity_id } = body

    // Validate entity access
    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'

    if (!isPlatformAdmin && entity_id !== currentUser.entityId) {
      return NextResponse.json(
        { error: 'Cannot initiate QuickBooks connection for other entities', success: false },
        { status: 403 }
      )
    }

    const finalEntityId = entity_id || currentUser.entityId

    // Check if integration already exists
    let integration = await prisma.quickBooksIntegration.findUnique({
      where: { entityId: finalEntityId }
    })

    if (integration && integration.status === 'CONNECTED') {
      return NextResponse.json(
        { error: 'QuickBooks is already connected for this entity', success: false },
        { status: 400 }
      )
    }

    // Create or update integration record
    if (!integration) {
      integration = await prisma.quickBooksIntegration.create({
        data: {
          entityId: finalEntityId,
          status: 'CONNECTING',
          isActive: true
        }
      })
    } else {
      integration = await prisma.quickBooksIntegration.update({
        where: { id: integration.id },
        data: { status: 'CONNECTING' }
      })
    }

    // Generate state parameter for security
    const state = Buffer.from(JSON.stringify({
      entity_id: finalEntityId,
      user_id: currentUser.id,
      integration_id: integration.id,
      timestamp: Date.now()
    })).toString('base64')

    // Build QuickBooks OAuth URL
    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
    authUrl.searchParams.append('client_id', QB_CONFIG.CLIENT_ID)
    authUrl.searchParams.append('scope', QB_CONFIG.SCOPE)
    authUrl.searchParams.append('redirect_uri', QB_CONFIG.REDIRECT_URI)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('access_type', 'offline')
    authUrl.searchParams.append('state', state)

    console.log('🚀 Generated QuickBooks OAuth URL:', {
      client_id: QB_CONFIG.CLIENT_ID ? 'SET' : 'MISSING',
      redirect_uri: QB_CONFIG.REDIRECT_URI,
      scope: QB_CONFIG.SCOPE,
      state_length: state.length,
      full_url: authUrl.toString()
    })

    return NextResponse.json({
      authorization_url: authUrl.toString(),
      state,
      success: true,
      debug_info: {
        client_id_set: !!QB_CONFIG.CLIENT_ID,
        redirect_uri: QB_CONFIG.REDIRECT_URI,
        scope: QB_CONFIG.SCOPE
      }
    })
  } catch (error) {
    console.error('Error initiating QuickBooks connection:', error)
    return NextResponse.json(
      { error: 'Failed to initiate QuickBooks connection', success: false },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized - no valid session', success: false },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { entity_id } = body

    // Validate entity access
    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'

    if (!isPlatformAdmin && entity_id !== currentUser.entityId) {
      return NextResponse.json(
        { error: 'Cannot disconnect QuickBooks for other entities', success: false },
        { status: 403 }
      )
    }

    const finalEntityId = entity_id || currentUser.entityId

    // Find and disconnect integration
    const integration = await prisma.quickBooksIntegration.findUnique({
      where: { entityId: finalEntityId }
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'No QuickBooks integration found for this entity', success: false },
        { status: 404 }
      )
    }

    // Update integration to disconnected state
    await prisma.quickBooksIntegration.update({
      where: { id: integration.id },
      data: {
        status: 'DISCONNECTED',
        accessToken: null,
        refreshToken: null,
        tokenExpiresAt: null,
        companyId: null,
        companyInfo: null,
        lastSyncAt: null,
        lastSyncStatus: null,
        syncErrors: []
      }
    })

    console.log(`QuickBooks disconnected for entity: ${finalEntityId}`)

    return NextResponse.json({
      success: true,
      message: 'QuickBooks integration disconnected successfully'
    })
  } catch (error) {
    console.error('Error disconnecting QuickBooks:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect QuickBooks', success: false },
      { status: 500 }
    )
  }
}
