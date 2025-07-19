import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe } from "lucide-react"

export default function PrivacyPolicyPage() {
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
              <Shield className="w-6 h-6 text-green-400" />
              Privacy Policy
            </CardTitle>
            <p className="text-slate-400">Last updated: January 17, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-slate prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <p className="text-lg">
                  Team Glome ("we," "us," or "our") operates Active Back Office (the "Service").
                  This page informs you of our policies regarding the collection, use, and disclosure
                  of personal data when you use our Service and the choices you have associated with that data.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  Information We Collect
                </h3>

                <h4 className="font-semibold text-white mt-4 mb-2">Personal Information</h4>
                <p>We collect information you provide directly to us, such as:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (name, email address, phone number, company details)</li>
                  <li>Profile information and user preferences</li>
                  <li>Billing and payment information (processed securely through third-party providers)</li>
                  <li>Communications with our support team</li>
                </ul>

                <h4 className="font-semibold text-white mt-4 mb-2">Business Data</h4>
                <p>Through your use of our Service, we may collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Property management data (property details, tenant information, lease agreements)</li>
                  <li>Financial data from integrated services (QuickBooks, banking connections)</li>
                  <li>Compliance monitoring data and inspection records</li>
                  <li>User activity logs and system usage analytics</li>
                  <li>Integration data from connected third-party services</li>
                </ul>

                <h4 className="font-semibold text-white mt-4 mb-2">Technical Information</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (browser type, operating system, device identifiers)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Log data (IP addresses, server logs, error reports)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  How We Use Your Information
                </h3>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Process transactions and manage your account</li>
                  <li>Enable integrations with QuickBooks and other third-party services</li>
                  <li>Generate AI-powered insights and compliance monitoring</li>
                  <li>Send important notifications about your account and service updates</li>
                  <li>Provide customer support and respond to your requests</li>
                  <li>Detect, prevent, and address technical issues and security threats</li>
                  <li>Comply with legal obligations and protect our rights</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  Information Sharing and Disclosure
                </h3>
                <p>We may share your information in the following circumstances:</p>

                <h4 className="font-semibold text-white mt-4 mb-2">With Your Consent</h4>
                <p>We may share your information when you explicitly consent to such sharing.</p>

                <h4 className="font-semibold text-white mt-4 mb-2">Service Providers</h4>
                <p>We work with third-party service providers who assist us in operating our Service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cloud hosting providers (Vercel, AWS)</li>
                  <li>Payment processors (Stripe, PayPal)</li>
                  <li>Analytics providers (usage analytics, error monitoring)</li>
                  <li>Customer support tools</li>
                  <li>Email service providers</li>
                </ul>

                <h4 className="font-semibold text-white mt-4 mb-2">Integrated Services</h4>
                <p>When you connect third-party services to your account:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>QuickBooks: Financial data synchronization</li>
                  <li>Banking providers: Transaction data via secure API connections</li>
                  <li>Google Drive/OneDrive: File storage and document management</li>
                </ul>

                <h4 className="font-semibold text-white mt-4 mb-2">Legal Requirements</h4>
                <p>We may disclose your information if required by law or in response to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Valid legal process (subpoenas, court orders)</li>
                  <li>Government investigations</li>
                  <li>Protection of our rights, property, or safety</li>
                  <li>Emergency situations involving personal safety</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-400" />
                  Data Security
                </h3>
                <p>We implement appropriate technical and organizational measures to protect your data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption in transit and at rest using industry-standard protocols</li>
                  <li>Secure cloud infrastructure with regular security audits</li>
                  <li>Access controls and multi-factor authentication</li>
                  <li>Regular security monitoring and incident response procedures</li>
                  <li>Employee training on data protection and privacy</li>
                  <li>Compliance with SOC 2 Type II and other security frameworks</li>
                </ul>
                <p className="font-medium text-yellow-300 mt-4">
                  While we strive to protect your data, no method of transmission over the internet
                  or electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Data Retention</h3>
                <p>We retain your information for as long as necessary to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide you with our Service during your active subscription</li>
                  <li>Comply with legal obligations and resolve disputes</li>
                  <li>Maintain business records for tax and accounting purposes</li>
                </ul>
                <p>
                  When you terminate your account, we will delete or anonymize your personal information
                  within 30 days, except where retention is required by law.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Your Rights and Choices</h3>
                <p>Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at privacy@activebackoffice.com.
                  We will respond to your request within 30 days.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Cookies and Tracking</h3>
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Authenticate your identity and maintain your session</li>
                  <li>Analyze usage patterns and improve our Service</li>
                  <li>Provide personalized content and recommendations</li>
                </ul>
                <p>
                  You can control cookie settings through your browser. Disabling cookies may affect
                  the functionality of our Service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  International Data Transfers
                </h3>
                <p>
                  Your information may be transferred to and processed in countries other than your own.
                  We ensure appropriate safeguards are in place, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard contractual clauses approved by regulatory authorities</li>
                  <li>Adequacy decisions by relevant data protection authorities</li>
                  <li>Certification schemes and codes of conduct</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Children's Privacy</h3>
                <p>
                  Our Service is not intended for children under 16 years of age. We do not knowingly
                  collect personal information from children under 16. If you become aware that a child
                  has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Changes to This Policy</h3>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes
                  by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  For material changes, we will provide additional notice via email or through our Service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <p><strong>Privacy Officer</strong></p>
                  <p>Team Glome</p>
                  <p>Email: privacy@activebackoffice.com</p>
                  <p>Address: [Your Business Address]</p>
                  <p>Phone: [Your Business Phone]</p>
                </div>
              </section>

              <section className="border-t border-slate-600 pt-6">
                <p className="text-sm text-slate-400">
                  This Privacy Policy is designed to help you understand how we collect, use, and protect
                  your information. Your privacy is important to us, and we are committed to protecting
                  your personal data.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
