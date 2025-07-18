"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import EntityModal from "./components/EntityModal"
import {
  Building2,
  Plus,
  Search,
  Settings,
  Users,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  Loader2,
  Heart,
  Zap,
  Clock,
  Filter,
  TrendingUp
} from "lucide-react"

interface EntityData {
  id: string
  name: string
  type: string
  status: string
  subscription_plan: string
  created_at: string
  updated_at: string
  settings: {
    timezone: string
    currency: string
    fiscal_year_start: string
  }
  billing: {
    subscription_id?: string
    current_period_start?: string
    current_period_end?: string
    monthly_amount: number
  }
  compliance?: {
    score: number
    last_assessment: string
    violations_count: number
  }
  integrations: {
    [key: string]: {
      connected: boolean
      company_id?: string
      access_token_expires?: string
      last_sync?: string
      api_key?: string
    }
  }
}

interface EntityStats {
  total: number
  active: number
  trial: number
  suspended: number
  totalRevenue: number
  totalUsers: number
}

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

export default function EntitiesPage() {
  const [entities, setEntities] = useState<EntityData[]>([])
  const [stats, setStats] = useState<EntityStats | null>(null)
  const [healthData, setHealthData] = useState<EntityHealth[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [healthFilter, setHealthFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedEntity, setSelectedEntity] = useState<EntityData | null>(null)
  const [refreshingHealth, setRefreshingHealth] = useState<string | null>(null)

  const fetchEntities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (selectedFilter !== 'all') params.append('status', selectedFilter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/platform/entities?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch entities')
      }

      setEntities(data.entities)
      setStats(data.stats)
    } catch (err) {
      console.error('Error fetching entities:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch entities')
    } finally {
      setLoading(false)
    }
  }, [selectedFilter, searchQuery])

  const fetchHealthData = useCallback(async () => {
    try {
      const response = await fetch('/api/platform/entities/health')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setHealthData(data.healthData)
        }
      }
    } catch (err) {
      console.error('Error fetching health data:', err)
    }
  }, [])

  const runHealthCheck = async (entityId: string) => {
    try {
      setRefreshingHealth(entityId)
      const response = await fetch('/api/platform/entities/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, healthCheck: true })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Update health data
          setHealthData(prev => {
            const updated = [...prev]
            const index = updated.findIndex(h => h.entityId === entityId)
            if (index >= 0) {
              updated[index] = data.health
            } else {
              updated.push(data.health)
            }
            return updated
          })
        }
      }
    } catch (err) {
      console.error('Error running health check:', err)
    } finally {
      setRefreshingHealth(null)
    }
  }

  const handleCreateEntity = () => {
    setModalMode('create')
    setSelectedEntity(null)
    setModalOpen(true)
  }

  const handleEditEntity = (entity: EntityData) => {
    setModalMode('edit')
    setSelectedEntity(entity)
    setModalOpen(true)
  }

  const handleSaveEntity = async (entityData: EntityData) => {
    try {
      const url = modalMode === 'create'
        ? '/api/platform/entities'
        : `/api/platform/entities/${selectedEntity?.id}`

      const method = modalMode === 'create' ? 'POST' : 'PUT'

      // Transform data to match API expectations
      const apiData = {
        name: entityData.name,
        type: entityData.type,
        status: entityData.status,
        subscription_plan: entityData.subscription_plan,
        settings: entityData.settings,
        billing: entityData.billing
      }

      console.log('Saving entity data:', apiData)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      })

      const result = await response.json()
      console.log('Save response:', result)

      if (response.ok && result.success) {
        await fetchEntities()
        setModalOpen(false)
      } else {
        console.error('Save failed:', result)
        alert(`Failed to save entity: ${result.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('Error saving entity:', err)
      alert(`Failed to save entity: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleDeleteEntity = async (entityId: string) => {
    if (!confirm('Are you sure you want to delete this entity?')) return

    try {
      const response = await fetch(`/api/platform/entities/${entityId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchEntities()
      } else {
        throw new Error('Failed to delete entity')
      }
    } catch (err) {
      console.error('Error deleting entity:', err)
    }
  }

  useEffect(() => {
    fetchEntities()
    fetchHealthData()

    // Set up real-time health monitoring
    const healthInterval = setInterval(fetchHealthData, 30000) // Every 30 seconds

    return () => clearInterval(healthInterval)
  }, [fetchEntities, fetchHealthData])

  const getEntityHealth = (entityId: string) => {
    return healthData.find(h => h.entityId === entityId)
  }

  const getHealthBadge = (health?: EntityHealth) => {
    if (!health) return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">Unknown</Badge>

    switch (health.status) {
      case 'healthy':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Healthy</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Warning</Badge>
      case 'critical':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Critical</Badge>
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">Unknown</Badge>
    }
  }

  const getIntegrationCount = (integrations: EntityData['integrations']) => {
    if (!integrations) return 0
    return Object.values(integrations).filter((integration: EntityData['integrations'][keyof EntityData['integrations']]) =>
      integration && integration.connected
    ).length
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
      case 'trial':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Trial</Badge>
      case 'suspended':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Suspended</Badge>
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">{status}</Badge>
    }
  }

  const filteredEntities = entities.filter(entity => {
    const health = getEntityHealth(entity.id)

    const matchesSearch = !searchQuery ||
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.category?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedFilter === 'all' || entity.status === selectedFilter
    const matchesType = typeFilter === 'all' || entity.type === typeFilter
    const matchesCategory = categoryFilter === 'all' || entity.category === categoryFilter
    const matchesHealth = healthFilter === 'all' ||
      (health && health.status === healthFilter) ||
      (healthFilter === 'unknown' && !health)

    return matchesSearch && matchesStatus && matchesType && matchesCategory && matchesHealth
  }).sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortBy) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'type':
        aValue = a.type || ''
        bValue = b.type || ''
        break
      case 'category':
        aValue = a.category || ''
        bValue = b.category || ''
        break
      case 'created_at':
        aValue = new Date(a.created_at)
        bValue = new Date(b.created_at)
        break
      default:
        aValue = a.name
        bValue = b.name
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue)
      return sortOrder === 'asc' ? comparison : -comparison
    }

    return 0
  })

  const uniqueTypes = [...new Set(entities.map(e => e.type).filter(Boolean))]
  const uniqueCategories = [...new Set(entities.map(e => e.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Entity Management</h1>
          <p className="text-slate-400">Manage platform entities and their configurations</p>
        </div>
        <Button
          onClick={handleCreateEntity}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Entity
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Entities</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    ${(stats.totalRevenue / 100).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search entities..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
            >
              <option value="all">All Health</option>
              <option value="healthy">Healthy</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="unknown">Unknown</option>
            </select>

            <Button
              variant="outline"
              onClick={fetchEntities}
              disabled={loading}
              className="border-slate-600 text-slate-400 hover:text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entities Grid */}
      <div className="grid gap-4">
        {filteredEntities.map((entity) => {
          const health = getEntityHealth(entity.id)
          return (
            <Card key={entity.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{entity.name}</h3>
                      <p className="text-slate-400">{entity.type}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {getStatusBadge(entity.status)}
                        <Badge variant="outline" className="text-xs">
                          {entity.subscription_plan}
                        </Badge>
                        {getHealthBadge(health)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-slate-400">Monthly Revenue</p>
                      <p className="text-lg font-semibold text-white">
                        ${(entity.billing.monthly_amount / 100).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-slate-400">Compliance Score</p>
                      <p className="text-lg font-semibold text-green-400">
                        {entity.compliance?.score?.toFixed(1)}%
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-slate-400">Integrations</p>
                      <p className="text-lg font-semibold text-blue-400">
                        {getIntegrationCount(entity.integrations)}
                      </p>
                    </div>

                    {health && (
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Response Time</p>
                        <p className="text-lg font-semibold text-white">
                          {health.apiResponseTime}ms
                        </p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runHealthCheck(entity.id)}
                        disabled={refreshingHealth === entity.id}
                        className="border-slate-600 text-slate-400 hover:text-white"
                      >
                        {refreshingHealth === entity.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEntity(entity)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEntity(entity.id)}
                        className="border-red-500/20 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Health Alerts */}
                {health && health.alerts.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Health Alerts</span>
                    </div>
                    {health.alerts.map((alert, i) => (
                      <p key={i} className="text-sm text-yellow-300">{alert.message}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredEntities.length === 0 && !loading && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Entities Found</h3>
            <p className="text-slate-400">No entities match your current filters.</p>
          </CardContent>
        </Card>
      )}

      {/* Entity Modal */}
      <EntityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEntity}
        entity={selectedEntity}
        mode={modalMode}
      />
    </div>
  )
}
