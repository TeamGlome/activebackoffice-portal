"use client"

import { useState, useEffect, useCallback } from 'react'
import { Command } from 'cmdk'
import { Search, Building2, FileText, Users, Settings, Scale, DollarSign, Wrench } from 'lucide-react'
import Fuse from 'fuse.js'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  type: 'property' | 'document' | 'integration' | 'compliance' | 'user' | 'task'
  title: string
  description: string
  url: string
  icon: React.ComponentType<any>
  metadata?: Record<string, any>
}

// Mock search data - replace with real API data
const searchData: SearchResult[] = [
  // Properties
  { id: '1', type: 'property', title: '123 Park Avenue', description: 'Residential High-Rise • 25 floors • 180 units', url: '/dashboard/property-management', icon: Building2 },
  { id: '2', type: 'property', title: '456 Broadway', description: 'Commercial Office • 15 floors • Class B', url: '/dashboard/property-management', icon: Building2 },
  { id: '3', type: 'property', title: '789 Fifth Avenue', description: 'Mixed Use • 30 floors • 120 units', url: '/dashboard/property-management', icon: Building2 },

  // Integrations
  { id: '4', type: 'integration', title: 'QuickBooks Online', description: 'Accounting integration • Last sync: 2 min ago', url: '/dashboard/integrations/quickbooks', icon: DollarSign },
  { id: '5', type: 'integration', title: 'NYC Site Compliance', description: 'AI-powered compliance • 97% accuracy', url: '/dashboard/integrations/nyc-compliance', icon: Scale },
  { id: '6', type: 'integration', title: 'Fiix Software', description: 'Maintenance management • Work orders active', url: '/dashboard/integrations/fiix', icon: Wrench },

  // Documents
  { id: '7', type: 'document', title: 'Facade Inspection Report - 123 Park Ave', description: 'Local Law 55 compliance • Due: Aug 10', url: '/dashboard/property-management/documents', icon: FileText },
  { id: '8', type: 'document', title: 'XRF Lead Paint Report - 456 Broadway', description: 'Local Law 31 compliance • Critical', url: '/dashboard/property-management/documents', icon: FileText },

  // Compliance
  { id: '9', type: 'compliance', title: 'Local Law 97 - Climate Emissions', description: 'Environmental compliance • 12 properties affected', url: '/dashboard/compliance', icon: Scale },
  { id: '10', type: 'compliance', title: 'Local Law 31 - Lead Paint XRF', description: 'Health & Safety • High priority • 5 properties', url: '/dashboard/compliance', icon: Scale },

  // Tasks
  { id: '11', type: 'task', title: 'Schedule facade inspection', description: '456 Broadway • Due in 15 days', url: '/dashboard/compliance', icon: Settings },
  { id: '12', type: 'task', title: 'Review emissions report', description: 'Local Law 97 compliance • Annual filing', url: '/dashboard/compliance', icon: Settings }
]

const fuse = new Fuse(searchData, {
  keys: ['title', 'description', 'type'],
  threshold: 0.3,
  includeScore: true
})

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(searchData.slice(0, 8))
      return
    }

    const searchResults = fuse.search(searchQuery)
    setResults(searchResults.map(result => result.item).slice(0, 8))
  }, [])

  useEffect(() => {
    performSearch(query)
  }, [query, performSearch])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      performSearch('')
    }
  }, [isOpen, performSearch])

  const handleSelect = (result: SearchResult) => {
    router.push(result.url)
    onClose()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'property':
        return 'text-blue-400'
      case 'integration':
        return 'text-orange-400'
      case 'document':
        return 'text-green-400'
      case 'compliance':
        return 'text-indigo-400'
      case 'task':
        return 'text-purple-400'
      default:
        return 'text-slate-400'
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'property':
        return 'Property'
      case 'integration':
        return 'Integration'
      case 'document':
        return 'Document'
      case 'compliance':
        return 'Compliance'
      case 'task':
        return 'Task'
      default:
        return type
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-16">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        <Command shouldFilter={false}>
          <div className="flex items-center gap-3 p-4 border-b border-slate-700">
            <Search className="w-5 h-5 text-slate-400" />
            <Command.Input
              placeholder="Search properties, documents, integrations..."
              value={query}
              onValueChange={setQuery}
              className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
            />
            <kbd className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded border border-slate-600">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-2">Try searching for properties, documents, or integrations</p>
              </div>
            ) : (
              <div className="p-2">
                {results.map((result, index) => {
                  const Icon = result.icon
                  return (
                    <Command.Item
                      key={result.id}
                      value={result.id}
                      onSelect={() => handleSelect(result)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        index === selectedIndex
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center ${getTypeColor(result.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{result.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full bg-slate-700 ${getTypeColor(result.type)}`}>
                            {getTypeBadge(result.type)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 truncate">{result.description}</p>
                      </div>
                    </Command.Item>
                  )
                })}
              </div>
            )}
          </Command.List>

          <div className="border-t border-slate-700 p-3 text-xs text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">Enter</kbd>
                Select
              </span>
            </div>
            <span>Powered by AI Search</span>
          </div>
        </Command>
      </div>
    </div>
  )
}
