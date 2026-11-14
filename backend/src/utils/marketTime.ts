/**
 * Market Time Utilities for NSE (India Standard Time - IST)
 * NSE Operating Hours: 9:15 AM to 3:30 PM IST, Monday to Friday
 */

export interface MarketStatus {
  isOpen: boolean
  status: 'open' | 'closed' | 'pre-open' | 'after-hours'
  currentTime: Date
  nextOpenTime: Date
  nextCloseTime: Date
  dayOfWeek: number
  isWeekend: boolean
  minutesUntilOpen: number
  minutesUntilClose: number
}

const MARKET_OPEN_HOUR = 9
const MARKET_OPEN_MINUTE = 15
const MARKET_CLOSE_HOUR = 15
const MARKET_CLOSE_MINUTE = 30

/**
 * Get current time in IST (UTC+5:30)
 */
export function getCurrentTimeIST(): Date {
  const now = new Date()
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  return istTime
}

/**
 * Check if market is open
 */
export function isMarketOpen(): boolean {
  const now = getCurrentTimeIST()
  const dayOfWeek = now.getDay()
  const hours = now.getHours()
  const minutes = now.getMinutes()

  // Market closed on Saturday (6) and Sunday (0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false
  }

  // Check time: 9:15 AM to 3:30 PM
  const currentTimeInMinutes = hours * 60 + minutes
  const openTimeInMinutes = MARKET_OPEN_HOUR * 60 + MARKET_OPEN_MINUTE
  const closeTimeInMinutes = MARKET_CLOSE_HOUR * 60 + MARKET_CLOSE_MINUTE

  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes
}

/**
 * Get detailed market status
 */
export function getMarketStatus(): MarketStatus {
  const now = getCurrentTimeIST()
  const dayOfWeek = now.getDay()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTimeInMinutes = hours * 60 + minutes
  const openTimeInMinutes = MARKET_OPEN_HOUR * 60 + MARKET_OPEN_MINUTE
  const closeTimeInMinutes = MARKET_CLOSE_HOUR * 60 + MARKET_CLOSE_MINUTE

  // Check if weekend
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  let status: MarketStatus['status'] = 'closed'
  let isOpen = false

  if (!isWeekend) {
    if (currentTimeInMinutes < openTimeInMinutes) {
      status = 'pre-open'
    } else if (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes) {
      status = 'open'
      isOpen = true
    } else {
      status = 'after-hours'
    }
  }

  // Calculate next open time
  let nextOpenTime = new Date(now)
  if (isWeekend || status === 'after-hours') {
    // Find next weekday
    let daysToAdd = isWeekend ? (8 - dayOfWeek) % 7 : 1
    if (daysToAdd === 0) daysToAdd = 1
    nextOpenTime.setDate(nextOpenTime.getDate() + daysToAdd)
  }
  nextOpenTime.setHours(MARKET_OPEN_HOUR, MARKET_OPEN_MINUTE, 0, 0)

  // Calculate next close time
  let nextCloseTime = new Date(now)
  if (currentTimeInMinutes >= closeTimeInMinutes) {
    nextCloseTime.setDate(nextCloseTime.getDate() + 1)
  }
  nextCloseTime.setHours(MARKET_CLOSE_HOUR, MARKET_CLOSE_MINUTE, 0, 0)

  // Calculate minutes until open/close
  const minutesUntilOpen = Math.max(0, Math.floor((nextOpenTime.getTime() - now.getTime()) / 60000))
  const minutesUntilClose = Math.max(0, Math.floor((nextCloseTime.getTime() - now.getTime()) / 60000))

  return {
    isOpen,
    status,
    currentTime: now,
    nextOpenTime,
    nextCloseTime,
    dayOfWeek,
    isWeekend,
    minutesUntilOpen,
    minutesUntilClose,
  }
}

/**
 * Format market status for display
 */
export function formatMarketStatus(status: MarketStatus): string {
  if (status.isOpen) {
    return `Market Open - Closes in ${status.minutesUntilClose} minutes`
  } else if (status.status === 'pre-open') {
    return `Pre-open - Opens in ${status.minutesUntilOpen} minutes`
  } else if (status.isWeekend) {
    return 'Market Closed (Weekend)'
  } else {
    return `Market Closed - Opens tomorrow at 9:15 AM`
  }
}
