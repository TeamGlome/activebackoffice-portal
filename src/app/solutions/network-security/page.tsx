"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  Server,
  Wifi,
  Router,
  Monitor,
  CheckCircle,
  ArrowRight,
  Zap,
  Clock,
  Users
} from "lucide-react"

export default function NetworkSecurityPage() {
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
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Network Security Solutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Enterprise-Grade
              <span className="text-blue-400"> Network Security</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Protect your property management operations with comprehensive network security solutions.
              Monitor, detect, and prevent threats across all your connected systems and devices.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Advanced Threat Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  AI-powered threat detection and prevention with real-time monitoring of network traffic and suspicious activities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">24/7 Network Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Continuous surveillance of your network infrastructure with instant alerts for any security incidents.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Server className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Secure Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Enterprise-grade firewalls, VPN connections, and encrypted communications for all your devices.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Security Components */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Comprehensive Security Architecture
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Wifi className="w-6 h-6 text-blue-400" />
                    Network Perimeter Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Next-generation firewalls</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Intrusion detection systems</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">VPN gateway protection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">DDoS mitigation</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Monitor className="w-6 h-6 text-green-400" />
                    Endpoint Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Device encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Antivirus and anti-malware</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Application whitelisting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Behavioral analysis</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-slate-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Security Benefits for Property Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">99.9% Uptime</h3>
                <p className="text-slate-400">
                  Ensure continuous operations with enterprise-grade security infrastructure
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Real-time Response</h3>
                <p className="text-slate-400">
                  Instant threat detection and automated response to security incidents
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Team Protection</h3>
                <p className="text-slate-400">
                  Secure access for all team members with role-based permissions
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Secure Your Property Operations?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Get enterprise-grade network security for your property management business.
              Protect your data, ensure compliance, and maintain operational continuity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Security Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                Contact Security Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
