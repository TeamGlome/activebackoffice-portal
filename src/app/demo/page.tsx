"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { RevenueChart } from "../../components/charts/RevenueChart"

import { AIPredictionsChart } from "../../components/charts/AIPredictionsChart"
import {
  Building2,
  DollarSign,
  Zap,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronRight,
  Activity,
  Database,
  Globe,
  Settings,
  FileText,
  Calendar,
  Bell,

  Wrench,
  Cloud,
  Brain,
  ArrowUpRight,
  Target,
  PieChart,
  Sparkles,
  Plus,
  Search,
  Layout,
  Home,
  PlayCircle
} from "lucide-react"

// Mock data - replace with real API calls
const mockDashboardData = {
  overview: {
    totalProperties: 24,
    monthlyRevenue: 2450000,
    revenueGrowth: 12.5,
    activeIntegrations: 14,

    costSavings: 245670
  },
  recentActivity: [
    {
      id: 1,
      type: 'integration_connected',
      message: 'NYC Compliance integration activated',
      timestamp: '2024-07-16T17:30:00Z',
      icon: Scale,
      color: 'text-indigo-400'
    },
    {
      id: 2,
      type: 'ai_analysis',
      message: 'AI detected $15K cost savings opportunity',
      timestamp: '2024-07-16T16:45:00Z',
      icon: Brain,
      color: 'text-purple-400'
    },
    {
      id: 3,
      type: 'financial_sync',
      message: 'QuickBooks sync completed - 247 transactions',
      timestamp: '2024-07-16T15:20:00Z',
      icon: DollarSign,
      color: 'text-green-400'
    },

  ],
  integrations: [
    { name: 'QuickBooks Online', status: 'connected', lastSync: '2 min ago', icon: DollarSign, color: 'text-blue-400' },
    { name: 'NYC Compliance', status: 'connected', lastSync: '5 min ago', icon: Scale, color: 'text-indigo-400' },
    { name: 'Fiix Software', status: 'connected', lastSync: '12 min ago', icon: Wrench, color: 'text-orange-400' },
    { name: 'Google Drive', status: 'syncing', lastSync: 'Syncing...', icon: Cloud, color: 'text-blue-400' },
    { name: 'Plaid Banking', status: 'connected', lastSync: '1 hour ago', icon: DollarSign, color: 'text-green-400' },
    { name: 'WatchGuard', status: 'connected', lastSync: '30 min ago', icon: Shield, color: 'text-red-400' }
  ],
  alerts: [
    {
      id: 1,
      type: 'critical',
      title: 'XRF Testing Due',
      message: '456 Broadway - Due July 25',
      action: 'Schedule Inspection'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Facade Report Filing',
      message: 'Due in 15 days',
      action: 'Review Requirements'
    },
    {
      id: 3,
      type: 'info',
      title: 'AI Cost Optimization',
      message: '23% savings opportunity identified',
      action: 'View Recommendations'
    }
  ],
  aiInsights: {
    predictiveAccuracy: 97.3,
    costSavingsThisMonth: 45670,
    violationsPrevented: 3,
    optimizationRecommendations: 8
  }
}

export default function DemoDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChartTab, setSelectedChartTab] = useState('revenue')

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'info':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'syncing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="p-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Demo Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                ABO
              </div>
              <h1 className="text-xl font-semibold text-white">Active Back Office</h1>
            </Link>
            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
              <PlayCircle className="w-3 h-3 mr-1" />
              Live Demo
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to Active Back Office Demo
            </h1>
            <p className="text-slate-400">
              Explore our AI-powered property management platform with live demo data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-400 hover:text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
              <kbd className="ml-2 px-1.5 py-0.5 bg-slate-700 text-xs rounded">⌘K</kbd>
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-400 hover:text-white"
            >
              <Layout className="w-4 h-4 mr-2" />
              Customize
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Quick Action
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Properties</p>
                  <p className="text-2xl font-bold text-white">{mockDashboardData.overview.totalProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(mockDashboardData.overview.monthlyRevenue)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">+{mockDashboardData.overview.revenueGrowth}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>



          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">AI Cost Savings</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(mockDashboardData.overview.costSavings)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Brain className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-400">This Year</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Charts Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Analytics & Insights</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedChartTab === 'revenue' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedChartTab('revenue')}
                  className={selectedChartTab === 'revenue' ? "bg-orange-500 text-white" : "text-slate-400"}
                >
                  Revenue
                </Button>

                <Button
                  variant={selectedChartTab === 'ai' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedChartTab('ai')}
                  className={selectedChartTab === 'ai' ? "bg-orange-500 text-white" : "text-slate-400"}
                >
                  AI Predictions
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedChartTab === 'revenue' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Revenue & Expense Trends</h3>
                <RevenueChart height={400} />
              </div>
            )}

            {selectedChartTab === 'ai' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">AI Predictions & Accuracy</h3>
                <AIPredictionsChart height={400} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDashboardData.recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                      <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.message}</p>
                        <p className="text-sm text-slate-400">{formatDate(activity.timestamp)}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <ArrowUpRight className="w-3 h-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-400">Prediction Accuracy</span>
                    <span className="text-purple-400 font-bold">{mockDashboardData.aiInsights.predictiveAccuracy}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${mockDashboardData.aiInsights.predictiveAccuracy}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <p className="text-green-400 font-bold text-lg">{mockDashboardData.aiInsights.violationsPrevented}</p>
                    <p className="text-xs text-green-300">Violations Prevented</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-blue-400 font-bold text-lg">{mockDashboardData.aiInsights.optimizationRecommendations}</p>
                    <p className="text-xs text-blue-300">Optimizations</p>
                  </div>
                </div>

                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  <Brain className="w-4 h-4 mr-2" />
                  View AI Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Critical Alerts */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  Priority Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDashboardData.alerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <p className="text-xs opacity-80 mb-2">{alert.message}</p>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        {alert.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Status Overview */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Integration Status
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockDashboardData.integrations.map((integration) => {
                const Icon = integration.icon
                return (
                  <div key={integration.name} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-600/50 rounded-lg flex items-center justify-center">
                          <Icon className={`w-4 h-4 ${integration.color}`} />
                        </div>
                        <span className="text-white font-medium">{integration.name}</span>
                      </div>
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">Last sync: {integration.lastSync}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Demo CTA */}
        <Card className="bg-gradient-to-r from-orange-500/10 to-blue-500/10 border-orange-500/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to transform your property management?
            </h3>
            <p className="text-slate-300 mb-6">
              This interactive demo shows just a fraction of what Active Back Office can do.
              Start your free trial today and see the difference AI-powered automation makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Start Free Trial
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
