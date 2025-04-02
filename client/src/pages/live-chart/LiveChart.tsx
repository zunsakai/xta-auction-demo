import React, { useEffect, useRef, useState } from 'react'
import type { CascaderProps } from 'antd'
import { Cascader, Layout } from 'antd'
import { createCandleWebSocket, fetchHistoricalData } from './binanceService'
import { usdtFormat } from '../../utils'
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import { Candle } from './types'

const { Header, Content } = Layout

interface Option {
  value: string
  label: string
}

const options: Option[] = [
  {
    value: 'BTCUSDT',
    label: 'BTC/USDT',
  },
  {
    value: 'ETHUSDT',
    label: 'ETH/USDT',
  },
]

const headerStyle: React.CSSProperties = {
  textAlign: 'left',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#181A20',
  display: 'flex',
}

const LiveChart: React.FC = () => {
  const [symbol, setSymbol] = useState(options[0].value)
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const currentPriceRef = useRef<number>(0)

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  const onChangeSymbol: CascaderProps<Option>['onChange'] = (_, selectedOptions) => {
    setSymbol(selectedOptions.map(o => o.value).join(', '))
    currentPriceRef.current = 0
    setCurrentPrice(0)
  }

  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#181a21' },
        textColor: '#d9d9d9',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: '#1f242b' },
        horzLines: { color: '#1f242b' },
      },
      crosshair: {
        mode: 1,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#4b5563',
      },
    })

    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: 'rgb(46, 189, 133)',
      downColor: 'rgb(246, 70, 93)',
      borderVisible: false,
      wickUpColor: 'rgb(46, 189, 133)',
      wickDownColor: 'rgb(246, 70, 93)',
    })

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: 500,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartRef.current?.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const historicalData = await fetchHistoricalData(symbol)
        if (seriesRef.current && historicalData.length > 0) {
          seriesRef.current.setData(historicalData as any)
          chartRef.current?.timeScale().fitContent()
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    })()

    const ws = createCandleWebSocket(symbol, (candle: Candle) => {
      seriesRef.current?.update(candle as any)
      const newPrice = candle.close
      const prevPrice = currentPriceRef.current
      setDirection(newPrice > prevPrice ? 'up' : 'down')
      currentPriceRef.current = newPrice
      setCurrentPrice(newPrice)
    })

    return () => {
      if (ws) ws.close()
    }
  }, [symbol])

  return (
    <>
      <Header style={headerStyle}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>TXA</div>
        <div style={{ marginLeft: 48 }}>
          <Cascader options={options} onChange={onChangeSymbol} allowClear={false} defaultValue={[options[0].value]} />
        </div>
        <div
          style={{
            marginLeft: 16,
            fontSize: 20,
            fontWeight: 600,
            color: direction === 'up' ? 'rgb(46, 189, 133)' : 'rgb(246, 70, 93)',
          }}
        >
          {usdtFormat(currentPrice)}
        </div>
      </Header>
      <Content style={{ padding: 16 }}>
        <div
          ref={chartContainerRef}
          style={{
            width: '100%',
            height: 500,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        />
      </Content>
    </>
  )
}

export default LiveChart
