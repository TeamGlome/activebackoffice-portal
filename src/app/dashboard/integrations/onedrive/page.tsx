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
  Cloud,
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
  Building2,
  Calendar,
  Users
} from "lucide-react"

// Mock OneDrive data - replace with real Microsoft Graph API integration
const mockOneDriveData = {
  account: {
    email: 'admin@premiumproperties.com',
    name: 'Premium Properties Admin',
    profilePicture: null,
    tenantId: 'tenant-12345',
    subscription: 'Microsoft 365 Business Premium',
    storageQuota: {
      total: '1 TB',
      used: '156 GB',
      remaining: '868 GB'
    }
  },
  files: [
    {
      id: 'file_1',
      name: 'Property_Database_2024.csv',
      size: 324567,
      lastModifiedDateTime: '2024-07-16T15:30:00Z',
      createdDateTime: '2024-07-15T10:00:00Z',
      webUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/file_1',
      parentReference: {
        driveId: 'drive-123',
        path: '/drive/root:/Property Management'
      },
      status: 'ready_to_import',
      fileType: 'csv'
    },
    {
      id: 'file_2',
      name: 'Lease_Agreements_Q3.xlsx',
      size: 892340,
      lastModifiedDateTime: '2024-07-14T09:15:00Z',
      createdDateTime: '2024-07-14T09:15:00Z',
      webUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/file_2',
      parentReference: {
        driveId: 'drive-123',
        path: '/drive/root:/Legal Documents'
      },
      status: 'imported',
      fileType: 'xlsx'
    },
    {
      id: 'file_3',
      name: 'Maintenance_Schedule.csv',
      size: 167890,
      lastModifiedDateTime: '2024-07-13T14:20:00Z',
      createdDateTime: '2024-07-13T14:20:00Z',
      webUrl: 'https://premiumproperties-my.sharepoint.com/:x:/g/personal/admin_premiumproperties_com/file_3',
      parentReference: {
        driveId: 'drive-123',
        path: '/drive/root:/Operations'
      },
      status: 'error',
      fileType: 'csv'
    }
  ],
  sharePointSites: [
    {
      id: 'site_1',
      name: 'Property Management Hub',
      webUrl: 'https://premiumproperties.sharepoint.com/sites/propertymanagement',
      description: 'Central hub for property management documents and workflows',
      isConnected: true,
      documentLibraries: ['Documents', 'Property Files', 'Contracts']
    },
    {
      id: 'site_2',
      name: 'Financial Operations',
      webUrl: 'https://premiumproperties.sharepoint.com/sites/financial',
      description: 'Financial documents and accounting records',
      isConnected: false,
      documentLibraries: ['Financial Records', 'Invoices', 'Reports']
    }
  ],
  drives: [
    {
      id: 'drive-123',
      name: 'OneDrive - Premium Properties',
      driveType: 'personal',
      owner: 'admin@premiumproperties.com',
      quota: {
        total: 1099511627776, // 1TB in bytes
        used: 167503724544,   // 156GB in bytes
        remaining: 932007903232
      }
    },
    {
      id: 'drive-456',
      name: 'Property Management Hub - Documents',
      driveType: 'documentLibrary',
      owner: 'Property Management Hub',
      quota: {
        total: 26843545600, // 25GB in bytes
        used: 5368709120,   // 5GB in bytes
        remaining: 21474836480
      }
    }
  ],
  syncStatus: {
    lastSync: '2024-07-16 14:45:00',
    status: 'connected',
    filesImported: 34,
    errors: 1,
    connectedSites: 1,
    connectedDrives: 2
  }
}

