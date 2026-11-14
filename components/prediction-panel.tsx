'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, TrendingDown, Target, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PredictionPanelProps {
  currentPrice: number
  predictions: number[]
  confidence?: number
  modelVersion?: string
}

export function PredictionPanel({
  currentPrice,
  predictions,
  confidence = 85,
  modelVersion = 'LSTM v1.0',
}: PredictionPanelProps) {
  const nextDayPrediction = predictions[0] || currentPrice
  const weekPrediction = predictions[6] || predictions[predictions.length - 1] || currentPrice
  
  const nextDayChange = ((nextDayPrediction - currentPrice) / currentPrice) * 100
  const weekChange = ((weekPrediction - currentPrice) / currentPrice) * 100

  const getSignal = () => {
    if (weekChange > 3) return { signal: 'Strong Buy', color: 'text-success bg-success/20' }
    if (weekChange > 0) return { signal: 'Buy', color: 'text-success bg-success/20' }
    if (weekChange > -3) return { signal: 'Hold', color: 'text-warning bg-warning/20' }
    return { signal: 'Sell', color: 'text-destructive bg-destructive/20' }
  }

  const signal = getSignal()

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Prediction
          </CardTitle>
          <Badge variant="secondary" className="font-mono text-xs">
            {modelVersion}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Signal Badge */}
        <div className="flex items-center justify-center">
          <div className={cn("px-4 py-2 rounded-full font-semibold", signal.color)}>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {signal.signal}
            </div>
          </div>
        </div>

        {/* Predictions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Next Day Prediction */}
          <div className="p-4 rounded-lg bg-muted/30 space-y-1">
            <p className="text-sm text-muted-foreground">Tomorrow</p>
            <p className="text-xl font-bold">
              ₹{nextDayPrediction.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <div className={cn(
              "flex items-center gap-1 text-sm",
              nextDayChange >= 0 ? "text-success" : "text-destructive"
            )}>
              {nextDayChange >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{nextDayChange >= 0 ? '+' : ''}{nextDayChange.toFixed(2)}%</span>
            </div>
          </div>

          {/* 7-Day Prediction */}
          <div className="p-4 rounded-lg bg-muted/30 space-y-1">
            <p className="text-sm text-muted-foreground">7 Days</p>
            <p className="text-xl font-bold">
              ₹{weekPrediction.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <div className={cn(
              "flex items-center gap-1 text-sm",
              weekChange >= 0 ? "text-success" : "text-destructive"
            )}>
              {weekChange >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{weekChange >= 0 ? '+' : ''}{weekChange.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Daily Predictions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Daily Forecast</p>
          <div className="grid grid-cols-7 gap-1">
            {predictions.slice(0, 7).map((price, index) => {
              const dayChange = ((price - currentPrice) / currentPrice) * 100
              const isPositive = dayChange >= 0
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center p-2 rounded bg-muted/20 text-center"
                >
                  <span className="text-xs text-muted-foreground">D{index + 1}</span>
                  <span className={cn(
                    "text-xs font-medium",
                    isPositive ? "text-success" : "text-destructive"
                  )}>
                    {isPositive ? '+' : ''}{dayChange.toFixed(1)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Confidence */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Model Confidence
            </span>
            <span className="font-medium">{confidence.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
          Predictions are based on historical data and LSTM model analysis. 
          Not financial advice.
        </p>
      </CardContent>
    </Card>
  )
}
