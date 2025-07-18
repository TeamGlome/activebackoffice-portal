import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import {
  ArrowLeft,
  Building2,
  Settings,
  BarChart3,
  Bell,
  Brain,
  Shield,
  RefreshCw,
  Zap,
  Target,
  TrendingUp,
  Users,
  CheckCircle
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              ABO
            </div>
            <h1 className="text-xl font-semibold text-white">Active Back Office</h1>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center py-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center font-bold text-white text-2xl">
              ABO
            </div>
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-lg px-4 py-2">
              AI-Powered
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Active Back Office
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A modular platform built to automate and simplify the operational backbone of property management,
            storage, parking, and service-based businesses.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* About Section */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Building2 className="w-6 h-6 text-orange-400" />
                About Active Back Office
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-slate-300 leading-relaxed">
                Active Back Office is a modular platform built to automate and simplify the operational backbone
                of property management, storage, parking, and service-based businesses. Designed for scalability
                and intelligence, it transforms traditional workflows into streamlined, data-driven systems.
              </p>
            </CardContent>
          </Card>

          {/* What We Do Section */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-400" />
                What We Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-slate-300 leading-relaxed">
                We centralize essential back-office functions—lease tracking, financial reporting, legal oversight,
                and tenant engagement—into a unified interface. With real-time analytics, automated workflows,
                and intelligent alerts, businesses gain the clarity and control needed to operate efficiently
                and scale confidently.
              </p>
            </CardContent>
          </Card>

          {/* Our Approach Section */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-400" />
                Our Approach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">⚙️ Automation-First</h4>
                      <p className="text-slate-300 text-sm">
                        Replace manual processes with intelligent workflows that reduce overhead and improve accuracy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">📊 Real-Time Financial Visibility</h4>
                      <p className="text-slate-300 text-sm">
                        Monitor performance, cash flow, and tenant activity through dynamic dashboards
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">🔔 Instant Alerts & Notifications</h4>
                      <p className="text-slate-300 text-sm">
                        Stay ahead of lease expirations, payment issues, compliance deadlines, and operational anomalies
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">🧠 AI-Driven Insights</h4>
                      <p className="text-slate-300 text-sm">
                        Surface trends, flag risks, and support smarter decision-making
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">🧱 Modular Design</h4>
                      <p className="text-slate-300 text-sm">
                        Activate only the tools you need, tailored to your business model
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">🔐 Security-Focused Architecture</h4>
                      <p className="text-slate-300 text-sm">
                        Built with privacy, control, and reliability in mind
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complementary Integration */}
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-blue-500/10 rounded-lg border border-orange-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2 text-lg">🔄 Complementary Integration</h4>
                    <p className="text-slate-300">
                      Active Back Office doesn't replace your existing systems—it makes them more powerful.
                      By enhancing data flow, visibility, and automation, we extend the value of the tools
                      you already rely on.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why It Matters Section */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Why It Matters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg text-slate-300 leading-relaxed">
                  Operational complexity shouldn't slow down innovation. Active Back Office empowers businesses
                  to move faster, respond smarter, and deliver better experiences—without the burden of outdated
                  systems or fragmented tools.
                </p>
                <div className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                  <p className="text-xl font-semibold text-white text-center">
                    It's not about starting over—it's about leveling up.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Move Faster</h3>
                <p className="text-slate-400">
                  Streamlined workflows and automation eliminate bottlenecks and reduce manual overhead
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Respond Smarter</h3>
                <p className="text-slate-400">
                  AI-driven insights and real-time alerts help you make informed decisions faster
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Deliver Better</h3>
                <p className="text-slate-400">
                  Enhanced visibility and control translate to superior customer and tenant experiences
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Level Up Your Operations?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Transform your property management business with our intelligent, modular platform.
              Start your free trial today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6">
                  Start Free Trial
                  <CheckCircle className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:text-white text-lg px-8 py-6">
                  Learn More About Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
