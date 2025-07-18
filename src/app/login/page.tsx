"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { useAuth } from "../../contexts/AuthContext"
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Monitor,
  Shield,
  Zap,
  Building2,
  AlertCircle,
  Lock
} from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(formData.email, formData.password)

      if (success) {
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setFormData({
      email: 'admin@activebackoffice.com',
      password: 'creadmin123!'
    })
    setIsLoading(true)
    setError('')

    try {
      const success = await login('admin@activebackoffice.com', 'creadmin123!')

      if (success) {
        router.push('/dashboard')
      } else {
        setError('Demo login failed. Please contact support.')
      }
    } catch (error) {
      setError('Demo login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              ABO
            </div>
            <h1 className="text-2xl font-bold text-white">Active Back Office</h1>
          </div>
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
            AI-Powered Business Operations
          </Badge>
        </div>

        {/* Admin Credentials */}
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-green-400">Admin Access</h3>
          </div>
          <p className="text-sm text-green-300 mb-3">
            Use these credentials to access the admin dashboard
          </p>
          <div className="text-xs text-green-200 mb-3 font-mono bg-green-500/5 p-2 rounded border">
            <div>📧 Email: <span className="text-green-300">admin@activebackoffice.com</span></div>
            <div>🔑 Password: <span className="text-green-300">creadmin123!</span></div>
          </div>
          <Button
            onClick={handleDemoLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
          >
            {isLoading ? 'Signing In...' : 'Quick Admin Login'}
          </Button>
        </div>

        {/* Demo Banner */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-blue-400">Try Our Interactive Demo</h3>
          </div>
          <p className="text-sm text-blue-300 mb-3">
            Explore the full dashboard with live data before signing up
          </p>
          <Link href="/demo">
            <Button variant="outline" className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
              View Demo Dashboard
            </Button>
          </Link>
        </div>

        {/* Login Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">Sign In to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-slate-600 text-orange-500 focus:ring-orange-500" />
                  <span className="ml-2 text-sm text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-orange-400 hover:text-orange-300">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <a href="#" className="text-orange-400 hover:text-orange-300">
                  Sign up for free
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg text-center">
            <Shield className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300">97% Compliance Accuracy</p>
          </div>
          <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg text-center">
            <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300">AI-Powered Insights</p>
          </div>
          <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg text-center">
            <Building2 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300">14+ Integrations</p>
          </div>
          <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg text-center">
            <Monitor className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300">Real-time Monitoring</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
