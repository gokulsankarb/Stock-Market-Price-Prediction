import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const PREDICTION_FILE = path.join(process.cwd(), 'ml', 'lstm_predictions.json')

const baseStocks = {
  'RELIANCE.NS': { name: 'Reliance Industries', sector: 'Energy', basePrice: 1408.80 },
  'TCS.NS': { name: 'Tata Consultancy Services', sector: 'Technology', basePrice: 2422.70 },
  'HDFCBANK.NS': { name: 'HDFC Bank', sector: 'Banking', basePrice: 782.30 },
  'INFY.NS': { name: 'Infosys', sector: 'Technology', basePrice: 1279.10 },
  'ICICIBANK.NS': { name: 'ICICI Bank', sector: 'Banking', basePrice: 1259.70 },
  'HINDUNILVR.NS': { name: 'Hindustan Unilever', sector: 'Consumer Goods', basePrice: 2141.80 },
  'SBIN.NS': { name: 'State Bank of India', sector: 'Banking', basePrice: 1060.60 },
  'BHARTIARTL.NS': { name: 'Bharti Airtel', sector: 'Telecommunications', basePrice: 1849.20 },
  'KOTAKBANK.NS': { name: 'Kotak Mahindra Bank', sector: 'Banking', basePrice: 371.10 },
  'ITC.NS': { name: 'ITC Limited', sector: 'Consumer Goods', basePrice: 291.25 },
  'LT.NS': { name: 'Larsen & Toubro', sector: 'Construction', basePrice: 3516.80 },
  'AXISBANK.NS': { name: 'Axis Bank', sector: 'Banking', basePrice: 1192.70 },
  'WIPRO.NS': { name: 'Wipro', sector: 'Technology', basePrice: 189.05 },
  'MARUTI.NS': { name: 'Maruti Suzuki', sector: 'Automobile', basePrice: 12711.00 },
  'TATASTEEL.NS': { name: 'Tata Steel', sector: 'Metals', basePrice: 196.65 },
} as const

type PredictionRecord = {
  historyLastClose: number
  predictions: number[]
  relativeChanges: number[]
  confidence: number
  modelVersion: string
  trainedAt: string
}

let predictionStore: Record<string, PredictionRecord> | null = null

function loadPredictionStore(): Record<string, PredictionRecord> {
  if (!predictionStore) {
    const raw = fs.readFileSync(PREDICTION_FILE, 'utf-8')
    predictionStore = JSON.parse(raw) as Record<string, PredictionRecord>
  }
  return predictionStore
}

function symbolHash(symbol: string) {
  return Array.from(symbol).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0)
}

function buildDeterministicHistory(symbol: string, basePrice: number, days = 60) {
  const hash = symbolHash(symbol)
  const slope = ((hash % 11) - 5) * 0.0006
  const seasonA = 0.017 + (hash % 5) * 0.002
  const seasonB = 0.009 + (hash % 7) * 0.0015
  const phaseA = (hash % 17) / 4
  const phaseB = (hash % 23) / 5
  const now = new Date()

  return Array.from({ length: days }, (_, i) => {
    const dayIndex = i + 1
    const trend = 1 + slope * (i - days / 2)
    const cyclical = 1 + seasonA * Math.sin((i / 4.2) + phaseA) + seasonB * Math.cos((i / 8.8) + phaseB)
    const micro = 1 + 0.0035 * Math.sin((i / 2.1) + phaseB / 2)
    const close = basePrice * trend * cyclical * micro
    const open = close * (1 + 0.0025 * Math.sin(dayIndex / 2.7 + phaseA))
    const high = Math.max(open, close) * (1 + 0.006 + (hash % 3) * 0.001)
    const low = Math.min(open, close) * (1 - 0.006 - (hash % 2) * 0.001)
    const volumeBase = 1500000 + (hash % 9) * 350000
    const volume = Math.floor(volumeBase * (1 + 0.18 * Math.sin(dayIndex / 5.5 + phaseB)))
    const date = new Date(now)
    date.setDate(date.getDate() - (days - 1 - i))

    return {
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    }
  })
}

function getLiveCurrentPrice(symbol: string, basePrice: number, timestamp: number) {
  const hash = symbolHash(symbol)
  const phase = (hash % 31) / 6
  const slowWave = Math.sin(timestamp / 180000 + phase) * 0.012
  const fastWave = Math.cos(timestamp / 45000 + phase / 2) * 0.004
  const intradayBias = ((hash % 7) - 3) * 0.0007
  const multiplier = 1 + slowWave + fastWave + intradayBias
  return parseFloat((basePrice * multiplier).toFixed(2))
}

function getLstmPredictions(symbol: string, basePrice: number) {
  const store = loadPredictionStore()
  const record = store[symbol]

  if (!record || !record.relativeChanges?.length) {
    return {
      predictions: Array.from({ length: 7 }, (_, i) => parseFloat((basePrice * (1 + 0.002 * (i + 1))).toFixed(2))),
      confidence: 80,
      modelVersion: 'Fallback Forecast v1.0',
    }
  }

  const predictions = record.relativeChanges
    .slice(0, 7)
    .map(change => parseFloat((basePrice * (1 + Number(change))).toFixed(2)))

  return {
    predictions,
    confidence: record.confidence,
    modelVersion: record.modelVersion,
  }
}

function generateStockData() {
  const stocks: Record<string, any> = {}
  const now = new Date()
  const timestamp = now.getTime()

  for (const [symbol, info] of Object.entries(baseStocks)) {
    const history = buildDeterministicHistory(symbol, info.basePrice)
    const currentPrice = getLiveCurrentPrice(symbol, info.basePrice, timestamp)
    const previousClose = history[history.length - 1].close
    const change = currentPrice - previousClose
    const changePercent = (change / previousClose) * 100
    const volume = history[history.length - 1].volume
    const avgVolume = Math.floor(history.reduce((sum, item) => sum + item.volume, 0) / history.length)
    const highs = history.map(item => item.high)
    const lows = history.map(item => item.low)
    const last20 = history.slice(-20).reduce((sum, item) => sum + item.close, 0) / 20
    const last50 = history.slice(-50).reduce((sum, item) => sum + item.close, 0) / 50
    const predictionData = getLstmPredictions(symbol, info.basePrice)
    const hash = symbolHash(symbol)

    stocks[symbol] = {
      symbol,
      name: info.name,
      sector: info.sector,
      currentPrice,
      previousClose,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high52Week: parseFloat((Math.max(...highs) * 1.08).toFixed(2)),
      low52Week: parseFloat((Math.min(...lows) * 0.92).toFixed(2)),
      ma20: parseFloat(last20.toFixed(2)),
      ma50: parseFloat(last50.toFixed(2)),
      volume,
      avgVolume,
      marketCap: Math.floor(info.basePrice * (90000000 + (hash % 13) * 10000000)),
      pe: parseFloat((12 + (hash % 30) + ((hash % 7) * 0.3)).toFixed(1)),
      history,
      predictions: predictionData.predictions,
      confidence: predictionData.confidence,
      modelVersion: predictionData.modelVersion,
      lastUpdated: now.toISOString(),
    }
  }

  return stocks
}

export async function GET() {
  try {
    const stockData = generateStockData()

    return NextResponse.json(stockData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
}
