"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { PermissionGuard } from "../../../../components/PermissionGuard"
import { useAuth } from "../../../../contexts/AuthContext"
import {
  Workflow,
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
  Globe
} from "lucide-react"

// Mock Pipedream data - replace with real Pipedream API integration
const mockPipedreamData = {
  account: {
    username: 'premium-properties',
    email: 'admin@premiumproperties.com',
    plan: 'Business',
    apiKey: 'pd_***************',
    accountId: 'acct_12345',
    credits: {
      used: 2450,
      limit: 10000,
      resetDate: '2024-08-01'
    }
  },
  workflows: [
    {
      id: 'workflow_1',
      name: 'New Tenant Onboarding Automation',
      description: 'Automate tenant onboarding process with document collection and notifications',
      status: 'active',
      lastRun: '2024-07-16T16:30:00Z',
      executions: 145,
      successRate: 98.6,
      trigger: 'Webhook (New Tenant Created)',
      steps: 8,
      actions: ['Send Welcome Email', 'Create Folder', 'Request Documents', 'Notify Manager'],
      nextScheduled: null,
      isRealtime: true
    },
    {
      id: 'workflow_2',
      name: 'Maintenance Request Processing',
      description: 'Process maintenance requests and route to appropriate vendors',
      status: 'active',
      lastRun: '2024-07-16T15:45:00Z',
      executions: 89,
      successRate: 100,
      trigger: 'Form Submission (Maintenance Portal)',
      steps: 6,
      actions: ['Validate Request', 'Assign Priority', 'Find Vendor', 'Send Notification'],
      nextScheduled: null,
      isRealtime: true
    },
    {
      id: 'workflow_3',
      name: 'Monthly Rent Collection Reminders',
      description: 'Send automated rent collection reminders and process payments',
      status: 'scheduled',
      lastRun: '2024-07-15T09:00:00Z',
      executions: 312,
      successRate: 95.2,
      trigger: 'Schedule (Monthly)',
      steps: 12,
      actions: ['Check Balances', 'Generate Invoices', 'Send Reminders', 'Process Payments'],
      nextScheduled: '2024-08-01T09:00:00Z',
      isRealtime: false
    },
    {
      id: 'workflow_4',
      name: 'Property Performance Analytics',
      description: 'Collect data from multiple sources and generate performance reports',
      status: 'paused',
      lastRun: '2024-07-14T23:00:00Z',
      executions: 67,
      successRate: 92.5,
      trigger: 'Schedule (Weekly)',
      steps: 15,
      actions: ['Fetch Data', 'Calculate KPIs', 'Generate Report', 'Email Stakeholders'],
      nextScheduled: null,
      isRealtime: false
    },
    {
      id: 'workflow_5',
      name: 'Emergency Notification System',
      description: 'Instant notifications for emergency maintenance and security alerts',
      status: 'error',
      lastRun: '2024-07-16T14:20:00Z',
      executions: 23,
      successRate: 87.0,
      trigger: 'Webhook (Emergency Alert)',
      steps: 5,
      actions: ['Validate Alert', 'Determine Priority', 'Notify Team', 'Log Incident'],
      nextScheduled: null,
      isRealtime: true
    }
  ],
  triggers: [
    {
      id: 'trigger_webhook',
      name: 'Webhook Events',
      type: 'webhook',
      description: 'Receive real-time events from external systems',
      isActive: true,
      eventCount: 1250,
      avgLatency: '150ms'
    },
    {
      id: 'trigger_schedule',
      name: 'Scheduled Tasks',
      type: 'schedule',
      description: 'Run workflows on recurring schedules',
      isActive: true,
      eventCount: 89,
      avgLatency: '2.3s'
    },
    {
      id: 'trigger_form',
      name: 'Form Submissions',
      type: 'form',
      description: 'Process form submissions from tenant portal',
      isActive: true,
      eventCount: 234,
      avgLatency: '300ms'
    },
    {
      id: 'trigger_email',
      name: 'Email Events',
      type: 'email',
      description: 'Process incoming emails and attachments',
      isActive: false,
      eventCount: 0,
      avgLatency: '1.2s'
    }
  ],
  templates: [
    {
      id: 'template_tenant_onboarding',
      name: 'Tenant Onboarding Workflow',
      description: 'Complete tenant onboarding automation with document collection and notifications',
      category: 'tenant',
      complexity: 'Intermediate',
      estimatedTime: '30 minutes',
      steps: 8,
      actions: ['Email', 'Document Management', 'CRM Integration', 'Notifications'],
      features: ['Multi-step Forms', 'File Upload', 'Email Templates', 'Calendar Integration']
    },
    {
      id: 'template_maintenance_routing',
      name: 'Maintenance Request Router',
      description: 'Intelligent routing of maintenance requests based on type and urgency',
      category: 'maintenance',
      complexity: 'Advanced',
      estimatedTime: '45 minutes',
      steps: 12,
      actions: ['AI Classification', 'Vendor Assignment', 'SMS Alerts', 'Work Order Creation'],
      features: ['Machine Learning', 'Vendor Database', 'Priority Matrix', 'Real-time Updates']
    },
    {
      id: 'template_payment_processing',
      name: 'Payment Processing Pipeline',
      description: 'Automated payment processing with reconciliation and notifications',
      category: 'financial',
      complexity: 'Beginner',
      estimatedTime: '20 minutes',
      steps: 6,
      actions: ['Payment Gateway', 'Bank Integration', 'Receipt Generation', 'Accounting Sync'],
      features: ['Multiple Payment Methods', 'Automatic Reconciliation', 'Fraud Detection', 'Reporting']
    },
    {
      id: 'template_analytics_dashboard',
      name: 'Analytics Data Pipeline',
      description: 'Collect and process data for real-time property management analytics',
      category: 'analytics',
      complexity: 'Advanced',
      estimatedTime: '60 minutes',
      steps: 15,
      actions: ['Data Collection', 'Transformation', 'Visualization', 'Report Distribution'],
      features: ['Real-time Processing', 'Custom Metrics', 'Dashboard Integration', 'Alert System']
    }
  ],
  analytics: {
    totalWorkflows: 5,
    activeWorkflows: 3,
    totalExecutions: 636,
    avgSuccessRate: 94.7,
    creditsUsed: 2450,
    avgExecutionTime: '2.8s'
  }
}

