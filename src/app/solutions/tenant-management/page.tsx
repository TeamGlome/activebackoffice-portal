"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import {
  Users,
  MessageSquare,
  FileText,
  CreditCard,
  Calendar,
  Bell,
  Building2,
  Phone,
  CheckCircle,
  ArrowRight,
  Clock,
  Star,
  TrendingUp
} from "lucide-react"

export default function TenantManagementPage() {
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
              Back to Home
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
              <Users className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-medium">Tenant Management Solutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Complete
              <span className="text-orange-400"> Tenant Experience</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Streamline tenant relationships with integrated communication, automated workflows,
              and self-service portals. Increase tenant satisfaction by 95% while reducing management overhead.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-orange-400" />
                </div>
                <CardTitle className="text-white">Communication Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Centralized messaging, automated notifications, and real-time communication between tenants and management.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Payment Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Automated rent collection, online payments, and integrated billing with late fee management.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Document Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Digital lease management, document storage, and automated contract renewals with e-signatures.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tenant Portal Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Self-Service Tenant Portal
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Phone className="w-6 h-6 text-orange-400" />
                    Request Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Online maintenance requests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Real-time status tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Automated prioritization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Vendor coordination</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    Lease Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Digital lease signing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Renewal automation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Document storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Compliance tracking</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-slate-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Enhanced Tenant Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">95% Satisfaction</h3>
                <p className="text-slate-400">
                  Higher tenant satisfaction through improved communication and service
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">30% Retention Increase</h3>
                <p className="text-slate-400">
                  Reduced turnover through proactive tenant engagement and service
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">24/7 Access</h3>
                <p className="text-slate-400">
                  Round-the-clock portal access for payments, requests, and communication
                </p>
              </div>
            </div>
          </div>

          {/* Management Tools */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Property Management Tools
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-white font-medium">Tenant Portal</h3>
                <p className="text-xs text-slate-400 mt-1">Self-Service Platform</p>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-medium">Notifications</h3>
                <p className="text-xs text-slate-400 mt-1">Automated Alerts</p>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-medium">Lease Tracking</h3>
                <p className="text-xs text-slate-400 mt-1">Contract Management</p>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-medium">Property Analytics</h3>
                <p className="text-xs text-slate-400 mt-1">Performance Insights</p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Transform Your Tenant Relationships
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Create exceptional tenant experiences with our comprehensive management platform.
              Improve satisfaction, reduce turnover, and streamline operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Tenant Portal Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
