'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Shield, User, Settings, Search, Filter } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: string
  platformRole: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  entity: {
    id: string
    name: string
  }
}

interface UserFilters {
  role: string
  status: string
  search: string
}

interface CreateUserData {
  email: string
  name: string
  role: string
  platformRole: string
  entityId: string
}

interface UpdateUserData {
  email?: string
  name?: string
  role?: string
  platformRole?: string
  isActive?: boolean
}

export default function UserManagement() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    status: 'all',
    search: ''
  })
  const [showCreateUser, setShowCreateUser] = useState(false)

  const roles = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', color: 'bg-red-500' },
    { value: 'ADMIN', label: 'Administrator', color: 'bg-orange-500' },
    { value: 'MANAGER', label: 'Manager', color: 'bg-blue-500' },
    { value: 'USER', label: 'User', color: 'bg-green-500' },
    { value: 'VIEWER', label: 'Viewer', color: 'bg-gray-500' }
  ]

  const permissions = {
    SUPER_ADMIN: ['ALL_PERMISSIONS'],
    ADMIN: ['USER_MANAGEMENT', 'SYSTEM_CONFIG', 'REPORTS', 'INTEGRATIONS'],
    MANAGER: ['TEAM_MANAGEMENT', 'REPORTS', 'INTEGRATIONS'],
    USER: ['DASHBOARD_ACCESS', 'BASIC_REPORTS'],
    VIEWER: ['DASHBOARD_VIEW']
  }

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/platform/users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users.filter(user => {
    const matchesRole = filters.role === 'all' || user.role === filters.role
    const matchesStatus = filters.status === 'all' ||
      (filters.status === 'active' && user.isActive) ||
      (filters.status === 'inactive' && !user.isActive)
    const matchesSearch = !filters.search ||
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase())

    return matchesRole && matchesStatus && matchesSearch
  })

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      const response = await fetch('/api/platform/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        await fetchUsers()
        setShowCreateUser(false)
      }
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const handleUpdateUser = async (userId: string, updates: UpdateUserData) => {
    try {
      const response = await fetch(`/api/platform/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await fetchUsers()
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      await handleUpdateUser(userId, { isActive: false })
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = roles.find(r => r.value === role)
    return (
      <Badge className={`${roleConfig?.color} text-white`}>
        {roleConfig?.label || role}
      </Badge>
    )
  }

  const getPermissionsList = (role: string) => {
    return permissions[role as keyof typeof permissions] || []
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Users...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">Manage users and their permissions</p>
        </div>
        <Button onClick={() => setShowCreateUser(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <Card key={user.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                    <p className="text-slate-400">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {getRoleBadge(user.role)}
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowCreateUser(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  {user.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeactivateUser(user.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-2">
                  {getPermissionsList(user.role).map(permission => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Users Found</h3>
            <p className="text-slate-400">No users match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
