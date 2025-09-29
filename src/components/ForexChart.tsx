import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HistoricalData } from "@/hooks/useForexData";
import { useState, useMemo } from 'react';

interface ForexChartProps {
  data: HistoricalData[];
  title?: string;
  pair?: string;
}

type TimePeriod = 'hour' | 'day' | 'month';

// Market flow detection algorithm
const detectMarketFlow = (data: HistoricalData[]) => {
  if (data.length < 3) return { signal: 'HOLD', strength: 0 };
  
  const recent = data.slice(-5); // Last 5 data points
  const prices = recent.map(d => d.close);
  
  // Calculate moving average
  const ma = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const currentPrice = prices[prices.length - 1];
  
  // Calculate price momentum
  const momentum = (currentPrice - prices[0]) / prices[0];
  
  // Calculate volatility
  const volatility = Math.sqrt(
    prices.reduce((sum, price) => sum + Math.pow(price - ma, 2), 0) / prices.length
  );
  
  // Simple RSI-like calculation
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i-1];
    if (change > 0) gains.push(change);
    else losses.push(Math.abs(change));
  }
  
  const avgGain = gains.length ? gains.reduce((a, b) => a + b, 0) / gains.length : 0;
  const avgLoss = losses.length ? losses.reduce((a, b) => a + b, 0) / losses.length : 0;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  // Determine signal
  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let strength = 0;
  
  if (momentum > 0.002 && rsi < 70 && currentPrice > ma) {
    signal = 'BUY';
    strength = Math.min(momentum * 1000, 1);
  } else if (momentum < -0.002 && rsi > 30 && currentPrice < ma) {
    signal = 'SELL';
    strength = Math.min(Math.abs(momentum) * 1000, 1);
  }
  
  return { signal, strength, rsi, momentum: momentum * 100 };
};

export const ForexChart = ({ data, title = "Price Chart", pair = "EUR/USD" }: ForexChartProps) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('day');
  
  const formatTimeByPeriod = (timestamp: number, period: TimePeriod) => {
    const date = new Date(timestamp);
    switch (period) {
      case 'hour':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'day':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case 'month':
        return date.toLocaleDateString([], { year: 'numeric', month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  };

  const chartData = useMemo(() => data.map((item) => ({
    time: formatTimeByPeriod(item.timestamp, timePeriod),
    open: item.open,
    close: item.close,
    high: item.high,
    low: item.low,
    candleColor: item.close >= item.open ? 'hsl(var(--bull))' : 'hsl(var(--bear))',
    volume: Math.random() * 1000000,
    fullDate: new Date(item.timestamp).toLocaleString(),
  })), [data, timePeriod]);

  const marketFlow = useMemo(() => detectMarketFlow(data), [data]);
  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || 0;
  const isPositive = currentPrice >= previousPrice;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <div className="space-y-1 text-xs">
            <p className="font-medium">O: {data.open.toFixed(4)}</p>
            <p className="font-medium">H: {data.high.toFixed(4)}</p>
            <p className="font-medium">L: {data.low.toFixed(4)}</p>
            <p className="font-medium">C: {data.close.toFixed(4)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Candlestick bar component
  const Candlestick = (props: any) => {
    const { x, y, width, height, payload } = props;
    const { open, close, high, low } = payload;
    
    const isPositive = close >= open;
    const color = isPositive ? 'hsl(var(--bull))' : 'hsl(var(--bear))';
    
    const bodyHeight = Math.abs(close - open) * (height / (payload.high - payload.low));
    const bodyY = y + (Math.max(high - close, high - open) * (height / (high - low)));
    
    return (
      <g>
        {/* Wick (high-low line) */}
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={y + height}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body (open-close rectangle) */}
        <rect
          x={x + width * 0.2}
          y={bodyY}
          width={width * 0.6}
          height={bodyHeight || 1}
          fill={color}
          stroke={color}
        />
      </g>
    );
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'bg-bull text-bull-foreground';
      case 'SELL': return 'bg-bear text-bear-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            <Badge className={getSignalColor(marketFlow.signal)}>
              {marketFlow.signal} {marketFlow.strength > 0 && `(${(marketFlow.strength * 100).toFixed(0)}%)`}
            </Badge>
            <span className={`text-sm font-mono ${isPositive ? 'text-bull' : 'text-bear'}`}>
              {currentPrice.toFixed(4)} {isPositive ? '↑' : '↓'}
            </span>
          </div>
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={timePeriod === 'hour' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimePeriod('hour')}
          >
            Hours
          </Button>
          <Button
            variant={timePeriod === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimePeriod('day')}
          >
            Days
          </Button>
          <Button
            variant={timePeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimePeriod('month')}
          >
            Months
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">RSI: </span>
            <span className={marketFlow.rsi > 70 ? 'text-bear' : marketFlow.rsi < 30 ? 'text-bull' : ''}>
              {marketFlow.rsi.toFixed(1)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Momentum: </span>
            <span className={marketFlow.momentum > 0 ? 'text-bull' : 'text-bear'}>
              {marketFlow.momentum.toFixed(2)}%
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Signal Strength: </span>
            <span>{(marketFlow.strength * 100).toFixed(0)}%</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis 
                domain={['dataMin - 0.002', 'dataMax + 0.002']}
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tickFormatter={(value) => value.toFixed(4)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="high"
                shape={<Candlestick />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};