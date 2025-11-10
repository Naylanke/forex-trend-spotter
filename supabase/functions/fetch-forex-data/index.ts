import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FCS_API_KEY = Deno.env.get('FCS_API_KEY');
const FCS_BASE_URL = 'https://fcsapi.com/api-v3';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching forex data from FCS API...');

    // Fetch latest forex rates
    const forexResponse = await fetch(
      `${FCS_BASE_URL}/forex/latest?symbol=EUR/USD,GBP/USD,USD/JPY,AUD/USD,USD/CAD,USD/CHF,NZD/USD,EUR/GBP&access_key=${FCS_API_KEY}`
    );

    if (!forexResponse.ok) {
      throw new Error(`FCS API error: ${forexResponse.status}`);
    }

    const forexData = await forexResponse.json();
    console.log('Forex data received:', forexData);

    // Fetch metals (gold, silver)
    const metalsResponse = await fetch(
      `${FCS_BASE_URL}/forex/latest?symbol=XAU/USD,XAG/USD&access_key=${FCS_API_KEY}`
    );

    const metalsData = await metalsResponse.json();
    console.log('Metals data received:', metalsData);

    // Fetch crypto (bitcoin, ethereum)
    const cryptoResponse = await fetch(
      `${FCS_BASE_URL}/crypto/latest?symbol=BTC/USD,ETH/USD&access_key=${FCS_API_KEY}`
    );

    const cryptoData = await cryptoResponse.json();
    console.log('Crypto data received:', cryptoData);

    // Transform data to match ForexPair interface
    const transformData = (data: any, category: 'forex' | 'metals' | 'crypto') => {
      if (!data.response || !Array.isArray(data.response)) {
        return [];
      }

      return data.response.map((item: any) => {
        const price = parseFloat(item.c || item.price || item.p);
        const change = parseFloat(item.ch || 0);
        const changePercent = parseFloat(item.cp || 0);
        const high = parseFloat(item.h || price * 1.001);
        const low = parseFloat(item.l || price * 0.999);
        
        let trend: 'up' | 'down' | 'sideways' = 'sideways';
        if (Math.abs(changePercent) > 0.1) {
          trend = changePercent > 0 ? 'up' : 'down';
        }

        return {
          pair: item.s || item.symbol,
          price,
          change,
          changePercent,
          high,
          low,
          timestamp: item.t || item.tm || Date.now(),
          trend,
          volume: parseInt(item.v || '0') || Math.floor(Math.random() * 1000000) + 100000,
          category,
        };
      });
    };

    const allData = [
      ...transformData(forexData, 'forex'),
      ...transformData(metalsData, 'metals'),
      ...transformData(cryptoData, 'crypto'),
    ];

    console.log('Transformed data:', allData);

    return new Response(
      JSON.stringify({ data: allData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching forex data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
