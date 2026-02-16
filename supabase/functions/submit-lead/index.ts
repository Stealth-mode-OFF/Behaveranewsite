/**
 * Supabase Edge Function: Submit Lead to Pipedrive + Supabase
 *
 * Receives lead data from the frontend and:
 * 1. Validates the input
 * 2. Checks for duplicate person in Pipedrive (by email)
 * 3. Creates or updates Person + Lead in Pipedrive
 * 4. Stores in Supabase leads table as backup
 *
 * Secrets required:
 * - PIPEDRIVE_API_KEY
 * - PIPEDRIVE_COMPANY_DOMAIN (optional, defaults to 'behavera')
 *
 * Auto-available in Edge Functions:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { corsHeaders } from '../_shared/cors.ts'

interface LeadPayload {
  email: string
  name?: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  companySize?: string
  role?: string
  source?: string
}

// ─── Pipedrive helpers ───

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
    throw new Error(data.error || `Pipedrive API error: ${response.status}`)
  }
  return data.data
}

async function findPersonByEmail(email: string): Promise<number | null> {
  try {
    const result = await pipedriveRequest<{
      items: Array<{ item: { id: number; name: string; emails: string[] } }>
    }>(`/persons/search?term=${encodeURIComponent(email)}&fields=email&exact_match=true`)
    return result.items?.[0]?.item?.id ?? null
  } catch {
    return null
  }
}

// ─── Supabase backup ───

async function saveToSupabase(payload: LeadPayload & { source: string }): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseKey) {
    console.log('Supabase not configured, skipping backup')
    return
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        email: payload.email,
        name: payload.name || payload.firstName,
        phone: payload.phone,
        company: payload.company,
        company_size: payload.companySize,
        role: payload.role,
        source: payload.source,
        created_at: new Date().toISOString(),
      }),
    })
    if (!res.ok) console.warn('Supabase backup failed:', res.status)
  } catch (error) {
    console.warn('Supabase backup error:', error)
  }
}

// ─── Main handler ───

Deno.serve(async (req) => {
  // CORS preflight
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
    const payload: LeadPayload = await req.json()

    if (!payload.email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const source = payload.source
      ? `echopulse.cz/${payload.source}`
      : 'echopulse.cz'

    const name =
      payload.name ||
      (payload.firstName && payload.lastName
        ? `${payload.firstName} ${payload.lastName}`
        : null) ||
      payload.firstName ||
      payload.email.split('@')[0]

    // Save to Supabase (fire-and-forget)
    saveToSupabase({ ...payload, source })

    // 1. Deduplicate person
    let personId = await findPersonByEmail(payload.email)
    let isExisting = false

    if (personId) {
      isExisting = true
      if (payload.phone) {
        try {
          await pipedriveRequest(`/persons/${personId}`, 'PUT', {
            phone: [{ value: payload.phone, primary: true }],
          })
        } catch { /* ignore */ }
      }
    } else {
      // Create organization if company provided
      let organizationId: number | undefined
      if (payload.company) {
        try {
          const org = await pipedriveRequest<{ id: number }>('/organizations', 'POST', {
            name: payload.company,
            visible_to: 3,
          })
          organizationId = org.id
        } catch { /* org may exist */ }
      }

      // Create person
      const person = await pipedriveRequest<{ id: number }>('/persons', 'POST', {
        name,
        email: [payload.email],
        phone: payload.phone ? [payload.phone] : undefined,
        org_id: organizationId,
        visible_to: 3,
      })
      personId = person.id
    }

    // 2. Create lead
    const sizeLabel = payload.companySize ? ` | ${payload.companySize}` : ''
    const roleLabel = payload.role ? ` | ${payload.role}` : ''
    const leadTitle = `[${source}] ${name}${sizeLabel}${roleLabel}`

    const lead = await pipedriveRequest<{ id: string }>('/leads', 'POST', {
      title: leadTitle,
      person_id: personId,
    })

    // 3. Add note
    const noteContent = `
**Website Source:** ${source}
**Company Size:** ${payload.companySize || 'Not specified'}
**Role:** ${payload.role || 'Not specified'}
**Phone:** ${payload.phone || 'Not provided'}
**Company:** ${payload.company || 'Not provided'}
**Submitted:** ${new Date().toISOString()}
${isExisting ? '\n⚠️ Note: This person already existed in Pipedrive' : ''}
    `.trim()

    await pipedriveRequest('/notes', 'POST', {
      content: noteContent,
      lead_id: lead.id,
    })

    return new Response(
      JSON.stringify({ success: true, personId, leadId: lead.id, isExisting }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Submit lead error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to create lead',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
