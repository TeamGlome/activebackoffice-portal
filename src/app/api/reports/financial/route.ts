import { NextRequest, NextResponse } from 'next/server'
import { FinancialReportData } from '../../../../lib/types'

// Mock financial data - replace with actual database queries in production
const mockFinancialData = {
  'ent_1': {
    accounts: [
      { Id: '1', Name: 'Checking Account', AccountType: 'Bank', CurrentBalance: 125000 },
      { Id: '2', Name: 'Accounts Receivable', AccountType: 'Accounts Receivable', CurrentBalance: 45000 },
      { Id: '3', Name: 'Rental Income', AccountType: 'Income', CurrentBalance: -85000 },
      { Id: '4', Name: 'Property Management Fees', AccountType: 'Income', CurrentBalance: -25000 },
      { Id: '5', Name: 'Maintenance Expenses', AccountType: 'Expense', CurrentBalance: 15000 },
      { Id: '6', Name: 'Insurance', AccountType: 'Expense', CurrentBalance: 8000 },
      { Id: '7', Name: 'Property Taxes', AccountType: 'Expense', CurrentBalance: 12000 }
    ],
    transactions: {
      invoice: [
        { Id: '1', TotalAmt: 5000, TxnDate: '2024-01-15', Line: [{ Amount: 5000, DetailType: 'SalesItemLineDetail' }] },
        { Id: '2', TotalAmt: 3500, TxnDate: '2024-01-10', Line: [{ Amount: 3500, DetailType: 'SalesItemLineDetail' }] },
        { Id: '3', TotalAmt: 4200, TxnDate: '2024-01-05', Line: [{ Amount: 4200, DetailType: 'SalesItemLineDetail' }] }
      ],
      expense: [
        { Id: '1', TotalAmt: 1200, TxnDate: '2024-01-14', Line: [{ Amount: 1200, DetailType: 'AccountBasedExpenseLineDetail' }] },
        { Id: '2', TotalAmt: 800, TxnDate: '2024-01-12', Line: [{ Amount: 800, DetailType: 'AccountBasedExpenseLineDetail' }] },
        { Id: '3', TotalAmt: 2500, TxnDate: '2024-01-08', Line: [{ Amount: 2500, DetailType: 'AccountBasedExpenseLineDetail' }] }
      ]
    },
    last_sync: '2024-01-16T12:00:00Z'
  },
  'ent_2': {
    accounts: [
      { Id: '1', Name: 'Business Checking', AccountType: 'Bank', CurrentBalance: 89000 },
      { Id: '2', Name: 'Accounts Receivable', AccountType: 'Accounts Receivable', CurrentBalance: 28000 },
      { Id: '3', Name: 'Rental Income', AccountType: 'Income', CurrentBalance: -65000 }
    ],
    transactions: {
      invoice: [
        { Id: '1', TotalAmt: 3200, TxnDate: '2024-01-16', Line: [{ Amount: 3200, DetailType: 'SalesItemLineDetail' }] }
      ],
      expense: [
        { Id: '1', TotalAmt: 950, TxnDate: '2024-01-15', Line: [{ Amount: 950, DetailType: 'AccountBasedExpenseLineDetail' }] }
      ]
    },
    last_sync: '2024-01-16T10:00:00Z'
  }
}

interface FinancialAccount {
  Id: string
  Name: string
  AccountType: string
  CurrentBalance: number
}

interface FinancialTransaction {
  Id: string
  TotalAmt: number
  TxnDate: string
  Line: TransactionLine[]
}

interface TransactionLine {
  Amount: number
  DetailType: string
}

interface EntityFinancialData {
  accounts: FinancialAccount[]
  transactions: {
    invoice: FinancialTransaction[]
    expense: FinancialTransaction[]
  }
  last_sync: string
}

