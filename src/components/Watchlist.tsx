import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, StarOff, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ForexPair } from "@/hooks/useForexData";
import { useToast } from "@/hooks/use-toast";
import { TrendIndicator } from "./TrendIndicator";

interface WatchlistProps {
  allPairs: ForexPair[];
}

export const Watchlist = ({ allPairs }: WatchlistProps) => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('currency_pair')
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setWatchlist(data?.map(item => item.currency_pair) || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async (pair: string) => {
    if (!user) return;

    try {
      const isInWatchlist = watchlist.includes(pair);
      
      if (isInWatchlist) {
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('currency_pair', pair);

        if (error) throw error;
        
        setWatchlist(prev => prev.filter(p => p !== pair));
        toast({
          title: "Removed from watchlist",
          description: `${pair} has been removed from your watchlist.`,
        });
      } else {
        const { error } = await supabase
          .from('watchlist')
          .insert({
            user_id: user.id,
            currency_pair: pair
          });

        if (error) throw error;
        
        setWatchlist(prev => [...prev, pair]);
        toast({
          title: "Added to watchlist",
          description: `${pair} has been added to your watchlist.`,
        });
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const watchlistPairs = allPairs.filter(pair => watchlist.includes(pair.pair));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>My Watchlist</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5" />
          <span>My Watchlist ({watchlist.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {watchlistPairs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pairs in your watchlist</p>
              <p className="text-sm">Click the star icon on any currency pair to add it to your watchlist</p>
            </div>
          ) : (
            watchlistPairs.map((item) => {
              const isPositive = item.change >= 0;
              
              return (
                <div
                  key={item.pair}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleWatchlist(item.pair)}
                      className="h-8 w-8"
                    >
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </Button>
                    
                    <div>
                      <div className="font-medium">{item.pair}</div>
                      <div className="text-sm text-muted-foreground">
                        H: {item.high} L: {item.low}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Vol: {item.volume.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-mono text-lg">
                      {item.price.toFixed(4)}
                    </div>
                    <TrendIndicator 
                      trend={item.trend} 
                      changePercent={item.changePercent}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {allPairs.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">All Currency Pairs</h4>
            <div className="grid gap-2">
              {allPairs.map((pair) => (
                <div key={pair.pair} className="flex items-center justify-between py-2 px-2 rounded hover:bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{pair.pair}</span>
                    <TrendIndicator 
                      trend={pair.trend} 
                      changePercent={pair.changePercent}
                      size="sm"
                      showText={false}
                    />
                    <span className="text-xs text-muted-foreground">
                      {pair.price}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleWatchlist(pair.pair)}
                    className="h-6 w-6"
                  >
                    {watchlist.includes(pair.pair) ? (
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};