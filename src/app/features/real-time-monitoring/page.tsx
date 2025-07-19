"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import {
  Monitor,
  Eye,
  AlertTriangle,
  Activity,
  Clock,
  TrendingUp,
  Bell,
  Shield,
  CheckCircle,
  ArrowRight,
  Zap,
  BarChart3,
  Gauge
} from "lucide-react"

export default function RealTimeMonitoringPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                ABO
              </div>
              <h1 className="text-xl font-semibold text-white">Active Back Office</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              Back to Features
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Monitor className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Real-time Monitoring</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              24/7 Real-time
              <span className="text-blue-400"> Monitoring</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Stay ahead of issues with continuous monitoring of your property operations.
              Get instant alerts, track performance metrics, and maintain operational excellence
              with our advanced monitoring platform.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Live Dashboards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Real-time visualization of property metrics, financial data, and operational KPIs with customizable dashboards.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <CardTitle className="text-white">Instant Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Immediate notifications for critical events, compliance violations, and maintenance issues via multiple channels.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Performance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Continuous monitoring of property performance, tenant satisfaction, and operational efficiency metrics.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monitoring Capabilities */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Comprehensive Monitoring Suite
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    Operational Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Property performance metrics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Maintenance request tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Tenant satisfaction scores</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Occupancy rates and trends</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-400" />
                    Compliance Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">NYC Local Law compliance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Safety inspection schedules</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Certification expiration tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Violation prevention alerts</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Alert System */}
          <div className="bg-slate-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Intelligent Alert System
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Critical Alerts</h3>
                <p className="text-slate-400">
                  Immediate notifications for safety issues, compliance violations, and emergency situations
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Scheduled Alerts</h3>
                <p className="text-slate-400">
                  Proactive reminders for inspections, renewals, and maintenance schedules
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Trend Alerts</h3>
                <p className="text-slate-400">
                  AI-powered notifications for performance trends and optimization opportunities
                </p>
              </div>
            </div>
          </div>

          {/* Monitoring Dashboard Preview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Live Monitoring Dashboard
            </h2>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <Gauge className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">System Health</h3>
                    <p className="text-2xl font-bold text-green-400">99.9%</p>
                    <p className="text-xs text-slate-400">Uptime</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Active Alerts</h3>
                    <p className="text-2xl font-bold text-blue-400">3</p>
                    <p className="text-xs text-slate-400">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Properties</h3>
                    <p className="text-2xl font-bold text-purple-400">24</p>
                    <p className="text-xs text-slate-400">Monitored</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Response Time</h3>
                    <p className="text-2xl font-bold text-orange-400">&lt; 1min</p>
                    <p className="text-xs text-slate-400">Average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Monitoring Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Proactive Management</h3>
                      <p className="text-slate-400">
                        Identify and address issues before they become costly problems with early warning systems.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Instant Response</h3>
                      <p className="text-slate-400">
                        Reduce response times from hours to minutes with real-time alerting and automated workflows.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Compliance Assurance</h3>
                      <p className="text-slate-400">
                        Maintain 97% compliance with automated monitoring of regulations and requirements.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Cost Optimization</h3>
                      <p className="text-slate-400">
                        Save $245K+ annually through efficient monitoring and preventive maintenance strategies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Start Monitoring Your Properties Today
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Get complete visibility into your property operations with our advanced
              real-time monitoring platform. Never miss a critical event again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
