/**
 * Vercel Edge Function: Create Stripe Checkout Session (Embedded mode)
 *
 * Creates a Stripe Checkout subscription session for paid plans (monthly/yearly).
 * Uses embedded UI mode so checkout renders in an overlay on the page.
 * Uses raw fetch to Stripe REST API (no npm packages needed for Edge runtime).
 *
 * Environment variables required:
 * - STRIPE_SECRET_KEY
 * - SUPABASE_URL (or VITE_SUPABASE_URL)
 * - SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)
 */

export const config = { runtime: 'edge' };

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY not configured');
    return json({ error: 'Payment system not configured' }, 500);
  }

  try {
    const body = await request.json();
    const {
      submissionId,
      billingInterval,
      employeeCount,
      currency,
      customerEmail,
      companyName,
    } = body as {
      submissionId: string;
      billingInterval: 'monthly' | 'yearly';
      employeeCount: number;
      currency: 'eur' | 'czk';
      customerEmail: string;
      companyName: string;
    };

    if (!submissionId || !billingInterval || !employeeCount || !customerEmail) {
      return json({ error: 'Missing required fields' }, 400);
    }

    // Price logic — matches frontend exactly
    const unitAmount = currency === 'eur'
      ? (billingInterval === 'yearly' ? 400 : 500)     // €4 or €5 in cents
      : (billingInterval === 'yearly' ? 9900 : 12900); // 99 or 129 CZK in haléře

    const interval = billingInterval === 'yearly' ? 'year' : 'month';
    const planLabel = billingInterval === 'yearly' ? 'Annual' : 'Monthly';

    // Build origin for return URL
    const origin = request.headers.get('origin')
      || request.headers.get('referer')?.replace(/\/[^/]*$/, '')
      || 'https://www.behavera.com';

    // Create Stripe Checkout Session — EMBEDDED mode
    const params = new URLSearchParams({
      'mode': 'subscription',
      'ui_mode': 'embedded',
      'return_url': `${origin}/start?success=true&session_id={CHECKOUT_SESSION_ID}`,
      'redirect_on_completion': 'if_required',
      'customer_email': customerEmail,
      'line_items[0][price_data][currency]': currency,
      'line_items[0][price_data][product_data][name]': `Behavera — ${planLabel} plan`,
      'line_items[0][price_data][product_data][description]': `People analytics platform — ${employeeCount} employees`,
      'line_items[0][price_data][unit_amount]': String(unitAmount),
      'line_items[0][price_data][recurring][interval]': interval,
      'line_items[0][quantity]': String(employeeCount),
      'metadata[submissionId]': submissionId,
      'metadata[companyName]': companyName || '',
      'metadata[billingInterval]': billingInterval,
      'metadata[employeeCount]': String(employeeCount),
      'billing_address_collection': 'required',
      'tax_id_collection[enabled]': 'true',
    });

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe error:', session.error);
      return json({ error: session.error?.message || 'Failed to create checkout session' }, 400);
    }

    // Update Supabase submission with Stripe session ID (fire & forget)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      fetch(`${supabaseUrl}/rest/v1/onboarding_submissions?id=eq.${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          stripe_session_id: session.id,
          payment_status: 'checkout_started',
        }),
      }).catch(err => console.warn('Failed to update Supabase with Stripe session:', err));
    }

    return json({ clientSecret: session.client_secret, sessionId: session.id });

  } catch (err) {
    console.error('Checkout session error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
}
