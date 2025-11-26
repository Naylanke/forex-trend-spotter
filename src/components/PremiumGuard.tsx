import { ReactNode } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const PremiumGuard = ({ children, fallback }: PremiumGuardProps) => {
  const { isPremium, isLoading } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading subscription status...</div>
      </div>
    );
  }

  if (!isPremium) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="border-premium-blue/30 bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-premium-blue/20 to-premium-gold/20 w-fit">
            <Crown className="w-12 h-12 text-premium-gold" />
          </div>
          <CardTitle className="text-2xl mb-2 flex items-center justify-center gap-2">
            <Lock className="w-6 h-6 text-premium-blue" />
            Premium Feature
          </CardTitle>
          <CardDescription className="text-base">
            Upgrade to Premium to unlock this feature
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              This feature is exclusive to Premium subscribers. Get access to:
            </p>
            <ul className="text-sm space-y-2">
              <li>✨ Advanced market analytics</li>
              <li>📊 Trend prediction dashboard</li>
              <li>🎯 Priority signal alerts</li>
              <li>🔮 Long-term forecasts</li>
            </ul>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-premium-blue to-premium-gold hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] text-white"
            size="lg"
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
