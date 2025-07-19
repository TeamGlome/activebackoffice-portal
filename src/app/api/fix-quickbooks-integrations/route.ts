import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting QuickBooks integration fix...')

    // Get all entities that don't have QuickBooks integration records
    const entitiesWithoutIntegrations = await prisma.entity.findMany({
      where: {
        quickbooksIntegrations: {
          none: {}
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    console.log(`Found ${entitiesWithoutIntegrations.length} entities without QuickBooks integrations`)

    const createdIntegrations = []

    // Create QuickBooks integration records for entities that don't have them
    for (const entity of entitiesWithoutIntegrations) {
      try {
        const integration = await prisma.quickBooksIntegration.create({
          data: {
            entityId: entity.id,
            status: 'DISCONNECTED',
            isActive: true
          }
        })

        createdIntegrations.push({
          entityId: entity.id,
          entityName: entity.name,
          integrationId: integration.id
        })

        console.log(`✅ Created QuickBooks integration for entity: ${entity.name} (${entity.id})`)
      } catch (error) {
        console.error(`❌ Failed to create integration for entity ${entity.name}:`, error)
      }
    }

    // Get summary of all integrations
    const allIntegrations = await prisma.quickBooksIntegration.findMany({
      include: {
        entity: {
          select: {
            name: true
          }
        }
      }
    })

    const summary = {
      total_entities: await prisma.entity.count(),
      total_integrations: allIntegrations.length,
      created_in_this_run: createdIntegrations.length,
      integration_statuses: allIntegrations.reduce((acc, integration) => {
        acc[integration.status] = (acc[integration.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    console.log('🎉 QuickBooks integration fix completed:', summary)

    return NextResponse.json({
      success: true,
      message: 'QuickBooks integrations initialized successfully',
      summary: summary,
      created_integrations: createdIntegrations,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ QuickBooks integration fix failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize QuickBooks integrations',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Just return the current status without making changes
    const entities = await prisma.entity.count()
    const integrations = await prisma.quickBooksIntegration.count()
    const entitiesWithoutIntegrations = await prisma.entity.count({
      where: {
        quickbooksIntegrations: {
          none: {}
        }
      }
    })

    const integrationStatuses = await prisma.quickBooksIntegration.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    return NextResponse.json({
      summary: {
        total_entities: entities,
        total_integrations: integrations,
        entities_without_integrations: entitiesWithoutIntegrations,
        integration_statuses: integrationStatuses.reduce((acc, item) => {
          acc[item.status] = item._count.status
          return acc
        }, {} as Record<string, number>)
      },
      needs_fix: entitiesWithoutIntegrations > 0,
      message: entitiesWithoutIntegrations > 0
        ? `${entitiesWithoutIntegrations} entities need QuickBooks integration records`
        : 'All entities have QuickBooks integration records',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error checking QuickBooks integration status:', error)
    return NextResponse.json(
      {
        error: 'Failed to check integration status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
