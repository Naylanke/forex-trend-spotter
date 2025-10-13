import { useState } from "react";
import { Header } from "./Header";
import { Settings } from "./Settings";
import { MarketOverview } from "./MarketOverview";
import { ForexChart } from "./ForexChart";
import { MarketFlowAnalyzer } from "./MarketFlowAnalyzer";
import { Watchlist } from "./Watchlist";
import { TradingSessionSelector, type TradingSession } from "./TradingSessionSelector";
import { MarketStatus } from "./MarketStatus";
import { OfflineDetector } from "./OfflineDetector";
import { useForexData } from "@/hooks/useForexData";
import { Skeleton } from "@/components/ui/skeleton";

export const Dashboard = () => {
  const [selectedPair, setSelectedPair] = useState("EUR/USD");
  const [tradingSession, setTradingSession] = useState<TradingSession>("european");
  const { data: forexData, historicalData, loading } = useForexData(selectedPair, tradingSession);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleNavigation = (page: string) => {
    if (page === 'download') {
      window.location.href = '/download';
    } else {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onNavigate={setCurrentPage} />
        <div className="container mx-auto p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div>
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[500px] w-full" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "settings") {
    return (
      <div className="min-h-screen bg-background">
        <Header onNavigate={setCurrentPage} />
        <Settings />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OfflineDetector />
      <Header onNavigate={handleNavigation} />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Forex Market Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time forex market analysis and insights
          </p>
        </div>

        {/* Trading Session Selector */}
        <TradingSessionSelector 
          selectedSession={tradingSession}
          onSessionChange={setTradingSession}
        />

        {/* Main Charts and Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ForexChart 
              data={historicalData} 
              title={`${selectedPair} Price Chart`}
              pair={selectedPair}
            />
          </div>
          
          <div>
            <MarketOverview 
              data={forexData} 
              onPairSelect={setSelectedPair}
            />
          </div>
        </div>

        {/* Market Flow Analysis */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <MarketFlowAnalyzer 
              data={historicalData}
              pair={selectedPair}
            />
          </div>
          
          <div>
            <Watchlist allPairs={forexData} />
          </div>
          
          <div className="space-y-6">
            {/* Market Status */}
            <MarketStatus />
            
            {/* Market Summary Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Market Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Pairs Tracked</span>
                    <span className="font-medium">{forexData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pairs Up</span>
                    <span className="font-medium text-bull">
                      {forexData.filter(p => p.change >= 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pairs Down</span>
                    <span className="font-medium text-bear">
                      {forexData.filter(p => p.change < 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Movers */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Movers</h3>
                <div className="space-y-3">
                  {forexData
                    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
                    .slice(0, 3)
                    .map((pair) => (
                      <div key={pair.pair} className="flex justify-between items-center">
                        <span className="font-medium">{pair.pair}</span>
                        <span className={`font-mono ${pair.change >= 0 ? 'text-bull' : 'text-bear'}`}>
                          {pair.change >= 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};