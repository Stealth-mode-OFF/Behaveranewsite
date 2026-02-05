# Lead Submission Setup with Supabase

**Project:** jugjqgkguozarsmclgse  
**Supabase URL:** https://jugjqgkguozarsmclgse.supabase.co

---

## Quick Setup (Recommended)

### Option 1: Supabase Edge Function (Best for production)

This is the recommended approach as it provides:
- Server-side validation
- Email notifications
- CRM integration
- Anti-spam protection

**Steps:**

1. **Create Edge Function in Supabase Dashboard:**
   - Go to https://supabase.com/dashboard/project/jugjqgkguozarsmclgse/functions
   - Click "Create Function"
   - Name: `submit-lead`
   - Deploy the function (see code below)

2. **Set environment variable:**
   ```bash
   # In .env.local:
   VITE_LEAD_ENDPOINT=https://jugjqgkguozarsmclgse.supabase.co/functions/v1/submit-lead
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

---

### Option 2: Direct Database Insert (Quick start)

Simpler but less secure - good for testing.

**Steps:**

1. **Create `leads` table in Supabase SQL Editor:**

   Go to: https://supabase.com/dashboard/project/jugjqgkguozarsmclgse/sql/new

   ```sql
   -- Create leads table
   create table if not exists leads (
     id uuid primary key default uuid_generate_v4(),
     email text not null,
     name text,
     first_name text,
     last_name text,
     phone text,
     company text,
     company_size text,
     role text,
     source text not null,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Enable Row Level Security
   alter table leads enable row level security;

   -- Allow inserts from anyone (for form submissions)
   create policy "Allow anonymous inserts"
     on leads for insert
     to anon
     with check (true);

   -- Allow reading for authenticated users only (for admin)
   create policy "Allow authenticated reads"
     on leads for select
     to authenticated
     using (true);
   ```

2. **Set environment variable:**
   ```bash
   # In .env.local:
   VITE_LEAD_ENDPOINT=https://jugjqgkguozarsmclgse.supabase.co/rest/v1/leads
   ```

3. **Update lead.ts to use Supabase REST API:**

   The current `submitLead` function needs to be updated to include Supabase headers.

---

## Detailed Implementation

### Edge Function Code (Option 1)

Create this file in Supabase Functions:

**File:** `supabase/functions/submit-lead/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const { 
      email, 
      name, 
      firstName, 
      lastName, 
      phone, 
      company, 
      companySize, 
      role, 
      source 
    } = await req.json()

    // Validate required fields
    if (!email || !source) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Email and source are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^\S+@\S+$/i
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Invalid email format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Insert lead into database
    const { data, error } = await supabaseClient
      .from('leads')
      .insert({
        email,
        name: name || `${firstName || ''} ${lastName || ''}`.trim() || null,
        first_name: firstName || null,
        last_name: lastName || null,
        phone: phone || null,
        company: company || null,
        company_size: companySize || null,
        role: role || null,
        source: source
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Odeslání se nepodařilo. Zkuste to prosím znovu.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // TODO: Send email notification
    // TODO: Add to CRM (e.g., HubSpot, Pipedrive)
    
    return new Response(
      JSON.stringify({ 
        ok: true,
        leadId: data.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: 'Odeslání se nepodařilo. Zkuste to prosím znovu.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

**Deploy:**
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref jugjqgkguozarsmclgse

# Deploy function
supabase functions deploy submit-lead
```

---

### Update lead.ts for Direct API (Option 2)

If using Option 2 (direct REST API), update your `lead.ts`:

**File:** `src/app/utils/lead.ts`

Find the fetch call and update it:

```typescript
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`
  },
  body: JSON.stringify(payload),
});
```

---

## Configuration

### Update .env.local

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://jugjqgkguozarsmclgse.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Lead Endpoint - Choose ONE:
# Option 1: Edge Function (recommended)
VITE_LEAD_ENDPOINT=https://jugjqgkguozarsmclgse.supabase.co/functions/v1/submit-lead

# Option 2: Direct REST API
# VITE_LEAD_ENDPOINT=https://jugjqgkguozarsmclgse.supabase.co/rest/v1/leads
```

### Get Your Anon Key

1. Go to: https://supabase.com/dashboard/project/jugjqgkguozarsmclgse/settings/api
2. Copy the "anon public" key
3. Add it to `.env.local`

---

## Testing

### Test Lead Submission

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:5173
# Fill out any form (e.g., e-book download)
# Submit with test email: test@company.cz
# Check Supabase dashboard for new lead
```

### View Leads in Supabase

Go to: https://supabase.com/dashboard/project/jugjqgkguozarsmclgse/editor

Click on `leads` table to see submissions.

---

## Next Steps

### 1. Set up Email Notifications (Optional)

Add to Edge Function:
```typescript
// Send email via Resend, SendGrid, etc.
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'leads@echopulse.cz',
    to: 'sales@echopulse.cz',
    subject: `New Lead: ${source}`,
    html: `
      <h2>New Lead Submitted</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Source:</strong> ${source}</p>
      <p><strong>Name:</strong> ${name || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
    `
  })
})
```

### 2. CRM Integration (Optional)

Add to Edge Function:
```typescript
// HubSpot example
await fetch('https://api.hubapi.com/contacts/v1/contact', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('HUBSPOT_API_KEY')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: [
      { property: 'email', value: email },
      { property: 'firstname', value: firstName },
      { property: 'phone', value: phone },
      { property: 'lead_source', value: source }
    ]
  })
})
```

### 3. Analytics Tracking

Track form submissions:
```typescript
// In each form component after successful submission
if (window.gtag) {
  window.gtag('event', 'form_submission', {
    form_name: 'lead-capture',
    source: 'ebook'
  })
}
```

---

## Troubleshooting

### Forms show "Formulář zatím není aktivní"

**Cause:** `VITE_LEAD_ENDPOINT` not set

**Fix:**
```bash
# Add to .env.local
VITE_LEAD_ENDPOINT=https://jugjqgkguozarsmclgse.supabase.co/functions/v1/submit-lead

# Restart dev server
npm run dev
```

### "Failed to fetch" error

**Cause:** CORS not configured on Edge Function

**Fix:** Ensure Edge Function includes `corsHeaders` in all responses

### Leads not appearing in database

**Cause:** RLS policies not configured

**Fix:** Run the RLS policy SQL from Option 2 setup above

---

## Production Checklist

Before deploying:

- [ ] `VITE_LEAD_ENDPOINT` set in production environment (Vercel/Netlify)
- [ ] `VITE_SUPABASE_ANON_KEY` set in production
- [ ] Edge Function deployed (if using Option 1)
- [ ] RLS policies configured on `leads` table
- [ ] Test submission in production
- [ ] Email notifications working (if configured)
- [ ] CRM integration working (if configured)

---

## Support

**Supabase Project:** https://supabase.com/dashboard/project/jugjqgkguozarsmclgse  
**Supabase Docs:** https://supabase.com/docs/guides/functions  
**Edge Functions:** https://supabase.com/docs/guides/functions/quickstart

---

**Status:** Ready to implement  
**Recommended:** Option 1 (Edge Function) for production  
**Quick Start:** Option 2 (Direct API) for testing
