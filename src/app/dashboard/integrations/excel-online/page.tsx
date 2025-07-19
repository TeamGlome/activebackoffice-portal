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
  Link2,
  Building2,
  PieChart,
  Calculator,
  Grid3x3,
  Layers
} from "lucide-react"

// Mock Excel Online data - replace with real Microsoft Graph API integration
const mockExcelOnlineData = {
  account: {
    email: 'admin@premiumproperties.com',
    name: 'Premium Properties Admin',
    tenantId: 'tenant-12345',
    subscription: 'Microsoft 365 Business Premium',
    oneDriveQuota: {
      total: '1 TB',
      used: '234 GB',
      remaining: '790 GB'
    }
  },
  workbooks: [
    {
      id: 'workbook_1',
      name: 'Property Portfolio Analysis 2024',
      webUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/workbook_1',
      lastModifiedDateTime: '2024-07-16T16:45:00Z',
      createdDateTime: '2024-07-10T10:00:00Z',
      driveId: 'drive-123',
      itemId: 'item-456',
      worksheets: [
        { id: 'ws_1', name: 'Properties Overview', position: 0, visibility: 'Visible' },
        { id: 'ws_2', name: 'Financial Summary', position: 1, visibility: 'Visible' },
        { id: 'ws_3', name: 'ROI Analysis', position: 2, visibility: 'Visible' },
        { id: 'ws_4', name: 'Calculations', position: 3, visibility: 'Hidden' }
      ],
      syncStatus: 'connected',
      syncDirection: 'bidirectional',
      lastSync: '2024-07-16T16:45:00Z',
      hasCharts: true,
      hasPivotTables: true,
      hasFormulas: true,
      sharedWith: ['manager@premiumproperties.com', 'analyst@premiumproperties.com']
    },
    {
      id: 'workbook_2',
      name: 'Monthly Rent Collection Report',
      webUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/workbook_2',
      lastModifiedDateTime: '2024-07-16T14:30:00Z',
      createdDateTime: '2024-07-01T09:00:00Z',
      driveId: 'drive-123',
      itemId: 'item-789',
      worksheets: [
        { id: 'ws_5', name: 'Collection Summary', position: 0, visibility: 'Visible' },
        { id: 'ws_6', name: 'Outstanding Balances', position: 1, visibility: 'Visible' },
        { id: 'ws_7', name: 'Payment Trends', position: 2, visibility: 'Visible' }
      ],
      syncStatus: 'syncing',
      syncDirection: 'import',
      lastSync: '2024-07-16T14:30:00Z',
      hasCharts: true,
      hasPivotTables: false,
      hasFormulas: true,
      sharedWith: ['manager@premiumproperties.com']
    },
    {
      id: 'workbook_3',
      name: 'Maintenance Cost Analysis',
      webUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/workbook_3',
      lastModifiedDateTime: '2024-07-15T11:20:00Z',
      createdDateTime: '2024-06-15T08:30:00Z',
      driveId: 'drive-123',
      itemId: 'item-012',
      worksheets: [
        { id: 'ws_8', name: 'Cost Breakdown', position: 0, visibility: 'Visible' },
        { id: 'ws_9', name: 'Vendor Performance', position: 1, visibility: 'Visible' },
        { id: 'ws_10', name: 'Budget vs Actual', position: 2, visibility: 'Visible' }
      ],
      syncStatus: 'error',
      syncDirection: 'export',
      lastSync: '2024-07-15T09:15:00Z',
      hasCharts: false,
      hasPivotTables: true,
      hasFormulas: true,
      sharedWith: ['staff@premiumproperties.com']
    },
    {
      id: 'workbook_4',
      name: 'Tenant Lease Tracking',
      webUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/workbook_4',
      lastModifiedDateTime: '2024-07-14T16:00:00Z',
      createdDateTime: '2024-05-01T10:00:00Z',
      driveId: 'drive-123',
      itemId: 'item-345',
      worksheets: [
        { id: 'ws_11', name: 'Active Leases', position: 0, visibility: 'Visible' },
        { id: 'ws_12', name: 'Expiring Leases', position: 1, visibility: 'Visible' },
        { id: 'ws_13', name: 'Renewal Pipeline', position: 2, visibility: 'Visible' },
        { id: 'ws_14', name: 'Historical Data', position: 3, visibility: 'Hidden' }
      ],
      syncStatus: 'disconnected',
      syncDirection: 'bidirectional',
      lastSync: '2024-07-13T11:45:00Z',
      hasCharts: true,
      hasPivotTables: true,
      hasFormulas: true,
      sharedWith: ['manager@premiumproperties.com', 'staff@premiumproperties.com']
    }
  ],
  templates: [
    {
      id: 'excel_property_dashboard',
      name: 'Property Portfolio Dashboard',
      description: 'Comprehensive Excel dashboard with charts, pivot tables, and financial analysis',
      category: 'property',
      worksheets: ['Portfolio Overview', 'Property Details', 'Financial Metrics', 'Performance Charts'],
      features: ['Pivot Tables', 'Charts & Graphs', 'Conditional Formatting', 'Data Validation'],
      sampleWorkbookUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/template_1'
    },
    {
      id: 'excel_financial_analysis',
      name: 'Financial Analysis Workbook',
      description: 'Advanced financial modeling and analysis with ROI calculations and projections',
      category: 'financial',
      worksheets: ['Income Statement', 'Cash Flow', 'ROI Analysis', 'Budget vs Actual', 'Projections'],
      features: ['Advanced Formulas', 'Financial Charts', 'Scenario Analysis', 'Dynamic Tables'],
      sampleWorkbookUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/template_2'
    },
    {
      id: 'excel_tenant_management',
      name: 'Tenant Management System',
      description: 'Complete tenant tracking with lease management and renewal workflows',
      category: 'tenant',
      worksheets: ['Tenant Directory', 'Lease Schedule', 'Renewals', 'Move-in/Move-out', 'Communications'],
      features: ['Data Tables', 'Conditional Formatting', 'Automated Calculations', 'Date Tracking'],
      sampleWorkbookUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/template_3'
    },
    {
      id: 'excel_maintenance_tracker',
      name: 'Maintenance & Operations Tracker',
      description: 'Comprehensive maintenance management with cost tracking and vendor performance',
      category: 'maintenance',
      worksheets: ['Work Orders', 'Vendor Directory', 'Cost Analysis', 'Performance Metrics', 'Scheduling'],
      features: ['Pivot Tables', 'Cost Calculations', 'Status Tracking', 'Performance Charts'],
      sampleWorkbookUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/template_4'
    }
  ],
  syncStatus: {
    lastSync: '2024-07-16 16:45:00',
    status: 'connected',
    connectedWorkbooks: 3,
    totalWorksheets: 14,
    errors: 1,
    successfulSyncs: 52,
    failedSyncs: 1
  }
}

