import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface MarketSession {
  name: string;
  timezone: string;
  openHour: number;
  closeHour: number;
}

const MARKET_SESSIONS: MarketSession[] = [
  { name: "Asian (Tokyo)", timezone: "Asia/Tokyo", openHour: 9, closeHour: 18 },
  { name: "European (London)", timezone: "Europe/London", openHour: 8, closeHour: 17 },
  { name: "New York", timezone: "America/New_York", openHour: 8, closeHour: 17 },
];

export const MarketStatus = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const isMarketOpen = (session: MarketSession): boolean => {
    try {
      const sessionTime = new Date(
        currentTime.toLocaleString("en-US", { timeZone: session.timezone })
      );
      const hour = sessionTime.getHours();
      const day = sessionTime.getDay();

      // Forex markets are closed on weekends
      if (day === 0 || day === 6) return false;

      return hour >= session.openHour && hour < session.closeHour;
    } catch (error) {
      console.error("Error checking market status:", error);
      return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Global Market Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {MARKET_SESSIONS.map((session) => {
          const isOpen = isMarketOpen(session);
          return (
            <div key={session.name} className="flex justify-between items-center">
              <span className="text-sm font-medium">{session.name}</span>
              <Badge variant={isOpen ? "default" : "secondary"}>
                {isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
          );
        })}
        <div className="pt-3 border-t text-xs text-muted-foreground">
          Markets are closed on weekends
        </div>
      </CardContent>
    </Card>
  );
};
