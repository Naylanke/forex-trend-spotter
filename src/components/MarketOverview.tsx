import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ForexPair } from "@/hooks/useForexData";

interface MarketOverviewProps {
  data: ForexPair[];
  onPairSelect?: (pair: string) => void;
}

export const MarketOverview = ({ data, onPairSelect }: MarketOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Market Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {data.map((item) => {
            const isPositive = item.change >= 0;
            
            return (
              <div
                key={item.pair}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onPairSelect?.(item.pair)}
              >
                <div>
                  <div className="font-medium">{item.pair}</div>
                  <div className="text-sm text-muted-foreground">
                    H: {item.high} L: {item.low}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-mono text-lg">
                    {item.price.toFixed(4)}
                  </div>
                  <div className="flex items-center space-x-1">
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 text-bull" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-bear" />
                    )}
                    <Badge 
                      variant={isPositive ? "default" : "destructive"}
                      className={isPositive ? "bg-bull hover:bg-bull/80" : ""}
                    >
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};