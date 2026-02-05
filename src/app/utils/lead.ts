export type LeadPayload = {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  companySize?: string;
  company?: string;
  phone?: string;
  role?: string;
  source?: string;
};

export type LeadResult = {
  ok: boolean;
  error?: string;
  personId?: number;
  leadId?: string;
};

// Use Vercel serverless function for Pipedrive integration
const PIPEDRIVE_ENDPOINT = '/api/submit-lead';

// Fallback to Supabase if configured
const supabaseEndpoint = (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined) || "";

export const submitLead = async (payload: LeadPayload): Promise<LeadResult> => {
  // Try Pipedrive first (via serverless function)
  try {
    const pipedriveResponse = await fetch(PIPEDRIVE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (pipedriveResponse.ok) {
      const data = await pipedriveResponse.json();
      return { 
        ok: true, 
        personId: data.personId,
        leadId: data.leadId 
      };
    }
  } catch (error) {
    console.warn('Pipedrive submission failed, trying fallback:', error);
  }

  // Fallback to Supabase if Pipedrive fails
  if (supabaseEndpoint) {
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    
    if (supabaseKey) {
      headers["apikey"] = supabaseKey;
      headers["Authorization"] = `Bearer ${supabaseKey}`;
    }

    try {
      const response = await fetch(supabaseEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return { ok: true };
      }
    } catch {
      // Both failed
    }
  }

  return {
    ok: false,
    error: "Odeslání se nepodařilo. Zkuste to prosím znovu."
  };
};
