import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { HistoricalData } from "@/hooks/useForexData";

interface MarketFlowAnalyzerProps {
  data: HistoricalData[];
  pair: string;
}

interface FlowAnalysis {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  indicators: {
    rsi: number;
    macd: number;
    momentum: number;
    support: number;
    resistance: number;
  };
  recommendation: string;
}

const analyzeMarketFlow = (data: HistoricalData[]): FlowAnalysis => {
  if (data.length < 20) {
    return {
      signal: 'HOLD',
      confidence: 0,
      indicators: { rsi: 50, macd: 0, momentum: 0, support: 0, resistance: 0 },
      recommendation: 'Insufficient data for analysis'
    };
  }

  const prices = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);
  
  // RSI Calculation
  const calculateRSI = (prices: number[], period = 14) => {
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i-1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  // MACD Calculation (simplified)
  const calculateMACD = (prices: number[]) => {
    const ema12 = prices.slice(-12).reduce((a, b) => a + b, 0) / 12;
    const ema26 = prices.slice(-26).reduce((a, b) => a + b, 0) / 26;
    return ema12 - ema26;
  };

  // Momentum
  const momentum = ((prices[prices.length - 1] - prices[prices.length - 10]) / prices[prices.length - 10]) * 100;

  // Support and Resistance
  const recentLows = lows.slice(-20);
  const recentHighs = highs.slice(-20);
  const support = Math.min(...recentLows);
  const resistance = Math.max(...recentHighs);

  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const currentPrice = prices[prices.length - 1];

  // Signal generation
  let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let confidence = 0;
  let recommendation = '';

  // Buy conditions
  if (rsi < 30 && macd > 0 && momentum > 1 && currentPrice > support * 1.001) {
    signal = 'BUY';
    confidence = Math.min(90, 30 + Math.abs(momentum) * 10 + (30 - rsi));
    recommendation = 'Strong upward momentum with oversold conditions. Consider buying.';
  }
  // Sell conditions
  else if (rsi > 70 && macd < 0 && momentum < -1 && currentPrice < resistance * 0.999) {
    signal = 'SELL';
    confidence = Math.min(90, 30 + Math.abs(momentum) * 10 + (rsi - 70));
    recommendation = 'Strong downward momentum with overbought conditions. Consider selling.';
  }
  // Moderate buy
  else if (rsi < 50 && momentum > 0.5 && currentPrice > support * 1.002) {
    signal = 'BUY';
    confidence = Math.min(70, 20 + momentum * 15);
    recommendation = 'Moderate upward trend. Cautious buy position.';
  }
  // Moderate sell
  else if (rsi > 50 && momentum < -0.5 && currentPrice < resistance * 0.998) {
    signal = 'SELL';
    confidence = Math.min(70, 20 + Math.abs(momentum) * 15);
    recommendation = 'Moderate downward trend. Consider taking profits.';
  }
  else {
    signal = 'HOLD';
    confidence = 40;
    recommendation = 'Market conditions are neutral. Wait for clearer signals.';
  }

  return {
    signal,
    confidence: Math.round(confidence),
    indicators: {
      rsi: Math.round(rsi * 10) / 10,
      macd: Math.round(macd * 10000) / 10000,
      momentum: Math.round(momentum * 100) / 100,
      support: Math.round(support * 10000) / 10000,
      resistance: Math.round(resistance * 10000) / 10000
    },
    recommendation
  };
};

export const MarketFlowAnalyzer = ({ data, pair }: MarketFlowAnalyzerProps) => {
  const analysis = analyzeMarketFlow(data);
  
  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return <TrendingUp className="h-4 w-4" />;
      case 'SELL': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'bg-bull text-bull-foreground';
      case 'SELL': return 'bg-bear text-bear-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-bull';
    if (confidence >= 60) return 'text-primary';
    if (confidence >= 40) return 'text-muted-foreground';
    return 'text-bear';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Market Flow Analysis</span>
          <Badge className={getSignalColor(analysis.signal)}>
            {getSignalIcon(analysis.signal)}
            {analysis.signal}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Confidence</span>
            <p className={`text-lg font-semibold ${getConfidenceColor(analysis.confidence)}`}>
              {analysis.confidence}%
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Pair</span>
            <p className="text-lg font-semibold">{pair}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Technical Indicators</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">RSI:</span>
              <span className={analysis.indicators.rsi > 70 ? 'text-bear' : analysis.indicators.rsi < 30 ? 'text-bull' : ''}>
                {analysis.indicators.rsi}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MACD:</span>
              <span className={analysis.indicators.macd > 0 ? 'text-bull' : 'text-bear'}>
                {analysis.indicators.macd}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Momentum:</span>
              <span className={analysis.indicators.momentum > 0 ? 'text-bull' : 'text-bear'}>
                {analysis.indicators.momentum}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Support:</span>
              <span>{analysis.indicators.support}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resistance:</span>
              <span>{analysis.indicators.resistance}</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Recommendation</h4>
          <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
        </div>

        {analysis.signal !== 'HOLD' && (
          <div className={`p-3 rounded-lg border ${analysis.signal === 'BUY' ? 'bg-bull/10 border-bull/20' : 'bg-bear/10 border-bear/20'}`}>
            <p className="text-sm font-medium">
              {analysis.signal === 'BUY' ? '📈 Buy Signal' : '📉 Sell Signal'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {analysis.signal === 'BUY' 
                ? 'Technical indicators suggest upward price movement'
                : 'Technical indicators suggest downward price movement'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};