function calculateFinancialMetrics(data: EntityFinancialData) {
  const accounts = data.accounts || []
  const transactions = data.transactions || {}

  // Calculate account balances by type
  const accountsByType = accounts.reduce((acc: Record<string, FinancialAccount[]>, account: FinancialAccount) => {
    const type = account.AccountType
    if (!acc[type]) acc[type] = []
    acc[type].push(account)
    return acc
  }, {})

  // Calculate total assets, liabilities, income, expenses
  const bankAccounts = accountsByType['Bank'] || []
  const arAccounts = accountsByType['Accounts Receivable'] || []
  const incomeAccounts = accountsByType['Income'] || []
  const expenseAccounts = accountsByType['Expense'] || []

  const totalCash = bankAccounts.reduce((sum: number, acc: FinancialAccount) => sum + (acc.CurrentBalance || 0), 0)
  const totalAR = arAccounts.reduce((sum: number, acc: FinancialAccount) => sum + (acc.CurrentBalance || 0), 0)
  const totalIncome = Math.abs(incomeAccounts.reduce((sum: number, acc: FinancialAccount) => sum + (acc.CurrentBalance || 0), 0))
  const totalExpenses = expenseAccounts.reduce((sum: number, acc: FinancialAccount) => sum + (acc.CurrentBalance || 0), 0)

  // Calculate monthly income and expenses from transactions
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const recentInvoices = (transactions.invoice || []).filter((inv: FinancialTransaction) =>
    new Date(inv.TxnDate) >= thirtyDaysAgo
  )
  const recentExpenses = (transactions.expense || []).filter((exp: FinancialTransaction) =>
    new Date(exp.TxnDate) >= thirtyDaysAgo
  )

  const monthlyIncome = recentInvoices.reduce((sum: number, inv: FinancialTransaction) => sum + (inv.TotalAmt || 0), 0)
  const monthlyExpenses = recentExpenses.reduce((sum: number, exp: FinancialTransaction) => sum + (exp.TotalAmt || 0), 0)
  const monthlyProfit = monthlyIncome - monthlyExpenses

  return {
    balanceSheet: {
      totalCash,
      totalAR,
      totalAssets: totalCash + totalAR,
      netWorth: totalCash + totalAR - totalExpenses
    },
    profitLoss: {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      monthlyProfit,
      profitMargin: monthlyIncome > 0 ? ((monthlyProfit / monthlyIncome) * 100) : 0
    },
    cashFlow: {
      operatingCashFlow: monthlyIncome - monthlyExpenses,
      endingCash: totalCash
    },
    accountBreakdown: {
      byType: accountsByType,
      bankAccounts: bankAccounts.map((acc: FinancialAccount) => ({
        name: acc.Name,
        balance: acc.CurrentBalance
      })),
      incomeAccounts: incomeAccounts.map((acc: FinancialAccount) => ({
        name: acc.Name,
        amount: Math.abs(acc.CurrentBalance)
      })),
      expenseAccounts: expenseAccounts.map((acc: FinancialAccount) => ({
        name: acc.Name,
        amount: acc.CurrentBalance
      }))
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entity_id = searchParams.get('entity_id')
    const report_type = searchParams.get('report_type') || 'summary'
    const period = searchParams.get('period') || '30d'

    if (!entity_id) {
      return NextResponse.json(
        { error: 'Entity ID is required', success: false },
        { status: 400 }
      )
    }

    // Get financial data for entity (in production, fetch from database)
    const entityData = mockFinancialData[entity_id as keyof typeof mockFinancialData] as EntityFinancialData
    if (!entityData) {
      return NextResponse.json(
        { error: 'Financial data not found for this entity', success: false },
        { status: 404 }
      )
    }

    const metrics = calculateFinancialMetrics(entityData)

    const reportData: FinancialReportData = {
      entity_id,
      report_type,
      period,
      generated_at: new Date().toISOString(),
      last_sync: entityData.last_sync,
      data: {}
    }

    switch (report_type) {
      case 'balance_sheet':
        reportData.data = {
          assets: {
            current_assets: {
              cash: metrics.balanceSheet.totalCash,
              accounts_receivable: metrics.balanceSheet.totalAR,
              total: metrics.balanceSheet.totalAssets
            },
            total_assets: metrics.balanceSheet.totalAssets
          },
          liabilities: {
            current_liabilities: 0,
            total_liabilities: 0
          },
          equity: {
            retained_earnings: metrics.balanceSheet.netWorth,
            total_equity: metrics.balanceSheet.netWorth
          },
          accounts: metrics.accountBreakdown.byType
        }
        break

      case 'profit_loss':
        reportData.data = {
          income: {
            rental_income: metrics.profitLoss.totalIncome,
            total_income: metrics.profitLoss.totalIncome
          },
          expenses: {
            total_expenses: metrics.profitLoss.totalExpenses,
            breakdown: metrics.accountBreakdown.expenseAccounts
          },
          net_income: metrics.profitLoss.netIncome,
          monthly_summary: {
            income: metrics.profitLoss.monthlyIncome,
            expenses: metrics.profitLoss.monthlyExpenses,
            profit: metrics.profitLoss.monthlyProfit,
            margin: metrics.profitLoss.profitMargin
          }
        }
        break

      case 'cash_flow':
        reportData.data = {
          operating_activities: {
            net_income: metrics.profitLoss.monthlyProfit,
            operating_cash_flow: metrics.cashFlow.operatingCashFlow
          },
          investing_activities: {
            total: 0
          },
          financing_activities: {
            total: 0
          },
          net_change_in_cash: metrics.cashFlow.operatingCashFlow,
          ending_cash: metrics.cashFlow.endingCash
        }
        break

      case 'summary':
      default:
        reportData.data = {
          overview: {
            total_assets: metrics.balanceSheet.totalAssets,
            total_income: metrics.profitLoss.totalIncome,
            total_expenses: metrics.profitLoss.totalExpenses,
            net_income: metrics.profitLoss.netIncome,
            cash_position: metrics.balanceSheet.totalCash
          },
          monthly_performance: {
            income: metrics.profitLoss.monthlyIncome,
            expenses: metrics.profitLoss.monthlyExpenses,
            profit: metrics.profitLoss.monthlyProfit,
            profit_margin: metrics.profitLoss.profitMargin
          },
          key_accounts: {
            bank_accounts: metrics.accountBreakdown.bankAccounts,
            top_income: metrics.accountBreakdown.incomeAccounts.slice(0, 5),
            top_expenses: metrics.accountBreakdown.expenseAccounts.slice(0, 5)
          }
        }
        break
    }

    return NextResponse.json({
      ...reportData,
      success: true
    })
  } catch (error) {
    console.error('Error generating financial report:', error)
    return NextResponse.json(
      { error: 'Failed to generate financial report', success: false },
      { status: 500 }
    )
  }
}
