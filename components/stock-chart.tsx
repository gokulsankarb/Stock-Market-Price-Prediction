'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StockChartProps {
  data: {
    date: string
    close: number
    open?: number
    high?: number
    low?: number
    volume?: number
    predicted?: number
  }[]
  title?: string
  predictions?: number[]
  chartType?: 'line' | 'area' | 'candlestick' | 'bar'
}

export function StockChart({ data, title = 'Price History', predictions, chartType = 'area' }: StockChartProps) {
  const [displayData, setDisplayData] = useState<any[]>([])

  useEffect(() => {
    if (!data || data.length === 0) return

    const processedData = data.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    }))

    if (predictions && predictions.length > 0) {
      const lastDate = new Date(data[data.length - 1]?.date || new Date())
      predictions.forEach((price, index) => {
        const predDate = new Date(lastDate)
        predDate.setDate(predDate.getDate() + index + 1)
        processedData.push({
          date: predDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          close: 0,
          predicted: price,
        })
      })
    }

    setDisplayData(processedData)
  }, [data, predictions])

  const minValue =
    displayData.length > 0
      ? Math.min(...displayData.map((d) => d.close || d.predicted || 0).filter((v) => v > 0)) * 0.98
      : 0

  const maxValue =
    displayData.length > 0
      ? Math.max(...displayData.map((d) => Math.max(d.close || 0, d.predicted || 0))) * 1.02
      : 100

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ value: number; dataKey: string; color: string }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium text-foreground" style={{ color: entry.color }}>
              {entry.dataKey === 'predicted' ? 'Predicted' : entry.dataKey}: ₹
              {entry.value?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3e52" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#2d3e52' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#2d3e52' }}
                  domain={[minValue, maxValue]}
                  tickFormatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  connectNulls={true}
                  name="Close Price"
                  isAnimationActive={true}
                />
                {predictions && predictions.length > 0 && (
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorPredicted)"
                    connectNulls={true}
                    name="LSTM Prediction"
                  />
                )}
              </AreaChart>
            ) : chartType === 'line' ? (
              <LineChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3e52" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#2d3e52' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#2d3e52' }}
                  domain={[minValue, maxValue]}
                  tickFormatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  connectNulls={true}
                  name="Close Price"
                  isAnimationActive={true}
                />
                {predictions && predictions.length > 0 && (
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    connectNulls={true}
                    name="LSTM Prediction"
                  />
                )}
              </LineChart>
            ) : chartType === 'candlestick' ? (
              <ComposedChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3e52" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#2d3e52' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#2d3e52' }}
                  domain={[minValue, maxValue]}
                  tickFormatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="high" stackId="candlestick" fill="#10b981" name="High" radius={[4, 4, 0, 0]} />
                <Bar dataKey="low" stackId="candlestick" fill="#ef4444" name="Low" radius={[0, 0, 4, 4]} />
                <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} name="Close" />
              </ComposedChart>
            ) : (
              <BarChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3e52" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#2d3e52' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#2d3e52' }}
                  tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="volume" fill="#8b5cf6" name="Volume" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        {predictions && predictions.length > 0 && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-blue-500 rounded" />
              <span className="text-xs text-muted-foreground">Historical Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-purple-500 rounded" style={{ borderStyle: 'dashed' }} />
              <span className="text-xs text-muted-foreground">LSTM Prediction</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
