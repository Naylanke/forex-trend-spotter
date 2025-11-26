import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  payment_reference: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        setIsLoading(true);

        // Get active subscription
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .gt("end_date", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching subscription:", error);
          setIsPremium(false);
        } else if (data) {
          setSubscription(data);
          setIsPremium(true);
        } else {
          setSubscription(null);
          setIsPremium(false);
        }
      } catch (error) {
        console.error("Error in subscription fetch:", error);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();

    // Set up real-time subscription to subscription changes
    const channel = supabase
      .channel("subscription-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch subscription when changes occur
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    subscription,
    isPremium,
    isLoading,
  };
};
