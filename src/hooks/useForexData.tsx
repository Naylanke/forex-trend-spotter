import { useState, useEffect } from 'react';

export interface ForexPair {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  timestamp: number;
  trend: 'up' | 'down' | 'sideways';
  volume: number;
  category: 'forex' | 'metals' | 'crypto';
}

export interface HistoricalData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Mock forex data for demonstration - in production, use a real forex API
const generateMockData = (): ForexPair[] => {
  const pairs = [
    { pair: 'EUR/USD', basePrice: 1.0850, category: 'forex' as const },
    { pair: 'GBP/USD', basePrice: 1.2640, category: 'forex' as const },
    { pair: 'USD/JPY', basePrice: 149.50, category: 'forex' as const },
    { pair: 'AUD/USD', basePrice: 0.6580, category: 'forex' as const },
    { pair: 'USD/CAD', basePrice: 1.3450, category: 'forex' as const },
    { pair: 'USD/CHF', basePrice: 0.8950, category: 'forex' as const },
    { pair: 'NZD/USD', basePrice: 0.5980, category: 'forex' as const },
    { pair: 'EUR/GBP', basePrice: 0.8590, category: 'forex' as const },
    { pair: 'XAU/USD', basePrice: 2032.50, category: 'metals' as const },
    { pair: 'XAG/USD', basePrice: 24.85, category: 'metals' as const },
    { pair: 'BTC/USD', basePrice: 43250.00, category: 'crypto' as const },
    { pair: 'ETH/USD', basePrice: 2645.00, category: 'crypto' as const },
  ];

  return pairs.map(({ pair, basePrice, category }) => {
    const changeMultiplier = category === 'crypto' ? 0.05 : category === 'metals' ? 0.02 : 0.01;
    const change = (Math.random() - 0.5) * changeMultiplier;
    const price = basePrice + change;
    const changePercent = (change / basePrice) * 100;
    
    // Determine trend based on change
    let trend: 'up' | 'down' | 'sideways' = 'sideways';
    if (Math.abs(changePercent) > 0.1) {
      trend = changePercent > 0 ? 'up' : 'down';
    }
    
    const decimals = category === 'crypto' ? 2 : category === 'metals' ? 2 : 4;
    
    return {
      pair,
      price: Number(price.toFixed(decimals)),
      change: Number(change.toFixed(decimals)),
      changePercent: Number(changePercent.toFixed(2)),
      high: Number((price + Math.random() * 0.005).toFixed(decimals)),
      low: Number((price - Math.random() * 0.005).toFixed(decimals)),
      timestamp: Date.now(),
      trend,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      category,
    };
  });
};

const generateHistoricalData = (pair: string = "EUR/USD", days: number = 30): HistoricalData[] => {
  const data: HistoricalData[] = [];
  
  // Get base price for the selected pair
  const pairConfigs: Record<string, { basePrice: number; volatility: number; decimals: number }> = {
    'EUR/USD': { basePrice: 1.0850, volatility: 0.01, decimals: 4 },
    'GBP/USD': { basePrice: 1.2640, volatility: 0.012, decimals: 4 },
    'USD/JPY': { basePrice: 149.50, volatility: 0.8, decimals: 2 },
    'AUD/USD': { basePrice: 0.6580, volatility: 0.011, decimals: 4 },
    'USD/CAD': { basePrice: 1.3450, volatility: 0.009, decimals: 4 },
    'USD/CHF': { basePrice: 0.8950, volatility: 0.008, decimals: 4 },
    'NZD/USD': { basePrice: 0.5980, volatility: 0.013, decimals: 4 },
    'EUR/GBP': { basePrice: 0.8590, volatility: 0.007, decimals: 4 },
    'XAU/USD': { basePrice: 2032.50, volatility: 15.0, decimals: 2 },
    'XAG/USD': { basePrice: 24.85, volatility: 0.8, decimals: 2 },
    'BTC/USD': { basePrice: 43250.00, volatility: 1200.0, decimals: 2 },
    'ETH/USD': { basePrice: 2645.00, volatility: 85.0, decimals: 2 },
  };
  
  const config = pairConfigs[pair] || pairConfigs['EUR/USD'];
  let currentPrice = config.basePrice;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000);
    const open = currentPrice;
    const change = (Math.random() - 0.5) * config.volatility * 2;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * config.volatility;
    const low = Math.min(open, close) - Math.random() * config.volatility;
    
    data.push({
      timestamp,
      open: Number(open.toFixed(config.decimals)),
      high: Number(high.toFixed(config.decimals)),
      low: Number(low.toFixed(config.decimals)),
      close: Number(close.toFixed(config.decimals)),
    });
    
    currentPrice = close;
  }
  
  return data;
};

export const useForexData = (selectedPair?: string) => {
  const [data, setData] = useState<ForexPair[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial data load
    setData(generateMockData());
    setHistoricalData(generateHistoricalData(selectedPair));
    setLoading(false);

    // Update data every 1 second for live MT5-style market updates
    const interval = setInterval(() => {
      const newData = generateMockData();
      setData(newData);
      
      // Update historical data with live price - update the last candle
      setHistoricalData(prevData => {
        if (prevData.length === 0) return prevData;
        
        const pairData = newData.find(p => p.pair === selectedPair);
        if (!pairData) return prevData;
        
        const updatedData = [...prevData];
        const lastCandle = updatedData[updatedData.length - 1];
        
        // Update the last candle's close price and high/low
        updatedData[updatedData.length - 1] = {
          ...lastCandle,
          close: pairData.price,
          high: Math.max(lastCandle.high, pairData.price),
          low: Math.min(lastCandle.low, pairData.price),
          timestamp: Date.now()
        };
        
        return updatedData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedPair]);

  // Update historical data when selected pair changes
  useEffect(() => {
    if (selectedPair) {
      setHistoricalData(generateHistoricalData(selectedPair));
    }
  }, [selectedPair]);

  return { data, historicalData, loading };
};