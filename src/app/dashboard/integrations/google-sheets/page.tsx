"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import AIImportAnalysis from "../../../../components/AIImportAnalysis"
import { type AIFieldMapping } from "../../../../lib/ai-csv-import"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { PermissionGuard } from "../../../../components/PermissionGuard"
import { useAuth } from "../../../../contexts/AuthContext"
import {
  FileSpreadsheet,
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
  Table,
  BarChart3,
  TrendingUp,
  Edit3,
  Share,
  Link2
} from "lucide-react"

// Mock Google Sheets data - replace with real Google Sheets API integration
const mockGoogleSheetsData = {
  account: {
    email: 'admin@premiumproperties.com',
    name: 'Premium Properties Admin',
    profilePicture: null,
    driveQuota: {
      limit: '15 GB',
      usage: '8.2 GB',
      remaining: '6.8 GB'
    }
  },
  spreadsheets: [
    {
      id: 'sheet_1',
      name: 'Property Portfolio Dashboard',
      url: 'https://docs.google.com/spreadsheets/d/sheet_1/edit',
      lastModified: '2024-07-16T16:45:00Z',
      owner: 'admin@premiumproperties.com',
      sharedWith: ['manager@premiumproperties.com', 'staff@premiumproperties.com'],
      worksheets: [
        { id: 'ws_1', name: 'Properties Overview', rowCount: 25, colCount: 12 },
        { id: 'ws_2', name: 'Financial Summary', rowCount: 50, colCount: 8 },
        { id: 'ws_3', name: 'Maintenance Tracker', rowCount: 35, colCount: 10 }
      ],
      syncStatus: 'connected',
      syncDirection: 'bidirectional',
      lastSync: '2024-07-16T16:45:00Z',
      template: 'property_portfolio'
    },
    {
      id: 'sheet_2',
      name: 'Rent Collection Report',
      url: 'https://docs.google.com/spreadsheets/d/sheet_2/edit',
      lastModified: '2024-07-16T14:30:00Z',
      owner: 'manager@premiumproperties.com',
      sharedWith: ['admin@premiumproperties.com'],
      worksheets: [
        { id: 'ws_4', name: 'Monthly Collections', rowCount: 60, colCount: 15 },
        { id: 'ws_5', name: 'Outstanding Balances', rowCount: 20, colCount: 8 }
      ],
      syncStatus: 'syncing',
      syncDirection: 'import',
      lastSync: '2024-07-16T14:30:00Z',
      template: 'rent_collection'
    },
    {
      id: 'sheet_3',
      name: 'Tenant Information Database',
      url: 'https://docs.google.com/spreadsheets/d/sheet_3/edit',
      lastModified: '2024-07-15T10:20:00Z',
      owner: 'staff@premiumproperties.com',
      sharedWith: ['manager@premiumproperties.com'],
      worksheets: [
        { id: 'ws_6', name: 'Current Tenants', rowCount: 45, colCount: 20 },
        { id: 'ws_7', name: 'Lease Renewals', rowCount: 12, colCount: 10 }
      ],
      syncStatus: 'error',
      syncDirection: 'export',
      lastSync: '2024-07-15T09:15:00Z',
      template: 'tenant_management'
    },
    {
      id: 'sheet_4',
      name: 'Maintenance Work Orders',
      url: 'https://docs.google.com/spreadsheets/d/sheet_4/edit',
      lastModified: '2024-07-14T16:00:00Z',
      owner: 'admin@premiumproperties.com',
      sharedWith: ['manager@premiumproperties.com', 'staff@premiumproperties.com'],
      worksheets: [
        { id: 'ws_8', name: 'Open Work Orders', rowCount: 28, colCount: 18 },
        { id: 'ws_9', name: 'Completed Tasks', rowCount: 150, colCount: 15 },
        { id: 'ws_10', name: 'Vendor Directory', rowCount: 25, colCount: 12 }
      ],
      syncStatus: 'disconnected',
      syncDirection: 'bidirectional',
      lastSync: '2024-07-13T11:45:00Z',
      template: 'maintenance_tracking'
    }
  ],
  templates: [
    {
      id: 'property_portfolio',
      name: 'Property Portfolio Dashboard',
      description: 'Comprehensive property overview with financial metrics and performance tracking',
      category: 'property',
      worksheets: ['Properties Overview', 'Financial Summary', 'Performance Metrics'],
      fields: ['Property Name', 'Address', 'Units', 'Monthly Rent', 'Occupancy Rate', 'NOI'],
      sampleSpreadsheetUrl: 'https://docs.google.com/spreadsheets/d/template_1/copy'
    },
    {
      id: 'rent_collection',
      name: 'Rent Collection Tracker',
      description: 'Monthly rent collection tracking with payment status and outstanding balances',
      category: 'financial',
      worksheets: ['Monthly Collections', 'Outstanding Balances', 'Payment History'],
      fields: ['Tenant Name', 'Unit', 'Rent Amount', 'Payment Date', 'Status', 'Balance Due'],
      sampleSpreadsheetUrl: 'https://docs.google.com/spreadsheets/d/template_2/copy'
    },
    {
      id: 'tenant_management',
      name: 'Tenant Management System',
      description: 'Complete tenant information database with lease tracking and renewals',
      category: 'tenant',
      worksheets: ['Current Tenants', 'Lease Renewals', 'Move-ins/Move-outs'],
      fields: ['Full Name', 'Unit Number', 'Lease Start', 'Lease End', 'Contact Info', 'Emergency Contact'],
      sampleSpreadsheetUrl: 'https://docs.google.com/spreadsheets/d/template_3/copy'
    },
    {
      id: 'maintenance_tracking',
      name: 'Maintenance Work Order System',
      description: 'Track maintenance requests, work orders, and vendor management',
      category: 'maintenance',
      worksheets: ['Open Work Orders', 'Completed Tasks', 'Vendor Directory', 'Cost Analysis'],
      fields: ['Work Order ID', 'Property', 'Unit', 'Issue Type', 'Priority', 'Assigned To', 'Status'],
      sampleSpreadsheetUrl: 'https://docs.google.com/spreadsheets/d/template_4/copy'
    }
  ],
  syncStatus: {
    lastSync: '2024-07-16 16:45:00',
    status: 'connected',
    connectedSheets: 3,
    totalRows: 425,
    errors: 1,
    successfulSyncs: 47,
    failedSyncs: 1
  }
}

