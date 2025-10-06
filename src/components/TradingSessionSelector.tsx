import { Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export type TradingSession = 'asian' | 'european' | 'london' | 'newyork';

interface TradingSessionSelectorProps {
  selectedSession: TradingSession;
  onSessionChange: (session: TradingSession) => void;
}

const sessionInfo: Record<TradingSession, { label: string; time: string; emoji: string }> = {
  asian: { label: 'Asian', time: '00:00-09:00 GMT', emoji: '🌏' },
  european: { label: 'European', time: '08:00-17:00 GMT', emoji: '🇪🇺' },
  london: { label: 'London', time: '08:00-16:30 GMT', emoji: '🇬🇧' },
  newyork: { label: 'New York', time: '13:00-22:00 GMT', emoji: '🇺🇸' },
};

export const TradingSessionSelector = ({ selectedSession, onSessionChange }: TradingSessionSelectorProps) => {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Trading Session</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {(Object.keys(sessionInfo) as TradingSession[]).map((session) => {
          const info = sessionInfo[session];
          const isSelected = selectedSession === session;
          
          return (
            <button
              key={session}
              onClick={() => onSessionChange(session)}
              className={cn(
                "flex flex-col items-start p-3 rounded-lg border transition-all",
                "hover:bg-accent hover:text-accent-foreground",
                isSelected && "bg-primary/10 border-primary"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{info.emoji}</span>
                <span className="font-medium text-sm">{info.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">{info.time}</span>
              {isSelected && (
                <Badge variant="default" className="mt-2 text-xs">
                  Active
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};