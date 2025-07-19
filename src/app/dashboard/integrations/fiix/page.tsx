"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { PermissionGuard } from "../../../../components/PermissionGuard"
import { useAuth } from "../../../../contexts/AuthContext"
import {
  Wrench,
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
  Zap,
  GitBranch,
  Layers,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Bell,
  Mail,
  MessageSquare,
  Webhook,
  Code,
  Globe,
  HardHat,
  Clipboard,
  Timer,
  DollarSign,
  User,
  MapPin,
  Package,
  ShoppingCart
} from "lucide-react"

// Mock Fiix Software data - replace with real Fiix API integration
const mockFiixData = {
  account: {
    organization: 'Premium Properties',
    baseUrl: 'https://premiumproperties.fiixsoftware.com',
    version: 'v2024.1',
    license: 'Professional',
    userCount: 15,
    activeUsers: 12,
    apiKey: 'fiix_api_***************'
  },
  workOrders: [
    {
      id: 24507,
      code: 'WO-2024-7-507',
      description: 'HVAC System Maintenance - Unit A Building',
      priority: 2,
      status: 'In Progress',
      assetCode: 'HVAC-A001',
      assetName: 'Rooftop Unit A - Building 1',
      assignedTo: 'Mike Rodriguez',
      requestedBy: 'Sarah Johnson',
      createdDate: '2024-07-16T09:30:00Z',
      scheduledDate: '2024-07-17T10:00:00Z',
      estimatedHours: 4,
      actualHours: 2.5,
      completionPercentage: 65,
      category: 'Preventive Maintenance',
      department: 'HVAC',
      location: 'Building 1 - Rooftop'
    },
    {
      id: 24506,
      code: 'WO-2024-7-506',
      description: 'Emergency Plumbing Repair - Tenant Unit 2B',
      priority: 1,
      status: 'Completed',
      assetCode: 'PLUMB-2B',
      assetName: 'Plumbing System - Unit 2B',
      assignedTo: 'Tom Wilson',
      requestedBy: 'Maintenance Hotline',
      createdDate: '2024-07-15T14:20:00Z',
      scheduledDate: '2024-07-15T16:00:00Z',
      estimatedHours: 2,
      actualHours: 3.5,
      completionPercentage: 100,
      category: 'Emergency Repair',
      department: 'Plumbing',
      location: 'Building 2 - Unit 2B'
    },
    {
      id: 24505,
      code: 'WO-2024-7-505',
      description: 'Elevator Inspection and Service',
      priority: 2,
      status: 'Scheduled',
      assetCode: 'ELEV-001',
      assetName: 'Passenger Elevator - Main Building',
      assignedTo: 'Elevator Specialists Inc',
      requestedBy: 'Property Manager',
      createdDate: '2024-07-14T11:00:00Z',
      scheduledDate: '2024-07-18T08:00:00Z',
      estimatedHours: 6,
      actualHours: 0,
      completionPercentage: 0,
      category: 'Compliance Inspection',
      department: 'Vertical Transportation',
      location: 'Main Building - Lobby'
    },
    {
      id: 24504,
      code: 'WO-2024-7-504',
      description: 'Landscaping and Grounds Maintenance',
      priority: 3,
      status: 'Open',
      assetCode: 'GROUNDS-01',
      assetName: 'Property Landscaping',
      assignedTo: 'Green Thumb Landscaping',
      requestedBy: 'Facility Manager',
      createdDate: '2024-07-13T16:45:00Z',
      scheduledDate: '2024-07-19T07:00:00Z',
      estimatedHours: 8,
      actualHours: 0,
      completionPercentage: 0,
      category: 'Grounds Maintenance',
      department: 'Landscaping',
      location: 'Exterior Grounds'
    }
  ],
  assets: [
    {
      id: 1001,
      code: 'HVAC-A001',
      name: 'Rooftop Unit A - Building 1',
      category: 'HVAC Equipment',
      status: 'Active',
      condition: 'Good',
      location: 'Building 1 - Rooftop',
      installDate: '2018-03-15',
      lastMaintenance: '2024-06-15',
      nextMaintenance: '2024-09-15',
      workOrdersCount: 12,
      totalCost: 15670.50
    },
    {
      id: 1002,
      code: 'PLUMB-2B',
      name: 'Plumbing System - Unit 2B',
      category: 'Plumbing',
      status: 'Active',
      condition: 'Fair',
      location: 'Building 2 - Unit 2B',
      installDate: '2019-08-22',
      lastMaintenance: '2024-07-15',
      nextMaintenance: '2024-10-15',
      workOrdersCount: 8,
      totalCost: 3450.00
    },
    {
      id: 1003,
      code: 'ELEV-001',
      name: 'Passenger Elevator - Main Building',
      category: 'Vertical Transportation',
      status: 'Active',
      condition: 'Excellent',
      location: 'Main Building - Lobby',
      installDate: '2020-01-10',
      lastMaintenance: '2024-04-18',
      nextMaintenance: '2024-07-18',
      workOrdersCount: 6,
      totalCost: 8950.00
    }
  ],
  technicians: [
    {
      id: 501,
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@premiumproperties.com',
      role: 'Senior HVAC Technician',
      department: 'HVAC',
      status: 'Active',
      currentWorkOrders: 3,
      skillsRating: 4.8,
      completionRate: 96.5,
      certifications: ['EPA 608', 'NATE Certified', 'OSHA 30']
    },
    {
      id: 502,
      name: 'Tom Wilson',
      email: 'tom.wilson@premiumproperties.com',
      role: 'Plumbing Specialist',
      department: 'Plumbing',
      status: 'Active',
      currentWorkOrders: 2,
      skillsRating: 4.6,
      completionRate: 94.2,
      certifications: ['Licensed Plumber', 'Backflow Prevention', 'OSHA 10']
    },
    {
      id: 503,
      name: 'Lisa Chen',
      email: 'lisa.chen@premiumproperties.com',
      role: 'Electrical Technician',
      department: 'Electrical',
      status: 'Active',
      currentWorkOrders: 1,
      skillsRating: 4.9,
      completionRate: 98.1,
      certifications: ['Master Electrician', 'Arc Flash Safety', 'NFPA 70E']
    }
  ],
  vendors: [
    {
      id: 301,
      name: 'Elevator Specialists Inc',
      category: 'Vertical Transportation',
      contactPerson: 'David Kim',
      email: 'service@elevatorspecialists.com',
      phone: '(555) 123-4567',
      status: 'Preferred',
      rating: 4.7,
      activeContracts: 2,
      totalSpent: 12450.00,
      services: ['Elevator Maintenance', 'Emergency Repairs', 'Modernization']
    },
    {
      id: 302,
      name: 'Green Thumb Landscaping',
      category: 'Landscaping',
      contactPerson: 'Maria Garcia',
      email: 'maria@greenthumblandscape.com',
      phone: '(555) 987-6543',
      status: 'Active',
      rating: 4.5,
      activeContracts: 1,
      totalSpent: 8900.00,
      services: ['Lawn Care', 'Tree Trimming', 'Irrigation Systems']
    }
  ],
  analytics: {
    totalWorkOrders: 147,
    openWorkOrders: 23,
    inProgressWorkOrders: 8,
    completedThisMonth: 45,
    avgCompletionTime: '3.2 days',
    maintenanceCosts: 34567.89,
    preventiveMaintenance: 65,
    emergencyRepairs: 12
  }
}