export default function GoogleSheetsIntegration() {
  const { currentEntity } = useAuth()
  const [isConnected, setIsConnected] = useState(true) // Mock connected state
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState(false)

  const handleConnect = async () => {
    // Mock Google OAuth flow - replace with real Google Sheets OAuth
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${window.location.origin}/dashboard/integrations/google-sheets/callback`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/userinfo.profile',
      access_type: 'offline',
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

  const handleCreateFromTemplate = async (templateId: string) => {
    setShowTemplateModal(false)
    const template = mockGoogleSheetsData.templates.find(t => t.id === templateId)
    if (template) {
      // Mock create spreadsheet from template
      console.log(`Creating spreadsheet from template: ${template.name}`)
      window.open(template.sampleSpreadsheetUrl, '_blank')
    }
  }

  const handleConnectSpreadsheet = async (spreadsheetId: string) => {
    setShowSpreadsheetModal(false)
    // Mock connect existing spreadsheet
    console.log(`Connecting spreadsheet: ${spreadsheetId}`)
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'spreadsheets', name: 'Spreadsheets', icon: FileSpreadsheet },
    { id: 'templates', name: 'Templates', icon: FolderOpen },
    { id: 'sync', name: 'Sync Settings', icon: RefreshCw },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'syncing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'disconnected':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-3 h-3" />
      case 'syncing':
        return <RefreshCw className="w-3 h-3 animate-spin" />
      case 'error':
        return <XCircle className="w-3 h-3" />
      case 'disconnected':
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <FileSpreadsheet className="w-3 h-3" />
    }
  }

  const getSyncDirectionBadge = (direction: string) => {
    switch (direction) {
      case 'bidirectional':
        return <Badge variant="outline" className="text-xs border-blue-600 text-blue-400">↕️ Both Ways</Badge>
      case 'import':
        return <Badge variant="outline" className="text-xs border-green-600 text-green-400">⬇️ Import Only</Badge>
      case 'export':
        return <Badge variant="outline" className="text-xs border-orange-600 text-orange-400">⬆️ Export Only</Badge>
      default:
        return <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">Not Set</Badge>
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
              <span className="text-white">Google Sheets</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Google Sheets</h1>
                <p className="text-slate-400">Real-time spreadsheet synchronization and collaboration</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              {mockGoogleSheetsData.syncStatus.connectedSheets} Sheets Connected
            </Badge>
          )}

          <PermissionGuard permission="entity.integrations.sheets.read">
            {isConnected ? (
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync All
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Connect Google Sheets
              </Button>
            )}
          </PermissionGuard>
        </div>
      </div>

      {!isConnected ? (
        /* Connection Setup */
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileSpreadsheet className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Connect Google Sheets</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Sync property data in real-time with Google Sheets. Create collaborative dashboards,
              reports, and data management spreadsheets for {currentEntity?.name}.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <RefreshCw className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Real-time Sync</p>
                <p className="text-xs text-slate-400">Bidirectional data sync</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Team Collaboration</p>
                <p className="text-xs text-slate-400">Multi-user editing</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <FolderOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Templates</p>
                <p className="text-xs text-slate-400">Pre-built spreadsheets</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Live Reports</p>
                <p className="text-xs text-slate-400">Dynamic dashboards</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">Secure & Private</span>
              </div>
              <p className="text-xs text-slate-400">
                We access only the spreadsheets you explicitly share with our integration.
                Your data remains private and secure within your Google account.
              </p>
            </div>

            <PermissionGuard permission="entity.integrations.sheets.connect">
              <Button
                onClick={handleConnect}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <FileSpreadsheet className="w-5 h-5 mr-2" />
                Connect Google Sheets
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
                  <CardTitle className="text-white">Google Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                      <FileSpreadsheet className="w-8 h-8 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{mockGoogleSheetsData.account.name}</h3>
                      <p className="text-slate-400">{mockGoogleSheetsData.account.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-slate-400">
                          Drive Storage: {mockGoogleSheetsData.account.driveQuota.usage} / {mockGoogleSheetsData.account.driveQuota.limit}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sync Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <FileSpreadsheet className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Connected Sheets</p>
                        <p className="text-2xl font-bold text-white">{mockGoogleSheetsData.syncStatus.connectedSheets}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Table className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Total Rows</p>
                        <p className="text-2xl font-bold text-white">{mockGoogleSheetsData.syncStatus.totalRows.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Successful Syncs</p>
                        <p className="text-2xl font-bold text-white">{mockGoogleSheetsData.syncStatus.successfulSyncs}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Last Sync</p>
                        <p className="text-sm font-medium text-white">
                          {new Date(mockGoogleSheetsData.syncStatus.lastSync).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedTab === 'spreadsheets' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Connected Spreadsheets</CardTitle>
                  <div className="flex items-center gap-2">
                    <PermissionGuard permission="entity.integrations.sheets.connect">
                      <Button
                        onClick={() => setShowSpreadsheetModal(true)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Connect Spreadsheet
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGoogleSheetsData.spreadsheets.map((spreadsheet) => (
                    <div key={spreadsheet.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{spreadsheet.name}</h4>
                            <p className="text-sm text-slate-400">
                              {spreadsheet.worksheets.length} worksheets • Modified {new Date(spreadsheet.lastModified).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500">Owner: {spreadsheet.owner}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getSyncStatusColor(spreadsheet.syncStatus)}>
                            {getSyncStatusIcon(spreadsheet.syncStatus)}
                            <span className="ml-1 capitalize">{spreadsheet.syncStatus}</span>
                          </Badge>
                          {getSyncDirectionBadge(spreadsheet.syncDirection)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">{spreadsheet.sharedWith.length + 1} collaborators</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Table className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">
                              {spreadsheet.worksheets.reduce((sum, ws) => sum + ws.rowCount, 0)} total rows
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <PermissionGuard permission="entity.integrations.sheets.read">
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Sync
                            </Button>
                          </PermissionGuard>
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>

                      {/* Worksheets */}
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <p className="text-xs text-slate-500 mb-2">Worksheets:</p>
                        <div className="flex flex-wrap gap-2">
                          {spreadsheet.worksheets.map((worksheet) => (
                            <Badge
                              key={worksheet.id}
                              variant="outline"
                              className="text-xs border-slate-600 text-slate-400"
                            >
                              {worksheet.name} ({worksheet.rowCount}×{worksheet.colCount})
                            </Badge>
                          ))}
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Spreadsheet Templates</CardTitle>
                    <p className="text-slate-400 text-sm">Pre-built Google Sheets templates for property management</p>
                  </div>
                  <PermissionGuard permission="entity.integrations.sheets.connect">
                    <Button
                      onClick={() => setShowTemplateModal(true)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create from Template
                    </Button>
                  </PermissionGuard>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockGoogleSheetsData.templates.map((template) => (
                    <div key={template.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">{template.name}</h4>
                        <p className="text-sm text-slate-400 mb-3">{template.description}</p>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Worksheets:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.worksheets.map((worksheet) => (
                                <Badge key={worksheet} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                                  {worksheet}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500 font-medium">Key Fields:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.fields.slice(0, 4).map((field) => (
                                <Badge key={field} className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                                  {field}
                                </Badge>
                              ))}
                              {template.fields.length > 4 && (
                                <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                                  +{template.fields.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <PermissionGuard permission="entity.integrations.sheets.connect">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-600 text-green-400 flex-1"
                            onClick={() => handleCreateFromTemplate(template.id)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Create Copy
                          </Button>
                        </PermissionGuard>
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'sync' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Sync Configuration</CardTitle>
                <p className="text-slate-400 text-sm">Configure how data syncs between Active Back Office and Google Sheets</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Sync Settings</h4>

                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Auto Sync</h5>
                        <p className="text-sm text-slate-400">Automatically sync changes in real-time</p>
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-400">
                        Enabled
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Sync Frequency</h5>
                        <p className="text-sm text-slate-400">How often to check for changes</p>
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-400">
                        Every 5 minutes
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Conflict Resolution</h5>
                        <p className="text-sm text-slate-400">How to handle data conflicts</p>
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-400">
                        ABO Wins
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Data Mapping</h4>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h5 className="text-white font-medium mb-2">Property Data</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">ABO Field</span>
                          <span className="text-slate-400">Sheet Column</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white">Property Name</span>
                          <span className="text-green-400">Column A</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white">Address</span>
                          <span className="text-green-400">Column B</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white">Monthly Rent</span>
                          <span className="text-green-400">Column C</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h5 className="text-white font-medium mb-2">Sync Direction</h5>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="sync-direction" defaultChecked className="text-green-500" />
                          <span className="text-white">↕️ Bidirectional (recommended)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="sync-direction" className="text-green-500" />
                          <span className="text-white">⬇️ Import only (Sheets → ABO)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="sync-direction" className="text-green-500" />
                          <span className="text-white">⬆️ Export only (ABO → Sheets)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'settings' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Google Sheets Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Real-time Collaboration</h4>
                      <p className="text-sm text-slate-400">Enable live editing with team members</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-sm text-slate-400">Get notified when sheets are updated</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Version History</h4>
                      <p className="text-sm text-slate-400">Track changes and maintain version history</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Data Validation</h4>
                      <p className="text-sm text-slate-400">Validate data before syncing to prevent errors</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <PermissionGuard permission="entity.integrations.sheets.connect">
                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Disconnect Google Sheets
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
              <CardTitle className="text-white">Create Spreadsheet from Template</CardTitle>
              <p className="text-slate-400">Choose a template to create a new Google Sheets spreadsheet</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockGoogleSheetsData.templates.map((template) => (
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
                    <div className="flex flex-wrap gap-1">
                      {template.worksheets.slice(0, 2).map((worksheet) => (
                        <Badge key={worksheet} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                          {worksheet}
                        </Badge>
                      ))}
                      {template.worksheets.length > 2 && (
                        <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                          +{template.worksheets.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={() => selectedTemplate && handleCreateFromTemplate(selectedTemplate)}
                  disabled={!selectedTemplate}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Spreadsheet
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

      {/* Connect Existing Spreadsheet Modal */}
      {showSpreadsheetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Connect Existing Spreadsheet</CardTitle>
              <p className="text-slate-400">Enter the URL or ID of an existing Google Sheets spreadsheet</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Spreadsheet URL or ID
                </label>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={() => handleConnectSpreadsheet('example_sheet_id')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect Spreadsheet
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSpreadsheetModal(false)}
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
