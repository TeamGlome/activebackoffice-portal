import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { BarChart3, FileText, Download, Calendar } from "lucide-react"

export default function ReportsAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
        <p className="text-slate-400">Business intelligence and comprehensive reporting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Reports Generated</p>
                <p className="text-2xl font-bold text-white">127</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Data Points</p>
                <p className="text-2xl font-bold text-white">2.4M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Downloads</p>
                <p className="text-2xl font-bold text-white">456</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-slate-400">Advanced reporting dashboard coming soon...</p>
            <p className="text-slate-500 text-sm mt-2">Interactive charts, custom reports, and data export capabilities</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
