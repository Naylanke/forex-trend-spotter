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

const generateHistoricalData = (days: number = 30): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const basePrice = 1.0850;
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000);
    const open = currentPrice;
    const change = (Math.random() - 0.5) * 0.02;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 0.01;
    const low = Math.min(open, close) - Math.random() * 0.01;
    
    data.push({
      timestamp,
      open: Number(open.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      close: Number(close.toFixed(4)),
    });
    
    currentPrice = close;
  }
  
  return data;
};

export const useForexData = () => {
  const [data, setData] = useState<ForexPair[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial data load
    setData(generateMockData());
    setHistoricalData(generateHistoricalData());
    setLoading(false);

    // Update data every 1 second for live MT5-style market updates
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { data, historicalData, loading };
};