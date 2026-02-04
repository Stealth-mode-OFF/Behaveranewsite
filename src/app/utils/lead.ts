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

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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