export default function OneDriveIntegration() {
  const { currentEntity } = useAuth()
  const [isConnected, setIsConnected] = useState(true) // Mock connected state
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showSiteModal, setShowSiteModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ id: string; name: string } | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvSampleData, setCsvSampleData] = useState<string[][]>([])
  const [aiFieldMappings, setAiFieldMappings] = useState<AIFieldMapping[]>([])
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)

  const handleConnect = async () => {
    // Mock Microsoft OAuth flow - replace with real Microsoft Graph OAuth
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` + new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || 'demo_client_id',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/dashboard/integrations/onedrive/callback`,
      scope: 'https://graph.microsoft.com/Files.Read https://graph.microsoft.com/Sites.Read.All https://graph.microsoft.com/User.Read',
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

  const handleConnectSite = async (siteId: string) => {
    setShowSiteModal(false)
    // Mock SharePoint site connection
    console.log(`Connecting SharePoint site ${siteId}`)
  }

  const handleImportFile = async (fileId: string, fileName: string) => {
    // Mock CSV parsing - in real implementation, fetch and parse the actual file
    const mockHeaders = ['Property Name', 'Address', 'Units', 'Monthly Rent', 'Tenant Name', 'Phone', 'Email', 'Lease Start']
    const mockSampleData = [
      ['Sunset Apartments', '123 Main St', '24', '$1200', 'John Smith', '(555) 123-4567', 'john@email.com', '2024-01-15'],
      ['Oak Grove Complex', '456 Oak Ave', '36', '$1350', 'Sarah Johnson', '(555) 987-6543', 'sarah@email.com', '2024-03-01'],
      ['Pine Valley', '789 Pine St', '18', '$1100', 'Mike Davis', '(555) 555-0123', 'mike@email.com', '2024-02-01'],
      ['Cedar Heights', '321 Cedar Rd', '42', '$1500', 'Lisa Chen', '(555) 444-5555', 'lisa@email.com', '2024-04-15'],
      ['Maple Court', '654 Maple Dr', '12', '$1000', 'Tom Wilson', '(555) 777-8888', 'tom@email.com', '2024-01-30']
    ]

    setSelectedFile({ id: fileId, name: fileName })
    setCsvHeaders(mockHeaders)
    setCsvSampleData(mockSampleData)
    setShowAIAnalysis(true)
  }

  const handleAIFieldMappingChange = (mappings: AIFieldMapping[]) => {
    setAiFieldMappings(mappings)
  }

  const handleAITemplateSelect = (templateId: string) => {
    // Handle template selection
  }

  const handleAIImportStart = () => {
    // Mock final import with AI mappings
    console.log('Starting AI-enhanced import with mappings:', aiFieldMappings)
    setShowAIAnalysis(false)
    // Reset state
    setSelectedFile(null)
    setCsvHeaders([])
    setCsvSampleData([])
    setAiFieldMappings([])
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Cloud },
    { id: 'files', name: 'OneDrive Files', icon: FileText },
    { id: 'sharepoint', name: 'SharePoint Sites', icon: Building2 },
    { id: 'drives', name: 'Connected Drives', icon: FolderOpen },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileStatusColor = (status: string) => {
    switch (status) {
      case 'ready_to_import':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'imported':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'not_supported':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getFileStatusIcon = (status: string) => {
    switch (status) {
      case 'ready_to_import':
        return <Upload className="w-3 h-3" />
      case 'imported':
        return <CheckCircle className="w-3 h-3" />
      case 'error':
        return <XCircle className="w-3 h-3" />
      case 'not_supported':
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <FileText className="w-3 h-3" />
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
              <span className="text-white">OneDrive & SharePoint</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">OneDrive & SharePoint</h1>
                <p className="text-slate-400">Microsoft 365 integration with SharePoint support</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected to Microsoft 365
            </Badge>
          )}

          <PermissionGuard permission="entity.integrations.storage.import">
            {isConnected ? (
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Files
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Cloud className="w-4 h-4 mr-2" />
                Connect Microsoft 365
              </Button>
            )}
          </PermissionGuard>
        </div>
      </div>

      {!isConnected ? (
        /* Connection Setup */
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cloud className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Connect Microsoft 365</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Access your OneDrive files and SharePoint sites. Import property data from Excel and CSV files
              stored across your Microsoft 365 environment for {currentEntity?.name}.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Cloud className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">OneDrive Files</p>
                <p className="text-xs text-slate-400">Personal file storage</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Building2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">SharePoint Sites</p>
                <p className="text-xs text-slate-400">Team collaboration</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Excel Import</p>
                <p className="text-xs text-slate-400">Spreadsheet data</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Team Access</p>
                <p className="text-xs text-slate-400">Shared document libraries</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">Enterprise Security</span>
              </div>
              <p className="text-xs text-slate-400">
                Leverages Microsoft's enterprise-grade security and compliance features.
                Your data remains within your Microsoft 365 tenant.
              </p>
            </div>

            <PermissionGuard permission="entity.integrations.storage.connect">
              <Button
                onClick={handleConnect}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Cloud className="w-5 h-5 mr-2" />
                Connect Microsoft 365
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
                      <Cloud className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{mockOneDriveData.account.name}</h3>
                      <p className="text-slate-400">{mockOneDriveData.account.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-slate-400">
                          Subscription: {mockOneDriveData.account.subscription}
                        </span>
                        <span className="text-slate-400">
                          Storage: {mockOneDriveData.account.storageQuota.used} / {mockOneDriveData.account.storageQuota.total}
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
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Files Imported</p>
                        <p className="text-2xl font-bold text-white">{mockOneDriveData.syncStatus.filesImported}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">SharePoint Sites</p>
                        <p className="text-2xl font-bold text-white">{mockOneDriveData.syncStatus.connectedSites}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Connected Drives</p>
                        <p className="text-2xl font-bold text-white">{mockOneDriveData.syncStatus.connectedDrives}</p>
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
                          {new Date(mockOneDriveData.syncStatus.lastSync).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedTab === 'files' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">OneDrive Files</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                      <Filter className="w-3 h-3 mr-1" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                      <Search className="w-3 h-3 mr-1" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOneDriveData.files.map((file) => (
                    <div key={file.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{file.name}</h4>
                            <p className="text-sm text-slate-400">
                              {formatFileSize(file.size)} • Modified {new Date(file.lastModifiedDateTime).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500">{file.parentReference.path}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getFileStatusColor(file.status)}>
                            {getFileStatusIcon(file.status)}
                            <span className="ml-1 capitalize">{file.status.replace('_', ' ')}</span>
                          </Badge>
                          <div className="flex items-center gap-2">
                            {file.status === 'ready_to_import' && (
                              <PermissionGuard permission="entity.integrations.storage.import">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-600 text-blue-400"
                                  onClick={() => handleImportFile(file.id, file.name)}
                                >
                                  <Upload className="w-3 h-3 mr-1" />
                                  AI Import
                                </Button>
                              </PermissionGuard>
                            )}
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'sharepoint' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">SharePoint Sites</CardTitle>
                  <PermissionGuard permission="entity.integrations.storage.connect">
                    <Button
                      onClick={() => setShowSiteModal(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Connect Site
                    </Button>
                  </PermissionGuard>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOneDriveData.sharePointSites.map((site) => (
                    <div key={site.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{site.name}</h4>
                            <p className="text-sm text-slate-400">{site.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {site.documentLibraries.slice(0, 2).map((library) => (
                                <Badge key={library} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  {library}
                                </Badge>
                              ))}
                              {site.documentLibraries.length > 2 && (
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  +{site.documentLibraries.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {site.isConnected ? (
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">
                              Not Connected
                            </Badge>
                          )}
                          <PermissionGuard permission="entity.integrations.storage.connect">
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

          {selectedTab === 'drives' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Connected Drives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOneDriveData.drives.map((drive) => (
                    <div key={drive.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{drive.name}</h4>
                            <p className="text-sm text-slate-400">
                              {drive.driveType === 'personal' ? 'Personal OneDrive' : 'SharePoint Document Library'}
                            </p>
                            <p className="text-xs text-slate-500">Owner: {drive.owner}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">
                            {formatFileSize(drive.quota.used)} / {formatFileSize(drive.quota.total)}
                          </p>
                          <div className="w-32 bg-slate-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(drive.quota.used / drive.quota.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'settings' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">OneDrive & SharePoint Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Auto Import from OneDrive</h4>
                      <p className="text-sm text-slate-400">Automatically import CSV and Excel files from personal OneDrive</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">SharePoint Integration</h4>
                      <p className="text-sm text-slate-400">Access team files from connected SharePoint sites</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">File Type Support</h4>
                      <p className="text-sm text-slate-400">Support for CSV, Excel (.xlsx), and text files</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Configured
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Team Notifications</h4>
                      <p className="text-sm text-slate-400">Notify team members when files are imported from SharePoint</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <PermissionGuard permission="entity.integrations.storage.connect">
                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Disconnect Microsoft 365
                    </Button>
                  </PermissionGuard>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* SharePoint Site Connection Modal */}
      {showSiteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Connect SharePoint Site</CardTitle>
              <p className="text-slate-400">Select SharePoint sites to connect for file access</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {mockOneDriveData.sharePointSites.filter(site => !site.isConnected).map((site) => (
                  <button
                    key={site.id}
                    onClick={() => handleConnectSite(site.id)}
                    className="w-full p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700/70 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-blue-400" />
                      <div>
                        <h4 className="text-white font-medium">{site.name}</h4>
                        <p className="text-sm text-slate-400">{site.description}</p>
                        <p className="text-xs text-slate-500 mt-1">{site.webUrl}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSiteModal(false)}
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
      {showAIAnalysis && selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-white">AI-Enhanced Import Analysis</h2>
                <p className="text-slate-400">{selectedFile.name}</p>
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
                  fileName={selectedFile.name}
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
