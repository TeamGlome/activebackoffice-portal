"use client"

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface RevenueChartProps {
  data?: {
    labels: string[]
    revenue: number[]
    expenses: number[]
  }
  height?: number
}

export function RevenueChart({ data, height = 300 }: RevenueChartProps) {
  // Mock data if none provided
  const defaultData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [2200000, 2350000, 2280000, 2450000, 2380000, 2520000, 2450000, 2580000, 2420000, 2650000, 2520000, 2700000],
    expenses: [1800000, 1850000, 1820000, 1900000, 1880000, 1950000, 1920000, 1980000, 1940000, 2000000, 1980000, 2020000]
  }

  const chartData = data || defaultData

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
           
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            const label = context.dataset.label || ''
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(context.parsed.y)
            return `${label}: ${value}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#334155',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter, sans-serif',
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#334155',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
           
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
              minimumFractionDigits: 0
            }).format(value)
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  }

  const datasets = [
    {
      label: 'Revenue',
      data: chartData.revenue,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#065f46',
      pointBorderWidth: 2
    },
    {
      label: 'Expenses',
      data: chartData.expenses,
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      fill: true,
      pointBackgroundColor: '#f59e0b',
      pointBorderColor: '#92400e',
      pointBorderWidth: 2
    }
  ]

  return (
    <div style={{ height: `${height}px` }}>
      <Line
        data={{
          labels: chartData.labels,
          datasets
        }}
        options={chartOptions}
      />
    </div>
  )
}
