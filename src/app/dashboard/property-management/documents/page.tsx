import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { PermissionGuard } from "../../../../components/PermissionGuard"
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical
} from "lucide-react"

const documents = [
  {
    id: 1,
    name: "Sunset Apartments - Master Lease Agreement",
    type: "Lease Agreement",
    property: "Sunset Apartments",
    uploadedBy: "Sarah Manager",
    uploadDate: "2024-07-10",
    size: "2.4 MB",
    status: "Approved",
    expiryDate: "2024-12-31",
    requiresSignature: false,
    tags: ["lease", "master", "legal"]
  },
  {
    id: 2,
    name: "Oak Grove - Fire Safety Certificate",
    type: "Certificate",
    property: "Oak Grove Complex",
    uploadedBy: "Mike Staff",
    uploadDate: "2024-07-15",
    size: "1.2 MB",
    status: "Pending Review",
    expiryDate: "2025-07-15",
    requiresSignature: true,
    tags: ["safety", "certificate", "compliance"]
  },
  {
    id: 3,
    name: "Downtown Lofts - Insurance Policy",
    type: "Insurance",
    property: "Downtown Lofts",
    uploadedBy: "John Admin",
    uploadDate: "2024-07-01",
    size: "3.1 MB",
    status: "Approved",
    expiryDate: "2025-01-01",
    requiresSignature: false,
    tags: ["insurance", "policy", "coverage"]
  },
  {
    id: 4,
    name: "Unit A-102 - Tenant Application",
    type: "Application",
    property: "Sunset Apartments",
    uploadedBy: "Lisa Chen",
    uploadDate: "2024-07-16",
    size: "0.8 MB",
    status: "Under Review",
    expiryDate: null,
    requiresSignature: true,
    tags: ["application", "tenant", "screening"]
  },
  {
    id: 5,
    name: "Maintenance Contract - HVAC Services",
    type: "Contract",
    property: "All Properties",
    uploadedBy: "Sarah Manager",
    uploadDate: "2024-06-30",
    size: "1.5 MB",
    status: "Expired",
    expiryDate: "2024-07-01",
    requiresSignature: false,
    tags: ["maintenance", "hvac", "contract"]
  }
]

const documentTypes = [
  { value: "all", label: "All Documents" },
  { value: "lease", label: "Lease Agreements" },
  { value: "certificate", label: "Certificates" },
  { value: "insurance", label: "Insurance" },
  { value: "application", label: "Applications" },
  { value: "contract", label: "Contracts" }
]

export default function DocumentsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Pending Review":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "Under Review":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Expired":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4" />
      case "Pending Review":
      case "Under Review":
        return <Clock className="w-4 h-4" />
      case "Expired":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Document Management</h1>
          <p className="text-slate-400">Manage property documents, contracts, and compliance certificates</p>
        </div>
        <PermissionGuard permission="entity.document.upload">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </PermissionGuard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Documents</p>
                <p className="text-2xl font-bold text-white">247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pending Review</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Expiring Soon</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Compliance Rate</p>
                <p className="text-2xl font-bold text-white">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Documents</CardTitle>
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
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">{doc.name}</h3>
                      <Badge className={getStatusColor(doc.status)}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1">{doc.status}</span>
                      </Badge>
                      {doc.requiresSignature && (
                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                          Signature Required
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Type</p>
                        <p className="text-white font-medium">{doc.type}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Property</p>
                        <p className="text-white font-medium">{doc.property}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Uploaded By</p>
                        <p className="text-white font-medium">{doc.uploadedBy}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Size</p>
                        <p className="text-white font-medium">{doc.size}</p>
                      </div>
                    </div>

                    {doc.expiryDate && (
                      <div className="mt-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">
                          Expires: {doc.expiryDate}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1">
                      {doc.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs border-slate-600 text-slate-400"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <PermissionGuard permission="entity.document.read">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </PermissionGuard>

                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </Button>

                    <PermissionGuard permission="entity.document.approve">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </PermissionGuard>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
