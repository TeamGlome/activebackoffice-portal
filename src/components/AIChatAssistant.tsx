"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Send,
  Minimize2,
  X,
  Brain,
  Sparkles,
  User,
  Bot,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Scale,
  Building2,
  Lightbulb
} from 'lucide-react'
import { Button } from './ui/button'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  insights?: {
    type: 'compliance' | 'financial' | 'property' | 'ai'
    title: string
    value: string
    trend?: 'up' | 'down' | 'stable'
  }[]
}

// Mock AI responses - replace with real AI integration
const aiResponses: Record<string, ChatMessage> = {
  "compliance": {
    id: '2',
    type: 'assistant',
    content: 'I can help you with NYC compliance! Your current compliance score is 94.2%. You have 2 upcoming deadlines: XRF testing at 456 Broadway (due July 25) and facade inspection at 789 Fifth Avenue (due Aug 10).',
    timestamp: new Date(),
    suggestions: ['Schedule XRF testing', 'Review facade requirements', 'Check Local Law 97 status'],
    insights: [
      { type: 'compliance', title: 'Compliance Score', value: '94.2%', trend: 'up' },
      { type: 'compliance', title: 'Violations Prevented', value: '3 this month', trend: 'up' }
    ]
  },
  "revenue": {
    id: '3',
    type: 'assistant',
    content: 'Your revenue trends look strong! Monthly revenue is $2.45M with 12.5% growth. AI has identified $245K in cost savings opportunities through compliance optimization and predictive maintenance.',
    timestamp: new Date(),
    suggestions: ['View revenue breakdown', 'See cost optimization', 'AI savings report'],
    insights: [
      { type: 'financial', title: 'Monthly Revenue', value: '$2.45M', trend: 'up' },
      { type: 'ai', title: 'AI Cost Savings', value: '$245K', trend: 'up' }
    ]
  },
  "properties": {
    id: '4',
    type: 'assistant',
    content: 'You manage 24 properties across NYC. Portfolio performance: 3 properties need attention (456 Broadway has compliance issues), 21 are performing well. AI predicts optimal maintenance scheduling could save 15% on costs.',
    timestamp: new Date(),
    suggestions: ['View property details', 'Schedule maintenance', 'AI optimization'],
    insights: [
      { type: 'property', title: 'Total Properties', value: '24', trend: 'stable' },
      { type: 'property', title: 'High Performers', value: '21', trend: 'up' }
    ]
  }
}

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m your AI assistant for Active Back Office. I can help you with compliance questions, analyze your property data, or provide insights about your portfolio. What would you like to know?',
      timestamp: new Date(),
      suggestions: ['Compliance status', 'Revenue analysis', 'Property insights', 'AI recommendations']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const query = inputValue.toLowerCase()
      let response: ChatMessage

      if (query.includes('compliance') || query.includes('violation') || query.includes('law')) {
        response = aiResponses.compliance
      } else if (query.includes('revenue') || query.includes('money') || query.includes('cost') || query.includes('financial')) {
        response = aiResponses.revenue
      } else if (query.includes('property') || query.includes('building') || query.includes('portfolio')) {
        response = aiResponses.properties
      } else {
        response = {
          id: Date.now().toString(),
          type: 'assistant',
          content: `I understand you're asking about "${inputValue}". I can provide insights on compliance management, property analytics, financial performance, and AI-powered recommendations. Could you be more specific about what you'd like to know?`,
          timestamp: new Date(),
          suggestions: ['Compliance overview', 'Financial analysis', 'Property performance', 'AI insights']
        }
      }

      response.id = Date.now().toString()
      response.timestamp = new Date()
      setMessages(prev => [...prev, response])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'compliance':
        return <Scale className="w-4 h-4" />
      case 'financial':
        return <DollarSign className="w-4 h-4" />
      case 'property':
        return <Building2 className="w-4 h-4" />
      case 'ai':
        return <Brain className="w-4 h-4" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-400" />
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />
      default:
        return <CheckCircle className="w-3 h-3 text-blue-400" />
    }
  }

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Brain className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-white" />
        </div>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-6 right-6 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      } transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">AI Assistant</h3>
            {!isMinimized && (
              <p className="text-xs text-slate-400">Powered by Active Back Office AI</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-6 h-6 text-slate-400 hover:text-white"
          >
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="w-6 h-6 text-slate-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`max-w-xs ${message.type === 'user' ? 'order-last' : ''}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {/* Insights */}
                  {message.insights && (
                    <div className="mt-2 space-y-2">
                      {message.insights.map((insight, index) => (
                        <div key={index} className="p-2 bg-slate-700/50 rounded-lg border border-slate-600">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getInsightIcon(insight.type)}
                              <span className="text-xs text-slate-400">{insight.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-white">{insight.value}</span>
                              {getTrendIcon(insight.trend)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-slate-300 rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about compliance, properties, or analytics..."
                className="flex-1 bg-slate-700 text-white placeholder-slate-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
