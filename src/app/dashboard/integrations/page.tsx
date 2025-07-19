"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { PermissionGuard } from "../../../components/PermissionGuard"
import { INTEGRATION_REGISTRY, type IntegrationType, type IntegrationStatus } from "../../../lib/integrations"
import { type Permission } from "../../../lib/permissions"
import {
  Settings,
  Zap,
  Database,
  Cloud,
  Plus,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  DollarSign,
  CreditCard,
  FileSpreadsheet,
  Wrench,
  Shield,

  Code,
  LinkIcon,
  Activity,
  BarChart3,
  Globe
} from "lucide-react"

// Mock integration data - replace with real API calls
const mockIntegrations = [
  {
    id: '1',
    type: 'quickbooks' as IntegrationType,
    name: 'QuickBooks Online',
    status: 'connected' as IntegrationStatus,
    lastSync: '2024-07-16 15:30:00',
    recordsImported: 1247,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '2',
    type: 'plaid' as IntegrationType,
    name: 'Business Banking',
    status: 'connected' as IntegrationStatus,
    lastSync: '2024-07-16 14:15:00',
    recordsImported: 89,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '3',
    type: 'google_sheets' as IntegrationType,
    name: 'Property Reports',
    status: 'syncing' as IntegrationStatus,
    lastSync: '2024-07-16 16:00:00',
    recordsImported: 345,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '4',
    type: 'watchguard' as IntegrationType,
    name: 'Security Monitoring',
    status: 'error' as IntegrationStatus,
    lastSync: '2024-07-15 22:30:00',
    recordsImported: 0,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '5',
    type: 'fiix' as IntegrationType,
    name: 'Maintenance Management',
    status: 'pending' as IntegrationStatus,
    lastSync: null,
    recordsImported: 0,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '6',
    type: 'google_drive' as IntegrationType,
    name: 'Google Drive',
    status: 'connected' as IntegrationStatus,
    lastSync: '2024-07-16 16:30:00',
    recordsImported: 23,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '7',
    type: 'onedrive' as IntegrationType,
    name: 'OneDrive Business',
    status: 'connected' as IntegrationStatus,
    lastSync: '2024-07-16 14:45:00',
    recordsImported: 34,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '8',
    type: 'google_sheets' as IntegrationType,
    name: 'Google Sheets',
    status: 'connected' as IntegrationStatus,
    lastSync: '2024-07-16 16:45:00',
    recordsImported: 425,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '9',
    type: 'excel_online' as IntegrationType,
    name: 'Excel Online',
    status: 'connected' as IntegrationStatus,
    lastSync: '2024-07-16 17:00:00',
    recordsImported: 312,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '10',
    type: 'skyvia' as IntegrationType,
    name: 'Skyvia',
    status: 'connected' as IntegrationStatus,
    lastSync: '2024-07-16 16:30:00',
    recordsImported: 425,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '11',
    type: 'pipedream' as IntegrationType,
    name: 'Pipedream',
    status: 'connected' as IntegrationStatus,
    lastSync: '2024-07-16 15:45:00',
    recordsImported: 156,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '12',
    type: 'fiix' as IntegrationType,
    name: 'Fiix Software',
    status: 'connected' as IntegrationStatus,
    lastSync: '2024-07-16 14:20:00',
    recordsImported: 89,
    entityName: 'Premium Properties LLC'
  },
  {
    id: '13',
    type: 'watchguard' as IntegrationType,
    name: 'WatchGuard',
    status: 'connected' as IntegrationStatus,
    lastSync: '2024-07-16 17:15:00',
    recordsImported: 234,
    entityName: 'Premium Properties LLC'
  },

]

const getStatusIcon = (status: IntegrationStatus) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="w-4 h-4 text-green-400" />
    case 'disconnected':
      return <XCircle className="w-4 h-4 text-red-400" />
    case 'error':
      return <AlertTriangle className="w-4 h-4 text-red-400" />
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-400" />
    case 'syncing':
      return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
    default:
      return <XCircle className="w-4 h-4 text-slate-400" />
  }
}

const getStatusColor = (status: IntegrationStatus) => {
  switch (status) {
    case 'connected':
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case 'disconnected':
      return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    case 'error':
      return "bg-red-500/10 text-red-400 border-red-500/20"
    case 'pending':
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    case 'syncing':
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20"
  }
}

const getIntegrationIcon = (type: IntegrationType) => {
  switch (type) {
    case 'quickbooks':
      return <DollarSign className="w-5 h-5 text-blue-400" />
    case 'plaid':
      return <CreditCard className="w-5 h-5 text-green-400" />
    case 'google_drive':
    case 'onedrive':
    case 'dropbox':
    case 'sharepoint':
      return <Cloud className="w-5 h-5 text-blue-400" />
    case 'google_sheets':
    case 'excel_online':
      return <FileSpreadsheet className="w-5 h-5 text-green-400" />
    case 'skyvia':
    case 'pipedream':
      return <Zap className="w-5 h-5 text-purple-400" />
    case 'fiix':
      return <Wrench className="w-5 h-5 text-orange-400" />
    case 'watchguard':
      return <Shield className="w-5 h-5 text-red-400" />

    case 'custom_api':
      return <Code className="w-5 h-5 text-slate-400" />
    default:
      return <Settings className="w-5 h-5 text-slate-400" />
  }
}

