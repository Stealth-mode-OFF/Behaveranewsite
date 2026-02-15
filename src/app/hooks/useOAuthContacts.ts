import { useState, useEffect, useCallback, useRef } from "react";

export interface OAuthContact {
  name: string;
  email: string;
  photo: string;
}

interface UseOAuthContactsReturn {
  contacts: OAuthContact[];
  loading: boolean;
  error: string | null;
  provider: "google" | "microsoft" | null;
  fetchContacts: (provider: "google" | "microsoft") => void;
  clearContacts: () => void;
}

/**
 * Hook to fetch contacts via Google/Microsoft OAuth popup flow.
 * Reusable across onboarding, invite-teammates, etc.
 */
export function useOAuthContacts(): UseOAuthContactsReturn {
  const [contacts, setContacts] = useState<OAuthContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<"google" | "microsoft" | null>(
    null
  );
  const popupTimerRef = useRef<ReturnType<typeof setInterval>>();

  // Listen for postMessage from OAuth popup
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;

      const { type, payload } = event.data || {};
      if (type !== "GOOGLE_CONTACTS" && type !== "MICROSOFT_CONTACTS") return;

      setLoading(false);
      if (popupTimerRef.current) clearInterval(popupTimerRef.current);

      if (payload?.error) {
        setError(payload.error);
        return;
      }

      const fetched: OAuthContact[] = (payload?.contacts || []).map(
        (c: { name?: string; email: string; photo?: string }) => ({
          name: c.name || "",
          email: c.email,
          photo: c.photo || "",
        })
      );

      setContacts(fetched);
      setProvider(type === "GOOGLE_CONTACTS" ? "google" : "microsoft");
      setError(null);
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const fetchContacts = useCallback((prov: "google" | "microsoft") => {
    setLoading(true);
    setError(null);

    const state = Math.random().toString(36).slice(2);
    const url =
      prov === "google"
        ? `/api/oauth/google/start?state=${state}`
        : `/api/oauth/microsoft/start?state=${state}`;

    const w = 500;
    const h = 650;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;

    const popup = window.open(
      url,
      `${prov}_oauth`,
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
    );

    // Detect popup close without response
    if (popupTimerRef.current) clearInterval(popupTimerRef.current);
    popupTimerRef.current = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(popupTimerRef.current);
        setLoading(false);
      }
    }, 500);
  }, []);

  const clearContacts = useCallback(() => {
    setContacts([]);
    setProvider(null);
    setError(null);
  }, []);

  return { contacts, loading, error, provider, fetchContacts, clearContacts };
}
