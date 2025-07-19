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
  Users,
  Calendar,
  Share
} from "lucide-react"

// Mock Dropbox data - replace with real Dropbox API integration
const mockDropboxData = {
  account: {
    email: 'admin@premiumproperties.com',
    name: 'Premium Properties Admin',
    accountId: 'dbid:AAAabc123def456',
    accountType: 'business',
    teamName: 'Premium Properties Team',
    country: 'US',
    locale: 'en',
    quotaInfo: {
      quota: 5368709120000, // 5TB in bytes
      used: 589934592000,   // 549GB in bytes
      allocation: 'team'
    }
  },
  files: [
    {
      id: 'id:abc123',
      name: 'Property_Import_Template.csv',
      pathLower: '/property management/imports/property_import_template.csv',
      pathDisplay: '/Property Management/Imports/Property_Import_Template.csv',
      size: 125467,
      serverModified: '2024-07-16T15:30:00Z',
      clientModified: '2024-07-16T15:30:00Z',
      rev: '5e4a2b123456789',
      contentHash: 'abc123def456',
      isDownloadable: true,
      status: 'ready_to_import',
      sharedFolderId: 'folder123'
    },
    {
      id: 'id:def456',
      name: 'Tenant_Data_July_2024.csv',
      pathLower: '/property management/tenant data/tenant_data_july_2024.csv',
      pathDisplay: '/Property Management/Tenant Data/Tenant_Data_July_2024.csv',
      size: 89340,
      serverModified: '2024-07-14T09:15:00Z',
      clientModified: '2024-07-14T09:15:00Z',
      rev: '6f5b3c234567890',
      contentHash: 'def456ghi789',
      isDownloadable: true,
      status: 'imported',
      sharedFolderId: 'folder123'
    },
    {
      id: 'id:ghi789',
      name: 'Financial_Report_Q2.xlsx',
      pathLower: '/financial/reports/financial_report_q2.xlsx',
      pathDisplay: '/Financial/Reports/Financial_Report_Q2.xlsx',
      size: 456780,
      serverModified: '2024-07-13T14:20:00Z',
      clientModified: '2024-07-13T14:20:00Z',
      rev: '7g6c4d345678901',
      contentHash: 'ghi789jkl012',
      isDownloadable: true,
      status: 'not_supported',
      sharedFolderId: 'folder456'
    }
  ],
  sharedFolders: [
    {
      sharedFolderId: 'folder123',
      name: 'Property Management',
      pathLower: '/property management',
      pathDisplay: '/Property Management',
      accessType: 'owner',
      isInsideTeamFolder: true,
      isTeamFolder: false,
      policy: {
        resolvedMemberPolicy: 'team',
        acl_update_policy: 'owner',
        shared_link_policy: 'members'
      },
      previewUrl: 'https://www.dropbox.com/scl/fo/folder123',
      isMonitored: true,
      fileCount: 24
    },
    {
      sharedFolderId: 'folder456',
      name: 'Financial Reports',
      pathLower: '/financial',
      pathDisplay: '/Financial',
      accessType: 'viewer',
      isInsideTeamFolder: true,
      isTeamFolder: false,
      policy: {
        resolvedMemberPolicy: 'team',
        acl_update_policy: 'editors',
        shared_link_policy: 'members'
      },
      previewUrl: 'https://www.dropbox.com/scl/fo/folder456',
      isMonitored: false,
      fileCount: 12
    },
    {
      sharedFolderId: 'folder789',
      name: 'Legal Documents',
      pathLower: '/legal documents',
      pathDisplay: '/Legal Documents',
      accessType: 'editor',
      isInsideTeamFolder: true,
      isTeamFolder: false,
      policy: {
        resolvedMemberPolicy: 'team',
        acl_update_policy: 'editors',
        shared_link_policy: 'members'
      },
      previewUrl: 'https://www.dropbox.com/scl/fo/folder789',
      isMonitored: false,
      fileCount: 67
    }
  ],
  teamInfo: {
    name: 'Premium Properties Team',
    teamId: 'dbtid:team123456',
    numLicensedUsers: 15,
    numProvisionedUsers: 12,
    policies: {
      sharing: 'allow_team_sharing',
      emm_state: 'disabled',
      office_addin: 'enabled'
    }
  },
  syncStatus: {
    lastSync: '2024-07-16 16:00:00',
    status: 'connected',
    filesImported: 18,
    errors: 0,
    monitoredFolders: 1,
    sharedFolders: 3
  }
}

