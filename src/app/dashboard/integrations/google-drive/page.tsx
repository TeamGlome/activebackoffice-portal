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
  MapPin,
  Calendar,
  Brain
} from "lucide-react"

// Mock Google Drive data - replace with real API integration
const mockGoogleDriveData = {
  account: {
    email: 'admin@premiumproperties.com',
    name: 'Premium Properties Admin',
    profilePicture: null,
    storageQuota: {
      limit: '100 GB',
      usage: '23.4 GB',
      usageInDrive: '18.2 GB'
    }
  },
  files: [
    {
      id: 'file_1',
      name: 'Property_Listings_Q3_2024.csv',
      mimeType: 'text/csv',
      size: 245670,
      modifiedTime: '2024-07-16T15:30:00Z',
      createdTime: '2024-07-15T10:00:00Z',
      parents: ['folder_imports'],
      webViewLink: 'https://drive.google.com/file/d/file_1/view',
      downloadUrl: 'https://drive.google.com/uc?id=file_1',
      status: 'ready_to_import'
    },
    {
      id: 'file_2',
      name: 'Tenant_Information_July.csv',
      mimeType: 'text/csv',
      size: 89340,
      modifiedTime: '2024-07-14T09:15:00Z',
      createdTime: '2024-07-14T09:15:00Z',
      parents: ['folder_imports'],
      webViewLink: 'https://drive.google.com/file/d/file_2/view',
      downloadUrl: 'https://drive.google.com/uc?id=file_2',
      status: 'imported'
    },
    {
      id: 'file_3',
      name: 'Maintenance_Records_2024.csv',
      mimeType: 'text/csv',
      size: 156780,
      modifiedTime: '2024-07-13T14:20:00Z',
      createdTime: '2024-07-13T14:20:00Z',
      parents: ['folder_imports'],
      webViewLink: 'https://drive.google.com/file/d/file_3/view',
      downloadUrl: 'https://drive.google.com/uc?id=file_3',
      status: 'error'
    },
    {
      id: 'file_4',
      name: 'Financial_Summary_Q2.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 445600,
      modifiedTime: '2024-07-12T11:45:00Z',
      createdTime: '2024-07-12T11:45:00Z',
      parents: ['folder_reports'],
      webViewLink: 'https://drive.google.com/file/d/file_4/view',
      downloadUrl: 'https://drive.google.com/uc?id=file_4',
      status: 'not_supported'
    }
  ],
  folders: [
    {
      id: 'folder_imports',
      name: 'Property Data Imports',
      fileCount: 12,
      isMonitored: true
    },
    {
      id: 'folder_reports',
      name: 'Financial Reports',
      fileCount: 8,
      isMonitored: false
    },
    {
      id: 'folder_documents',
      name: 'Legal Documents',
      fileCount: 45,
      isMonitored: false
    }
  ],
  syncStatus: {
    lastSync: '2024-07-16 15:30:00',
    status: 'connected',
    filesImported: 23,
    errors: 1,
    monitoredFolders: 1
  }
}

