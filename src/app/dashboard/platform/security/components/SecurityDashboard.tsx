'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle, Eye, Lock, Activity, Users, Globe, Database } from 'lucide-react'

interface SecurityEvent {
  id: string
  eventType: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  ipAddress?: string
  userId?: string
  resolved: boolean
}

interface SecurityMetrics {
  totalEvents: number
  criticalEvents: number
  activeUsers: number
  failedLogins: number
  blockedIPs: number
  lastSecurityScan: string
}

export default function SecurityDashboard() {
  const { data: session } = useSession()
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSecurityData = useCallback(async () => {
    try {
      // Mock data for now - replace with actual API calls
      setMetrics({
        totalEvents: 45,
        criticalEvents: 2,
        activeUsers: 8,
        failedLogins: 12,
        blockedIPs: 3,
        lastSecurityScan: new Date().toISOString()
      })

      setSecurityEvents([
        {
          id: '1',
          eventType: 'FAILED_LOGIN',
          description: 'Multiple failed login attempts from IP 192.168.1.100',
          severity: 'medium',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.100',
          resolved: false
        },
        {
          id: '2',
          eventType: 'SUSPICIOUS_ACTIVITY',
          description: 'Unusual API access pattern detected',
          severity: 'high',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          userId: 'user-123',
          resolved: false
        },
        {
          id: '3',
          eventType: 'RATE_LIMIT_EXCEEDED',
          description: 'Rate limit exceeded from IP 10.0.0.50',
          severity: 'low',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          ipAddress: '10.0.0.50',
          resolved: true
        }
      ])
    } catch (error) {
      console.error('Failed to fetch security data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSecurityData()
  }, [fetchSecurityData])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const resolveEvent = async (eventId: string) => {
    setSecurityEvents(events =>
      events.map(event =>
        event.id === eventId ? { ...event, resolved: true } : event
      )
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
          <p className="text-slate-400">Monitor and manage security events and settings</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Shield className="h-4 w-4 mr-2" />
          Run Security Scan
        </Button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Security Events</p>
                <p className="text-2xl font-bold text-white">{metrics?.totalEvents}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Critical Events</p>
                <p className="text-2xl font-bold text-red-400">{metrics?.criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Users</p>
                <p className="text-2xl font-bold text-green-400">{metrics?.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Failed Logins</p>
                <p className="text-2xl font-bold text-yellow-400">{metrics?.failedLogins}</p>
              </div>
              <Lock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Configuration */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Configuration
            </CardTitle>
            <CardDescription>Current security settings and protections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-white">HTTPS Enforcement</p>
                    <p className="text-sm text-slate-400">SSL/TLS encryption enabled</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-white">Rate Limiting</p>
                    <p className="text-sm text-slate-400">1000 requests per 15 minutes</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-white">Security Headers</p>
                    <p className="text-sm text-slate-400">CSP, HSTS, XSS protection</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-white">Database Security</p>
                    <p className="text-sm text-slate-400">Encrypted connections, access control</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Events */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Security Events
            </CardTitle>
            <CardDescription>Latest security incidents and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityEvents.map(event => (
                <div key={event.id} className="p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)}`}></div>
                      <Badge variant="outline" className="text-xs">
                        {event.eventType.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm text-white mb-2">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {event.ipAddress && `IP: ${event.ipAddress}`}
                      {event.userId && `User: ${event.userId}`}
                    </div>
                    {!event.resolved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveEvent(event.id)}
                        className="text-xs"
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Configuration */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Alert Configuration</CardTitle>
          <CardDescription>Configure security monitoring and notification settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Email Alerts</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-slate-300">Critical security events</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-slate-300">Failed login attempts ({'>'}10/hour)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-slate-300">Rate limit violations</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-slate-300">Unusual API activity</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-white">Monitoring Thresholds</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Failed Login Threshold</label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Rate Limit (requests/15min)</label>
                  <input
                    type="number"
                    defaultValue="1000"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Alert Email</label>
                  <input
                    type="email"
                    defaultValue="admin@activebackoffice.com"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Save Security Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