export default function DropboxIntegration() {
  const { currentEntity } = useAuth()
  const [isConnected, setIsConnected] = useState(true) // Mock connected state
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ id: string; name: string } | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvSampleData, setCsvSampleData] = useState<string[][]>([])
  const [aiFieldMappings, setAiFieldMappings] = useState<AIFieldMapping[]>([])
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)

  const handleConnect = async () => {
    // Mock Dropbox OAuth flow - replace with real Dropbox OAuth
    const authUrl = `https://www.dropbox.com/oauth2/authorize?` + new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID || 'demo_client_id',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/dashboard/integrations/dropbox/callback`,
      state: `entity_${currentEntity?.id}`,
      token_access_type: 'offline'
    }).toString()

    window.location.href = authUrl
  }

  const handleSync = async () => {
    setIsSyncing(true)
    // Mock sync process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsSyncing(false)
  }

  const handleConnectFolder = async (folderId: string) => {
    setShowFolderModal(false)
    // Mock folder connection
    console.log(`Connecting Dropbox folder ${folderId}`)
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
    { id: 'files', name: 'Files', icon: FileText },
    { id: 'folders', name: 'Shared Folders', icon: FolderOpen },
    { id: 'team', name: 'Team Info', icon: Users },
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

  const getAccessTypeColor = (accessType: string) => {
    switch (accessType) {
      case 'owner':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'editor':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'viewer':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
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
              <span className="text-white">Dropbox Business</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dropbox Business</h1>
                <p className="text-slate-400">Team file collaboration and CSV import</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected to {mockDropboxData.teamInfo.name}
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
                Connect Dropbox
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
            <h2 className="text-2xl font-bold text-white mb-3">Connect Dropbox Business</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Access your team's Dropbox files and shared folders. Import property data from CSV files
              stored in your Dropbox Business account for {currentEntity?.name}.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Cloud className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Team Files</p>
                <p className="text-xs text-slate-400">Shared file access</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <FolderOpen className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Shared Folders</p>
                <p className="text-xs text-slate-400">Team collaboration</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">CSV Import</p>
                <p className="text-xs text-slate-400">Property data import</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Team Sync</p>
                <p className="text-xs text-slate-400">Automatic updates</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">Business-Grade Security</span>
              </div>
              <p className="text-xs text-slate-400">
                Dropbox Business provides enterprise-level security with team management and compliance features.
                Your files remain secure within your team's Dropbox account.
              </p>
            </div>

            <PermissionGuard permission="entity.integrations.storage.connect">
              <Button
                onClick={handleConnect}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Cloud className="w-5 h-5 mr-2" />
                Connect Dropbox Business
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
                  <CardTitle className="text-white">Dropbox Business Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                      <Cloud className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{mockDropboxData.account.name}</h3>
                      <p className="text-slate-400">{mockDropboxData.account.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-slate-400">
                          Team: {mockDropboxData.teamInfo.name}
                        </span>
                        <span className="text-slate-400">
                          Storage: {formatFileSize(mockDropboxData.account.quotaInfo.used)} / {formatFileSize(mockDropboxData.account.quotaInfo.quota)}
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
                        <p className="text-2xl font-bold text-white">{mockDropboxData.syncStatus.filesImported}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Shared Folders</p>
                        <p className="text-2xl font-bold text-white">{mockDropboxData.syncStatus.sharedFolders}</p>
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
                        <p className="text-sm text-slate-400">Team Members</p>
                        <p className="text-2xl font-bold text-white">{mockDropboxData.teamInfo.numProvisionedUsers}</p>
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
                          {new Date(mockDropboxData.syncStatus.lastSync).toLocaleString()}
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
                  <CardTitle className="text-white">Dropbox Files</CardTitle>
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
                  {mockDropboxData.files.map((file) => (
                    <div key={file.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{file.name}</h4>
                            <p className="text-sm text-slate-400">
                              {formatFileSize(file.size)} • Modified {new Date(file.serverModified).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500">{file.pathDisplay}</p>
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

          {selectedTab === 'folders' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Shared Folders</CardTitle>
                  <PermissionGuard permission="entity.integrations.storage.connect">
                    <Button
                      onClick={() => setShowFolderModal(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Monitor Folder
                    </Button>
                  </PermissionGuard>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDropboxData.sharedFolders.map((folder) => (
                    <div key={folder.sharedFolderId} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{folder.name}</h4>
                            <p className="text-sm text-slate-400">{folder.fileCount} files</p>
                            <p className="text-xs text-slate-500">{folder.pathDisplay}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getAccessTypeColor(folder.accessType)}>
                            {folder.accessType}
                          </Badge>
                          {folder.isMonitored ? (
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Monitored
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">
                              Not Monitored
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

          {selectedTab === 'team' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Team Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Team Name:</span>
                          <span className="text-white">{mockDropboxData.teamInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Team ID:</span>
                          <span className="text-white font-mono text-xs">{mockDropboxData.teamInfo.teamId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Licensed Users:</span>
                          <span className="text-white">{mockDropboxData.teamInfo.numLicensedUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Provisioned Users:</span>
                          <span className="text-white">{mockDropboxData.teamInfo.numProvisionedUsers}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Team Policies</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sharing Policy:</span>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                            Team Sharing Allowed
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Office Add-in:</span>
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                            Enabled
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">EMM State:</span>
                          <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                            Disabled
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Storage Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Used:</span>
                      <span className="text-white">{formatFileSize(mockDropboxData.account.quotaInfo.used)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total:</span>
                      <span className="text-white">{formatFileSize(mockDropboxData.account.quotaInfo.quota)}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(mockDropboxData.account.quotaInfo.used / mockDropboxData.account.quotaInfo.quota) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'settings' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Dropbox Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Auto Import</h4>
                      <p className="text-sm text-slate-400">Automatically import CSV files from monitored folders</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Team Folder Access</h4>
                      <p className="text-sm text-slate-400">Access files from team shared folders</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">File Type Filtering</h4>
                      <p className="text-sm text-slate-400">Only process CSV and Excel files for import</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Team Notifications</h4>
                      <p className="text-sm text-slate-400">Notify team when files are imported</p>
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
                      Disconnect Dropbox
                    </Button>
                  </PermissionGuard>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Folder Monitoring Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Monitor Shared Folder</CardTitle>
              <p className="text-slate-400">Select folders to monitor for automatic file import</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {mockDropboxData.sharedFolders.filter(folder => !folder.isMonitored).map((folder) => (
                  <button
                    key={folder.sharedFolderId}
                    onClick={() => handleConnectFolder(folder.sharedFolderId)}
                    className="w-full p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700/70 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-8 h-8 text-blue-400" />
                      <div>
                        <h4 className="text-white font-medium">{folder.name}</h4>
                        <p className="text-sm text-slate-400">{folder.fileCount} files • {folder.accessType} access</p>
                        <p className="text-xs text-slate-500">{folder.pathDisplay}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFolderModal(false)}
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
