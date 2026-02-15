import { useState, useEffect, useCallback, useRef } from "react";

export interface AresResult {
  ico: string;
  name: string;
  address: string;
}

interface UseAresLookupReturn {
  results: AresResult[];
  loading: boolean;
  search: (query: string) => void;
  clear: () => void;
}

/**
 * Hook to search the Czech ARES business registry by company name.
 * Debounced — triggers after 300ms of inactivity, min 3 chars.
 */
export function useAresLookup(): UseAresLookupReturn {
  const [results, setResults] = useState<AresResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback((query: string) => {
    // Clear previous debounce
    if (timerRef.current) clearTimeout(timerRef.current);

    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    timerRef.current = setTimeout(async () => {
      // Abort previous request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/ares-lookup?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          setResults([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setResults(data.results || []);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return { results, loading, search, clear };
}
