import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { PermissionGuard } from "../../../components/PermissionGuard"
import {
  Building2,
  Users,
  Wrench,
  Calendar,
  MapPin,
  DollarSign,
  Plus,
  Filter,
  Search,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Bell,
  TrendingUp,
  Eye,
  Settings
} from "lucide-react"

const properties = [
  {
    id: 1,
    name: "Sunset Apartments",
    address: "123 Main St, City Center",
    units: 24,
    occupied: 22,
    monthlyRevenue: 48000,
    status: "Active",
    maintenanceIssues: 2
  },
  {
    id: 2,
    name: "Oak Grove Complex",
    address: "456 Oak Ave, Suburban",
    units: 36,
    occupied: 34,
    monthlyRevenue: 72000,
    status: "Active",
    maintenanceIssues: 1
  },
  {
    id: 3,
    name: "Downtown Lofts",
    address: "789 Business Blvd, Downtown",
    units: 18,
    occupied: 16,
    monthlyRevenue: 54000,
    status: "Active",
    maintenanceIssues: 3
  }
]

const leases = [
  {
    id: 1,
    tenant: "John Smith",
    property: "Sunset Apartments",
    unit: "A-102",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    monthlyRent: 2000,
    status: "Active",
    renewalStatus: "Pending"
  },
  {
    id: 2,
    tenant: "Sarah Johnson",
    property: "Oak Grove Complex",
    unit: "B-205",
    startDate: "2023-08-01",
    endDate: "2024-07-31",
    monthlyRent: 2200,
    status: "Expiring Soon",
    renewalStatus: "Negotiating"
  },
  {
    id: 3,
    tenant: "Mike Davis",
    property: "Downtown Lofts",
    unit: "C-301",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    monthlyRent: 3000,
    status: "Active",
    renewalStatus: "Not Due"
  }
]

const maintenanceRequests = [
  {
    id: 1,
    property: "Sunset Apartments",
    unit: "A-105",
    issue: "Leaking faucet in kitchen",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Tom Wilson",
    createdDate: "2024-07-15",
    estimatedCompletion: "2024-07-17"
  },
  {
    id: 2,
    property: "Oak Grove Complex",
    unit: "B-103",
    issue: "Air conditioning not working",
    priority: "High",
    status: "Pending",
    assignedTo: "Lisa Chen",
    createdDate: "2024-07-16",
    estimatedCompletion: "2024-07-18"
  },
  {
    id: 3,
    property: "Downtown Lofts",
    unit: "C-202",
    issue: "Broken window in living room",
    priority: "Low",
    status: "Completed",
    assignedTo: "Mark Rodriguez",
    createdDate: "2024-07-10",
    estimatedCompletion: "2024-07-14"
  }
]

export default function PropertyManagement() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Property Management</h1>
          <p className="text-slate-400">Manage properties, leases, and maintenance operations</p>
        </div>
        <PermissionGuard permission="entity.property.create">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </PermissionGuard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Properties</p>
                <p className="text-2xl font-bold text-white">127</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Tenants</p>
                <p className="text-2xl font-bold text-white">1,847</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Open Maintenance</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Expiring Leases</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/property-management/documents">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Document Management</h3>
                  <p className="text-sm text-slate-400">Manage leases, contracts & certificates</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">
                      12 Pending Review
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <PermissionGuard permission="entity.tenant.communicate">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Tenant Communication</h3>
                  <p className="text-sm text-slate-400">Messages, announcements & support</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                      5 New Messages
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard permission="entity.ai.read">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Insights</h3>
                  <p className="text-sm text-slate-400">Predictive analytics & recommendations</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                      3 New Insights
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>

      {/* Property Listings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Property Listings</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{property.name}</h3>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                        {property.status}
                      </Badge>
                      {property.maintenanceIssues > 0 && (
                        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                          {property.maintenanceIssues} Issues
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-400 flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4" />
                      {property.address}
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-400">Units</p>
                        <p className="text-white font-semibold">{property.occupied}/{property.units}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Occupancy</p>
                        <p className="text-white font-semibold">
                          {Math.round((property.occupied / property.units) * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Monthly Revenue</p>
                        <p className="text-white font-semibold">
                          ${property.monthlyRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lease Tracking */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Lease Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leases.map((lease) => (
                <div key={lease.id} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{lease.tenant}</h4>
                    <Badge
                      className={
                        lease.status === "Expiring Soon"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-green-500/10 text-green-400 border-green-500/20"
                      }
                    >
                      {lease.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">{lease.property} - Unit {lease.unit}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Ends: {lease.endDate}</span>
                    <span className="text-white font-medium">${lease.monthlyRent}/month</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-slate-500">Renewal: </span>
                    <span className={
                      lease.renewalStatus === "Pending"
                        ? "text-yellow-400"
                        : lease.renewalStatus === "Negotiating"
                        ? "text-orange-400"
                        : "text-slate-400"
                    }>
                      {lease.renewalStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Workflow */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {request.status === "Completed" ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : request.status === "In Progress" ? (
                        <Clock className="w-4 h-4 text-blue-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                      )}
                      <Badge
                        className={
                          request.priority === "High"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : request.priority === "Medium"
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-green-500/10 text-green-400 border-green-500/20"
                        }
                      >
                        {request.priority}
                      </Badge>
                    </div>
                    <Badge
                      className={
                        request.status === "Completed"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : request.status === "In Progress"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-white mb-1">{request.issue}</h4>
                  <p className="text-sm text-slate-400 mb-2">{request.property} - Unit {request.unit}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Assigned: {request.assignedTo}</span>
                    <span>Due: {request.estimatedCompletion}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
