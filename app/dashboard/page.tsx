'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { StockSelector } from '@/components/stock-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { NSE_STOCKS } from '@/lib/types'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Lazy load heavy components
const StockChart = dynamic(() => import('@/components/stock-chart').then(mod => ({ default: mod.StockChart })), {
  loading: () => <Skeleton className="h-80 w-full" />,
})
const StockStats = dynamic(() => import('@/components/stock-stats').then(mod => ({ default: mod.StockStats })), {
  loading: () => <Skeleton className="h-40 w-full" />,
})
const PredictionPanel = dynamic(() => import('@/components/prediction-panel').then(mod => ({ default: mod.PredictionPanel })), {
  loading: () => <Skeleton className="h-40 w-full" />,
})

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const [selectedStock, setSelectedStock] = useState(NSE_STOCKS[0].symbol)
  const { data: stockData, error, isLoading, mutate } = useSWR('/api/stocks', fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds for live updates
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  })

  const currentStock = stockData?.[selectedStock]

  // Market summary
  const marketSummary = stockData ? {
    gainers: Object.values(stockData).filter((s: { changePercent: number }) => s.changePercent > 0).length,
    losers: Object.values(stockData).filter((s: { changePercent: number }) => s.changePercent < 0).length,
    unchanged: Object.values(stockData).filter((s: { changePercent: number }) => s.changePercent === 0).length,
  } : null

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-card/50 border-border/50 p-8 text-center">
          <p className="text-destructive mb-4">Failed to load stock data</p>
          <Button onClick={() => mutate()}>Try Again</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Stock Dashboard</h1>
          <p className="text-muted-foreground mt-1">AI-powered stock predictions using LSTM</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => mutate()} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Market Summary */}
      {marketSummary && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{marketSummary.gainers}</p>
                <p className="text-sm text-muted-foreground">Gainers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{marketSummary.losers}</p>
                <p className="text-sm text-muted-foreground">Losers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-muted-foreground/50" />
              <div>
                <p className="text-2xl font-bold">{marketSummary.unchanged}</p>
                <p className="text-sm text-muted-foreground">Unchanged</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stock Selector */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Select Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <StockSelector
            value={selectedStock}
            onChange={setSelectedStock}
            stockData={stockData}
          />
        </CardContent>
      </Card>

      {/* Stock Info Header */}
      {isLoading ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : currentStock && (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {currentStock.symbol.replace('.NS', '').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {currentStock.name}
                    <Badge variant="secondary" className="text-xs">{currentStock.symbol.replace('.NS', '')}</Badge>
                  </h2>
                  <p className="text-muted-foreground text-sm">{currentStock.sector}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ₹{currentStock.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </p>
                <p className={cn(
                  "flex items-center justify-end gap-1 text-sm font-medium",
                  currentStock.change >= 0 ? "text-success" : "text-destructive"
                )}>
                  {currentStock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {currentStock.change >= 0 ? '+' : ''}{currentStock.change.toFixed(2)} ({currentStock.change >= 0 ? '+' : ''}{currentStock.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : currentStock && (
        <StockStats
          currentPrice={currentStock.currentPrice}
          change={currentStock.change}
          changePercent={currentStock.changePercent}
          high52Week={currentStock.high52Week}
          low52Week={currentStock.low52Week}
          volume={currentStock.volume}
          avgVolume={currentStock.avgVolume}
          ma20={currentStock.ma20}
          ma50={currentStock.ma50}
          marketCap={currentStock.marketCap}
          pe={currentStock.pe}
        />
      )}

      {/* Chart and Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ) : currentStock && (
            <StockChart
              data={currentStock.history}
              title={`${currentStock.symbol.replace('.NS', '')} Price History`}
              predictions={currentStock.predictions}
              chartType="area"
            />
          )}
        </div>
        <div>
          {isLoading ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ) : currentStock && (
            <PredictionPanel
              currentPrice={currentStock.currentPrice}
              predictions={currentStock.predictions}
              confidence={currentStock.confidence ?? 88.5}
              modelVersion={currentStock.modelVersion ?? 'PyTorch LSTM v1.0'}
            />
          )}
        </div>
      </div>

      {/* All Stocks Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>All NSE Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Change</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Volume</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Prediction (7D)</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      <td className="py-3 px-4 hidden md:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-4 w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : stockData && Object.values(stockData).map((stock: {
                  symbol: string
                  name: string
                  currentPrice: number
                  change: number
                  changePercent: number
                  volume: number
                  predictions: number[]
                }) => {
                  const predChange = ((stock.predictions[6] - stock.currentPrice) / stock.currentPrice) * 100
                  return (
                    <tr 
                      key={stock.symbol} 
                      className={cn(
                        "border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-colors",
                        selectedStock === stock.symbol && "bg-muted/50"
                      )}
                      onClick={() => setSelectedStock(stock.symbol)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stock.symbol.replace('.NS', '')}</span>
                          <span className="text-muted-foreground text-sm hidden sm:inline">{stock.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        ₹{stock.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className={cn(
                        "py-3 px-4 text-right font-mono",
                        stock.change >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono hidden md:table-cell text-muted-foreground">
                        {(stock.volume / 100000).toFixed(1)}L
                      </td>
                      <td className={cn(
                        "py-3 px-4 text-right font-mono hidden lg:table-cell",
                        predChange >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {predChange >= 0 ? '+' : ''}{predChange.toFixed(2)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
