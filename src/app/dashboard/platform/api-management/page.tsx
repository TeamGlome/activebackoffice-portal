"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { PermissionGuard } from "../../../../components/PermissionGuard"
import {
  Key,
  Code,
  Monitor,
  Globe,
  Eye,
  Plus,
  Trash2,
  Copy,
  RefreshCw,
  Activity,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Webhook,
  Database,
  Shield
} from "lucide-react"

const apiKeys = [
  {
    id: 1,
    name: "Premium Properties - Production",
    key: "ak_live_7f8g9h0i1j2k3l4m5n6o7p8q",
    entityId: "entity-1",
    entityName: "Premium Properties LLC",
    environment: "production",
    permissions: ["entity.read", "entity.properties.manage", "entity.tenants.manage"],
    lastUsed: "2024-07-16 14:30:00",
    requests30d: 145670,
    status: "active",
    createdBy: "john@premiumproperties.com",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "City Center - Development",
    key: "ak_test_a1b2c3d4e5f6g7h8i9j0k1l2",
    entityId: "entity-2",
    entityName: "City Center Management",
    environment: "development",
    permissions: ["entity.read", "entity.properties.read"],
    lastUsed: "2024-07-16 09:15:00",
    requests30d: 2340,
    status: "active",
    createdBy: "sarah@manager.com",
    createdAt: "2024-03-01"
  },
  {
    id: 3,
    name: "Platform Analytics - Internal",
    key: "ak_internal_x9y8z7w6v5u4t3s2r1q0p9o8",
    entityId: null,
    entityName: "Active Back Office",
    environment: "production",
    permissions: ["platform.analytics.global", "platform.entities.read"],
    lastUsed: "2024-07-16 16:45:00",
    requests30d: 89234,
    status: "active",
    createdBy: "dev@activeoffice.com",
    createdAt: "2024-01-01"
  },
  {
    id: 4,
    name: "Legacy Integration",
    key: "ak_live_m5n6o7p8q9r0s1t2u3v4w5x6",
    entityId: "entity-1",
    entityName: "Premium Properties LLC",
    environment: "production",
    permissions: ["entity.read"],
    lastUsed: "2024-06-15 10:20:00",
    requests30d: 0,
    status: "inactive",
    createdBy: "admin@activeoffice.com",
    createdAt: "2023-12-01"
  }
]

const webhooks = [
  {
    id: 1,
    name: "Property Updates Webhook",
    url: "https://premiumproperties.com/webhooks/property-updates",
    entityId: "entity-1",
    events: ["property.created", "property.updated", "tenant.lease_signed"],
    status: "active",
    lastDelivery: "2024-07-16 15:30:00",
    deliveryRate: 99.2
  },
  {
    id: 2,
    name: "Payment Notifications",
    url: "https://citycenter.com/api/payment-webhook",
    entityId: "entity-2",
    events: ["payment.received", "payment.failed"],
    status: "active",
    lastDelivery: "2024-07-16 14:15:00",
    deliveryRate: 97.8
  }
]

export default function APIManagementPage() {
  const [showCreateKey, setShowCreateKey] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "inactive":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "suspended":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "production":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "development":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "staging":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const maskApiKey = (key: string) => {
    const prefix = key.substring(0, 8)
    return `${prefix}${'*'.repeat(24)}`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">API Management</h1>
          <p className="text-slate-400">Manage API keys, webhooks, and integrations for the Active Back Office platform</p>
        </div>
        <PermissionGuard permission="platform.api.create">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create API Key
          </Button>
        </PermissionGuard>
      </div>

      {/* API Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active API Keys</p>
                <p className="text-2xl font-bold text-white">127</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">API Requests (30d)</p>
                <p className="text-2xl font-bold text-white">2.4M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Webhook className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Webhooks</p>
                <p className="text-2xl font-bold text-white">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">99.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Keys
            </CardTitle>
            <div className="flex items-center gap-2">
              <PermissionGuard permission="platform.api.monitor">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                  <Monitor className="w-4 h-4 mr-2" />
                  Monitor Usage
                </Button>
              </PermissionGuard>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                      <Key className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{key.name}</h4>
                      <p className="text-sm text-slate-400">{key.entityName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getEnvironmentColor(key.environment)}>
                      {key.environment}
                    </Badge>
                    <Badge className={getStatusColor(key.status)}>
                      {key.status}
                    </Badge>
                    <PermissionGuard permission="platform.api.update">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-slate-400">API Key</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-white bg-slate-800 px-2 py-1 rounded">
                        {maskApiKey(key.key)}
                      </code>
                      <PermissionGuard permission="platform.api.read">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </PermissionGuard>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Requests (30d)</p>
                    <p className="text-white font-medium">{key.requests30d.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Last Used</p>
                    <p className="text-white font-medium">{key.lastUsed}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {key.permissions.map((permission) => (
                    <Badge
                      key={permission}
                      variant="outline"
                      className="text-xs border-slate-600 text-slate-400"
                    >
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Webhooks */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Webhook className="w-5 h-5" />
              Webhooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{webhook.name}</h4>
                    <Badge className={getStatusColor(webhook.status)}>
                      {webhook.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-400 mb-2">{webhook.url}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Delivery Rate: {webhook.deliveryRate}%</span>
                    <span className="text-slate-400">Last: {webhook.lastDelivery}</span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {webhook.events.map((event) => (
                      <Badge
                        key={event}
                        variant="outline"
                        className="text-xs border-slate-600 text-slate-400"
                      >
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Code className="w-5 h-5" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PermissionGuard permission="platform.development.access">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">API Documentation</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  Complete API reference for developers
                </p>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                  View Docs
                </Button>
              </div>
            </PermissionGuard>

            <PermissionGuard permission="platform.api.monitor">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">API Monitor</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  Real-time API usage and performance metrics
                </p>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                  Open Monitor
                </Button>
              </div>
            </PermissionGuard>

            <PermissionGuard permission="platform.development.debug">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">API Playground</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  Test API endpoints and debug requests
                </p>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                  Launch Playground
                </Button>
              </div>
            </PermissionGuard>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