export default function IntegrationHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const categories = [
    { id: 'all', name: 'All Integrations', count: 13 },
    { id: 'accounting', name: 'Accounting', count: 1 },
    { id: 'banking', name: 'Banking', count: 1 },
    { id: 'storage', name: 'Cloud Storage', count: 4 },
    { id: 'spreadsheet', name: 'Spreadsheets', count: 2 },
    { id: 'automation', name: 'Automation', count: 2 },
    { id: 'maintenance', name: 'Maintenance', count: 1 },
    { id: 'security', name: 'Security', count: 1 },
    { id: 'api', name: 'Custom API', count: 1 }
  ]

  const availableIntegrations = Object.entries(INTEGRATION_REGISTRY).filter(([type, config]) => {
    if (selectedCategory === 'all') return true
    return config.category === selectedCategory
  })

  const connectedCount = mockIntegrations.filter(i => i.status === 'connected').length
  const totalSyncs = mockIntegrations.reduce((sum, i) => sum + i.recordsImported, 0)
  const errorCount = mockIntegrations.filter(i => i.status === 'error').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-white">Integrations</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Integration Hub</h1>
          <p className="text-slate-400">Connect and manage all your business applications</p>
        </div>
        <PermissionGuard permission="entity.integrations.manage">
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </PermissionGuard>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Connected</p>
                <p className="text-2xl font-bold text-white">{connectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Data Synced</p>
                <p className="text-2xl font-bold text-white">{totalSyncs.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Available</p>
                <p className="text-2xl font-bold text-white">13</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">98.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Filter */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <span>{category.name}</span>
                <Badge variant="outline" className="border-slate-600 text-xs">
                  {category.count}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Available Integrations */}
        <div className="lg:col-span-3 space-y-6">
          {/* Connected Integrations */}
          {mockIntegrations.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Connected Integrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockIntegrations.map((integration) => (
                    <div key={integration.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            {getIntegrationIcon(integration.type)}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{integration.name}</h4>
                            <p className="text-sm text-slate-400">{INTEGRATION_REGISTRY[integration.type]?.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(integration.status)}>
                            {getStatusIcon(integration.status)}
                            <span className="ml-1 capitalize">{integration.status}</span>
                          </Badge>
                          <PermissionGuard permission="entity.integrations.manage">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </PermissionGuard>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Last Sync</p>
                          <p className="text-white font-medium">
                            {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Records</p>
                          <p className="text-white font-medium">{integration.recordsImported.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <PermissionGuard permission="entity.integrations.manage">
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Sync
                            </Button>
                          </PermissionGuard>
                          {(['quickbooks', 'plaid', 'google_drive', 'onedrive', 'dropbox', 'google_sheets', 'excel_online', 'skyvia', 'pipedream', 'fiix', 'watchguard'].includes(integration.type)) ? (
                            <Link href={`/dashboard/integrations/${integration.type.replace(/_/g, '-')}`}>
                              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </Link>
                          ) : (
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Integrations */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Available Integrations
                {selectedCategory !== 'all' && (
                  <Badge variant="outline" className="border-slate-600 text-slate-400">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableIntegrations.map(([type, config]) => {
                  const isConnected = mockIntegrations.some(i => i.type === type)

                  return (
                    <div key={type} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-${config.color}-500/10 rounded-lg flex items-center justify-center`}>
                            {getIntegrationIcon(type as IntegrationType)}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{config.name}</h4>
                            <p className="text-sm text-slate-400">{config.description}</p>
                          </div>
                        </div>
                        {isConnected && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {config.features.slice(0, 2).map((feature) => (
                          <Badge
                            key={feature}
                            variant="outline"
                            className="text-xs border-slate-600 text-slate-400"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {config.features.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-600 text-slate-400"
                          >
                            +{config.features.length - 2} more
                          </Badge>
                        )}
                      </div>

                      <PermissionGuard permissions={config.requiredPermissions as Permission[]}>
                        {/* Clickable integration links */}
                        {(['quickbooks', 'plaid', 'google_drive', 'onedrive', 'dropbox', 'google_sheets', 'excel_online', 'skyvia', 'pipedream', 'fiix', 'watchguard'].includes(type)) ? (
                          <Link href={`/dashboard/integrations/${type.replace(/_/g, '-')}`}>
                            <Button
                              variant={isConnected ? "outline" : "default"}
                              size="sm"
                              className={isConnected ? "border-slate-600 text-slate-400" : "bg-orange-500 hover:bg-orange-600 text-white"}
                            >
                              {isConnected ? (
                                <>
                                  <Settings className="w-3 h-3 mr-1" />
                                  Configure
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3 mr-1" />
                                  Connect
                                </>
                              )}
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant={isConnected ? "outline" : "default"}
                            size="sm"
                            className={isConnected ? "border-slate-600 text-slate-400" : "bg-orange-500 hover:bg-orange-600 text-white"}
                            disabled={isConnected}
                          >
                            {isConnected ? (
                              <>
                                <Settings className="w-3 h-3 mr-1" />
                                Configure
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3 mr-1" />
                                Connect
                              </>
                            )}
                          </Button>
                        )}
                      </PermissionGuard>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
