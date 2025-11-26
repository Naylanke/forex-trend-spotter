import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePaystackPayment } from "react-paystack";
import { Check, CreditCard, Smartphone, Wallet, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentDialogProps {
  plan: {
    name: string;
    price: number;
    period: string;
    features: string[];
  } | null;
  open: boolean;
  onClose: () => void;
}

const PAYSTACK_PUBLIC_KEY = "pk_test_your_key_here"; // Replace with actual key

export const PaymentDialog = ({ plan, open, onClose }: PaymentDialogProps) => {
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: (plan?.price || 0) * 100, // Amount in kobo (cents)
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Plan Name",
          variable_name: "plan_name",
          value: plan?.name || "",
        },
        {
          display_name: "Plan Period",
          variable_name: "plan_period",
          value: plan?.period || "",
        },
      ],
    },
  };

  const onSuccess = () => {
    setIsProcessing(false);
    toast.success("Payment Successful!", {
      description: `You've subscribed to the ${plan?.name}. Welcome to Premium!`,
    });
    onClose();
  };

  const onClose_payment = () => {
    setIsProcessing(false);
    toast.error("Payment Cancelled", {
      description: "Your payment was not completed. Please try again.",
    });
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (!email || !email.includes("@")) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address",
      });
      return;
    }

    setIsProcessing(true);
    initializePayment({
      onSuccess,
      onClose: onClose_payment,
    });
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-premium-blue to-premium-gold bg-clip-text text-transparent">
            Complete Your Subscription
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Plan Summary */}
          <div className="bg-gradient-to-br from-premium-blue/10 to-premium-gold/10 border border-premium-blue/30 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">Premium Access</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-premium-gold">
                  ${plan.price}
                </div>
                <div className="text-sm text-muted-foreground">/{plan.period}</div>
              </div>
            </div>

            <div className="space-y-2">
              {plan.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-premium-blue shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-premium-blue/30 focus:border-premium-blue"
            />
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 border border-border rounded-lg p-3 hover:border-premium-blue/50 transition-colors">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="w-4 h-4 text-premium-blue" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-3 border border-border rounded-lg p-3 hover:border-premium-blue/50 transition-colors">
                <RadioGroupItem value="mpesa" id="mpesa" />
                <Label htmlFor="mpesa" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="w-4 h-4 text-premium-gold" />
                  M-Pesa
                </Label>
              </div>
              <div className="flex items-center space-x-3 border border-border rounded-lg p-3 hover:border-premium-blue/50 transition-colors">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Wallet className="w-4 h-4 text-chart-1" />
                  PayPal
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-premium-blue to-premium-gold hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] text-white font-bold text-lg h-12 transition-all duration-300"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Confirm Payment ${plan.price}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Paystack. Your payment information is encrypted and secure.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
