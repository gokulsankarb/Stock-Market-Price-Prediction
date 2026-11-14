'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StockStatsProps {
  currentPrice: number
  change: number
  changePercent: number
  high52Week: number
  low52Week: number
  volume: number
  avgVolume: number
  ma20: number
  ma50: number
  marketCap?: number
  pe?: number
}

export function StockStats({
  currentPrice,
  change,
  changePercent,
  high52Week,
  low52Week,
  volume,
  avgVolume,
  ma20,
  ma50,
  marketCap,
  pe,
}: StockStatsProps) {
  const isPositive = change >= 0
  const pricePosition = ((currentPrice - low52Week) / (high52Week - low52Week)) * 100

  const formatNumber = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`
    }
    return `₹${num.toLocaleString('en-IN')}`
  }

  const formatVolume = (num: number) => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Cr`
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(2)} L`
    }
    return num.toLocaleString('en-IN')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Price Card */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Current Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              ₹{currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className={cn(
            "flex items-center gap-1 mt-1",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 52 Week Range Card */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            52 Week Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">₹{low52Week.toLocaleString('en-IN')}</span>
              <span className="text-muted-foreground">₹{high52Week.toLocaleString('en-IN')}</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-primary rounded-full"
                style={{ width: `${pricePosition}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full border-2 border-background"
                style={{ left: `${pricePosition}%`, marginLeft: '-6px' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume Card */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Today</span>
              <span className="font-medium">{formatVolume(volume)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg</span>
              <span className="font-medium">{formatVolume(avgVolume)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moving Averages Card */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Moving Averages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">MA 20</span>
              <span className={cn(
                "font-medium",
                currentPrice > ma20 ? "text-success" : "text-destructive"
              )}>
                ₹{ma20.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">MA 50</span>
              <span className={cn(
                "font-medium",
                currentPrice > ma50 ? "text-success" : "text-destructive"
              )}>
                ₹{ma50.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
