import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { ArrowLeft, Building2 } from "lucide-react"

export default function EULAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              ABO
            </div>
            <h1 className="text-xl font-semibold text-white">Active Back Office</h1>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <Building2 className="w-6 h-6 text-orange-400" />
              End-User License Agreement (EULA)
            </CardTitle>
            <p className="text-slate-400">Last updated: January 17, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-slate prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <h3 className="text-lg font-semibold text-white mb-3">1. Agreement to Terms</h3>
                <p>
                  This End-User License Agreement ("Agreement") is a legal agreement between you ("User" or "you")
                  and Team Glome ("Company," "we," or "us") for the use of Active Back Office ("Software" or "Service"),
                  including computer software and associated documentation.
                </p>
                <p>
                  By installing, accessing, or using the Software, you agree to be bound by the terms of this Agreement.
                  If you do not agree to the terms of this Agreement, do not install or use the Software.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">2. License Grant</h3>
                <p>
                  Subject to the terms of this Agreement, Company grants you a limited, non-exclusive, non-transferable,
                  revocable license to use the Software for your internal business purposes in accordance with the
                  Software's documentation and your selected subscription plan.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may access and use the Software during your active subscription period</li>
                  <li>You may integrate the Software with your existing business systems and QuickBooks</li>
                  <li>You may configure the Software for your organization's specific needs</li>
                  <li>You may use AI-powered features for compliance monitoring and business analytics</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">3. Restrictions</h3>
                <p>You may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Copy, modify, or create derivative works of the Software</li>
                  <li>Reverse engineer, decompile, or disassemble the Software</li>
                  <li>Rent, lease, lend, sell, redistribute, or sublicense the Software</li>
                  <li>Remove or alter any proprietary notices or labels on the Software</li>
                  <li>Use the Software for any illegal or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to any systems or networks</li>
                  <li>Use the Software to compete with Company's business</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">4. Data and Privacy</h3>
                <p>
                  Your use of the Software is also governed by our Privacy Policy. The Software may collect,
                  process, and store data related to your use of the service, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Property management data and financial information</li>
                  <li>User account information and access logs</li>
                  <li>Integration data from connected services (QuickBooks, etc.)</li>
                  <li>Compliance monitoring data and AI-generated insights</li>
                </ul>
                <p>
                  You retain ownership of your data. Company will process your data in accordance with
                  applicable privacy laws and our Privacy Policy.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">5. Intellectual Property</h3>
                <p>
                  The Software and all related intellectual property rights are and remain the exclusive
                  property of Company and its licensors. This Agreement does not grant you any rights to
                  Company's trademarks, service marks, or logos.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">6. Subscription and Payment</h3>
                <p>
                  Use of the Software requires an active subscription. Subscription fees are due in advance
                  and are non-refundable except as expressly stated in our refund policy.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscription plans: Starter ($85/month), Professional ($180/month), Enterprise ($250/month)</li>
                  <li>Automatic renewal unless cancelled 30 days before renewal date</li>
                  <li>Price changes effective for subsequent renewal periods</li>
                  <li>Immediate termination for non-payment after 15-day grace period</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">7. Warranty Disclaimer</h3>
                <p className="font-medium uppercase">
                  THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. COMPANY DISCLAIMS ALL
                  WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                  PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">8. Limitation of Liability</h3>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, COMPANY SHALL NOT BE LIABLE FOR ANY INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS,
                  OR BUSINESS INTERRUPTION.
                </p>
                <p>
                  COMPANY'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SOFTWARE IN THE
                  TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">9. Termination</h3>
                <p>
                  This Agreement is effective until terminated. Your rights under this Agreement will terminate
                  automatically if you fail to comply with any terms. Company may terminate this Agreement at
                  any time with 30 days' notice.
                </p>
                <p>
                  Upon termination, you must cease all use of the Software and delete all copies in your possession.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">10. Governing Law</h3>
                <p>
                  This Agreement shall be governed by and construed in accordance with the laws of the State of
                  New York, without regard to conflict of law principles. Any disputes shall be resolved in the
                  courts of New York County, New York.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">11. Contact Information</h3>
                <p>
                  If you have questions about this Agreement, please contact us at:
                </p>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <p><strong>Team Glome</strong></p>
                  <p>Email: legal@activebackoffice.com</p>
                  <p>Address: [Your Business Address]</p>
                  <p>Phone: [Your Business Phone]</p>
                </div>
              </section>

              <section className="border-t border-slate-600 pt-6">
                <p className="text-sm text-slate-400">
                  By using Active Back Office, you acknowledge that you have read this Agreement,
                  understand it, and agree to be bound by its terms and conditions.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
