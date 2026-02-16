/**
 * Supabase Edge Function: Submit COMPLETE onboarding data
 *
 * Receives the full onboarding payload (company, teams, members, OAuth info)
 * and persists it to Supabase + creates a Pipedrive lead.
 *
 * Secrets required:
 * - PIPEDRIVE_API_KEY (optional — lead creation skipped if missing)
 * - PIPEDRIVE_COMPANY_DOMAIN (optional, defaults to 'behavera')
 *
 * Auto-available:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { corsHeaders } from '../_shared/cors.ts'

/* ─── Types ─── */

interface TeamMember {
  name: string
  email: string
  photo?: string
}

interface TeamPayload {
  id: string
  name: string
  leaderEmail: string
  members: TeamMember[]
}

interface OnboardingPayload {
  companyName: string
  companyId?: string
  repName: string
  repEmail: string
  billingEmail?: string
  adminName?: string
  adminEmail?: string
  employeeCount?: number
  billingInterval?: 'monthly' | 'yearly'
  agreedToTerms?: boolean
  oauthProvider?: 'google' | 'microsoft' | null
  teams: TeamPayload[]
}

/* ─── Supabase helpers ─── */

async function supabasePost(
  table: string,
  body: Record<string, unknown> | Record<string, unknown>[],
  supabaseUrl: string,
  supabaseKey: string,
  returnData = false,
): Promise<Record<string, unknown>[] | null> {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: returnData ? 'return=representation' : 'return=minimal',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase ${table} insert failed (${res.status}): ${text}`)
  }

  return returnData ? res.json() : null
}

/* ─── Pipedrive helpers ─── */

async function pipedriveRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: Record<string, unknown>,
): Promise<T> {
  const apiKey = Deno.env.get('PIPEDRIVE_API_KEY')
  const domain = Deno.env.get('PIPEDRIVE_COMPANY_DOMAIN') || 'behavera'
  if (!apiKey) throw new Error('PIPEDRIVE_API_KEY not configured')

  const sep = endpoint.includes('?') ? '&' : '?'
  const url = `https://${domain}.pipedrive.com/api/v1${endpoint}${sep}api_token=${apiKey}`

  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)
  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.error || `Pipedrive error: ${response.status}`)
  }
  return data.data
}

async function findPersonByEmail(email: string): Promise<number | null> {
  try {
    const result = await pipedriveRequest<{
      items: Array<{ item: { id: number } }>
    }>(`/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true`)
    return result.items?.[0]?.item?.id ?? null
  } catch {
    return null
  }
}

async function createPipedriveLead(payload: OnboardingPayload) {
  if (!Deno.env.get('PIPEDRIVE_API_KEY')) return { personId: null, leadId: null }

  const totalMembers = payload.teams.reduce((s, t) => s + t.members.length, 0)
  const name = payload.repName || payload.repEmail.split('@')[0]

  let personId = await findPersonByEmail(payload.repEmail)
  const isExisting = !!personId

  if (!personId) {
    let orgId: number | undefined
    if (payload.companyName) {
      try {
        const org = await pipedriveRequest<{ id: number }>('/organizations', 'POST', {
          name: payload.companyName,
          visible_to: 3,
        })
        orgId = org.id
      } catch { /* org may already exist */ }
    }
    const person = await pipedriveRequest<{ id: number }>('/persons', 'POST', {
      name,
      email: [payload.repEmail],
      org_id: orgId,
      visible_to: 3,
    })
    personId = person.id
  }

  // Create lead
  const source = `onboarding:${payload.billingInterval || 'yearly'}:${totalMembers}members:${payload.teams.length}teams:${payload.oauthProvider || 'manual'}`
  const title = `[echopulse.cz/${source}] ${name} | ${payload.companyName}`

  const lead = await pipedriveRequest<{ id: string }>('/leads', 'POST', {
    title,
    person_id: personId,
  })

  // Rich note
  const teamLines = payload.teams
    .map(
      (t, i) =>
        `**Team ${i + 1}: ${t.name}** (${t.members.length} members, leader: ${t.leaderEmail || 'not set'})`,
    )
    .join('\n')

  const note = `
**🚀 Full Onboarding Submission**
**Company:** ${payload.companyName}${payload.companyId ? ` (IČO: ${payload.companyId})` : ''}
**Rep:** ${payload.repName} <${payload.repEmail}>
**Admin:** ${payload.adminName || '—'} <${payload.adminEmail || '—'}>
**Billing Email:** ${payload.billingEmail || '—'}
**Employees:** ${payload.employeeCount || '—'}
**Plan:** ${payload.billingInterval || '—'}
**OAuth:** ${payload.oauthProvider || 'manual entry'}
**Teams:** ${payload.teams.length} | **Total Members:** ${totalMembers}
${teamLines}
**Submitted:** ${new Date().toISOString()}
${isExisting ? '\n⚠️ Person already existed in Pipedrive' : ''}
  `.trim()

  await pipedriveRequest('/notes', 'POST', {
    content: note,
    lead_id: lead.id,
  })

  return { personId, leadId: lead.id }
}

/* ─── Main handler ─── */

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

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const payload: OnboardingPayload = await req.json()

    if (!payload.repEmail || !payload.companyName) {
      return new Response(
        JSON.stringify({ error: 'Email and company name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // ─── 1. Save to Supabase ───
    const submissionRows = await supabasePost(
      'onboarding_submissions',
      {
        company_name: payload.companyName,
        company_id: payload.companyId || null,
        rep_name: payload.repName,
        rep_email: payload.repEmail,
        billing_email: payload.billingEmail || null,
        admin_name: payload.adminName || null,
        admin_email: payload.adminEmail || null,
        employee_count: payload.employeeCount || null,
        billing_interval: payload.billingInterval || null,
        agreed_to_terms: payload.agreedToTerms ?? false,
        oauth_provider: payload.oauthProvider || null,
        status: 'new',
      },
      supabaseUrl,
      supabaseKey,
      true,
    )

    const submissionId = submissionRows?.[0]?.id as string
    if (!submissionId) throw new Error('Failed to get submission ID')

    // Insert teams + members
    for (let i = 0; i < payload.teams.length; i++) {
      const team = payload.teams[i]
      const teamRows = await supabasePost(
        'onboarding_teams',
        {
          submission_id: submissionId,
          name: team.name,
          leader_email: team.leaderEmail || null,
          sort_order: i,
        },
        supabaseUrl,
        supabaseKey,
        true,
      )

      const teamId = teamRows?.[0]?.id as string
      if (!teamId || team.members.length === 0) continue

      const memberRows = team.members.map((m) => ({
        team_id: teamId,
        name: m.name || '',
        email: m.email,
        photo_url: m.photo || '',
      }))

      await supabasePost('onboarding_team_members', memberRows, supabaseUrl, supabaseKey)
    }

    // ─── 2. Create Pipedrive lead ───
    let pipedriveResult = { personId: null as number | null, leadId: null as string | null }
    try {
      pipedriveResult = await createPipedriveLead(payload)

      if (pipedriveResult.personId || pipedriveResult.leadId) {
        await fetch(`${supabaseUrl}/rest/v1/onboarding_submissions?id=eq.${submissionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            pipedrive_person_id: pipedriveResult.personId,
            pipedrive_lead_id: pipedriveResult.leadId,
          }),
        })
      }
    } catch (err) {
      console.warn('Pipedrive lead creation failed (Supabase data saved):', err)
    }

    return new Response(
      JSON.stringify({
        success: true,
        submissionId,
        personId: pipedriveResult.personId,
        leadId: pipedriveResult.leadId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Onboarding submission error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to save onboarding data',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
