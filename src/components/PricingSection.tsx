import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { PaymentDialog } from "./PaymentDialog";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  icon: typeof Zap;
  popular?: boolean;
  savings?: string;
}

const plans: PricingPlan[] = [
  {
    id: "weekly",
    name: "Weekly Plan",
    price: 10,
    period: "week",
    description: "Perfect for testing premium features",
    icon: Zap,
    features: [
      "Full access to all forex analysis",
      "Real-time signals",
      "Premium market insights",
      "No ads",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 29,
    period: "month",
    description: "Best for active traders",
    icon: Sparkles,
    popular: true,
    savings: "Save 25% vs weekly",
    features: [
      "Everything in Weekly Plan",
      "Priority signal alerts",
      "Trend-prediction dashboard",
      "Advanced analytics tools",
    ],
  },
  {
    id: "yearly",
    name: "Yearly Plan",
    price: 199,
    period: "year",
    description: "Maximum value for professionals",
    icon: Crown,
    savings: "Save 40% overall",
    features: [
      "Everything in Monthly Plan",
      "VIP tools + long-term forecasts",
      "One-time yearly payment",
      "Priority support",
      "Exclusive market reports",
    ],
  },
];

export const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  return (
    <>
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-premium-blue via-premium-glow to-premium-gold bg-clip-text text-transparent">
              Premium Access
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock professional-grade tools and insights to maximize your trading potential
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? "border-premium-blue shadow-[0_0_30px_rgba(56,189,248,0.3)]"
                      : "border-border hover:border-premium-blue/50"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-premium-blue to-premium-gold text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-12">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-premium-blue/20 to-premium-gold/20 w-fit">
                      <Icon className="w-8 h-8 text-premium-blue" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    
                    <div className="mt-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold text-premium-gold">
                          ${plan.price}
                        </span>
                        <span className="text-muted-foreground">/{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <p className="text-sm text-premium-blue font-medium mt-2">
                          {plan.savings}
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-premium-blue shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-premium-blue to-premium-gold hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] text-white"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                      size="lg"
                    >
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-12">
            All plans include 24/7 support and a 7-day money-back guarantee
          </p>
        </div>
      </section>

      <PaymentDialog
        plan={selectedPlan}
        open={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
};
