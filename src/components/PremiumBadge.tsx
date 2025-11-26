import { Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

export const PremiumBadge = () => {
  const { isPremium, subscription } = useSubscription();

  if (!isPremium) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-premium-blue/20 to-premium-gold/20 border border-premium-gold/30">
      <Crown className="w-4 h-4 text-premium-gold" />
      <span className="text-xs font-semibold text-premium-gold">
        {subscription?.plan_name || "Premium"}
      </span>
    </div>
  );
};
