"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Building2,
  Users,
  MoreVertical,
  Download,
  RefreshCw,
  PauseCircle,
  PlayCircle
} from "lucide-react"

// Mock billing data
const mockBillingData = {
  overview: {
    totalRevenue: 2850000,
    monthlyRecurring: 485000,
    growth: 12.5,
    activeSubscriptions: 24,
    trialAccounts: 6,
    churnRate: 3.2
  },
  recentInvoices: [
    {
      id: "INV-001",
      entity: "Manhattan Properties LLC",
      amount: 25000,
      status: "paid",
      dueDate: "2024-01-15",
      paidDate: "2024-01-12"
    },
    {
      id: "INV-002",
      entity: "Brooklyn Real Estate Group",
      amount: 18000,
      status: "paid",
      dueDate: "2024-01-15",
      paidDate: "2024-01-10"
    },
    {
      id: "INV-003",
      entity: "Queens Commercial Partners",
      amount: 32000,
      status: "pending",
      dueDate: "2024-01-20",
      paidDate: null
    },
    {
      id: "INV-004",
      entity: "Bronx Housing Corp",
      amount: 8500,
      status: "overdue",
      dueDate: "2024-01-10",
      paidDate: null
    }
  ],
  subscriptions: [
    {
      id: "SUB-001",
      entity: "Manhattan Properties LLC",
      plan: "Enterprise",
      price: 25000,
      billing: "monthly",
      status: "active",
      nextBilling: "2024-02-15",
      users: 24,
      properties: 12
    },
    {
      id: "SUB-002",
      entity: "Brooklyn Real Estate Group",
      plan: "Professional",
      price: 18000,
      billing: "monthly",
      status: "active",
      nextBilling: "2024-02-15",
      users: 18,
      properties: 8
    },
    {
      id: "SUB-003",
      entity: "Queens Commercial Partners",
      plan: "Enterprise",
      price: 32000,
      billing: "monthly",
      status: "active",
      nextBilling: "2024-02-20",
      users: 12,
      properties: 6
    },
    {
      id: "SUB-004",
      entity: "Bronx Housing Corp",
      plan: "Starter",
      price: 8500,
      billing: "monthly",
      status: "trial",
      nextBilling: "2024-02-01",
      users: 6,
      properties: 4
    }
  ]
}

export default function BillingPage() {
  const [selectedView, setSelectedView] = useState("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "pending":
      case "trial":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "overdue":
      case "suspended":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "Professional":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Starter":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscriptions</h1>
          <p className="text-slate-400">Monitor revenue, invoices, and subscription management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-400">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Billing
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(mockBillingData.overview.totalRevenue)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+{mockBillingData.overview.growth}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Monthly Recurring</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(mockBillingData.overview.monthlyRecurring)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-blue-400">+8.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Subscriptions</p>
                <p className="text-2xl font-bold text-white">
                  {mockBillingData.overview.activeSubscriptions}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-slate-400">{mockBillingData.overview.trialAccounts} trials</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2">
        {["overview", "invoices", "subscriptions"].map((view) => (
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

      {selectedView === "invoices" && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBillingData.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{invoice.id}</h3>
                        <p className="text-sm text-slate-400">{invoice.entity}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Amount</p>
                        <p className="font-semibold text-white">{formatCurrency(invoice.amount)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Due Date</p>
                        <p className="text-sm text-white">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Status</p>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedView === "subscriptions" && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBillingData.subscriptions.map((subscription) => (
                <div key={subscription.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{subscription.entity}</h3>
                        <p className="text-sm text-slate-400">{subscription.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Plan</p>
                        <Badge className={getPlanColor(subscription.plan)}>
                          {subscription.plan}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Price</p>
                        <p className="font-semibold text-white">{formatCurrency(subscription.price)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Users</p>
                        <p className="font-semibold text-white">{subscription.users}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Next Billing</p>
                        <p className="text-sm text-white">{new Date(subscription.nextBilling).toLocaleDateString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-400">Status</p>
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                          {subscription.status === 'active' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
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

      {selectedView === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart Placeholder */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-slate-700/30 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">Revenue chart visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Distribution */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Plan Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-white">Enterprise</span>
                  </div>
                  <span className="text-slate-400">2 entities</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-white">Professional</span>
                  </div>
                  <span className="text-slate-400">1 entity</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white">Starter</span>
                  </div>
                  <span className="text-slate-400">1 entity</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
