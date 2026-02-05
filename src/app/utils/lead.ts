export type LeadPayload = {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  companySize?: string;
  phone?: string;
  role?: string;
  source?: string;
};

export type LeadResult = {
  ok: boolean;
  error?: string;
};

const endpoint = (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined) || "";

export const submitLead = async (payload: LeadPayload): Promise<LeadResult> => {
  if (!endpoint) {
    return {
      ok: false,
      error: "Formulář zatím není aktivní. Zkuste to prosím později."
    };
  }

  // Get Supabase configuration
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  
  // Prepare headers (works for both Supabase REST API and Edge Functions)
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  
  // Add Supabase auth headers if available (for direct REST API)
  if (supabaseKey) {
    headers["apikey"] = supabaseKey;
    headers["Authorization"] = `Bearer ${supabaseKey}`;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return {
        ok: false,
        error: "Odeslání se nepodařilo. Zkuste to prosím znovu."
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Odeslání se nepodařilo. Zkuste to prosím později."
    };
  }
};
