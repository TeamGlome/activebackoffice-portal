"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { MultiTenantUser, Entity, PlatformRole, EntityRole } from '../lib/permissions'

interface AuthContextType {
  user: MultiTenantUser | null
  currentEntity: Entity | null
  availableEntities: Entity[]
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  switchEntity: (entityId: string) => Promise<boolean>
  isLoading: boolean
  isPlatformAdmin: boolean
  currentEntityRole: EntityRole | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock entities for demo (in real app, these come from API)
const mockEntities: Entity[] = [
  {
    id: 'default-entity',
    name: 'Active Back Office',
    slug: 'active-back-office',
    subscription: 'enterprise',
    status: 'active',
    createdAt: '2024-01-15',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      features: ['ai_analytics', 'document_management', 'advanced_reporting']
    }
  },
  {
    id: 'entity-1',
    name: 'Premium Properties LLC',
    slug: 'premium-properties',
    subscription: 'enterprise',
    status: 'active',
    createdAt: '2024-01-15',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      features: ['ai_analytics', 'document_management', 'advanced_reporting']
    }
  },
  {
    id: 'entity-2',
    name: 'City Center Management',
    slug: 'city-center',
    subscription: 'professional',
    status: 'active',
    createdAt: '2024-03-01',
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      features: ['document_management', 'basic_reporting']
    }
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<MultiTenantUser | null>(null)
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null)
  const [availableEntities, setAvailableEntities] = useState<Entity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      // Convert NextAuth session to MultiTenantUser
      const multiTenantUser: MultiTenantUser = {
        id: session.user.id,
        name: session.user.name || 'User',
        email: session.user.email,
        platformRole: convertPlatformRole(session.user.platformRole),
        entityMemberships: [{
          entityId: session.user.entityId || 'default-entity',
          entityRole: convertEntityRole(session.user.role),
          status: 'active',
          joinedAt: new Date().toISOString().split('T')[0]
        }],
        currentEntityId: session.user.entityId || 'default-entity'
      }

      setUser(multiTenantUser)
      loadUserEntities(multiTenantUser)
    } else {
      setUser(null)
      setCurrentEntity(null)
      setAvailableEntities([])
    }

    setIsLoading(false)
  }, [session, status])

  const convertPlatformRole = (role?: string): PlatformRole | undefined => {
    switch (role) {
      case 'PLATFORM_SUPER_ADMIN':
        return 'platform_superadmin'
      case 'PLATFORM_ADMIN':
        return 'platform_manager'
      default:
        return undefined
    }
  }

  const convertEntityRole = (role: string): EntityRole => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'entity_admin'
      case 'ADMIN':
        return 'entity_manager'
      case 'USER':
        return 'entity_staff'
      default:
        return 'entity_staff'
    }
  }

  const loadUserEntities = (userData: MultiTenantUser, preferredEntityId?: string | null) => {
    // Get entities user has access to
    const userEntityIds = userData.entityMemberships
      .filter(m => m.status === 'active')
      .map(m => m.entityId)

    const userEntities = mockEntities.filter(entity =>
      userEntityIds.includes(entity.id) && entity.status === 'active'
    )

    setAvailableEntities(userEntities)

    // Set current entity
    let targetEntityId = preferredEntityId || userData.currentEntityId
    if (!targetEntityId || !userEntityIds.includes(targetEntityId)) {
      targetEntityId = userEntityIds[0] // Default to first available entity
    }

    const targetEntity = userEntities.find(e => e.id === targetEntityId)
    if (targetEntity) {
      setCurrentEntity(targetEntity)
      // Update user's current entity
      const updatedUser = { ...userData, currentEntityId: targetEntityId }
      setUser(updatedUser)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      setIsLoading(false)
      return result?.ok || false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    signOut({ redirect: false })
    setUser(null)
    setCurrentEntity(null)
    setAvailableEntities([])
  }

  const switchEntity = async (entityId: string): Promise<boolean> => {
    if (!user) return false

    // Check if user has access to this entity
    const hasAccess = user.entityMemberships.some(
      m => m.entityId === entityId && m.status === 'active'
    )

    if (!hasAccess) return false

    const targetEntity = mockEntities.find(e => e.id === entityId)
    if (!targetEntity) return false

    // Update current entity
    setCurrentEntity(targetEntity)

    // Update user's current entity
    const updatedUser = { ...user, currentEntityId: entityId }
    setUser(updatedUser)

    return true
  }

  const isPlatformAdmin = user?.platformRole === 'platform_superadmin'

  const currentEntityRole = user && currentEntity
    ? user.entityMemberships.find(m => m.entityId === currentEntity.id && m.status === 'active')?.entityRole || null
    : null

  return (
    <AuthContext.Provider value={{
      user,
      currentEntity,
      availableEntities,
      login,
      logout,
      switchEntity,
      isLoading,
      isPlatformAdmin,
      currentEntityRole
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
