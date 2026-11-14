/**
 * Extended Socket.IO events for Phase 2 with Zerodha integration
 * This file documents the socket events used in Phase 2+
 */

export const SocketEvents = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Market status
  MARKET_STATUS: 'market-status',

  // Stock data
  STOCK_UPDATE: 'stock-update',
  SUBSCRIBE_STOCK: 'subscribe-stock',
  UNSUBSCRIBE_STOCK: 'unsubscribe-stock',

  // Historical candles
  CANDLES_REQUEST: 'candles-request',
  CANDLES_RESPONSE: 'candles-response',

  // Historical data
  HISTORICAL_DATA_REQUEST: 'historical-data-request',
  HISTORICAL_DATA_RESPONSE: 'historical-data-response',

  // Connection pool
  PING: 'ping',
  PONG: 'pong',
}

export interface StockUpdateEvent {
  symbol: string
  ltp: number
  change: number
  changePercent: number
  bid: number
  ask: number
  volume: number
  timestamp: string
  ohlc?: {
    open: number
    high: number
    low: number
    close: number
  }
}

export interface CandlesRequestEvent {
  symbol: string
  interval: 'minute' | '5minute' | '15minute' | 'hour' | 'day'
  count?: number
}

export interface CandlesResponseEvent {
  symbol: string
  interval: string
  candles: Array<{
    date: string
    time: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
}

export interface HistoricalDataRequestEvent {
  symbol: string
  fromDate: string // YYYY-MM-DD
  toDate: string // YYYY-MM-DD
  interval: 'minute' | '5minute' | '15minute' | 'hour' | 'day'
}

export interface HistoricalDataResponseEvent {
  symbol: string
  data: Array<{
    date: string
    time: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
  error?: string
}

export interface MarketStatusEvent {
  isOpen: boolean
  status: 'open' | 'closed' | 'pre-open' | 'after-hours'
  currentTime: string
  formattedStatus: string
}
