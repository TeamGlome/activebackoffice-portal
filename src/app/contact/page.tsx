"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Building2,
  Users,
  Headphones
} from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                ABO
              </div>
              <h1 className="text-xl font-semibold text-white">Active Back Office</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              Back to Home
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
              <MessageSquare className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-medium">Get in Touch</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Contact
              <span className="text-orange-400"> Our Team</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your property management operations? Our experts are here to help you
              get started with Active Back Office and answer any questions you may have.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Send us a Message</CardTitle>
                <p className="text-slate-400">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      How can we help?
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="">Select an option</option>
                      <option value="demo">Schedule a Demo</option>
                      <option value="pricing">Pricing Information</option>
                      <option value="integration">Integration Questions</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Tell us more about your needs..."
                    />
                  </div>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Email</h3>
                      <p className="text-slate-400">contact@activebackoffice.com</p>
                      <p className="text-slate-400">support@activebackoffice.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Phone</h3>
                      <p className="text-slate-400">+1 (555) 123-4567</p>
                      <p className="text-slate-400">+1 (555) 123-4568 (Support)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Office</h3>
                      <p className="text-slate-400">123 Business Avenue</p>
                      <p className="text-slate-400">New York, NY 10001</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Business Hours</h3>
                      <p className="text-slate-400">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p className="text-slate-400">Saturday: 10:00 AM - 4:00 PM EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Options */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Support Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <Headphones className="w-5 h-5 text-orange-400" />
                    <div>
                      <h3 className="text-white font-medium">Live Chat</h3>
                      <p className="text-sm text-slate-400">Available 24/7 for existing customers</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-white font-medium">Enterprise Support</h3>
                      <p className="text-sm text-slate-400">Dedicated account management</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <Users className="w-5 h-5 text-green-400" />
                    <div>
                      <h3 className="text-white font-medium">Training & Onboarding</h3>
                      <p className="text-sm text-slate-400">Comprehensive team training</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Schedule a Demo
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:text-white">
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-2">How quickly can I get started?</h3>
                  <p className="text-slate-400">
                    Most customers are up and running within 5 minutes of signing up. Our setup wizard
                    guides you through the initial configuration process.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-2">Do you offer training?</h3>
                  <p className="text-slate-400">
                    Yes! We provide comprehensive training sessions for your team, including onboarding
                    calls, video tutorials, and ongoing support.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-2">What integrations do you support?</h3>
                  <p className="text-slate-400">
                    We support 14+ integrations including QuickBooks, Plaid Banking, Google Drive,
                    and many more. View our full integration list on the features page.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-2">Is there a free trial?</h3>
                  <p className="text-slate-400">
                    Yes! We offer a 14-day free trial with full access to all features.
                    No credit card required to get started.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
