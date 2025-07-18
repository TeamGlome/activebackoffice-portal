"use client"

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface AIPredictionsChartProps {
  data?: {
    labels: string[]
    predictions: number[]
    accuracy: number[]
    costSavings: number[]
  }
  height?: number
}

interface TooltipContext {
  dataset: {
    label?: string
  }
  parsed: {
    y: number
  }
}

export function AIPredictionsChart({ data, height = 300 }: AIPredictionsChartProps) {
  // Mock data if none provided
  const defaultData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    predictions: [24, 31, 28, 35, 29, 38, 32, 41],
    accuracy: [94, 96, 95, 97, 98, 96, 97, 98],
    costSavings: [15000, 22000, 18000, 28000, 25000, 35000, 30000, 42000]
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
          label: function(context: TooltipContext) {
            const label = context.dataset.label || ''
            if (label === 'Accuracy') {
              return `${label}: ${context.parsed.y}%`
            }
            return `${label}: ${context.parsed.y}`
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
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
        },
        min: 0
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function(value: string | number) {
            return `${value}%`
          }
        },
        min: 90,
        max: 100
      }
    }
  }

  const datasets = [
    {
      label: 'Predictions Made',
      data: chartData.predictions,
      backgroundColor: 'rgba(147, 51, 234, 0.8)',
      borderColor: '#7c3aed',
      borderWidth: 1,
      yAxisID: 'y'
    },
    {
      label: 'Accuracy',
      data: chartData.accuracy,
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: '#10b981',
      borderWidth: 1,
      yAxisID: 'y1'
    }
  ]

  return (
    <div style={{ height: `${height}px` }}>
      <Bar
        data={{
          labels: chartData.labels,
          datasets
        }}
        options={chartOptions}
      />
    </div>
  )
}
