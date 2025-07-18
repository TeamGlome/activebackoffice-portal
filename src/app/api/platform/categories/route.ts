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

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const isPlatformAdmin = currentUser.platformRole === 'PLATFORM_ADMIN' ||
                           currentUser.platformRole === 'PLATFORM_SUPER_ADMIN'

    // Build where clause - get platform-wide categories and entity-specific ones
    const where: any = {
      isActive: true,
      OR: [
        { entityId: null }, // Platform-wide categories
        ...(currentUser.entityId ? [{ entityId: currentUser.entityId }] : [])
      ]
    }

    if (type) {
      where.type = type
    }

    const categories = await prisma.entityCategory.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { category: 'asc' }
      ]
    })

    // Group by type for easier frontend consumption
    const categoriesByType: Record<string, string[]> = {}
    categories.forEach(cat => {
      if (!categoriesByType[cat.type]) {
        categoriesByType[cat.type] = []
      }
      if (!categoriesByType[cat.type].includes(cat.category)) {
        categoriesByType[cat.type].push(cat.category)
      }
    })

    return NextResponse.json({
      categories: categoriesByType,
      rawCategories: categories,
      currentUser: {
        id: currentUser.id,
        entityId: currentUser.entityId,
        isPlatformAdmin: isPlatformAdmin
      },
      success: true
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', success: false },
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
        { error: 'Insufficient permissions to create categories', success: false },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { type, category, entityId } = body

    // Validate entity assignment
    const finalEntityId = isPlatformAdmin ? entityId : currentUser.entityId

    if (!isPlatformAdmin && entityId && entityId !== currentUser.entityId) {
      return NextResponse.json(
        { error: 'Cannot create categories for other entities', success: false },
        { status: 403 }
      )
    }

    const newCategory = await prisma.entityCategory.create({
      data: {
        type,
        category,
        entityId: finalEntityId,
        isActive: true
      }
    })

    return NextResponse.json({
      category: newCategory,
      success: true
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category', success: false },
      { status: 500 }
    )
  }
}
