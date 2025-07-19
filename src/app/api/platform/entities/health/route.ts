import { NextRequest, NextResponse } from 'next/server'

interface EntityHealth {
  entityId: string
  status: 'healthy' | 'warning' | 'critical'
  lastSync: string
  integrationStatus: {
    [key: string]: {
      connected: boolean
      lastSync?: string
      error?: string
    }
  }
  complianceScore: number
  apiResponseTime: number
  uptime: number
  alerts: Array<{
    type: 'warning' | 'error' | 'info'
    message: string
    timestamp: string
  }>
}

// Mock health data - replace with actual monitoring in production
const entityHealthData: EntityHealth[] = [
  {
    entityId: "ent_1",
    status: 'healthy',
    lastSync: new Date().toISOString(),
    integrationStatus: {
      quickbooks: {
        connected: true,
        lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 minutes ago
      },
      nyc_compliance: {
        connected: true,
        lastSync: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago
      }
    },
    complianceScore: 94.2,
    apiResponseTime: 245,
    uptime: 99.8,
    alerts: []
  },
  {
    entityId: "ent_2",
    status: 'warning',
    lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    integrationStatus: {
      quickbooks: {
        connected: true,
        lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      }
    },
    complianceScore: 91.8,
    apiResponseTime: 1240,
    uptime: 97.2,
    alerts: [
      {
        type: 'warning',
        message: 'API response time above threshold',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityId = searchParams.get('entityId')

    if (entityId) {
      // Return health for specific entity
      const health = entityHealthData.find(h => h.entityId === entityId)
      if (!health) {
        return NextResponse.json(
          { error: 'Entity health data not found', success: false },
          { status: 404 }
        )
      }
      return NextResponse.json({ health, success: true })
    }

    // Return health for all entities
    return NextResponse.json({
      healthData: entityHealthData,
      summary: {
        healthy: entityHealthData.filter(h => h.status === 'healthy').length,
        warning: entityHealthData.filter(h => h.status === 'warning').length,
        critical: entityHealthData.filter(h => h.status === 'critical').length,
        avgResponseTime: entityHealthData.reduce((sum, h) => sum + h.apiResponseTime, 0) / entityHealthData.length,
        avgUptime: entityHealthData.reduce((sum, h) => sum + h.uptime, 0) / entityHealthData.length
      },
      success: true
    })
  } catch (error) {
    console.error('Error fetching entity health:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entity health', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityId, healthCheck } = body

    // Run health check for specific entity
    const mockHealthCheck = {
      entityId,
      status: Math.random() > 0.8 ? 'warning' : 'healthy',
      lastSync: new Date().toISOString(),
      integrationStatus: {
        quickbooks: {
          connected: Math.random() > 0.1,
          lastSync: new Date().toISOString()
        }
      },
      complianceScore: 90 + Math.random() * 10,
      apiResponseTime: 200 + Math.random() * 800,
      uptime: 95 + Math.random() * 5,
      alerts: []
    }

    // Update the health data
    const index = entityHealthData.findIndex(h => h.entityId === entityId)
    if (index >= 0) {
      entityHealthData[index] = mockHealthCheck
    } else {
      entityHealthData.push(mockHealthCheck)
    }

    return NextResponse.json({
      health: mockHealthCheck,
      success: true
    })
  } catch (error) {
    console.error('Error running health check:', error)
    return NextResponse.json(
      { error: 'Failed to run health check', success: false },
      { status: 500 }
    )
  }
}
