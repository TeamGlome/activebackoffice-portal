import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id
      },
      include: {
        entity: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.toLowerCase() || 'user', // Map back to frontend format
        platformRole: user.platformRole?.toLowerCase().replace('platform_', '') || 'user',
        entityId: user.entityId,
        entityName: user.entity?.name || 'No Entity',
        isActive: user.isActive,
        lastLogin: user.lastLogin?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      },
      success: true
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user', success: false },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      )
    }

    // Check if email is being changed and if it conflicts
    if (body.email && body.email !== existingUser.email) {
      const emailConflict = await prisma.user.findUnique({
        where: { email: body.email }
      })

      if (emailConflict) {
        return NextResponse.json(
          { error: 'Email already in use by another user', success: false },
          { status: 400 }
        )
      }
    }

    // Map frontend values to Prisma enum values
    const mapRole = (role: string) => {
      switch (role?.toLowerCase()) {
        case 'user': return 'USER'
        case 'admin': return 'ADMIN'
        case 'super_admin': return 'SUPER_ADMIN'
        default: return 'USER'
      }
    }

    const mapPlatformRole = (platformRole: string) => {
      switch (platformRole?.toLowerCase()) {
        case 'admin': return 'PLATFORM_ADMIN'
        case 'super_admin': return 'PLATFORM_SUPER_ADMIN'
        default: return null // Make it optional
      }
    }

    // Prepare update data
    const updateData: any = {
      name: body.name,
      email: body.email,
      role: body.role ? mapRole(body.role) : undefined,
      platformRole: body.platformRole ? mapPlatformRole(body.platformRole) : undefined,
      entityId: body.entityId,
      isActive: body.isActive
    }

    // Hash new password if provided
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 12)
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: params.id
      },
      data: updateData,
      include: {
        entity: true
      }
    })

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role?.toLowerCase() || 'user', // Map back to frontend format
        platformRole: updatedUser.platformRole?.toLowerCase().replace('platform_', '') || 'user',
        entityId: updatedUser.entityId,
        entityName: updatedUser.entity?.name || 'No Entity',
        isActive: updatedUser.isActive,
        lastLogin: updatedUser.lastLogin?.toISOString() || null,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString()
      },
      success: true
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user', success: false },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      )
    }

    // Don't allow deleting the last admin
    if (existingUser.platformRole === 'admin') {
      const adminCount = await prisma.user.count({
        where: { platformRole: 'admin', isActive: true }
      })

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last active admin user', success: false },
          { status: 400 }
        )
      }
    }

    await prisma.user.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user', success: false },
      { status: 500 }
    )
  }
}
