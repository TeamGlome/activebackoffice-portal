"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import UserModal from "./components/UserModal"
import {
  Users,
  Plus,
  Search,
  Settings,
  Mail,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  Loader2,
  UserPlus,
  Filter,
  Download,
  Clock
} from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  platformRole: string
  entityId: string
  entityName: string
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

interface Entity {
  id: string
  name: string
}

interface UserStats {
  total: number
  active: number
  inactive: number
  admins: number
  managers: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [entities, setEntities] = useState<Entity[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedEntity, setSelectedEntity] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (selectedFilter !== 'all') params.append('status', selectedFilter)
      if (selectedRole !== 'all') params.append('role', selectedRole)
      if (selectedEntity !== 'all') params.append('entityId', selectedEntity)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/platform/users?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch users')
      }

      setUsers(data.users)
      setEntities(data.entities)
      setStats(data.stats)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [selectedFilter, searchQuery, selectedRole, selectedEntity])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreateUser = () => {
    setModalMode('create')
    setSelectedUser(null)
    setModalOpen(true)
  }

  const handleEditUser = (user: UserData) => {
    setModalMode('edit')
    setSelectedUser(user)
    setModalOpen(true)
  }

  const handleSaveUser = async (userData: UserData) => {
    try {
      const url = modalMode === 'create'
        ? '/api/platform/users'
        : `/api/platform/users/${selectedUser?.id}`

      const method = modalMode === 'create' ? 'POST' : 'PUT'

      console.log('Saving user with method:', method)
      console.log('URL:', url)
      console.log('User data being sent:', JSON.stringify(userData, null, 2))

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers))

      const result = await response.json()
      console.log('Full API response:', JSON.stringify(result, null, 2))

      if (response.ok && result.success) {
        console.log('User saved successfully')
        await fetchUsers()
        setModalOpen(false)
      } else {
        console.error('Save failed - Response not OK or success false')
        console.error('Status:', response.status)
        console.error('Result:', result)

        const errorMessage = result.error || result.details || 'Unknown error'
        alert(`Failed to save user: ${errorMessage}`)
      }
    } catch (err) {
      console.error('Network/Parse error saving user:', err)
      console.error('Error type:', typeof err)
      console.error('Error details:', err)

      const errorMessage = err instanceof Error ? err.message : 'Network error'
      alert(`Failed to save user: ${errorMessage}`)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/platform/users/${userId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await fetchUsers()
      } else {
        alert(`Failed to delete user: ${result.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      alert(`Failed to delete user: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
      : <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Inactive</Badge>
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Admin</Badge>
      case 'manager':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Manager</Badge>
      case 'user':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">User</Badge>
      case 'viewer':
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Viewer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getPlatformRoleBadge = (platformRole: string) => {
    switch (platformRole) {
      case 'super_admin':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Super Admin</Badge>
      case 'admin':
        return <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">Platform Admin</Badge>
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">User</Badge>
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.entityName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedFilter === 'all' ||
      (selectedFilter === 'active' && user.isActive) ||
      (selectedFilter === 'inactive' && !user.isActive)

    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesEntity = selectedEntity === 'all' || user.entityId === selectedEntity

    return matchesSearch && matchesStatus && matchesRole && matchesEntity
  })

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">Manage platform users and their access permissions</p>
        </div>
        <Button
          onClick={handleCreateUser}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Inactive</p>
                  <p className="text-2xl font-bold text-white">{stats.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Admins</p>
                  <p className="text-2xl font-bold text-white">{stats.admins}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Managers</p>
                  <p className="text-2xl font-bold text-white">{stats.managers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>

            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
            >
              <option value="all">All Entities</option>
              {entities.map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>

            <Button
              variant="outline"
              onClick={fetchUsers}
              disabled={loading}
              className="border-slate-600 text-slate-400 hover:text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Grid */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                    <p className="text-slate-400">{user.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {getStatusBadge(user.isActive)}
                      {getRoleBadge(user.role)}
                      {getPlatformRoleBadge(user.platformRole)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Entity</p>
                    <p className="text-lg font-semibold text-white">{user.entityName}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-slate-400">Last Login</p>
                    <p className="text-lg font-semibold text-white">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-slate-400">Created</p>
                    <p className="text-lg font-semibold text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="border-red-500/20 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Users Found</h3>
            <p className="text-slate-400">No users match your current filters.</p>
          </CardContent>
        </Card>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        entities={entities}
        mode={modalMode}
      />
    </div>
  )
}
