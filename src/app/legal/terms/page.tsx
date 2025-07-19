import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { ArrowLeft, FileText, Scale, CreditCard, UserCheck, AlertTriangle, Shield } from "lucide-react"

export default function TermsOfServicePage() {
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
              <FileText className="w-6 h-6 text-blue-400" />
              Terms of Service
            </CardTitle>
            <p className="text-slate-400">Last updated: January 17, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-slate prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <p className="text-lg">
                  Welcome to Active Back Office. These Terms of Service ("Terms") govern your use of
                  our AI-powered property management platform operated by Team Glome ("Company," "we," or "us").
                  By accessing or using our Service, you agree to be bound by these Terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-400" />
                  Acceptance of Terms
                </h3>
                <p>
                  By creating an account, accessing our website, or using our Service in any way, you acknowledge
                  that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                  If you do not agree to these Terms, you may not use our Service.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and Company. You must be at least
                  18 years old and have the legal authority to enter into these Terms on behalf of yourself or
                  your organization.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Description of Service</h3>
                <p>
                  Active Back Office is a comprehensive property management platform that provides:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>AI-powered compliance monitoring with 97% violation prevention accuracy</li>
                  <li>QuickBooks integration for financial management and reporting</li>
                  <li>Property portfolio management and analytics</li>
                  <li>Automated compliance tracking for NYC Local Laws and regulations</li>
                  <li>Integration with third-party services (Fiix, banking, cloud storage)</li>
                  <li>Advanced reporting and business intelligence features</li>
                  <li>Multi-user access with role-based permissions</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">User Accounts and Registration</h3>
                <p>
                  To use our Service, you must create an account by providing accurate and complete information.
                  You are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintaining the security of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring all account information remains current and accurate</li>
                </ul>
                <p>
                  You may not share your account credentials, create multiple accounts, or use automated
                  means to create accounts. Each user must have their own individual account.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  Subscription Plans and Billing
                </h3>

                <h4 className="font-semibold text-white mt-4 mb-2">Available Plans</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h5 className="font-semibold text-white">Starter</h5>
                    <p className="text-2xl font-bold text-green-400">$85/month</p>
                    <p className="text-sm text-slate-400">Up to 5 users, basic features</p>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h5 className="font-semibold text-white">Professional</h5>
                    <p className="text-2xl font-bold text-blue-400">$180/month</p>
                    <p className="text-sm text-slate-400">Up to 15 users, advanced features</p>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h5 className="font-semibold text-white">Enterprise</h5>
                    <p className="text-2xl font-bold text-orange-400">$250/month</p>
                    <p className="text-sm text-slate-400">Unlimited users, full features</p>
                  </div>
                </div>

                <h4 className="font-semibold text-white mt-4 mb-2">Billing Terms</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscription fees are billed monthly in advance</li>
                  <li>All fees are non-refundable except as expressly stated</li>
                  <li>Automatic renewal unless cancelled 30 days before renewal date</li>
                  <li>Price changes will be communicated 30 days in advance</li>
                  <li>Late payment may result in service suspension after 15-day grace period</li>
                  <li>You're responsible for all taxes related to your subscription</li>
                </ul>

                <h4 className="font-semibold text-white mt-4 mb-2">Free Trial</h4>
                <p>
                  We may offer a 14-day free trial for new customers. During the trial period, you have
                  access to selected features. The trial will automatically convert to a paid subscription
                  unless cancelled before the trial ends.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Acceptable Use Policy</h3>
                <p>You agree to use our Service only for lawful purposes and in accordance with these Terms. You may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights of others</li>
                  <li>Upload or transmit malicious code, viruses, or harmful content</li>
                  <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                  <li>Use the Service to send spam or unsolicited communications</li>
                  <li>Reverse engineer, decompile, or attempt to extract source code</li>
                  <li>Use the Service for any competitive or commercial purpose outside your organization</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Data Ownership and Privacy</h3>
                <p>
                  <strong>Your Data:</strong> You retain ownership of all data you input into our Service,
                  including property information, financial data, and business records.
                </p>
                <p>
                  <strong>Our Service:</strong> We own all rights to the Service software, algorithms,
                  AI models, and platform infrastructure.
                </p>
                <p>
                  <strong>Data Processing:</strong> We process your data to provide the Service, generate
                  insights, and improve our platform. See our Privacy Policy for detailed information.
                </p>
                <p>
                  <strong>Data Backup:</strong> While we maintain backups, you're responsible for maintaining
                  your own backup copies of critical data.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Third-Party Integrations</h3>
                <p>
                  Our Service integrates with third-party platforms including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>QuickBooks Online for financial data synchronization</li>
                  <li>Banking institutions for transaction data</li>
                  <li>Cloud storage providers (Google Drive, OneDrive, Dropbox)</li>
                  <li>Maintenance management systems (Fiix Software)</li>
                  <li>Compliance monitoring services</li>
                </ul>
                <p>
                  Your use of these integrations is subject to the respective third-party terms and policies.
                  We are not responsible for the availability, functionality, or data practices of third-party services.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  AI and Compliance Features
                </h3>
                <p>
                  Our AI-powered compliance monitoring provides insights and predictions based on data analysis.
                  Important limitations:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>AI predictions are estimates and should not be the sole basis for business decisions</li>
                  <li>Compliance monitoring is a tool to assist, not replace, professional legal advice</li>
                  <li>You remain fully responsible for ensuring actual compliance with all applicable laws</li>
                  <li>We do not guarantee that use of our Service will prevent violations or legal issues</li>
                  <li>AI accuracy rates are based on historical data and may not predict future outcomes</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Service Availability</h3>
                <p>
                  We strive to maintain high service availability but cannot guarantee uninterrupted access.
                  We may:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Perform scheduled maintenance with advance notice</li>
                  <li>Temporarily suspend service for emergency maintenance</li>
                  <li>Modify or discontinue features with reasonable notice</li>
                  <li>Implement usage limits to ensure fair access for all users</li>
                </ul>
                <p>
                  We target 99.9% uptime but are not liable for temporary service interruptions or data loss
                  due to factors beyond our reasonable control.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Termination</h3>
                <p>
                  <strong>By You:</strong> You may cancel your subscription at any time through your account settings
                  or by contacting us. Cancellation takes effect at the end of your current billing period.
                </p>
                <p>
                  <strong>By Us:</strong> We may suspend or terminate your account if you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate these Terms or our Acceptable Use Policy</li>
                  <li>Fail to pay subscription fees after the grace period</li>
                  <li>Engage in fraudulent or illegal activities</li>
                  <li>Pose a security risk to our systems or other users</li>
                </ul>
                <p>
                  Upon termination, you'll lose access to the Service and your data will be deleted after 30 days,
                  except where retention is required by law.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Disclaimers and Limitation of Liability
                </h3>

                <h4 className="font-semibold text-white mt-4 mb-2">Service Disclaimers</h4>
                <p className="font-medium uppercase text-yellow-300">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                  EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                  PURPOSE, AND NON-INFRINGEMENT.
                </p>

                <h4 className="font-semibold text-white mt-4 mb-2">Limitation of Liability</h4>
                <p className="font-medium uppercase text-red-300">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, COMPANY SHALL NOT BE LIABLE FOR ANY INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS,
                  BUSINESS INTERRUPTION, OR COMPLIANCE VIOLATIONS.
                </p>
                <p>
                  COMPANY'S TOTAL LIABILITY FOR ANY CLAIMS RELATED TO THE SERVICE SHALL NOT EXCEED THE
                  AMOUNT PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Indemnification</h3>
                <p>
                  You agree to indemnify and hold harmless Company, its officers, directors, employees, and agents
                  from any claims, damages, or expenses arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of the Service in violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Any data or content you submit to the Service</li>
                  <li>Your negligent or wrongful conduct</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-400" />
                  Governing Law and Disputes
                </h3>
                <p>
                  These Terms are governed by the laws of the State of New York, without regard to conflict
                  of law principles. Any disputes will be resolved through:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Good faith negotiations between the parties</li>
                  <li>Binding arbitration under American Arbitration Association rules</li>
                  <li>If arbitration is unavailable, courts in New York County, New York</li>
                </ol>
                <p>
                  You waive any right to participate in class action lawsuits or class-wide arbitration.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Changes to Terms</h3>
                <p>
                  We may update these Terms periodically to reflect changes in our Service, legal requirements,
                  or business practices. We will:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Post updated Terms on our website with a new "Last updated" date</li>
                  <li>Send email notifications for material changes</li>
                  <li>Provide 30 days' notice for significant changes</li>
                </ul>
                <p>
                  Continued use of the Service after changes become effective constitutes acceptance of the
                  updated Terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                <p>
                  For questions about these Terms or our Service, please contact us:
                </p>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <p><strong>Legal Department</strong></p>
                  <p>Team Glome</p>
                  <p>Email: legal@activebackoffice.com</p>
                  <p>Support: support@activebackoffice.com</p>
                  <p>Address: [Your Business Address]</p>
                  <p>Phone: [Your Business Phone]</p>
                </div>
              </section>

              <section className="border-t border-slate-600 pt-6">
                <p className="text-sm text-slate-400">
                  These Terms of Service are effective as of the date last updated above. By using Active Back Office,
                  you acknowledge that you have read, understood, and agree to be bound by these Terms.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
