"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { Loader2 } from "lucide-react"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/setup", "/api/setup-production"]
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (!isLoading) {
      if (!user && !isPublicRoute) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push("/login")
      } else if (user && pathname === "/login") {
        // Redirect to dashboard if authenticated and trying to access login
        router.push("/")
      }
    }
  }, [user, isLoading, pathname, router, isPublicRoute])

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">
              ABO
            </div>
            <h1 className="text-xl font-semibold text-white">Active Back Office</h1>
          </div>
          <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render protected content if not authenticated
  if (!user && !isPublicRoute) {
    return null
  }

  return <>{children}</>
}