const csvImportTemplates = [
  {
    id: 'properties',
    name: 'Property Listings',
    description: 'Import property information, addresses, and specifications',
    requiredFields: ['name', 'address', 'type', 'units'],
    optionalFields: ['description', 'amenities', 'year_built', 'square_feet'],
    sampleData: [
      { name: 'Sunset Apartments', address: '123 Main St', type: 'Apartment', units: 24 },
      { name: 'Oak Grove Complex', address: '456 Oak Ave', type: 'Complex', units: 36 }
    ]
  },
  {
    id: 'tenants',
    name: 'Tenant Information',
    description: 'Import tenant contact details and lease information',
    requiredFields: ['name', 'email', 'unit', 'lease_start'],
    optionalFields: ['phone', 'emergency_contact', 'lease_end', 'rent_amount'],
    sampleData: [
      { name: 'John Smith', email: 'john@email.com', unit: 'A-102', lease_start: '2024-01-15' },
      { name: 'Sarah Johnson', email: 'sarah@email.com', unit: 'B-205', lease_start: '2024-03-01' }
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance Records',
    description: 'Import maintenance requests and work orders',
    requiredFields: ['property', 'unit', 'issue', 'date_reported'],
    optionalFields: ['priority', 'assigned_to', 'status', 'completion_date'],
    sampleData: [
      { property: 'Sunset Apartments', unit: 'A-105', issue: 'Leaking faucet', date_reported: '2024-07-15' },
      { property: 'Oak Grove Complex', unit: 'B-103', issue: 'HVAC not working', date_reported: '2024-07-16' }
    ]
  }
]

export default function GoogleDriveIntegration() {
  const { currentEntity } = useAuth()
  const [isConnected, setIsConnected] = useState(true) // Mock connected state
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ id: string; name: string } | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvSampleData, setCsvSampleData] = useState<string[][]>([])
  const [aiFieldMappings, setAiFieldMappings] = useState<AIFieldMapping[]>([])
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)

  const handleConnect = async () => {
    // Mock Google OAuth flow - replace with real Google OAuth
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${window.location.origin}/dashboard/integrations/google-drive/callback`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/userinfo.profile',
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
    setShowImportModal(false)
    setShowAIAnalysis(true)
  }

  const handleAIFieldMappingChange = (mappings: AIFieldMapping[]) => {
    setAiFieldMappings(mappings)
  }

  const handleAITemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
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
    { id: 'folders', name: 'Folders', icon: FolderOpen },
    { id: 'templates', name: 'Import Templates', icon: Upload },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
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
              <span className="text-white">Google Drive</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Google Drive</h1>
                <p className="text-slate-400">Cloud storage and CSV import integration</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
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
                Connect Google Drive
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
            <h2 className="text-2xl font-bold text-white mb-3">Connect Google Drive</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Import property data from CSV files stored in your Google Drive. Automatically monitor folders
              for new uploads and import data seamlessly into {currentEntity?.name}.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">CSV Import</p>
                <p className="text-xs text-slate-400">Property data import</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <FolderOpen className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Folder Monitoring</p>
                <p className="text-xs text-slate-400">Auto-import new files</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Data Validation</p>
                <p className="text-xs text-slate-400">Verify data integrity</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">Secure Access</span>
              </div>
              <p className="text-xs text-slate-400">
                We only request read-only access to your Google Drive files. Your data remains secure and private.
              </p>
            </div>

            <PermissionGuard permission="entity.integrations.storage.connect">
              <Button
                onClick={handleConnect}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Cloud className="w-5 h-5 mr-2" />
                Connect Google Drive
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
                  <CardTitle className="text-white">Google Drive Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                      <Cloud className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{mockGoogleDriveData.account.name}</h3>
                      <p className="text-slate-400">{mockGoogleDriveData.account.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-slate-400">
                          Storage: {mockGoogleDriveData.account.storageQuota.usage} / {mockGoogleDriveData.account.storageQuota.limit}
                        </span>
                        <span className="text-slate-400">
                          Drive Files: {mockGoogleDriveData.account.storageQuota.usageInDrive}
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
                        <p className="text-2xl font-bold text-white">{mockGoogleDriveData.syncStatus.filesImported}</p>
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
                        <p className="text-sm text-slate-400">Monitored Folders</p>
                        <p className="text-2xl font-bold text-white">{mockGoogleDriveData.syncStatus.monitoredFolders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Import Errors</p>
                        <p className="text-2xl font-bold text-white">{mockGoogleDriveData.syncStatus.errors}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Last Sync</p>
                        <p className="text-sm font-medium text-white">
                          {new Date(mockGoogleDriveData.syncStatus.lastSync).toLocaleString()}
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
                  <CardTitle className="text-white">Available Files</CardTitle>
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
                  {mockGoogleDriveData.files.map((file) => (
                    <div key={file.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{file.name}</h4>
                            <p className="text-sm text-slate-400">
                              {formatFileSize(file.size)} • Modified {new Date(file.modifiedTime).toLocaleDateString()}
                            </p>
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
                <CardTitle className="text-white">Monitored Folders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGoogleDriveData.folders.map((folder) => (
                    <div key={folder.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{folder.name}</h4>
                            <p className="text-sm text-slate-400">{folder.fileCount} files</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
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

          {selectedTab === 'templates' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">CSV Import Templates</CardTitle>
                <p className="text-slate-400 text-sm">Pre-configured templates for importing different types of property data</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {csvImportTemplates.map((template) => (
                    <div key={template.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">{template.name}</h4>
                        <p className="text-sm text-slate-400 mb-3">{template.description}</p>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Required Fields:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.requiredFields.map((field) => (
                                <Badge key={field} className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500 font-medium">Optional Fields:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.optionalFields.slice(0, 3).map((field) => (
                                <Badge key={field} className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                                  {field}
                                </Badge>
                              ))}
                              {template.optionalFields.length > 3 && (
                                <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                                  +{template.optionalFields.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 flex-1">
                          <Download className="w-3 h-3 mr-1" />
                          Download Template
                        </Button>
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

          {selectedTab === 'settings' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Google Drive Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <Brain className="w-4 h-4 text-blue-400" />
                        AI-Enhanced Import
                      </h4>
                      <p className="text-sm text-slate-400">Use AI for intelligent field mapping and Yardi data detection</p>
                    </div>
                    <Button variant="outline" className="border-blue-600 text-blue-400">
                      Enabled
                    </Button>
                  </div>

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
                      <h4 className="text-white font-medium">Data Validation</h4>
                      <p className="text-sm text-slate-400">Validate CSV data before importing</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">File Notifications</h4>
                      <p className="text-sm text-slate-400">Get notified when new files are available for import</p>
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
                      Disconnect Google Drive
                    </Button>
                  </PermissionGuard>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Import CSV File</CardTitle>
              <p className="text-slate-400">Select a template for importing your CSV data</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {csvImportTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                  >
                    <h4 className="text-white font-medium">{template.name}</h4>
                    <p className="text-sm text-slate-400">{template.description}</p>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={() => selectedTemplate && handleImportFile('file_1', selectedTemplate)}
                  disabled={!selectedTemplate}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowImportModal(false)}
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
