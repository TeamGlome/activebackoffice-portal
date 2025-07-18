import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/auth'
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

    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'

    // Get platform-wide groups and entity-specific ones
    const where: any = {
      isActive: true,
      OR: [
        { entityId: null }, // Platform-wide groups
        ...(currentUser.entityId ? [{ entityId: currentUser.entityId }] : [])
      ]
    }

    const groups = await prisma.userGroup.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      groups: groups,
      currentUser: {
        id: currentUser.id,
        entityId: currentUser.entityId,
        isPlatformAdmin: isPlatformAdmin
      },
      success: true
    })
  } catch (error) {
    console.error('Error fetching user groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user groups', success: false },
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

    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'
    const isEntityAdmin = currentUser.role === 'ADMIN'

    if (!isPlatformAdmin && !isEntityAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create user groups', success: false },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, permissions, entityId } = body

    // Validate entity assignment
    const finalEntityId = isPlatformAdmin ? entityId : currentUser.entityId

    if (!isPlatformAdmin && entityId && entityId !== currentUser.entityId) {
      return NextResponse.json(
        { error: 'Cannot create user groups for other entities', success: false },
        { status: 403 }
      )
    }

    const newGroup = await prisma.userGroup.create({
      data: {
        name,
        description: description || null,
        permissions: permissions || {},
        entityId: finalEntityId,
        isActive: true
      }
    })

    return NextResponse.json({
      group: newGroup,
      success: true
    })
  } catch (error) {
    console.error('Error creating user group:', error)
    return NextResponse.json(
      { error: 'Failed to create user group', success: false },
      { status: 500 }
    )
  }
}
