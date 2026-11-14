import express from 'express'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { getMarketStatus, isMarketOpen, formatMarketStatus, getCurrentTimeIST } from './utils/marketTime'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

// Market status endpoint
app.get('/api/market-status', (req, res) => {
  const status = getMarketStatus()
  res.json({
    ...status,
    currentTime: status.currentTime.toISOString(),
    nextOpenTime: status.nextOpenTime.toISOString(),
    nextCloseTime: status.nextCloseTime.toISOString(),
    formattedStatus: formatMarketStatus(status),
  })
})

// Stock list endpoint
app.get('/api/stocks', (req, res) => {
  const stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking' },
    { symbol: 'INFY', name: 'Infosys', sector: 'Technology' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'Consumer Goods' },
    { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecommunications' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking' },
    { symbol: 'ITC', name: 'ITC Limited', sector: 'Consumer Goods' },
    { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Construction' },
    { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Banking' },
    { symbol: 'WIPRO', name: 'Wipro', sector: 'Technology' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Automobile' },
    { symbol: 'TATASTEEL', name: 'Tata Steel', sector: 'Metals' },
  ]
  res.json(stocks)
})

// Store for connected clients and subscribed stocks
const connectedClients = new Map<string, any>()
const subscribedStocks = new Map<string, Set<string>>() // stockSymbol -> Set<clientId>

// Mock data generator (will be replaced with real Zerodha data in Phase 2)
function generateMockLiveData(symbol: string) {
  const basePrice = {
    RELIANCE: 2800,
    TCS: 3400,
    HDFCBANK: 1650,
    INFY: 1520,
    ICICIBANK: 980,
    HINDUNILVR: 2500,
    SBIN: 550,
    BHARTIARTL: 1200,
    KOTAKBANK: 1850,
    ITC: 450,
    LT: 3200,
    AXISBANK: 1050,
    WIPRO: 320,
    MARUTI: 8200,
    TATASTEEL: 145,
  }

  const price = (basePrice[symbol as keyof typeof basePrice] || 1000) + (Math.random() - 0.5) * 50
  const change = (Math.random() - 0.5) * 2
  const volume = Math.floor(Math.random() * 10000000)

  return {
    symbol,
    ltp: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(((change / (basePrice[symbol as keyof typeof basePrice] || 1000)) * 100).toFixed(2)),
    bid: parseFloat((price - 0.5).toFixed(2)),
    ask: parseFloat((price + 0.5).toFixed(2)),
    volume,
    timestamp: new Date().toISOString(),
  }
}

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`[${new Date().toISOString()}] Client connected: ${socket.id}`)
  connectedClients.set(socket.id, socket)

  // Send initial market status
  const marketStatus = getMarketStatus()
  socket.emit('market-status', {
    isOpen: marketStatus.isOpen,
    status: marketStatus.status,
    currentTime: marketStatus.currentTime.toISOString(),
    formattedStatus: formatMarketStatus(marketStatus),
  })

  // Handle stock subscription
  socket.on('subscribe-stock', (symbol: string) => {
    console.log(`[${new Date().toISOString()}] Client ${socket.id} subscribed to ${symbol}`)

    if (!subscribedStocks.has(symbol)) {
      subscribedStocks.set(symbol, new Set())
    }
    subscribedStocks.get(symbol)!.add(socket.id)

    // Send initial data
    const liveData = generateMockLiveData(symbol)
    socket.emit('stock-update', liveData)

    // If market is open, start sending updates
    if (isMarketOpen()) {
      const interval = setInterval(() => {
        if (subscribedStocks.get(symbol)?.has(socket.id)) {
          const data = generateMockLiveData(symbol)
          socket.emit('stock-update', data)
        } else {
          clearInterval(interval)
        }
      }, 1000) // Update every second (Phase 2 will use real data)

      socket.on('disconnect', () => {
        clearInterval(interval)
      })
    }
  })

  // Handle stock unsubscription
  socket.on('unsubscribe-stock', (symbol: string) => {
    console.log(`[${new Date().toISOString()}] Client ${socket.id} unsubscribed from ${symbol}`)
    subscribedStocks.get(symbol)?.delete(socket.id)
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`[${new Date().toISOString()}] Client disconnected: ${socket.id}`)
    connectedClients.delete(socket.id)
    subscribedStocks.forEach((clients) => clients.delete(socket.id))
  })

  // Heartbeat to keep connection alive
  socket.emit('ping')
})

// Broadcast market status updates every minute
setInterval(() => {
  const marketStatus = getMarketStatus()
  io.emit('market-status', {
    isOpen: marketStatus.isOpen,
    status: marketStatus.status,
    currentTime: marketStatus.currentTime.toISOString(),
    formattedStatus: formatMarketStatus(marketStatus),
  })
}, 60000) // Every 60 seconds

// Start server
httpServer.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] StockAI Realtime Backend listening on port ${PORT}`)
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
})
