import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/auth'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../../lib/auth'
import { QB_CONFIG, isQuickBooksConfigured } from '../../../../../lib/quickbooks-config'

async function getCurrentUser(request: NextRequest) {
  try {
    console.log('🔍 QB Auth: Getting current user...')

    const session = await getServerSession(authOptions)
    console.log('QB Auth: Session exists:', !!session)
    console.log('QB Auth: Session user:', session?.user ? { id: session.user.id, email: session.user.email } : null)

    if (!session?.user?.id) {
      console.log('❌ QB Auth: No session or user ID found')
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { entity: true }
    })

    console.log('QB Auth: Database user found:', !!user)
    if (user) {
      console.log('QB Auth: User details:', {
        id: user.id,
        email: user.email,
        entityId: user.entityId
      })
    }

    return user
  } catch (error) {
    console.error('❌ QB Auth: Error getting current user:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📥 POST /api/integrations/quickbooks/auth called')

    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      console.log('❌ QB Auth: Unauthorized - no current user')
      return NextResponse.json(
        { error: 'Unauthorized - no valid session', success: false },
        { status: 401 }
      )
    }

    console.log('✅ QB Auth: Authorized user:', currentUser.email)

    if (!currentUser.entityId) {
      console.log('❌ QB Auth: User has no entity')
      return NextResponse.json(
        { error: 'User must be associated with an entity', success: false },
        { status: 400 }
      )
    }

    if (!isQuickBooksConfigured) {
      console.log('❌ QB Auth: QuickBooks not configured')
      return NextResponse.json(
        { error: 'QuickBooks integration is not configured', success: false },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { entity_id } = body

    console.log('QB Auth: Request body:', { entity_id })

    // Validate entity access
    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'

    if (!isPlatformAdmin && entity_id !== currentUser.entityId) {
      console.log('❌ QB Auth: Cannot initiate connection for other entities')
      return NextResponse.json(
        { error: 'Cannot initiate QuickBooks connection for other entities', success: false },
        { status: 403 }
      )
    }

    const finalEntityId = entity_id || currentUser.entityId
    console.log('QB Auth: Final entity ID:', finalEntityId)

    // Check if integration already exists
    let integration = await prisma.quickBooksIntegration.findUnique({
      where: { entityId: finalEntityId }
    })

    if (integration && integration.status === 'CONNECTED') {
      console.log('❌ QB Auth: QuickBooks already connected')
      return NextResponse.json(
        { error: 'QuickBooks is already connected for this entity', success: false },
        { status: 400 }
      )
    }

    // Create or update integration record
    if (!integration) {
      console.log('QB Auth: Creating new integration record')
      integration = await prisma.quickBooksIntegration.create({
        data: {
          entityId: finalEntityId,
          status: 'CONNECTING',
          isActive: true
        }
      })
    } else {
      console.log('QB Auth: Updating existing integration record')
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

    console.log('✅ QB Auth: Generated authorization URL')
    console.log('QB Auth: Redirect URI:', QB_CONFIG.REDIRECT_URI)

    return NextResponse.json({
      authorization_url: authUrl.toString(),
      state,
      success: true
    })
  } catch (error) {
    console.error('❌ QB Auth: Error initiating connection:', error)
    return NextResponse.json(
      { error: 'Failed to initiate QuickBooks connection', success: false },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('📥 DELETE /api/integrations/quickbooks/auth called')

    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      console.log('❌ QB Auth: Unauthorized - no current user (DELETE)')
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

    console.log(`✅ QB Auth: QuickBooks disconnected for entity: ${finalEntityId}`)

    return NextResponse.json({
      success: true,
      message: 'QuickBooks integration disconnected successfully'
    })
  } catch (error) {
    console.error('❌ QB Auth: Error disconnecting:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect QuickBooks', success: false },
      { status: 500 }
    )
  }
}
