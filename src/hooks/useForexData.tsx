import { useState, useEffect } from 'react';

export interface ForexPair {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  timestamp: number;
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
    { pair: 'EUR/USD', basePrice: 1.0850 },
    { pair: 'GBP/USD', basePrice: 1.2640 },
    { pair: 'USD/JPY', basePrice: 149.50 },
    { pair: 'AUD/USD', basePrice: 0.6580 },
    { pair: 'USD/CAD', basePrice: 1.3450 },
    { pair: 'USD/CHF', basePrice: 0.8950 },
    { pair: 'NZD/USD', basePrice: 0.5980 },
    { pair: 'EUR/GBP', basePrice: 0.8590 },
  ];

  return pairs.map(({ pair, basePrice }) => {
    const change = (Math.random() - 0.5) * 0.01;
    const price = basePrice + change;
    const changePercent = (change / basePrice) * 100;
    
    return {
      pair,
      price: Number(price.toFixed(4)),
      change: Number(change.toFixed(4)),
      changePercent: Number(changePercent.toFixed(2)),
      high: Number((price + Math.random() * 0.005).toFixed(4)),
      low: Number((price - Math.random() * 0.005).toFixed(4)),
      timestamp: Date.now(),
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

    // Update data every 5 seconds to simulate real-time updates
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { data, historicalData, loading };
};