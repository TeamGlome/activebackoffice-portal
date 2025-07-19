"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useAuth } from "../../contexts/AuthContext"
import { EntitySwitcher } from "../../components/EntitySwitcher"
import { hasPermission, Permission } from "../../lib/permissions"
import PasswordChangeModal from "./components/PasswordChangeModal"

interface PlatformNavigationItem {
  name: string
  href: string
  icon: LucideIcon
  permission: Permission
}

interface EntityNavigationItem {
  name: string
  href: string
  icon: LucideIcon
}
import {
  Building2,
  DollarSign,
  Shield,
  Zap,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  MessageSquare,
  UserCog,
  type LucideIcon
} from "lucide-react"

const platformNavigationItems = [
  {
    name: "Platform Dashboard",
    href: "/",
    icon: BarChart3,
    permission: "platform.analytics.global"
  },
  {
    name: "Entity Management",
    href: "/dashboard/platform/entities",
    icon: Building2,
    permission: "platform.entities.read"
  },
  {
    name: "User Management",
    href: "/dashboard/platform/users",
    icon: User,
    permission: "platform.users.read"
  },
  {
    name: "API Management",
    href: "/dashboard/platform/api-management",
    icon: Settings,
    permission: "platform.api.read"
  },
  {
    name: "Billing & Subscriptions",
    href: "/dashboard/platform/billing",
    icon: DollarSign,
    permission: "platform.billing.read"
  },
  {
    name: "Platform Analytics",
    href: "/dashboard/platform/analytics",
    icon: BarChart3,
    permission: "platform.analytics.global"
  },
  {
    name: "Support Center",
    href: "/dashboard/platform/support",
    icon: MessageSquare,
  UserCog,
    permission: "platform.support.access"
  }
]

const entityNavigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3
  },
  {
    name: "Property Management",
    href: "/dashboard/property-management",
    icon: Building2
  },
  {
    name: "Financial Management",
    href: "/dashboard/financial",
    icon: DollarSign
  },
  {
    name: "Security Operations",
    href: "/dashboard/security",
    icon: Shield
  },
  {
    name: "AI Analytics",
    href: "/dashboard/ai-analytics",
    icon: Zap
  },
  {
    name: "Reports & Analytics",
    href: "/dashboard/reports",
    icon: BarChart3
  },
  {
    name: "Integration Hub",
    href: "/dashboard/integrations",
    icon: Settings
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const pathname = usePathname()
  const { user, logout, isPlatformAdmin } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // Determine which navigation to show
  const isPlatformUser = user?.platformRole !== undefined
  const navigationItems = isPlatformUser ? platformNavigationItems : entityNavigationItems

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                ABO
              </div>
              <h1 className="text-xl font-semibold text-white">Active Back Office</h1>
            </Link>
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
              AI-Powered
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/about">
              <Button variant="ghost" className="text-slate-400 hover:text-white text-sm">
                About
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>

            {/* Entity Switcher */}
            <div className="hidden md:block">
              <EntitySwitcher />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-sm text-slate-400 hover:text-white hidden lg:flex items-center gap-2" onClick={() => setShowPasswordModal(true)} title="Profile Settings"><UserCog className="w-4 h-4" />{user?.name}</Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700 transition-transform duration-200 ease-in-out lg:block`}>
          <div className="flex flex-col h-full pt-6">
            <nav className="flex-1 px-4 space-y-2">
              {navigationItems.map((item) => {
                // Check permissions for platform navigation items
                if ('permission' in item) {
                  const platformItem = item as PlatformNavigationItem
                  if (!hasPermission(user, platformItem.permission)) {
                    return null
                  }
                }

                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:pl-0">
          {children}
        </main>

        {/* Password Change Modal */}
        <PasswordChangeModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      </div>
    </div>
  )
}
