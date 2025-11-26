import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Paystack webhook received');

    // Get the signature from headers
    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();

    // Verify webhook signature
    const hash = await crypto.subtle.digest(
      'SHA-512',
      new TextEncoder().encode(paystackSecretKey + body)
    );
    const expectedSignature = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const event = JSON.parse(body);
    console.log('Webhook event:', event.event);

    // Handle successful payment
    if (event.event === 'charge.success') {
      const { data } = event;
      const email = data.customer.email;
      const amount = data.amount / 100; // Convert from kobo to dollars
      const reference = data.reference;
      const metadata = data.metadata;

      console.log('Processing successful payment:', { email, amount, reference });

      // Initialize Supabase client with service role
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Get user by email
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        console.error('Error fetching users:', userError);
        throw userError;
      }

      const user = users.find(u => u.email === email);

      if (!user) {
        console.error('User not found:', email);
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Calculate subscription end date based on plan
      let endDate = new Date();
      const planId = metadata?.custom_fields?.find((f: any) => f.variable_name === 'plan_name')?.value || 'weekly';
      
      if (planId.toLowerCase().includes('weekly')) {
        endDate.setDate(endDate.getDate() + 7);
      } else if (planId.toLowerCase().includes('monthly')) {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (planId.toLowerCase().includes('yearly')) {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Create subscription record
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId.toLowerCase(),
          plan_name: planId,
          amount: amount,
          currency: data.currency || 'USD',
          status: 'active',
          payment_reference: reference,
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
        })
        .select()
        .single();

      if (subError) {
        console.error('Error creating subscription:', subError);
        throw subError;
      }

      console.log('Subscription created successfully:', subscription.id);

      return new Response(
        JSON.stringify({ success: true, subscription: subscription }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle subscription cancellation or expiry
    if (event.event === 'subscription.disable') {
      const { data } = event;
      const reference = data.subscription_code;

      console.log('Processing subscription cancellation:', reference);

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Update subscription status
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('payment_reference', reference);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }

      console.log('Subscription cancelled successfully');
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