export default function ExcelOnlineIntegration() {
  const { currentEntity } = useAuth()
  const [isConnected, setIsConnected] = useState(true) // Mock connected state
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showWorkbookModal, setShowWorkbookModal] = useState(false)
  const [selectedWorkbook, setSelectedWorkbook] = useState<string | null>(null)
  const [selectedWorksheet, setSelectedWorksheet] = useState<string | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvSampleData, setCsvSampleData] = useState<string[][]>([])
  const [aiFieldMappings, setAiFieldMappings] = useState<AIFieldMapping[]>([])
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)

  const handleConnect = async () => {
    // Mock Microsoft OAuth flow - replace with real Microsoft Graph OAuth
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` + new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || 'demo_client_id',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/dashboard/integrations/excel-online/callback`,
      scope: 'https://graph.microsoft.com/Files.ReadWrite https://graph.microsoft.com/Sites.ReadWrite.All https://graph.microsoft.com/User.Read',
      response_mode: 'query',
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
    const template = mockExcelOnlineData.templates.find(t => t.id === templateId)
    if (template) {
      // Mock create workbook from template
      console.log(`Creating Excel workbook from template: ${template.name}`)
      window.open(template.sampleWorkbookUrl, '_blank')
    }
  }

  const handleConnectWorkbook = async (workbookUrl: string) => {
    setShowWorkbookModal(false)
    // Mock connect existing workbook
    console.log(`Connecting Excel workbook: ${workbookUrl}`)
  }

  const handleAnalyzeWorksheet = async (workbookId: string, worksheetId: string) => {
    const workbook = mockExcelOnlineData.workbooks.find(w => w.id === workbookId)
    const worksheet = workbook?.worksheets.find(w => w.id === worksheetId)

    if (workbook && worksheet) {
      // Mock Excel worksheet data extraction - in real implementation, use Microsoft Graph API
      const mockHeaders = ['Property Name', 'Address', 'Units', 'Monthly Rent', 'Occupancy Rate', 'NOI', 'Cap Rate', 'Last Updated']
      const mockSampleData = [
        ['Sunset Apartments', '123 Main St', '24', '$28,800', '95%', '$18,500', '6.2%', '2024-07-15'],
        ['Oak Grove Complex', '456 Oak Ave', '36', '$48,600', '92%', '$31,200', '5.8%', '2024-07-15'],
        ['Pine Valley', '789 Pine St', '18', '$19,800', '100%', '$14,200', '6.5%', '2024-07-14'],
        ['Cedar Heights', '321 Cedar Rd', '42', '$63,000', '88%', '$38,900', '5.4%', '2024-07-14'],
        ['Maple Court', '654 Maple Dr', '12', '$14,400', '100%', '$10,800', '7.1%', '2024-07-13']
      ]

      setSelectedWorkbook(workbookId)
      setSelectedWorksheet(worksheetId)
      setCsvHeaders(mockHeaders)
      setCsvSampleData(mockSampleData)
      setShowAIAnalysis(true)
    }
  }

  const handleAIFieldMappingChange = (mappings: AIFieldMapping[]) => {
    setAiFieldMappings(mappings)
  }

  const handleAITemplateSelect = (templateId: string) => {
    // Handle template selection
  }

  const handleAIImportStart = () => {
    // Mock final import with AI mappings
    console.log('Starting AI-enhanced Excel import with mappings:', aiFieldMappings)
    setShowAIAnalysis(false)
    // Reset state
    setSelectedWorkbook(null)
    setSelectedWorksheet(null)
    setCsvHeaders([])
    setCsvSampleData([])
    setAiFieldMappings([])
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'workbooks', name: 'Workbooks', icon: FileSpreadsheet },
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

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'pivot tables':
        return <Grid3x3 className="w-3 h-3" />
      case 'charts & graphs':
      case 'charts':
        return <PieChart className="w-3 h-3" />
      case 'advanced formulas':
      case 'formulas':
        return <Calculator className="w-3 h-3" />
      case 'conditional formatting':
        return <Layers className="w-3 h-3" />
      default:
        return <Table className="w-3 h-3" />
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
              <span className="text-white">Excel Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Excel Online</h1>
                <p className="text-slate-400">Advanced spreadsheet analysis with charts and pivot tables</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              {mockExcelOnlineData.syncStatus.connectedWorkbooks} Workbooks Connected
            </Badge>
          )}

          <PermissionGuard permission="entity.integrations.excel.read">
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
                Connect Excel Online
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
            <h2 className="text-2xl font-bold text-white mb-3">Connect Excel Online</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Sync property data with Excel Online workbooks. Create advanced dashboards with charts,
              pivot tables, and complex formulas for {currentEntity?.name}.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <PieChart className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Charts & Graphs</p>
                <p className="text-xs text-slate-400">Visual analytics</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Grid3x3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Pivot Tables</p>
                <p className="text-xs text-slate-400">Data summarization</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Calculator className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Advanced Formulas</p>
                <p className="text-xs text-slate-400">Complex calculations</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <RefreshCw className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Real-time Sync</p>
                <p className="text-xs text-slate-400">Live data updates</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">Microsoft 365 Integration</span>
              </div>
              <p className="text-xs text-slate-400">
                Seamless integration with your Microsoft 365 environment. Access workbooks from OneDrive
                and SharePoint with enterprise-grade security.
              </p>
            </div>

            <PermissionGuard permission="entity.integrations.excel.connect">
              <Button
                onClick={handleConnect}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <FileSpreadsheet className="w-5 h-5 mr-2" />
                Connect Excel Online
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
                  <CardTitle className="text-white">Microsoft 365 Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                      <FileSpreadsheet className="w-8 h-8 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{mockExcelOnlineData.account.name}</h3>
                      <p className="text-slate-400">{mockExcelOnlineData.account.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-slate-400">
                          Subscription: {mockExcelOnlineData.account.subscription}
                        </span>
                        <span className="text-slate-400">
                          OneDrive: {mockExcelOnlineData.account.oneDriveQuota.used} / {mockExcelOnlineData.account.oneDriveQuota.total}
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
                        <p className="text-sm text-slate-400">Connected Workbooks</p>
                        <p className="text-2xl font-bold text-white">{mockExcelOnlineData.syncStatus.connectedWorkbooks}</p>
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
                        <p className="text-sm text-slate-400">Total Worksheets</p>
                        <p className="text-2xl font-bold text-white">{mockExcelOnlineData.syncStatus.totalWorksheets}</p>
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
                        <p className="text-2xl font-bold text-white">{mockExcelOnlineData.syncStatus.successfulSyncs}</p>
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
                          {new Date(mockExcelOnlineData.syncStatus.lastSync).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedTab === 'workbooks' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Excel Workbooks</CardTitle>
                  <div className="flex items-center gap-2">
                    <PermissionGuard permission="entity.integrations.excel.connect">
                      <Button
                        onClick={() => setShowWorkbookModal(true)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Connect Workbook
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockExcelOnlineData.workbooks.map((workbook) => (
                    <div key={workbook.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{workbook.name}</h4>
                            <p className="text-sm text-slate-400">
                              {workbook.worksheets.filter(w => w.visibility === 'Visible').length} worksheets •
                              Modified {new Date(workbook.lastModifiedDateTime).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {workbook.hasCharts && (
                                <Badge variant="outline" className="text-xs border-blue-600 text-blue-400">
                                  <PieChart className="w-3 h-3 mr-1" />
                                  Charts
                                </Badge>
                              )}
                              {workbook.hasPivotTables && (
                                <Badge variant="outline" className="text-xs border-purple-600 text-purple-400">
                                  <Grid3x3 className="w-3 h-3 mr-1" />
                                  Pivot Tables
                                </Badge>
                              )}
                              {workbook.hasFormulas && (
                                <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                                  <Calculator className="w-3 h-3 mr-1" />
                                  Formulas
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getSyncStatusColor(workbook.syncStatus)}>
                            {getSyncStatusIcon(workbook.syncStatus)}
                            <span className="ml-1 capitalize">{workbook.syncStatus}</span>
                          </Badge>
                          {getSyncDirectionBadge(workbook.syncDirection)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">{workbook.sharedWith.length + 1} collaborators</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Table className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">{workbook.worksheets.length} worksheets</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <PermissionGuard permission="entity.integrations.excel.read">
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
                        <div className="grid grid-cols-2 gap-2">
                          {workbook.worksheets.filter(w => w.visibility === 'Visible').map((worksheet) => (
                            <button
                              key={worksheet.id}
                              onClick={() => handleAnalyzeWorksheet(workbook.id, worksheet.id)}
                              className="p-2 bg-slate-600/50 rounded border border-slate-500 hover:bg-slate-600/70 transition-colors text-left"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-white">{worksheet.name}</span>
                                <Badge variant="outline" className="text-xs border-blue-600 text-blue-400">
                                  AI Import
                                </Badge>
                              </div>
                            </button>
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
                    <CardTitle className="text-white">Excel Templates</CardTitle>
                    <p className="text-slate-400 text-sm">Pre-built Excel workbooks for property management</p>
                  </div>
                  <PermissionGuard permission="entity.integrations.excel.connect">
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
                  {mockExcelOnlineData.templates.map((template) => (
                    <div key={template.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">{template.name}</h4>
                        <p className="text-sm text-slate-400 mb-3">{template.description}</p>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Worksheets:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.worksheets.slice(0, 3).map((worksheet) => (
                                <Badge key={worksheet} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                                  {worksheet}
                                </Badge>
                              ))}
                              {template.worksheets.length > 3 && (
                                <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                                  +{template.worksheets.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500 font-medium">Features:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.features.map((feature) => (
                                <Badge key={feature} className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                                  {getFeatureIcon(feature)}
                                  <span className="ml-1">{feature}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <PermissionGuard permission="entity.integrations.excel.connect">
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
                <p className="text-slate-400 text-sm">Configure how data syncs between Active Back Office and Excel Online</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Sync Settings</h4>

                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Real-time Sync</h5>
                        <p className="text-sm text-slate-400">Sync changes instantly when workbooks are modified</p>
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-400">
                        Enabled
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Formula Preservation</h5>
                        <p className="text-sm text-slate-400">Maintain Excel formulas during sync operations</p>
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-400">
                        Enabled
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Chart Sync</h5>
                        <p className="text-sm text-slate-400">Update charts and graphs with new data</p>
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-400">
                        Enabled
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Advanced Features</h4>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h5 className="text-white font-medium mb-2">Excel Features Support</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Pivot Tables</span>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Supported</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Charts & Graphs</span>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Supported</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Advanced Formulas</span>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Supported</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Conditional Formatting</span>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Supported</Badge>
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
                          <span className="text-white">⬇️ Import only (Excel → ABO)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="sync-direction" className="text-green-500" />
                          <span className="text-white">⬆️ Export only (ABO → Excel)</span>
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
                <CardTitle className="text-white">Excel Online Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Auto-save Changes</h4>
                      <p className="text-sm text-slate-400">Automatically save changes to Excel workbooks</p>
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
                      <h4 className="text-white font-medium">Collaboration Notifications</h4>
                      <p className="text-sm text-slate-400">Get notified when workbooks are updated by team members</p>
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
                  <PermissionGuard permission="entity.integrations.excel.connect">
                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Disconnect Excel Online
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
              <CardTitle className="text-white">Create Excel Workbook from Template</CardTitle>
              <p className="text-slate-400">Choose a template to create a new Excel Online workbook</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockExcelOnlineData.templates.map((template) => (
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
                      {template.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                          {getFeatureIcon(feature)}
                          <span className="ml-1">{feature}</span>
                        </Badge>
                      ))}
                      {template.features.length > 2 && (
                        <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                          +{template.features.length - 2} more
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
                  Create Workbook
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

      {/* Connect Existing Workbook Modal */}
      {showWorkbookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Connect Existing Workbook</CardTitle>
              <p className="text-slate-400">Enter the URL of an existing Excel Online workbook</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Workbook URL
                </label>
                <input
                  type="text"
                  placeholder="https://[tenant]-my.sharepoint.com/:x:/g/personal/[user]/[workbook-id]"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={() => handleConnectWorkbook('example_workbook_url')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect Workbook
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowWorkbookModal(false)}
                  className="border-slate-600 text-slate-400"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAIAnalysis && selectedWorkbook && selectedWorksheet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-white">AI-Enhanced Excel Import Analysis</h2>
                <p className="text-slate-400">
                  {mockExcelOnlineData.workbooks.find(w => w.id === selectedWorkbook)?.name} -
                  {mockExcelOnlineData.workbooks.find(w => w.id === selectedWorkbook)?.worksheets.find(ws => ws.id === selectedWorksheet)?.name}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAIAnalysis(false)}
                className="border-slate-600 text-slate-400"
              >
                Close
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                <AIImportAnalysis
                  fileName={`${mockExcelOnlineData.workbooks.find(w => w.id === selectedWorkbook)?.name} - ${mockExcelOnlineData.workbooks.find(w => w.id === selectedWorkbook)?.worksheets.find(ws => ws.id === selectedWorksheet)?.name}`}
                  headers={csvHeaders}
                  sampleData={csvSampleData}
                  onFieldMappingChange={handleAIFieldMappingChange}
                  onTemplateSelect={handleAITemplateSelect}
                  onImportStart={handleAIImportStart}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
