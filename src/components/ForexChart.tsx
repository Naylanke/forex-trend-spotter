import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalData } from "@/hooks/useForexData";

interface ForexChartProps {
  data: HistoricalData[];
  title?: string;
  pair?: string;
}

export const ForexChart = ({ data, title = "Price Chart", pair = "EUR/USD" }: ForexChartProps) => {
  const chartData = data.map((item) => ({
    time: new Date(item.timestamp).toLocaleDateString(),
    price: item.close,
    fullDate: new Date(item.timestamp).toLocaleString(),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`${pair}: ${payload[0].value.toFixed(4)}`}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      );
    }
    return null;
  };

  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || 0;
  const isPositive = currentPrice >= previousPrice;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className={`text-sm font-mono ${isPositive ? 'text-bull' : 'text-bear'}`}>
            {currentPrice.toFixed(4)} {isPositive ? '↑' : '↓'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis 
                domain={['dataMin - 0.001', 'dataMax + 0.001']}
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tickFormatter={(value) => value.toFixed(4)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? "hsl(var(--bull))" : "hsl(var(--bear))"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};