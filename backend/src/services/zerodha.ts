/**
 * Zerodha Kite WebSocket Integration
 * Handles real-time market data from Zerodha Kite API
 */

import axios, { AxiosInstance } from 'axios'

export interface ZerodhaConfig {
  apiKey: string
  accessToken: string
  publicToken: string
}

export interface ZerodhaTickData {
  tradable: boolean
  mode: string
  instrument_token: number
  last_price: number
  last_quantity: number
  last_trade_time: number
  last_trade_date: string
  volume: number
  buy_quantity: number
  sell_quantity: number
  bid: number
  ask: number
  bid_quantity: number
  ask_quantity: number
  ohlc: {
    open: number
    high: number
    low: number
    close: number
  }
}

/**
 * Zerodha Kite API client
 */
export class KiteClient {
  private apiKey: string
  private accessToken: string
  private httpClient: AxiosInstance
  private baseUrl = 'https://api.kite.trade'

  constructor(config: ZerodhaConfig) {
    this.apiKey = config.apiKey
    this.accessToken = config.accessToken

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${this.apiKey}:${this.accessToken}`,
      },
    })
  }

  /**
   * Get instrument tokens for symbols
   */
  async getInstruments(symbols: string[]): Promise<Map<string, number>> {
    try {
      const response = await this.httpClient.get('/instruments', {
        params: {
          exchange: 'NSE',
        },
      })

      const instrumentMap = new Map<string, number>()

      if (response.data?.data) {
        response.data.data.forEach((inst: any) => {
          if (symbols.includes(inst.tradingsymbol)) {
            instrumentMap.set(inst.tradingsymbol, inst.instrument_token)
          }
        })
      }

      return instrumentMap
    } catch (error) {
      console.error('[Zerodha] Error fetching instruments:', error)
      throw error
    }
  }

  /**
   * Get current market quote
   */
  async getQuote(symbol: string, mode: string = 'full'): Promise<any> {
    try {
      const response = await this.httpClient.get('/quote', {
        params: {
          i: `NSE:${symbol}`,
          mode,
        },
      })

      return response.data?.data?.[`NSE:${symbol}`]
    } catch (error) {
      console.error(`[Zerodha] Error fetching quote for ${symbol}:`, error)
      throw error
    }
  }

  /**
   * Get historical data (candles)
   */
  async getHistoricalData(
    symbol: string,
    interval: string = '1',
    fromDate: string,
    toDate: string
  ): Promise<any[]> {
    try {
      const response = await this.httpClient.get('/instruments/historical/{instrument_token}/{interval}', {
        params: {
          from: fromDate,
          to: toDate,
          continuous: '0',
          oi: '0',
        },
      })

      return response.data?.data?.candles || []
    } catch (error) {
      console.error(`[Zerodha] Error fetching historical data for ${symbol}:`, error)
      throw error
    }
  }
}

/**
 * Convert Zerodha quote to standard format
 */
export function formatZerodhaQuote(symbol: string, quote: any) {
  return {
    symbol,
    ltp: quote?.last_price || 0,
    change: (quote?.last_price || 0) - (quote?.ohlc?.close || 0),
    changePercent: ((quote?.last_price || 0) - (quote?.ohlc?.close || 0)) / (quote?.ohlc?.close || 1) * 100,
    bid: quote?.bid || 0,
    ask: quote?.ask || 0,
    volume: quote?.volume || 0,
    timestamp: new Date().toISOString(),
    ohlc: quote?.ohlc || { open: 0, high: 0, low: 0, close: 0 },
  }
}