export default function PipedreamIntegration() {
  const { currentEntity } = useAuth()
  const [isConnected, setIsConnected] = useState(true) // Mock connected state
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showNewWorkflowModal, setShowNewWorkflowModal] = useState(false)

  const handleConnect = async () => {
    // Mock Pipedream connection - replace with real Pipedream OAuth/API key setup
    const authUrl = `https://pipedream.com/auth?` + new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || 'demo_client_id',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/dashboard/integrations/pipedream/callback`,
      scope: 'workflow:read workflow:write',
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

  const handleRunWorkflow = async (workflowId: string) => {
    console.log(`Running workflow: ${workflowId}`)
    // Mock run workflow
  }

  const handlePauseWorkflow = async (workflowId: string) => {
    console.log(`Pausing workflow: ${workflowId}`)
    // Mock pause workflow
  }

  const handleCreateFromTemplate = async (templateId: string) => {
    setShowTemplateModal(false)
    const template = mockPipedreamData.templates.find(t => t.id === templateId)
    if (template) {
      console.log(`Creating workflow from template: ${template.name}`)
      setShowNewWorkflowModal(true)
    }
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'workflows', name: 'Workflows', icon: Workflow },
    { id: 'triggers', name: 'Triggers', icon: Zap },
    { id: 'templates', name: 'Templates', icon: FolderOpen },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getWorkflowStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="w-3 h-3" />
      case 'scheduled':
        return <Clock className="w-3 h-3" />
      case 'paused':
        return <Pause className="w-3 h-3" />
      case 'error':
        return <XCircle className="w-3 h-3" />
      default:
        return <AlertTriangle className="w-3 h-3" />
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'webhook':
        return <Webhook className="w-4 h-4" />
      case 'schedule':
        return <Clock className="w-4 h-4" />
      case 'form':
        return <FileText className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
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
              <span className="text-white">Pipedream</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Workflow className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Pipedream</h1>
                <p className="text-slate-400">Workflow automation and event processing platform</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              {mockPipedreamData.analytics.activeWorkflows} Active Workflows
            </Badge>
          )}

          <PermissionGuard permission="entity.integrations.pipedream.configure">
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
                    Sync Workflows
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Workflow className="w-4 h-4 mr-2" />
                Connect Pipedream
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
              <Workflow className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Connect Pipedream</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Build powerful automation workflows for your property management operations.
              Connect APIs, process events, and automate tasks for {currentEntity?.name}.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Workflow className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Custom Workflows</p>
                <p className="text-xs text-slate-400">Visual automation</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Webhook className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Event Processing</p>
                <p className="text-xs text-slate-400">Real-time triggers</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Code className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Custom Code</p>
                <p className="text-xs text-slate-400">JavaScript/Python</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Globe className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">API Integration</p>
                <p className="text-xs text-slate-400">1000+ apps</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">Developer-Friendly Automation</span>
              </div>
              <p className="text-xs text-slate-400">
                Pipedream combines the simplicity of no-code tools with the power of custom code.
                Build sophisticated automation workflows for complex property management scenarios.
              </p>
            </div>

            <PermissionGuard permission="entity.integrations.pipedream.configure">
              <Button
                onClick={handleConnect}
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Workflow className="w-5 h-5 mr-2" />
                Connect Pipedream
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
                  <CardTitle className="text-white">Pipedream Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                      <Workflow className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">@{mockPipedreamData.account.username}</h3>
                      <p className="text-slate-400">{mockPipedreamData.account.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-slate-400">
                          Plan: {mockPipedreamData.account.plan}
                        </span>
                        <span className="text-slate-400">
                          Credits: {mockPipedreamData.account.credits.used.toLocaleString()} / {mockPipedreamData.account.credits.limit.toLocaleString()}
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
                        <p className="text-sm text-slate-400">Active Workflows</p>
                        <p className="text-2xl font-bold text-white">{mockPipedreamData.analytics.activeWorkflows}</p>
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
                        <p className="text-sm text-slate-400">Total Executions</p>
                        <p className="text-2xl font-bold text-white">{mockPipedreamData.analytics.totalExecutions.toLocaleString()}</p>
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
                        <p className="text-2xl font-bold text-white">{mockPipedreamData.analytics.avgSuccessRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Avg Execution</p>
                        <p className="text-2xl font-bold text-white">{mockPipedreamData.analytics.avgExecutionTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Credit Usage */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Credit Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Used this month</span>
                      <span className="text-white">
                        {mockPipedreamData.account.credits.used.toLocaleString()} / {mockPipedreamData.account.credits.limit.toLocaleString()} credits
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full"
                        style={{ width: `${(mockPipedreamData.account.credits.used / mockPipedreamData.account.credits.limit) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        {Math.round((mockPipedreamData.account.credits.used / mockPipedreamData.account.credits.limit) * 100)}% used
                      </span>
                      <span className="text-slate-500">
                        Resets on {new Date(mockPipedreamData.account.credits.resetDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === 'workflows' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Automation Workflows</CardTitle>
                  <div className="flex items-center gap-2">
                    <PermissionGuard permission="entity.integrations.pipedream.configure">
                      <Button
                        onClick={() => setShowTemplateModal(true)}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Workflow
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPipedreamData.workflows.map((workflow) => (
                    <div key={workflow.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <Workflow className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{workflow.name}</h4>
                            <p className="text-sm text-slate-400">{workflow.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs">
                              <span className="text-slate-500">{workflow.trigger}</span>
                              <span className="text-slate-500">{workflow.executions} executions</span>
                              <span className="text-slate-500">{workflow.successRate}% success</span>
                              {workflow.isRealtime && (
                                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                                  Real-time
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getWorkflowStatusColor(workflow.status)}>
                            {getWorkflowStatusIcon(workflow.status)}
                            <span className="ml-1 capitalize">{workflow.status}</span>
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">{workflow.steps} steps</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">
                              Last run: {new Date(workflow.lastRun).toLocaleString()}
                            </span>
                          </div>
                          {workflow.nextScheduled && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-400">
                                Next: {new Date(workflow.nextScheduled).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {workflow.status === 'active' ? (
                            <PermissionGuard permission="entity.integrations.pipedream.configure">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-yellow-600 text-yellow-400"
                                onClick={() => handlePauseWorkflow(workflow.id)}
                              >
                                <Pause className="w-3 h-3 mr-1" />
                                Pause
                              </Button>
                            </PermissionGuard>
                          ) : (
                            <PermissionGuard permission="entity.integrations.pipedream.configure">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-green-600 text-green-400"
                                onClick={() => handleRunWorkflow(workflow.id)}
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Activate
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

                      {/* Actions Preview */}
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <p className="text-xs text-slate-500 mb-2">Key Actions:</p>
                        <div className="flex flex-wrap gap-1">
                          {workflow.actions.slice(0, 3).map((action) => (
                            <Badge key={action} variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {action}
                            </Badge>
                          ))}
                          {workflow.actions.length > 3 && (
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              +{workflow.actions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'triggers' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Event Triggers</CardTitle>
                <p className="text-slate-400 text-sm">Configure how workflows are triggered by external events</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPipedreamData.triggers.map((trigger) => (
                    <div key={trigger.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            {getTriggerIcon(trigger.type)}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{trigger.name}</h4>
                            <p className="text-sm text-slate-400">{trigger.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs">
                              <span className="text-slate-500">{trigger.eventCount.toLocaleString()} events</span>
                              <span className="text-slate-500">Avg latency: {trigger.avgLatency}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={trigger.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}>
                            {trigger.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <PermissionGuard permission="entity.integrations.pipedream.configure">
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
                <CardTitle className="text-white">Workflow Templates</CardTitle>
                <p className="text-slate-400 text-sm">Pre-built automation workflows for property management</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockPipedreamData.templates.map((template) => (
                    <div key={template.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">{template.name}</h4>
                        <p className="text-sm text-slate-400 mb-3">{template.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-slate-500">Complexity:</p>
                              <Badge className={getComplexityColor(template.complexity)}>
                                {template.complexity}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Steps:</p>
                              <p className="text-sm text-white">{template.steps}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Est. Time:</p>
                              <p className="text-sm text-white">{template.estimatedTime}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500 font-medium">Key Features:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.features.slice(0, 2).map((feature) => (
                                <Badge key={feature} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {template.features.length > 2 && (
                                <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-xs">
                                  +{template.features.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <PermissionGuard permission="entity.integrations.pipedream.configure">
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
                <CardTitle className="text-white">Pipedream Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Error Notifications</h4>
                      <p className="text-sm text-slate-400">Get notified when workflows fail or encounter errors</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Execution Logging</h4>
                      <p className="text-sm text-slate-400">Log detailed information about workflow executions</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Webhook Security</h4>
                      <p className="text-sm text-slate-400">Enable webhook signature verification for security</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Rate Limiting</h4>
                      <p className="text-sm text-slate-400">Automatically handle API rate limits and retries</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <PermissionGuard permission="entity.integrations.pipedream.configure">
                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Disconnect Pipedream
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
              <CardTitle className="text-white">Create Workflow from Template</CardTitle>
              <p className="text-slate-400">Choose a template to create a new automation workflow</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPipedreamData.templates.map((template) => (
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
                  Create Workflow
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

      {/* New Workflow Creation Modal */}
      {showNewWorkflowModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Configure New Workflow</CardTitle>
              <p className="text-slate-400">Set up your automation workflow</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Workflow Name
                </label>
                <input
                  type="text"
                  placeholder="Enter workflow name..."
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe what this workflow does..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Trigger Type
                </label>
                <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Webhook (Real-time events)</option>
                  <option>Schedule (Recurring tasks)</option>
                  <option>Form Submission</option>
                  <option>Email Event</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Workflow className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewWorkflowModal(false)}
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
