"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import {
  MessageCircle,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Bug,
  Settings,
  User,
  Calendar,
  ArrowRight,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Download,
  RefreshCw,
  Loader2,
  Eye,
  MoreVertical,
  ChevronDown,
  Star,
  Zap
} from "lucide-react"

interface SupportTicket {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'other'
  submitter: {
    name: string
    email: string
    entity: string
  }
  assignedTo?: string
  createdAt: string
  updatedAt: string
  messages: number
}

interface SupportStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  avgResponseTime: string
  satisfactionScore: number
}

// Mock data
const mockTickets: SupportTicket[] = [
  {
    id: "T-001",
    title: "QuickBooks integration not syncing transactions",
    description: "Our QuickBooks integration stopped syncing transactions since yesterday. Getting authentication errors.",
    status: "open",
    priority: "high",
    category: "technical",
    submitter: {
      name: "Sarah Chen",
      email: "sarah.chen@relatedcompanies.com",
      entity: "Related Companies"
    },
    assignedTo: "Support Team",
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T14:20:00Z",
    messages: 3
  },
  {
    id: "T-002",
    title: "Need help with NYC compliance setup",
    description: "We're trying to set up the NYC compliance module for our properties. Need guidance on the configuration.",
    status: "in-progress",
    priority: "medium",
    category: "feature",
    submitter: {
      name: "Michael Rodriguez",
      email: "m.rodriguez@silversteinproperties.com",
      entity: "Silverstein Properties"
    },
    assignedTo: "John Smith",
    createdAt: "2024-03-14T16:45:00Z",
    updatedAt: "2024-03-15T09:15:00Z",
    messages: 7
  },
  {
    id: "T-003",
    title: "Billing question about user seats",
    description: "We want to add more users to our plan. What are the pricing options?",
    status: "resolved",
    priority: "low",
    category: "billing",
    submitter: {
      name: "Jennifer Liu",
      email: "j.liu@rxrrealty.com",
      entity: "RXR Realty"
    },
    assignedTo: "Billing Team",
    createdAt: "2024-03-13T11:20:00Z",
    updatedAt: "2024-03-14T10:30:00Z",
    messages: 5
  }
]

const mockStats: SupportStats = {
  total: 24,
  open: 8,
  inProgress: 6,
  resolved: 10,
  avgResponseTime: "2.4 hours",
  satisfactionScore: 4.8
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [stats, setStats] = useState<SupportStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setTickets(mockTickets)
      setStats(mockStats)
    } catch (err) {
      console.error('Error fetching tickets:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets')
    } finally {
      setLoading(false)
    }
  }, [selectedStatus, searchQuery, selectedPriority, selectedCategory])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Open</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">In Progress</Badge>
      case 'resolved':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Resolved</Badge>
      case 'closed':
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Closed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Urgent</Badge>
      case 'high':
        return <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Medium</Badge>
      case 'low':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getCategoryIcon = (category: SupportTicket['category']) => {
    switch (category) {
      case 'technical':
        return <Settings className="w-4 h-4" />
      case 'billing':
        return <FileText className="w-4 h-4" />
      case 'feature':
        return <Zap className="w-4 h-4" />
      case 'bug':
        return <Bug className="w-4 h-4" />
      default:
        return <HelpCircle className="w-4 h-4" />
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.submitter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.submitter.entity.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
          <p className="text-slate-400">Manage customer support tickets and requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-400">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Tickets</p>
                <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Open</p>
                <p className="text-2xl font-bold text-white">{stats?.open || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">In Progress</p>
                <p className="text-2xl font-bold text-white">{stats?.inProgress || 0}</p>
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
                <p className="text-sm text-slate-400">Resolved</p>
                <p className="text-2xl font-bold text-white">{stats?.resolved || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Avg Response</p>
                <p className="text-xl font-bold text-white">{stats?.avgResponseTime || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Satisfaction</p>
                <p className="text-xl font-bold text-white">{stats?.satisfactionScore || 'N/A'}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Categories</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="feature">Feature Request</option>
          <option value="bug">Bug Report</option>
          <option value="other">Other</option>
        </select>

        <Button
          onClick={fetchTickets}
          variant="outline"
          className="border-slate-600 text-slate-400"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Support Tickets */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Support Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-2">Error loading tickets</p>
              <p className="text-slate-400 text-sm">{error}</p>
              <Button onClick={fetchTickets} className="mt-4 bg-orange-500 hover:bg-orange-600">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(ticket.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white text-lg">{ticket.title}</h3>
                          <span className="text-sm text-slate-400">#{ticket.id}</span>
                        </div>

                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{ticket.description}</p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-300">{ticket.submitter.name}</span>
                            <span className="text-slate-500">({ticket.submitter.entity})</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">{formatDate(ticket.createdAt)}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">{ticket.messages} messages</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-center">
                        <p className="text-xs text-slate-400 mb-1">Priority</p>
                        {getPriorityBadge(ticket.priority)}
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-slate-400 mb-1">Status</p>
                        {getStatusBadge(ticket.status)}
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-slate-400 mb-1">Assigned</p>
                        <p className="text-xs text-white">{ticket.assignedTo || 'Unassigned'}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredTickets.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">No tickets found matching your criteria</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="ghost">
              <Plus className="w-4 h-4 mr-2" />
              Create New Ticket
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Download className="w-4 h-4 mr-2" />
              Export Ticket Data
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Settings className="w-4 h-4 mr-2" />
              Support Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">support@activebackoffice.com</span>
            </div>
            <div className="text-xs text-slate-400">
              Mon-Fri 9AM-6PM EST
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="ghost">
              <FileText className="w-4 h-4 mr-2" />
              Documentation
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <MessageSquare className="w-4 h-4 mr-2" />
              Community Forum
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
