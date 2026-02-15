/**
 * GET /api/ares-lookup?q=<company_name>
 *
 * Proxy for the Czech ARES business registry API.
 * Searches by company name, returns top 5 matches with IČO.
 * No API key needed — ARES is a free public government service.
 *
 * We proxy server-side to avoid CORS issues from the browser.
 */

export const config = { runtime: 'edge' };

interface AresSubject {
  ico: string;
  obchodniJmeno: string;
  sidlo?: {
    textovaAdresa?: string;
    nazevObce?: string;
  };
}

interface AresResponse {
  pocetCelkem: number;
  ekonomickeSubjekty: AresSubject[];
}

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // cache 5 min
      },
    });
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
      }
    );

    if (!aresRes.ok) {
      return new Response(JSON.stringify({ results: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data: AresResponse = await aresRes.json();

    const results = (data.ekonomickeSubjekty || []).map((s) => ({
      ico: s.ico,
      name: s.obchodniJmeno,
      address: s.sidlo?.textovaAdresa || s.sidlo?.nazevObce || '',
    }));

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (err) {
    console.error('ARES lookup error:', err);
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
