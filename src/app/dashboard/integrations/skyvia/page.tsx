"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { PermissionGuard } from "../../../../components/PermissionGuard"
import { useAuth } from "../../../../contexts/AuthContext"
import {
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Eye,
  Download,
  Upload,
  FolderOpen,
  FileText,
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
  Search,
  Filter,
  Calendar,
  Users,
  Database,
  BarChart3,
  TrendingUp,
  Edit3,
  Share,
  Link2,
  Building2,
  Clock,
  Target,
  Workflow,
  GitBranch,
  Layers,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Activity
} from "lucide-react"

// Mock Skyvia data - replace with real Skyvia API integration
const mockSkyviaData = {
  account: {
    email: 'admin@premiumproperties.com',
    name: 'Premium Properties',
    plan: 'Professional',
    apiKey: 'skyvia_api_key_***************',
    connectionId: 'conn_12345',
    quotas: {
      operations: { used: 1250, limit: 5000 },
      records: { used: 45000, limit: 100000 },
      storage: { used: '2.3 GB', limit: '10 GB' }
    }
  },
  dataFlows: [
    {
      id: 'flow_1',
      name: 'Yardi to ABO Property Sync',
      description: 'Daily synchronization of property data from Yardi to Active Back Office',
      status: 'running',
      lastRun: '2024-07-16T16:30:00Z',
      nextRun: '2024-07-17T06:00:00Z',
      schedule: 'Daily at 6:00 AM',
      sourceConnector: 'Yardi Voyager',
      targetConnector: 'Active Back Office',
      recordsProcessed: 2450,
      successRate: 98.5,
      transformations: 8,
      filters: 3
    },
    {
      id: 'flow_2',
      name: 'QuickBooks Financial Data Import',
      description: 'Real-time financial data synchronization from QuickBooks to reporting dashboard',
      status: 'completed',
      lastRun: '2024-07-16T15:45:00Z',
      nextRun: '2024-07-16T18:45:00Z',
      schedule: 'Every 3 hours',
      sourceConnector: 'QuickBooks Online',
      targetConnector: 'ABO Analytics',
      recordsProcessed: 1890,
      successRate: 100,
      transformations: 5,
      filters: 2
    },
    {
      id: 'flow_3',
      name: 'Tenant Data Consolidation',
      description: 'Consolidate tenant information from multiple sources into unified database',
      status: 'scheduled',
      lastRun: '2024-07-15T23:00:00Z',
      nextRun: '2024-07-16T23:00:00Z',
      schedule: 'Daily at 11:00 PM',
      sourceConnector: 'Multiple Sources',
      targetConnector: 'Master Database',
      recordsProcessed: 3200,
      successRate: 97.8,
      transformations: 12,
      filters: 5
    },
    {
      id: 'flow_4',
      name: 'Maintenance Request Workflow',
      description: 'Process and route maintenance requests from tenant portal to work order system',
      status: 'error',
      lastRun: '2024-07-16T14:20:00Z',
      nextRun: '2024-07-16T17:20:00Z',
      schedule: 'Every 3 hours',
      sourceConnector: 'Tenant Portal',
      targetConnector: 'Maintenance System',
      recordsProcessed: 450,
      successRate: 85.2,
      transformations: 6,
      filters: 4
    }
  ],
  connectors: [
    {
      id: 'conn_yardi',
      name: 'Yardi Voyager',
      type: 'source',
      status: 'connected',
      lastTested: '2024-07-16T10:00:00Z',
      recordsAvailable: 15600,
      tables: ['Properties', 'Tenants', 'Leases', 'Payments', 'Maintenance']
    },
    {
      id: 'conn_quickbooks',
      name: 'QuickBooks Online',
      type: 'source',
      status: 'connected',
      lastTested: '2024-07-16T12:30:00Z',
      recordsAvailable: 8900,
      tables: ['Accounts', 'Customers', 'Invoices', 'Payments', 'Items']
    },
    {
      id: 'conn_abo',
      name: 'Active Back Office',
      type: 'target',
      status: 'connected',
      lastTested: '2024-07-16T16:45:00Z',
      recordsAvailable: 25400,
      tables: ['Properties', 'Tenants', 'Financial', 'Analytics', 'Reports']
    },
    {
      id: 'conn_salesforce',
      name: 'Salesforce CRM',
      type: 'bidirectional',
      status: 'pending',
      lastTested: null,
      recordsAvailable: 0,
      tables: []
    }
  ],
  templates: [
    {
      id: 'template_property_etl',
      name: 'Property Data ETL Pipeline',
      description: 'Complete ETL workflow for property management data with validation and cleansing',
      category: 'property',
      sourceTypes: ['Yardi', 'RealPage', 'AppFolio', 'CSV'],
      transformations: ['Data Validation', 'Address Standardization', 'Duplicate Detection', 'Field Mapping'],
      estimatedTime: '15-30 minutes',
      complexity: 'Intermediate'
    },
    {
      id: 'template_financial_sync',
      name: 'Financial Data Synchronization',
      description: 'Real-time sync of financial data between accounting systems and analytics',
      category: 'financial',
      sourceTypes: ['QuickBooks', 'Sage', 'Xero', 'Excel'],
      transformations: ['Currency Conversion', 'Account Mapping', 'Period Alignment', 'KPI Calculation'],
      estimatedTime: '10-20 minutes',
      complexity: 'Beginner'
    },
    {
      id: 'template_tenant_workflow',
      name: 'Tenant Lifecycle Management',
      description: 'Automated workflow for tenant onboarding, renewals, and move-out processes',
      category: 'tenant',
      sourceTypes: ['Tenant Portal', 'Lease Management', 'Background Check', 'Payment System'],
      transformations: ['Status Updates', 'Document Generation', 'Notification Triggers', 'Workflow Routing'],
      estimatedTime: '30-45 minutes',
      complexity: 'Advanced'
    }
  ],
  analytics: {
    totalFlows: 4,
    activeFlows: 3,
    totalRecordsProcessed: 125000,
    avgSuccessRate: 95.4,
    lastMonthVolume: 95000,
    monthlyGrowth: 12.5
  }
}

