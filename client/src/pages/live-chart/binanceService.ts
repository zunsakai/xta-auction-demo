import { Candle } from './types'

const BINANCE_API_BASE = 'https://api.binance.com/api/v3'
const BINANCE_WS_BASE = 'wss://stream.binance.com:9443/ws'

export const fetchHistoricalData = async (
  symbol: string,
  interval: string = '1m',
  limit: number = 1000
): Promise<Candle[]> => {
  try {
    const response = await fetch(`${BINANCE_API_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    return data.map((item: any) => ({
      time: item[0] / 1000, // Convert to seconds for lightweight-charts
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
    }))
  } catch (error) {
    console.error('Error fetching historical data:', error)
    return []
  }
}

export const createCandleWebSocket = (symbol: string, onMessage: (candle: Candle) => void): WebSocket => {
  const wsSymbol = symbol.toLowerCase()
  const ws = new WebSocket(`${BINANCE_WS_BASE}/${wsSymbol}@kline_1m`)

  ws.onopen = () => {
    console.log(`WebSocket connection opened for ${symbol}`)
  }

  ws.onmessage = event => {
    const message = JSON.parse(event.data)

    if (message.k) {
      const { t, o, h, l, c, v } = message.k

      const candle: Candle = {
        time: t / 1000, // Convert to seconds for lightweight-charts
        open: parseFloat(o),
        high: parseFloat(h),
        low: parseFloat(l),
        close: parseFloat(c),
        volume: parseFloat(v),
      }

      onMessage(candle)
    }
  }

  ws.onerror = error => {
    console.error('WebSocket error:', error)
  }

  ws.onclose = () => {
    console.log(`WebSocket connection closed for ${symbol}`)
  }

  return ws
}
