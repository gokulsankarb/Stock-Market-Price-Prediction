'use client'

import { useStockLiveData } from '@/lib/socket-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface LivePriceCardProps {
  symbol: string
  name?: string
}

export function LivePriceCard({ symbol, name }: LivePriceCardProps) {
  const { liveData, isLoading } = useStockLiveData(symbol)

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground">{name || symbol}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    )
  }

  if (!liveData) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-foreground">{name || symbol}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">No data</CardContent>
      </Card>
    )
  }

  const isPositive = liveData.change >= 0
  const Icon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center justify-between">
          <span>{name || symbol}</span>
          <Icon className={`h-4 w-4 ${isPositive ? 'text-success' : 'text-destructive'}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-foreground">₹{liveData.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <span className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{liveData.change.toFixed(2)} ({liveData.changePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Bid: ₹{liveData.bid.toFixed(2)}</span>
          <span>Ask: ₹{liveData.ask.toFixed(2)}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Vol: {(liveData.volume / 1000000).toFixed(2)}M
        </div>
        <div className="text-xs text-muted-foreground opacity-70">
          {new Date(liveData.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </CardContent>
    </Card>
  )
}