export default function SkyviaIntegration() {
  const { currentEntity } = useAuth()
  const [isConnected, setIsConnected] = useState(true) // Mock connected state
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showNewFlowModal, setShowNewFlowModal] = useState(false)

  const handleConnect = async () => {
    // Mock Skyvia connection - replace with real Skyvia OAuth/API key setup
    const authUrl = `https://app.skyvia.com/oauth/authorize?` + new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_SKYVIA_CLIENT_ID || 'demo_client_id',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/dashboard/integrations/skyvia/callback`,
      scope: 'read write',
      state: `entity_${currentEntity?.id}`
    }).toString()

    window.location.href = authUrl
  }

  const handleSync = async () => {
    setIsSyncing(true)
    // Mock sync process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsSyncing(false)
  }

  const handleRunFlow = async (flowId: string) => {
    console.log(`Running data flow: ${flowId}`)
    // Mock run flow
  }

  const handleStopFlow = async (flowId: string) => {
    console.log(`Stopping data flow: ${flowId}`)
    // Mock stop flow
  }

  const handleCreateFromTemplate = async (templateId: string) => {
    setShowTemplateModal(false)
    const template = mockSkyviaData.templates.find(t => t.id === templateId)
    if (template) {
      console.log(`Creating data flow from template: ${template.name}`)
      setShowNewFlowModal(true)
    }
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'dataflows', name: 'Data Flows', icon: Workflow },
    { id: 'connectors', name: 'Connectors', icon: Database },
    { id: 'templates', name: 'Templates', icon: FolderOpen },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const getFlowStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'scheduled':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'paused':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getFlowStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-3 h-3 animate-pulse" />
      case 'completed':
        return <CheckCircle className="w-3 h-3" />
      case 'scheduled':
        return <Clock className="w-3 h-3" />
      case 'error':
        return <XCircle className="w-3 h-3" />
      case 'paused':
        return <Pause className="w-3 h-3" />
      default:
        return <AlertTriangle className="w-3 h-3" />
    }
  }

  const getConnectorStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'advanced':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/integrations">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link href="/dashboard/integrations" className="hover:text-white transition-colors">
                Integrations
              </Link>
              <span>/</span>
              <span className="text-white">Skyvia</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Skyvia</h1>
                <p className="text-slate-400">No-code data integration and ETL platform</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              {mockSkyviaData.analytics.activeFlows} Active Flows
            </Badge>
          )}

          <PermissionGuard permission="entity.integrations.skyvia.configure">
            {isConnected ? (
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync All Flows
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Connect Skyvia
              </Button>
            )}
          </PermissionGuard>
        </div>
      </div>

      {!isConnected ? (
        /* Connection Setup */
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Connect Skyvia</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Build powerful no-code data integration workflows. Transform and sync property data
              between systems without writing code for {currentEntity?.name}.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Workflow className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">ETL Workflows</p>
                <p className="text-xs text-slate-400">Visual data pipelines</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <GitBranch className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Data Transformation</p>
                <p className="text-xs text-slate-400">Clean and enrich data</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Real-time Sync</p>
                <p className="text-xs text-slate-400">Automated scheduling</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Layers className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Multiple Sources</p>
                <p className="text-xs text-slate-400">200+ connectors</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">Enterprise-Grade ETL</span>
              </div>
              <p className="text-xs text-slate-400">
                Skyvia provides enterprise-level data integration capabilities with advanced transformation
                features and monitoring tools for complex property management workflows.
              </p>
            </div>

            <PermissionGuard permission="entity.integrations.skyvia.configure">
              <Button
                onClick={handleConnect}
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Zap className="w-5 h-5 mr-2" />
                Connect Skyvia
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </PermissionGuard>
          </CardContent>
        </Card>
      ) : (
        /* Connected Dashboard */
        <>
          {/* Tab Navigation */}
          <div className="border-b border-slate-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      selectedTab === tab.id
                        ? 'border-orange-500 text-orange-400'
                        : 'border-transparent text-slate-400 hover:text-white hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Account Info */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Skyvia Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                      <Zap className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{mockSkyviaData.account.name}</h3>
                      <p className="text-slate-400">{mockSkyviaData.account.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-slate-400">
                          Plan: {mockSkyviaData.account.plan}
                        </span>
                        <span className="text-slate-400">
                          API Key: {mockSkyviaData.account.apiKey}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Workflow className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Active Flows</p>
                        <p className="text-2xl font-bold text-white">{mockSkyviaData.analytics.activeFlows}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Database className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Records Processed</p>
                        <p className="text-2xl font-bold text-white">{mockSkyviaData.analytics.totalRecordsProcessed.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Success Rate</p>
                        <p className="text-2xl font-bold text-white">{mockSkyviaData.analytics.avgSuccessRate}%</p>
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
                        <p className="text-sm text-slate-400">Monthly Growth</p>
                        <p className="text-2xl font-bold text-white">+{mockSkyviaData.analytics.monthlyGrowth}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resource Usage */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Resource Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Operations</span>
                        <span className="text-white">{mockSkyviaData.account.quotas.operations.used} / {mockSkyviaData.account.quotas.operations.limit}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(mockSkyviaData.account.quotas.operations.used / mockSkyviaData.account.quotas.operations.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Records</span>
                        <span className="text-white">{mockSkyviaData.account.quotas.records.used.toLocaleString()} / {mockSkyviaData.account.quotas.records.limit.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(mockSkyviaData.account.quotas.records.used / mockSkyviaData.account.quotas.records.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Storage</span>
                        <span className="text-white">{mockSkyviaData.account.quotas.storage.used} / {mockSkyviaData.account.quotas.storage.limit}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === 'dataflows' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Data Flows</CardTitle>
                  <div className="flex items-center gap-2">
                    <PermissionGuard permission="entity.integrations.skyvia.configure">
                      <Button
                        onClick={() => setShowTemplateModal(true)}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Flow
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSkyviaData.dataFlows.map((flow) => (
                    <div key={flow.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <Workflow className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{flow.name}</h4>
                            <p className="text-sm text-slate-400">{flow.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs">
                              <span className="text-slate-500">{flow.sourceConnector} → {flow.targetConnector}</span>
                              <span className="text-slate-500">{flow.recordsProcessed.toLocaleString()} records</span>
                              <span className="text-slate-500">{flow.successRate}% success</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getFlowStatusColor(flow.status)}>
                            {getFlowStatusIcon(flow.status)}
                            <span className="ml-1 capitalize">{flow.status}</span>
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">Next: {new Date(flow.nextRun).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitBranch className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">{flow.transformations} transformations</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Filter className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">{flow.filters} filters</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {flow.status === 'running' ? (
                            <PermissionGuard permission="entity.integrations.skyvia.configure">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-600 text-red-400"
                                onClick={() => handleStopFlow(flow.id)}
                              >
                                <Pause className="w-3 h-3 mr-1" />
                                Stop
                              </Button>
                            </PermissionGuard>
                          ) : (
                            <PermissionGuard permission="entity.integrations.skyvia.configure">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-green-600 text-green-400"
                                onClick={() => handleRunFlow(flow.id)}
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Run
                              </Button>
                            </PermissionGuard>
                          )}
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'connectors' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Data Connectors</CardTitle>
                  <PermissionGuard permission="entity.integrations.skyvia.configure">
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Connector
                    </Button>
                  </PermissionGuard>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSkyviaData.connectors.map((connector) => (
                    <div key={connector.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{connector.name}</h4>
                            <p className="text-sm text-slate-400 capitalize">{connector.type} connector</p>
                            <div className="flex items-center gap-2 mt-1">
                              {connector.tables.slice(0, 3).map((table) => (
                                <Badge key={table} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  {table}
                                </Badge>
                              ))}
                              {connector.tables.length > 3 && (
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  +{connector.tables.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getConnectorStatusColor(connector.status)}>
                            <span className="capitalize">{connector.status}</span>
                          </Badge>
                          <div className="text-right text-sm">
                            <p className="text-white font-medium">{connector.recordsAvailable.toLocaleString()}</p>
                            <p className="text-slate-400">records available</p>
                          </div>
                          <PermissionGuard permission="entity.integrations.skyvia.configure">
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                              <Settings className="w-3 h-3 mr-1" />
                              Configure
                            </Button>
                          </PermissionGuard>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'templates' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Flow Templates</CardTitle>
                <p className="text-slate-400 text-sm">Pre-built data integration workflows for property management</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockSkyviaData.templates.map((template) => (
                    <div key={template.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">{template.name}</h4>
                        <p className="text-sm text-slate-400 mb-3">{template.description}</p>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Source Types:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.sourceTypes.slice(0, 2).map((source) => (
                                <Badge key={source} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                                  {source}
                                </Badge>
                              ))}
                              {template.sourceTypes.length > 2 && (
                                <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                                  +{template.sourceTypes.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-slate-500">Complexity:</p>
                              <Badge className={getComplexityColor(template.complexity)}>
                                {template.complexity}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Est. Time:</p>
                              <p className="text-xs text-white">{template.estimatedTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <PermissionGuard permission="entity.integrations.skyvia.configure">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-purple-600 text-purple-400"
                          onClick={() => handleCreateFromTemplate(template.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Use Template
                        </Button>
                      </PermissionGuard>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'settings' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Skyvia Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Auto-retry Failed Flows</h4>
                      <p className="text-sm text-slate-400">Automatically retry failed data flows up to 3 times</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-sm text-slate-400">Get notified when flows complete or encounter errors</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Data Logging</h4>
                      <p className="text-sm text-slate-400">Log detailed information about data transformations</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Performance Monitoring</h4>
                      <p className="text-sm text-slate-400">Monitor flow performance and resource usage</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <PermissionGuard permission="entity.integrations.skyvia.configure">
                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Disconnect Skyvia
                    </Button>
                  </PermissionGuard>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-4xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Create Data Flow from Template</CardTitle>
              <p className="text-slate-400">Choose a template to create a new data integration workflow</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockSkyviaData.templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                  >
                    <h4 className="text-white font-medium mb-2">{template.name}</h4>
                    <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity}
                      </Badge>
                      <span className="text-xs text-slate-500">{template.estimatedTime}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={() => selectedTemplate && handleCreateFromTemplate(selectedTemplate)}
                  disabled={!selectedTemplate}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Flow
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateModal(false)}
                  className="border-slate-600 text-slate-400"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Flow Creation Modal */}
      {showNewFlowModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Configure New Data Flow</CardTitle>
              <p className="text-slate-400">Set up your data integration workflow</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Flow Name
                </label>
                <input
                  type="text"
                  placeholder="Enter flow name..."
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe what this flow does..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Source Connector
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Yardi Voyager</option>
                    <option>QuickBooks Online</option>
                    <option>CSV File</option>
                    <option>Excel File</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Connector
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Active Back Office</option>
                    <option>Analytics Database</option>
                    <option>Data Warehouse</option>
                    <option>Reporting System</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Workflow className="w-4 h-4 mr-2" />
                  Create Flow
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewFlowModal(false)}
                  className="border-slate-600 text-slate-400"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
