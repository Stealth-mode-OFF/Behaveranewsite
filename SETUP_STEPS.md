# Quick Setup Steps

## 1. Run SQL in Supabase

1. Go to: https://supabase.com/dashboard/project/jugjqgkguozarsmclgse/sql/new
2. Copy the contents of `supabase-setup-leads.sql`
3. Paste and click "Run"
4. You should see: "Leads table created successfully! 🎉"

## 2. Get Your API Key

1. Go to: https://supabase.com/dashboard/project/jugjqgkguozarsmclgse/settings/api
2. Copy the **"anon public"** key (NOT the service_role key!)

## 3. Update .env.local

Create or update `.env.local` with:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://jugjqgkguozarsmclgse.supabase.co
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
VITE_ADMIN_ENABLED=false
VITE_ADMIN_PASSWORD=change_me

# Lead Submission Endpoint
VITE_LEAD_ENDPOINT=https://jugjqgkguozarsmclgse.supabase.co/rest/v1/leads
```

## 4. Restart Dev Server

```bash
npm run dev
```

## 5. Test a Form

1. Open http://localhost:5173
2. Scroll to the e-book section
3. Enter: test@company.cz
4. Click submit
5. Check your Supabase dashboard: https://supabase.com/dashboard/project/jugjqgkguozarsmclgse/editor
6. Click on "leads" table - you should see your test entry!

---

## What I Did

✅ Created `supabase-setup-leads.sql` - Run this to create the database table
✅ Updated `lead.ts` - Now includes Supabase authentication headers
✅ Updated `.env.local.example` - Shows the correct endpoint format

## View Your Leads

After forms are submitted, view them here:
https://supabase.com/dashboard/project/jugjqgkguozarsmclgse/editor

Click on the `leads` table.

---

That's it! Your forms will now save to Supabase. 🚀
