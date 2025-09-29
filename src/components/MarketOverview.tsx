import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";
import { ForexPair } from "@/hooks/useForexData";
import { TrendIndicator } from "./TrendIndicator";
import { useState } from "react";

interface MarketOverviewProps {
  data: ForexPair[];
  onPairSelect?: (pair: string) => void;
}

export const MarketOverview = ({ data, onPairSelect }: MarketOverviewProps) => {
  const [showAll, setShowAll] = useState(false);
  const forexPairs = data.filter(pair => pair.category === 'forex');
  const metalsPairs = data.filter(pair => pair.category === 'metals');
  const cryptoPairs = data.filter(pair => pair.category === 'crypto');

  const PairList = ({ pairs }: { pairs: ForexPair[] }) => (
    <div className="space-y-3">
      {pairs.map((pair) => (
        <div 
          key={pair.pair} 
          className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
          onClick={() => onPairSelect?.(pair.pair)}
        >
          <div>
            <div className="font-medium">{pair.pair}</div>
            <div className="text-sm text-muted-foreground">
              H: {pair.high} L: {pair.low}
            </div>
            <div className="text-xs text-muted-foreground">
              Vol: {pair.volume.toLocaleString()}
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <div className="font-mono">{pair.price}</div>
            <TrendIndicator 
              trend={pair.trend} 
              changePercent={pair.changePercent}
              size="sm"
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Market Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forex" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forex">Forex</TabsTrigger>
            <TabsTrigger value="metals">Metals</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forex" className="mt-4">
            <PairList pairs={showAll ? forexPairs : forexPairs.slice(0, 6)} />
          </TabsContent>
          
          <TabsContent value="metals" className="mt-4">
            <PairList pairs={metalsPairs} />
          </TabsContent>
          
          <TabsContent value="crypto" className="mt-4">
            <PairList pairs={cryptoPairs} />
          </TabsContent>
        </Tabs>
        
        {forexPairs.length > 6 && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'View All Markets'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};