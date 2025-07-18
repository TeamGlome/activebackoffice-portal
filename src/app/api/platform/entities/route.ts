import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/auth'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../lib/auth'

async function getCurrentUser(request: NextRequest) {
  try {
    console.log('🔍 Getting current user...')

    // Try to get session
    const session = await getServerSession(authOptions)
    console.log('Session exists:', !!session)
    console.log('Session user:', session?.user ? { id: session.user.id, email: session.user.email } : null)

    if (!session?.user?.id) {
      console.log('❌ No session or user ID found')
      return null
    }

    console.log('🔍 Looking up user in database:', session.user.id)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { entity: true }
    })

    console.log('Database user found:', !!user)
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        entityId: user.entityId,
        platformRole: user.platformRole
      })
    }

    return user
  } catch (error) {
    console.error('❌ Error getting current user:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📥 GET /api/platform/entities called')

    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      console.log('❌ Unauthorized: No current user found')
      return NextResponse.json(
        { error: 'Unauthorized - no valid session', success: false },
        { status: 401 }
      )
    }

    console.log('✅ Authorized user:', currentUser.email)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Entity-based data isolation
    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'

    console.log('User permissions:', {
      isPlatformAdmin,
      entityId: currentUser.entityId,
      platformRole: currentUser.platformRole
    })

    // Build where clause for filtering with entity isolation
    const where: any = {}

    if (!isPlatformAdmin) {
      // Regular users can only see their own entity
      if (currentUser.entityId) {
        where.id = currentUser.entityId
      } else {
        // User has no entity assigned, return empty results
        console.log('⚠️ User has no entity assigned')
        return NextResponse.json({
          entities: [],
          stats: { total: 0, active: 0, trial: 0, suspended: 0, totalRevenue: 0, totalUsers: 0 },
          currentUser: {
            id: currentUser.id,
            entityId: currentUser.entityId,
            isPlatformAdmin: false
          },
          success: true
        })
      }
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } }
      ]
    }

    console.log('Entity query where clause:', JSON.stringify(where, null, 2))

    // Fetch entities from database
    const entities = await prisma.entity.findMany({
      where,
      include: {
        users: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Found entities:', entities.length)

    // Calculate summary stats (only for accessible entities)
    const allAccessibleEntities = await prisma.entity.findMany({
      where: isPlatformAdmin ? {} : { id: currentUser.entityId || undefined },
      include: {
        users: true
      }
    })

    const stats = {
      total: allAccessibleEntities.length,
      active: allAccessibleEntities.filter(e => e.status === 'active').length,
      trial: allAccessibleEntities.filter(e => e.status === 'trial').length,
      suspended: allAccessibleEntities.filter(e => e.status === 'suspended').length,
      totalRevenue: allAccessibleEntities.reduce((sum, e) => sum + (e.monthlyAmount || 0), 0),
      totalUsers: allAccessibleEntities.reduce((sum, e) => sum + (e.users?.length || 0), 0)
    }

    // Transform data to match frontend interface
    const transformedEntities = entities.map(entity => ({
      id: entity.id,
      name: entity.name,
      type: entity.type || 'Property Management',
      status: entity.status,
      subscription_plan: entity.subscriptionPlan || 'starter',
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
      settings: {
        timezone: entity.timezone || 'America/New_York',
        currency: entity.currency || 'USD',
        fiscal_year_start: entity.fiscalYearStart || '01-01'
      },
      billing: {
        monthly_amount: entity.monthlyAmount || 8500
      },
      compliance: {
        score: entity.complianceScore || 75.0,
        last_assessment: entity.lastAssessment?.toISOString() || new Date().toISOString(),
        violations_count: entity.violationsCount || 0
      },
      integrations: entity.integrations || {}
    }))

    console.log('✅ Returning response with', transformedEntities.length, 'entities')

    return NextResponse.json({
      entities: transformedEntities,
      stats,
      currentUser: {
        id: currentUser.id,
        entityId: currentUser.entityId,
        isPlatformAdmin: isPlatformAdmin
      },
      success: true
    })
  } catch (error) {
    console.error('❌ Error fetching entities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entities', success: false },
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

    // Only platform admins can create entities
    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'

    if (!isPlatformAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create entities', success: false },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log('Creating entity with data:', JSON.stringify(body, null, 2))

    const newEntity = await prisma.entity.create({
      data: {
        name: body.name,
        type: body.type,
        status: body.status || 'trial',
        subscriptionPlan: body.subscription_plan || 'starter',
        timezone: body.settings?.timezone || 'America/New_York',
        currency: body.settings?.currency || 'USD',
        fiscalYearStart: body.settings?.fiscal_year_start || '01-01',
        monthlyAmount: body.billing?.monthly_amount || 8500,
        complianceScore: 75.0,
        violationsCount: 0,
        integrations: {}
      }
    })

    console.log('Entity created successfully:', newEntity.id)

    return NextResponse.json({
      entity: {
        id: newEntity.id,
        name: newEntity.name,
        type: newEntity.type,
        status: newEntity.status,
        subscription_plan: newEntity.subscriptionPlan,
        created_at: newEntity.createdAt.toISOString(),
        updated_at: newEntity.updatedAt.toISOString(),
        settings: {
          timezone: newEntity.timezone,
          currency: newEntity.currency,
          fiscal_year_start: newEntity.fiscalYearStart
        },
        billing: {
          monthly_amount: newEntity.monthlyAmount
        },
        compliance: {
          score: newEntity.complianceScore,
          last_assessment: newEntity.lastAssessment?.toISOString() || new Date().toISOString(),
          violations_count: newEntity.violationsCount
        },
        integrations: newEntity.integrations
      },
      success: true
    })
  } catch (error) {
    console.error('Error creating entity:', error)
    return NextResponse.json(
      { error: 'Failed to create entity', success: false },
      { status: 500 }
    )
  }
}
