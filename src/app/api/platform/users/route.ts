import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/auth'
import bcrypt from 'bcryptjs'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../lib/auth'

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
    const entityId = searchParams.get('entityId')
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build where clause for filtering with entity isolation
    const where: any = {}

    // Entity-based data isolation
    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'

    if (isPlatformAdmin) {
      // Platform admins can see all users, optionally filtered by entity
      if (entityId && entityId !== 'all') {
        where.entityId = entityId
      }
    } else {
      // Regular users can only see users from their own entity
      where.entityId = currentUser.entityId
    }

    if (role && role !== 'all') {
      // Map frontend role to database enum
      const roleMap: Record<string, string> = {
        'user': 'USER',
        'admin': 'ADMIN',
        'super_admin': 'SUPER_ADMIN'
      }
      where.role = roleMap[role] || 'USER'
    }

    if (status && status !== 'all') {
      where.isActive = status === 'active'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    console.log('User query where clause:', JSON.stringify(where, null, 2))

    // Fetch users from database
    const users = await prisma.user.findMany({
      where,
      include: {
        entity: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get entities for dropdown (filtered by access)
    const entitiesWhere = isPlatformAdmin ? {} : { id: currentUser.entityId || undefined }
    const entities = await prisma.entity.findMany({
      where: entitiesWhere,
      select: {
        id: true,
        name: true
      }
    })

    // Calculate summary stats (only for accessible users)
    const allAccessibleUsers = await prisma.user.findMany({
      where: isPlatformAdmin ? {} : { entityId: currentUser.entityId }
    })

    const stats = {
      total: allAccessibleUsers.length,
      active: allAccessibleUsers.filter(u => u.isActive).length,
      inactive: allAccessibleUsers.filter(u => !u.isActive).length,
      admins: allAccessibleUsers.filter(u => u.platformRole === 'PLATFORM_ADMIN' || u.platformRole === 'PLATFORM_SUPER_ADMIN').length,
      managers: allAccessibleUsers.filter(u => u.role === 'ADMIN').length
    }

    // Transform data to match frontend interface
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.toLowerCase() || 'user',
      platformRole: user.platformRole?.toLowerCase().replace('platform_', '') || 'user',
      entityId: user.entityId,
      entityName: user.entity?.name || 'No Entity',
      isActive: user.isActive,
      lastLogin: user.lastLogin?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }))

    return NextResponse.json({
      users: transformedUsers,
      entities: entities,
      stats,
      currentUser: {
        id: currentUser.id,
        entityId: currentUser.entityId,
        isPlatformAdmin: isPlatformAdmin
      },
      success: true
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', success: false },
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

    // Check if user has permission to create users
    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'
    const isEntityAdmin = currentUser.role === 'ADMIN'

    if (!isPlatformAdmin && !isEntityAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create users', success: false },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log('Creating user with data:', JSON.stringify(body, null, 2))

    // Validate entity access
    if (body.entityId) {
      if (!isPlatformAdmin && body.entityId !== currentUser.entityId) {
        return NextResponse.json(
          { error: 'Cannot create users for other entities', success: false },
          { status: 403 }
        )
      }

      const entityExists = await prisma.entity.findUnique({
        where: { id: body.entityId }
      })
      if (!entityExists) {
        return NextResponse.json(
          { error: 'Selected entity does not exist', success: false },
          { status: 400 }
        )
      }
    }

    // If not platform admin, force entity assignment to current user's entity
    const finalEntityId = isPlatformAdmin ? body.entityId : currentUser.entityId

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })

    if (existingUser) {
      console.log('User already exists:', body.email)
      return NextResponse.json(
        { error: 'User with this email already exists', success: false },
        { status: 400 }
      )
    }

    // Hash password
    const password = body.password || 'temp123!'
    const hashedPassword = await bcrypt.hash(password, 12)

    // Map frontend values to Prisma enum values
    const mapRole = (role: string) => {
      const mapped = (() => {
        switch (role?.toLowerCase()) {
          case 'user': return 'USER'
          case 'admin': return 'ADMIN'
          case 'super_admin': return 'SUPER_ADMIN'
          default: return 'USER'
        }
      })()
      return mapped
    }

    const mapPlatformRole = (platformRole: string) => {
      // Only platform admins can assign platform roles
      if (!isPlatformAdmin) return null

      const mapped = (() => {
        switch (platformRole?.toLowerCase()) {
          case 'admin': return 'PLATFORM_ADMIN'
          case 'super_admin': return 'PLATFORM_SUPER_ADMIN'
          default: return null
        }
      })()
      return mapped
    }

    const userData = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: mapRole(body.role),
      platformRole: mapPlatformRole(body.platformRole),
      entityId: finalEntityId,
      isActive: body.isActive !== undefined ? body.isActive : true
    }

    console.log('Creating user with processed data:', JSON.stringify(userData, null, 2))

    const newUser = await prisma.user.create({
      data: userData,
      include: {
        entity: true
      }
    })

    console.log('User created successfully:', newUser.id)

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role?.toLowerCase() || 'user',
        platformRole: newUser.platformRole?.toLowerCase().replace('platform_', '') || 'user',
        entityId: newUser.entityId,
        entityName: newUser.entity?.name || 'No Entity',
        isActive: newUser.isActive,
        lastLogin: newUser.lastLogin?.toISOString() || null,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString()
      },
      success: true
    })
  } catch (error) {
    console.error('Detailed error creating user:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create user',
        details: error instanceof Error ? error.stack : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}
