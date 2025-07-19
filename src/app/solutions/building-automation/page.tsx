"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import {
  Settings,
  Thermometer,
  Lightbulb,
  Zap,
  Shield,
  Camera,
  Wifi,
  Monitor,
  CheckCircle,
  ArrowRight,
  Clock,
  TrendingDown,
  Building2
} from "lucide-react"

export default function BuildingAutomationPage() {
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
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <Settings className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-medium">Building Automation Solutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Smart Building
              <span className="text-purple-400"> Automation</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Transform your properties into intelligent buildings with IoT sensors, automated systems,
              and AI-powered optimization. Reduce energy costs by 40% while enhancing tenant comfort.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Thermometer className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Climate Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  AI-powered HVAC optimization with zone-based temperature control and energy efficiency monitoring.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                </div>
                <CardTitle className="text-white">Smart Lighting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Automated lighting systems with occupancy sensors, daylight harvesting, and energy optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Security Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Integrated access control, surveillance systems, and automated security protocols.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Automation Systems */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Comprehensive Building Systems
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    Energy Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Smart meter integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Load balancing optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Peak demand management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Renewable energy integration</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Monitor className="w-6 h-6 text-blue-400" />
                    IoT Sensor Network
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Occupancy detection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Air quality monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Water leak detection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Environmental sensors</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-slate-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Smart Building Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">40% Energy Savings</h3>
                <p className="text-slate-400">
                  Reduce utility costs through intelligent automation and optimization
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">24/7 Monitoring</h3>
                <p className="text-slate-400">
                  Continuous system monitoring with predictive maintenance alerts
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Enhanced Comfort</h3>
                <p className="text-slate-400">
                  Improved tenant satisfaction through optimized living conditions
                </p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Advanced Automation Technologies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Wifi className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-medium">IoT Sensors</h3>
                <p className="text-xs text-slate-400 mt-1">Environmental Monitoring</p>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-medium">BMS Integration</h3>
                <p className="text-xs text-slate-400 mt-1">Building Management</p>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-medium">Smart Grid</h3>
                <p className="text-xs text-slate-400 mt-1">Energy Optimization</p>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white font-medium">AI Analytics</h3>
                <p className="text-xs text-slate-400 mt-1">Predictive Insights</p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Automate Your Buildings?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Transform your properties into intelligent buildings with our comprehensive
              automation solutions. Reduce costs, improve efficiency, and enhance tenant satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Building Assessment
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
