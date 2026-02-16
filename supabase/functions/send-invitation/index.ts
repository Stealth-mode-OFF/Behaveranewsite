/**
 * Supabase Edge Function: Store Team Invitations
 *
 * POST /send-invitation
 *
 * Stores selected teammate invitations in Supabase.
 * GDPR: Only the emails the user EXPLICITLY selected are stored.
 *
 * Auto-available:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { corsHeaders } from '../_shared/cors.ts'

interface InvitationPayload {
  inviterEmail: string
  inviterName: string
  companyName: string
  invitees: Array<{ email: string; name?: string }>
  source: 'google' | 'microsoft' | 'manual' | 'csv'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const payload: InvitationPayload = await req.json()

    if (!payload.inviterEmail || !payload.invitees?.length) {
      return new Response(
        JSON.stringify({ error: 'inviterEmail and at least one invitee required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Cap at 100 invitations per request
    const invitees = payload.invitees.slice(0, 100)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (supabaseUrl && supabaseKey) {
      const rows = invitees.map((inv) => ({
        inviter_email: payload.inviterEmail,
        inviter_name: payload.inviterName || '',
        company_name: payload.companyName || '',
        invitee_email: inv.email,
        invitee_name: inv.name || '',
        source: payload.source || 'manual',
        status: 'pending',
        created_at: new Date().toISOString(),
      }))

      const res = await fetch(`${supabaseUrl}/rest/v1/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(rows),
      })

      if (!res.ok) {
        console.warn('Supabase invitations insert failed:', res.status, await res.text())
      }
    } else {
      console.warn('Supabase not configured')
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: invitees.length,
        message: 'Invitations queued',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('Invitation API error:', err)
    return new Response(
      JSON.stringify({
        error: 'Failed to process invitations',
        details: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
