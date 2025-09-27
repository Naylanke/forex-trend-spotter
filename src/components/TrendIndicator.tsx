import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'sideways';
  changePercent: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const TrendIndicator = ({ 
  trend, 
  changePercent, 
  size = 'md',
  showText = true 
}: TrendIndicatorProps) => {
  const getIcon = () => {
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    
    switch (trend) {
      case 'up':
        return <TrendingUp className={`${iconSize} text-bull`} />;
      case 'down':
        return <TrendingDown className={`${iconSize} text-bear`} />;
      default:
        return <Minus className={`${iconSize} text-muted-foreground`} />;
    }
  };

  const getVariant = () => {
    switch (trend) {
      case 'up':
        return 'default';
      case 'down':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getText = () => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const getTextColor = () => {
    if (trend === 'up') return 'text-bull';
    if (trend === 'down') return 'text-bear';
    return 'text-muted-foreground';
  };

  if (!showText) {
    return getIcon();
  }

  return (
    <Badge variant={getVariant()} className="flex items-center space-x-1">
      {getIcon()}
      {showText && (
        <span className={`font-mono ${getTextColor()}`}>
          {getText()}
        </span>
      )}
    </Badge>
  );
};