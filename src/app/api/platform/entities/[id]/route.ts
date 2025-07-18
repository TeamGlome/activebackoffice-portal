import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const entity = await prisma.entity.findUnique({
      where: {
        id: params.id
      },
      include: {
        users: true
      }
    })

    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found', success: false },
        { status: 404 }
      )
    }

    // Transform data to match frontend interface
    const transformedEntity = {
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
    }

    return NextResponse.json({
      entity: transformedEntity,
      success: true
    })
  } catch (error) {
    console.error('Error fetching entity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entity', success: false },
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

    const existingEntity = await prisma.entity.findUnique({
      where: { id: params.id }
    })

    if (!existingEntity) {
      return NextResponse.json(
        { error: 'Entity not found', success: false },
        { status: 404 }
      )
    }

    const updatedEntity = await prisma.entity.update({
      where: {
        id: params.id
      },
      data: {
        name: body.name,
        type: body.type,
        status: body.status,
        subscriptionPlan: body.subscription_plan,
        timezone: body.settings?.timezone,
        currency: body.settings?.currency,
        fiscalYearStart: body.settings?.fiscal_year_start,
        monthlyAmount: body.billing?.monthly_amount
      }
    })

    return NextResponse.json({
      entity: {
        id: updatedEntity.id,
        name: updatedEntity.name,
        type: updatedEntity.type,
        status: updatedEntity.status,
        subscription_plan: updatedEntity.subscriptionPlan,
        created_at: updatedEntity.createdAt.toISOString(),
        updated_at: updatedEntity.updatedAt.toISOString(),
        settings: {
          timezone: updatedEntity.timezone,
          currency: updatedEntity.currency,
          fiscal_year_start: updatedEntity.fiscalYearStart
        },
        billing: {
          monthly_amount: updatedEntity.monthlyAmount
        },
        compliance: {
          score: updatedEntity.complianceScore,
          last_assessment: updatedEntity.lastAssessment?.toISOString() || new Date().toISOString(),
          violations_count: updatedEntity.violationsCount
        },
        integrations: updatedEntity.integrations
      },
      success: true
    })
  } catch (error) {
    console.error('Error updating entity:', error)
    return NextResponse.json(
      { error: 'Failed to update entity', success: false },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingEntity = await prisma.entity.findUnique({
      where: { id: params.id }
    })

    if (!existingEntity) {
      return NextResponse.json(
        { error: 'Entity not found', success: false },
        { status: 404 }
      )
    }

    await prisma.entity.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Entity deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting entity:', error)
    return NextResponse.json(
      { error: 'Failed to delete entity', success: false },
      { status: 500 }
    )
  }
}
