/**
 * Candle aggregation from tick data
 * Generates OHLCV candles from individual price updates
 */

export interface Candle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CandleAggregator {
  symbol: string
  interval: number // in seconds (60 = 1 min, 300 = 5 min)
  currentCandle: Candle | null
  candles: Candle[]
}

/**
 * Create new candle aggregator
 */
export function createCandleAggregator(symbol: string, intervalSeconds: number = 60): CandleAggregator {
  return {
    symbol,
    interval: intervalSeconds,
    currentCandle: null,
    candles: [],
  }
}

/**
 * Add tick to candle aggregator
 */
export function addTickToCandle(
  aggregator: CandleAggregator,
  price: number,
  volume: number
): Candle | null {
  const now = Math.floor(Date.now() / 1000)
  const candleStart = Math.floor(now / aggregator.interval) * aggregator.interval

  // If we don't have a current candle or it's from a different period
  if (!aggregator.currentCandle || aggregator.currentCandle.timestamp !== candleStart) {
    // Save previous candle if it exists
    if (aggregator.currentCandle) {
      aggregator.candles.push(aggregator.currentCandle)

      // Keep only last 500 candles in memory
      if (aggregator.candles.length > 500) {
        aggregator.candles.shift()
      }
    }

    // Create new candle
    aggregator.currentCandle = {
      timestamp: candleStart,
      open: price,
      high: price,
      low: price,
      close: price,
      volume: volume,
    }

    return null // Not completed yet
  }

  // Update current candle
  aggregator.currentCandle.high = Math.max(aggregator.currentCandle.high, price)
  aggregator.currentCandle.low = Math.min(aggregator.currentCandle.low, price)
  aggregator.currentCandle.close = price
  aggregator.currentCandle.volume += volume

  return null // Not completed yet
}

/**
 * Get all candles
 */
export function getCandles(aggregator: CandleAggregator): Candle[] {
  if (aggregator.currentCandle) {
    return [...aggregator.candles, aggregator.currentCandle]
  }
  return aggregator.candles
}

/**
 * Get last N candles
 */
export function getLastCandles(aggregator: CandleAggregator, count: number = 100): Candle[] {
  const all = getCandles(aggregator)
  return all.slice(Math.max(0, all.length - count))
}

/**
 * Convert timestamp to Date
 */
export function candleTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

/**
 * Format candle for frontend
 */
export function formatCandleForChart(candle: Candle) {
  return {
    date: new Date(candle.timestamp * 1000).toISOString().split('T')[0],
    time: new Date(candle.timestamp * 1000).toLocaleTimeString('en-IN'),
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume,
  }
}
