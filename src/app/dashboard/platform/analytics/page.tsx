"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Activity,
  Globe,
  Zap,
  Shield,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Clock,
  Target,
  Cpu
} from "lucide-react"

// Mock analytics data
const mockAnalytics = {
  platformMetrics: {
    totalUsers: 78,
    activeUsers: 64,
    totalEntities: 24,
    totalProperties: 156,
    totalRevenue: 2850000,
    avgSessionTime: "24.5 min",
    pageViews: 45231,
    apiCalls: 128456
  },
  growthMetrics: {
    userGrowth: 18.5,
    entityGrowth: 12.3,
    revenueGrowth: 25.7,
    usageGrowth: 34.2
  },
  featureUsage: [
    { name: "Integration Hub", usage: 92, users: 58 },
    { name: "NYC Compliance", usage: 87, users: 42 },
    { name: "Property Management", usage: 94, users: 61 },
    { name: "AI Analytics", usage: 76, users: 38 },
    { name: "Financial Dashboard", usage: 89, users: 55 },
    { name: "Reporting", usage: 68, users: 35 }
  ],
  integrationStats: [
    { name: "QuickBooks", connections: 18, usage: 95 },
    { name: "NYC Compliance", connections: 12, usage: 87 },
    { name: "Fiix Software", connections: 10, usage: 82 },
    { name: "Google Drive", connections: 16, usage: 78 },
    { name: "Plaid Banking", connections: 14, usage: 91 }
  ],
  systemHealth: {
    uptime: 99.98,
    avgResponseTime: 245,
    errorRate: 0.02,
    activeConnections: 1247
  },
  userActivity: [
    { time: "00:00", active: 12 },
    { time: "04:00", active: 8 },
    { time: "08:00", active: 45 },
    { time: "12:00", active: 58 },
    { time: "16:00", active: 52 },
    { time: "20:00", active: 28 }
  ]
}

export default function PlatformAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [selectedView, setSelectedView] = useState("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
          <p className="text-slate-400">Monitor platform performance, usage, and growth metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" className="border-slate-600 text-slate-400">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Users</p>
                <p className="text-2xl font-bold text-white">{mockAnalytics.platformMetrics.activeUsers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+{mockAnalytics.growthMetrics.userGrowth}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Entities</p>
                <p className="text-2xl font-bold text-white">{mockAnalytics.platformMetrics.totalEntities}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+{mockAnalytics.growthMetrics.entityGrowth}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Platform Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(mockAnalytics.platformMetrics.totalRevenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+{mockAnalytics.growthMetrics.revenueGrowth}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">API Calls</p>
                <p className="text-2xl font-bold text-white">{formatNumber(mockAnalytics.platformMetrics.apiCalls)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+{mockAnalytics.growthMetrics.usageGrowth}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2">
        {["overview", "usage", "integrations", "performance"].map((view) => (
          <Button
            key={view}
            variant={selectedView === view ? "default" : "ghost"}
            onClick={() => setSelectedView(view)}
            className={selectedView === view ? "bg-orange-500 text-white" : "text-slate-400"}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        ))}
      </div>

      {selectedView === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Activity Chart */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">User Activity (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 p-4">
                {mockAnalytics.userActivity.map((point, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-orange-500 rounded-t-sm"
                      style={{ height: `${(point.active / 60) * 200}px` }}
                    />
                    <span className="text-xs text-slate-400 mt-1">{point.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white">Uptime</span>
                  </div>
                  <span className="text-green-400 font-semibold">{mockAnalytics.systemHealth.uptime}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-white">Response Time</span>
                  </div>
                  <span className="text-blue-400 font-semibold">{mockAnalytics.systemHealth.avgResponseTime}ms</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-white">Error Rate</span>
                  </div>
                  <span className="text-green-400 font-semibold">{mockAnalytics.systemHealth.errorRate}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-orange-400" />
                    <span className="text-white">Active Connections</span>
                  </div>
                  <span className="text-orange-400 font-semibold">{formatNumber(mockAnalytics.systemHealth.activeConnections)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === "usage" && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Feature Usage Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.featureUsage.map((feature, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">{feature.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-400">{feature.users} users</span>
                      <span className="text-sm font-semibold text-white">{feature.usage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${feature.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedView === "integrations" && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Integration Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.integrationStats.map((integration, index) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{integration.name}</h3>
                        <p className="text-sm text-slate-400">{integration.connections} active connections</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Usage</p>
                      <p className="text-lg font-semibold text-white">{integration.usage}%</p>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${integration.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedView === "performance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avg Session Time</span>
                    <span className="text-white font-semibold">{mockAnalytics.platformMetrics.avgSessionTime}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Page Views</span>
                    <span className="text-white font-semibold">{formatNumber(mockAnalytics.platformMetrics.pageViews)}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">API Response Time</span>
                    <span className="text-white font-semibold">{mockAnalytics.systemHealth.avgResponseTime}ms</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-slate-700/30 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">Performance trends visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
