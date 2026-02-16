/**
 * Supabase Edge Function: Czech ARES Business Registry Lookup
 *
 * GET /ares-lookup?q=<company_name>
 *
 * Proxy for the Czech ARES API. Searches by company name,
 * returns top 6 matches with IČO. No API key needed.
 * We proxy server-side to avoid CORS issues from the browser.
 */

import { corsHeaders } from '../_shared/cors.ts'

interface AresSubject {
  ico: string
  obchodniJmeno: string
  sidlo?: {
    textovaAdresa?: string
    nazevObce?: string
  }
}

interface AresResponse {
  pocetCelkem: number
  ekonomickeSubjekty: AresSubject[]
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const query = url.searchParams.get('q')?.trim()

  if (!query || query.length < 2) {
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    })
  }

  try {
    const aresRes = await fetch(
      'https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/vyhledat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          obchodniJmeno: query,
          start: 0,
          pocet: 6,
        }),
      },
    )

    if (!aresRes.ok) {
      return new Response(JSON.stringify({ results: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data: AresResponse = await aresRes.json()

    const results = (data.ekonomickeSubjekty || []).map((s) => ({
      ico: s.ico,
      name: s.obchodniJmeno,
      address: s.sidlo?.textovaAdresa || s.sidlo?.nazevObce || '',
    }))

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (err) {
    console.error('ARES lookup error:', err)
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