export default function FiixIntegration() {
  const { currentEntity } = useAuth()
  const [isConnected, setIsConnected] = useState(true) // Mock connected state
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showNewWorkOrderModal, setShowNewWorkOrderModal] = useState(false)

  const handleConnect = async () => {
    // Mock Fiix connection - replace with real Fiix API key setup
    const fiixUrl = `https://api.fiixsoftware.com/auth?` + new URLSearchParams({
      organization: 'premiumproperties',
      redirect_uri: `${window.location.origin}/dashboard/integrations/fiix/callback`,
      state: `entity_${currentEntity?.id}`
    }).toString()

    window.location.href = fiixUrl
  }

  const handleSync = async () => {
    setIsSyncing(true)
    // Mock sync process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsSyncing(false)
  }

  const handleCreateWorkOrder = () => {
    setShowNewWorkOrderModal(true)
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'workorders', name: 'Work Orders', icon: Clipboard },
    { id: 'assets', name: 'Assets', icon: Package },
    { id: 'technicians', name: 'Technicians', icon: HardHat },
    { id: 'vendors', name: 'Vendors', icon: ShoppingCart },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 2:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 3:
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1: return 'Critical'
      case 2: return 'High'
      case 3: return 'Medium'
      case 4: return 'Low'
      default: return 'Unknown'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'in progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'scheduled':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'open':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'good':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'fair':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'poor':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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
              <span className="text-white">Fiix Software</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Fiix Software</h1>
                <p className="text-slate-400">Maintenance management and work order system</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              {mockFiixData.analytics.openWorkOrders} Open Work Orders
            </Badge>
          )}

          <PermissionGuard permission="entity.integrations.fiix.sync">
            {isConnected ? (
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Data
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Wrench className="w-4 h-4 mr-2" />
                Connect Fiix
              </Button>
            )}
          </PermissionGuard>
        </div>
      </div>

      {!isConnected ? (
        /* Connection Setup */
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-10 h-10 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Connect Fiix Software</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Integrate your Fiix maintenance management system with {currentEntity?.name}.
              Sync work orders, assets, and technician data for comprehensive maintenance tracking.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Clipboard className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Work Orders</p>
                <p className="text-xs text-slate-400">Complete lifecycle management</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Package className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Asset Management</p>
                <p className="text-xs text-slate-400">Equipment tracking</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <HardHat className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Technician Scheduling</p>
                <p className="text-xs text-slate-400">Resource optimization</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Analytics</p>
                <p className="text-xs text-slate-400">Performance insights</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">Enterprise Maintenance Platform</span>
              </div>
              <p className="text-xs text-slate-400">
                Fiix provides comprehensive maintenance management with advanced analytics,
                mobile capabilities, and integration with property management workflows.
              </p>
            </div>

            <PermissionGuard permission="entity.integrations.fiix.connect">
              <Button
                onClick={handleConnect}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Wrench className="w-5 h-5 mr-2" />
                Connect Fiix Software
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
                  <CardTitle className="text-white">Fiix Software Instance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                      <Wrench className="w-8 h-8 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{mockFiixData.account.organization}</h3>
                      <p className="text-slate-400">{mockFiixData.account.baseUrl}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-slate-400">
                          Version: {mockFiixData.account.version}
                        </span>
                        <span className="text-slate-400">
                          License: {mockFiixData.account.license}
                        </span>
                        <span className="text-slate-400">
                          Users: {mockFiixData.account.activeUsers}/{mockFiixData.account.userCount}
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
                      <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                        <Clipboard className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Open Work Orders</p>
                        <p className="text-2xl font-bold text-white">{mockFiixData.analytics.openWorkOrders}</p>
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
                        <p className="text-sm text-slate-400">In Progress</p>
                        <p className="text-2xl font-bold text-white">{mockFiixData.analytics.inProgressWorkOrders}</p>
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
                        <p className="text-sm text-slate-400">Completed This Month</p>
                        <p className="text-2xl font-bold text-white">{mockFiixData.analytics.completedThisMonth}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Timer className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Avg Completion</p>
                        <p className="text-2xl font-bold text-white">{mockFiixData.analytics.avgCompletionTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Maintenance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Maintenance Costs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-white mb-2">
                      {formatCurrency(mockFiixData.analytics.maintenanceCosts)}
                    </p>
                    <p className="text-sm text-slate-400">This month</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Preventive Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-400 mb-2">
                      {mockFiixData.analytics.preventiveMaintenance}%
                    </p>
                    <p className="text-sm text-slate-400">Of all work orders</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Emergency Repairs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-red-400 mb-2">
                      {mockFiixData.analytics.emergencyRepairs}
                    </p>
                    <p className="text-sm text-slate-400">This month</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedTab === 'workorders' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Work Orders</CardTitle>
                  <div className="flex items-center gap-2">
                    <PermissionGuard permission="entity.integrations.fiix.workorders">
                      <Button
                        onClick={handleCreateWorkOrder}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Work Order
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFiixData.workOrders.map((workOrder) => (
                    <div key={workOrder.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <Clipboard className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{workOrder.code}</h4>
                            <p className="text-sm text-slate-400">{workOrder.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs">
                              <span className="text-slate-500">Asset: {workOrder.assetCode}</span>
                              <span className="text-slate-500">Assigned: {workOrder.assignedTo}</span>
                              <span className="text-slate-500">Category: {workOrder.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getPriorityColor(workOrder.priority)}>
                            {getPriorityText(workOrder.priority)}
                          </Badge>
                          <Badge className={getStatusColor(workOrder.status)}>
                            {workOrder.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">
                              Scheduled: {new Date(workOrder.scheduledDate).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Timer className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">
                              {workOrder.actualHours}h / {workOrder.estimatedHours}h
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">{workOrder.completionPercentage}% complete</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
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

                      {workOrder.completionPercentage > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-600">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Progress</span>
                            <span className="text-slate-400">{workOrder.completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${workOrder.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'assets' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Assets</CardTitle>
                <p className="text-slate-400 text-sm">Equipment and systems under maintenance</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFiixData.assets.map((asset) => (
                    <div key={asset.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{asset.name}</h4>
                            <p className="text-sm text-slate-400">Code: {asset.code} • Category: {asset.category}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs">
                              <span className="text-slate-500">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {asset.location}
                              </span>
                              <span className="text-slate-500">
                                Installed: {new Date(asset.installDate).toLocaleDateString()}
                              </span>
                              <span className="text-slate-500">
                                Work Orders: {asset.workOrdersCount}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getConditionColor(asset.condition)}>
                            {asset.condition}
                          </Badge>
                          <div className="text-right">
                            <p className="text-white font-medium">{formatCurrency(asset.totalCost)}</p>
                            <p className="text-xs text-slate-400">Total maintenance cost</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-600 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-slate-400">
                            Last Service: {new Date(asset.lastMaintenance).toLocaleDateString()}
                          </span>
                          <span className="text-slate-400">
                            Next Service: {new Date(asset.nextMaintenance).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'technicians' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Technicians</CardTitle>
                <p className="text-slate-400 text-sm">Maintenance team members and their performance</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFiixData.technicians.map((technician) => (
                    <div key={technician.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <HardHat className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{technician.name}</h4>
                            <p className="text-sm text-slate-400">{technician.role} • {technician.department}</p>
                            <p className="text-xs text-slate-500">{technician.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-white font-medium">{technician.currentWorkOrders}</p>
                            <p className="text-xs text-slate-400">Active WOs</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium">{technician.skillsRating}/5.0</p>
                            <p className="text-xs text-slate-400">Rating</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium">{technician.completionRate}%</p>
                            <p className="text-xs text-slate-400">Completion</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <p className="text-xs text-slate-500 mb-2">Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {technician.certifications.map((cert) => (
                            <Badge key={cert} variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {cert}
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

          {selectedTab === 'vendors' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Vendors</CardTitle>
                <p className="text-slate-400 text-sm">External service providers and contractors</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFiixData.vendors.map((vendor) => (
                    <div key={vendor.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{vendor.name}</h4>
                            <p className="text-sm text-slate-400">{vendor.category}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs">
                              <span className="text-slate-500">{vendor.contactPerson}</span>
                              <span className="text-slate-500">{vendor.email}</span>
                              <span className="text-slate-500">{vendor.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={vendor.status === 'Preferred' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}>
                            {vendor.status}
                          </Badge>
                          <div className="text-center">
                            <p className="text-white font-medium">{vendor.rating}/5.0</p>
                            <p className="text-xs text-slate-400">Rating</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium">{formatCurrency(vendor.totalSpent)}</p>
                            <p className="text-xs text-slate-400">Total spent</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <p className="text-xs text-slate-500 mb-2">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {vendor.services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {service}
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

          {selectedTab === 'settings' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Fiix Software Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Auto-sync Work Orders</h4>
                      <p className="text-sm text-slate-400">Automatically sync work orders every 15 minutes</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Asset Status Updates</h4>
                      <p className="text-sm text-slate-400">Update asset conditions and maintenance schedules</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Technician Notifications</h4>
                      <p className="text-sm text-slate-400">Notify technicians of new work assignments</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Cost Tracking</h4>
                      <p className="text-sm text-slate-400">Track maintenance costs and budget usage</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <PermissionGuard permission="entity.integrations.fiix.connect">
                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Disconnect Fiix Software
                    </Button>
                  </PermissionGuard>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* New Work Order Modal */}
      {showNewWorkOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Create Work Order</CardTitle>
              <p className="text-slate-400">Create a new maintenance work order in Fiix</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Work Order Title
                </label>
                <input
                  type="text"
                  placeholder="Enter work order title..."
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the maintenance work needed..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Priority
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Assigned To
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Mike Rodriguez</option>
                    <option>Tom Wilson</option>
                    <option>Lisa Chen</option>
                    <option>External Vendor</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Clipboard className="w-4 h-4 mr-2" />
                  Create Work Order
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewWorkOrderModal(false)}
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
