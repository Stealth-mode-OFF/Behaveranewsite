import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useSearchParams } from "react-router-dom";
import { useModal } from "@/app/contexts/modal-context";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { Button } from "@/app/components/ui/button";
import { useSEO } from "@/app/hooks/use-seo";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Send,
  Wifi,
  WifiOff,
  RotateCcw,
  Calendar,
  Building2,
  Users,
  MessageCircle,
  Shield,
  Sparkles,
  Heart,
  Zap,
  ArrowRight,
  Star,
} from "lucide-react";

/* ───────────────────────────────────────────────────
 *  /scan_QR  — Event lead capture (QR mobile + kiosk)
 *
 *  Premium lead magnet with ARES autocomplete,
 *  smooth animations, and a "fun yet professional" vibe.
 *
 *  Two modes:
 *   • mobile (default): fast, minimal
 *   • kiosk (?mode=kiosk or toggle): big targets, phone required,
 *     auto-reset after submit
 * ─────────────────────────────────────────────────── */

const ENDPOINT = "/api/qr-lead";
const QUEUE_KEY = "behavera_qr_lead_queue";
const PRIVACY_URL = "/privacy-policy";
const BOOKING_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as Record<string, Record<string, string>>).env
      ?.VITE_BOOKING_URL) ||
  "https://calendly.com/josef-hofman-behavera";

/* ── Enums / Options ───────────────────────────── */

const EMPLOYEES_OPTIONS = [
  { value: "1-49", label: "1\u201349", icon: "\U0001F3E2", sub: "Mal\u00E1 firma" },
  { value: "50-199", label: "50\u2013199", icon: "\U0001F3EC", sub: "St\u0159edn\u00ED firma" },
  { value: "200-999", label: "200\u2013999", icon: "\U0001F3ED", sub: "Velk\u00E1 firma" },
  { value: "1000+", label: "1\u00A0000+", icon: "\U0001F30D", sub: "Enterprise" },
] as const;

const FEEDBACK_OPTIONS = [
  { value: "no", label: "Zat\u00EDm ne", icon: "\U0001F914", sub: "Ale zaj\u00EDm\u00E1 m\u011B to" },
  { value: "ad_hoc", label: "Ob\u010Das", icon: "\U0001F4CB", sub: "Ad hoc pr\u016Fzkumy" },
  { value: "quarterly", label: "\u010Ctvrtletn\u011B", icon: "\U0001F4C5", sub: "Pravideln\u011B" },
  { value: "monthly_plus", label: "M\u011Bs\u00ED\u010Dn\u011B+", icon: "\u26A1", sub: "Pokro\u010Dil\u00ED" },
] as const;

const ROLE_OPTIONS = [
  { value: "decision_maker", label: "Rozhoduji", icon: "\u2705", sub: "M\u00E1m to v rukou" },
  { value: "co_decision_maker", label: "Spolurozhoduji", icon: "\U0001F91D", sub: "Jsem u toho" },
  { value: "connector", label: "Propoj\u00EDm", icon: "\U0001F517", sub: "Zn\u00E1m spr\u00E1vn\u00E9ho \u010Dlov\u011Bka" },
] as const;

/* Fun thank-you messages (random pick) */
const THANK_YOU_MESSAGES = [
  { title: "Par\u00E1da, d\u00EDky!", sub: "U\u017E se na to kouk\u00E1me. \u2615" },
  { title: "Super, m\u00E1me to!", sub: "Ozveme se \u2014 bez spamu, sl\u00EDbujeme. \u270C\uFE0F" },
  { title: "D\u011Bkujeme!", sub: "Jste v dobr\u00FDch rukou. \U0001F4AA" },
  { title: "Hotovo!", sub: "Te\u010F si u\u017Eijte zbytek eventu. \U0001F389" },
  { title: "V\u00FDborn\u011B!", sub: "Uk\u00E1zku v\u00E1m po\u0161leme co nejd\u0159\u00EDv. \U0001F680" },
];

/* ── Offline queue helpers ───────────────────────── */

interface QueuedLead {
  payload: Record<string, unknown>;
  timestamp: number;
}

function getQueue(): QueuedLead[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function pushQueue(payload: Record<string, unknown>) {
  const queue = getQueue();
  queue.push({ payload, timestamp: Date.now() });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function setQueue(queue: QueuedLead[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

async function flushQueue(): Promise<number> {
  const queue = getQueue();
  if (!queue.length) return 0;
  let sent = 0;
  const remaining: QueuedLead[] = [];
  for (const item of queue) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload),
      });
      if (res.ok) {
        sent++;
      } else {
        remaining.push(item);
      }
    } catch {
      remaining.push(item);
    }
  }
  setQueue(remaining);
  return sent;
}

/* ── Phone formatter ───────────────────────────── */

function formatPhone(raw?: string): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("420")) return `+${digits}`;
  if (digits.startsWith("00420")) return `+${digits.slice(2)}`;
  return `+420${digits}`;
}

/* ── Detect iPad ───────────────────────────────── */

function isIPad(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/* ── Source params from URL ────────────────────── */

function useSourceParams() {
  const [params] = useSearchParams();
  const src = params.get("src") || undefined;
  const rep = params.get("rep") || undefined;
  const booth = params.get("booth") || undefined;
  const event = params.get("event") || undefined;

  const known = new Set(["src", "rep", "booth", "event", "mode"]);
  const meta: Record<string, string> = {};
  params.forEach((v, k) => {
    if (!known.has(k)) meta[k] = v;
  });

  return {
    src,
    rep,
    booth,
    event,
    source_meta: Object.keys(meta).length ? meta : undefined,
  };
}

/* ── ARES Company Autocomplete hook ──── */

interface AresResult {
  ico: string;
  name: string;
  address: string;
}

function useAresAutocomplete() {
  const [results, setResults] = useState<AresResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (!query || query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(`/api/ares-lookup?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("ARES error");
        const data = await res.json();
        setResults(data.results || []);
        setOpen((data.results || []).length > 0);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setResults([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return { results, loading, open, search, close };
}

/* ── Confetti burst (CSS-only, lightweight) ── */

function ConfettiBurst() {
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360;
    const distance = 60 + Math.random() * 80;
    const size = 4 + Math.random() * 6;
    const colors = ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#3b82f6"];
    const color = colors[i % colors.length];
    const delay = Math.random() * 0.3;
    return (
      <span
        key={i}
        className="absolute rounded-full opacity-0"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          left: "50%",
          top: "50%",
          animation: `confetti-burst 0.8s ease-out ${delay}s forwards`,
          // @ts-expect-error CSS custom properties
          "--tx": `${Math.cos((angle * Math.PI) / 180) * distance}px`,
          "--ty": `${Math.sin((angle * Math.PI) / 180) * distance}px`,
        }}
      />
    );
  });

  return <div className="absolute inset-0 pointer-events-none overflow-hidden">{particles}</div>;
}

/* ── Progress dots ─────────────────────────── */

function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                ${isDone ? "bg-green-500 text-white scale-90" : ""}
                ${isActive ? "bg-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/30" : ""}
                ${!isDone && !isActive ? "bg-brand-background-secondary text-brand-text-muted" : ""}
              `}
            >
              {isDone ? <Check className="w-4 h-4" /> : step}
            </div>
            {i < total - 1 && (
              <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${isDone ? "bg-green-500" : "bg-brand-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Premium chip group ─────────────────── */

function ChipGroup({
  options,
  value,
  onChange,
  isKiosk,
}: {
  options: readonly { value: string; label: string; icon?: string; sub?: string }[];
  value: string;
  onChange: (v: string) => void;
  isKiosk: boolean;
}) {
  return (
    <div className={`grid gap-2 ${options.length <= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              relative rounded-2xl border-2 text-left transition-all duration-200 select-none group
              ${isKiosk ? "p-4" : "p-3"}
              ${
                selected
                  ? "border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/10 scale-[1.02]"
                  : "border-brand-border/60 bg-white hover:border-brand-primary/40 hover:shadow-sm active:scale-[0.98]"
              }
            `}
          >
            {selected && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="flex items-center gap-2.5">
              {opt.icon && <span className={`${isKiosk ? "text-xl" : "text-lg"} shrink-0`}>{opt.icon}</span>}
              <div className="min-w-0">
                <div className={`font-semibold leading-tight ${isKiosk ? "text-base" : "text-sm"} ${selected ? "text-brand-primary" : "text-brand-text-primary"}`}>
                  {opt.label}
                </div>
                {opt.sub && (
                  <div className={`text-[11px] leading-tight mt-0.5 ${selected ? "text-brand-primary/70" : "text-brand-text-muted"}`}>
                    {opt.sub}
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 *  MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */

export function ScanQrPage() {
  const [searchParams] = useSearchParams();
  const { openBooking } = useModal();
  const sourceParams = useSourceParams();

  /* ── Mode ── */
  const [isKiosk, setIsKiosk] = useState(
    () => searchParams.get("mode") === "kiosk" || isIPad(),
  );

  /* ── Step ── */
  const [step, setStep] = useState(1);

  /* ── Form state ── */
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [employeesBucket, setEmployeesBucket] = useState("");
  const [feedbackFreq, setFeedbackFreq] = useState("");
  const [decisionRole, setDecisionRole] = useState("");
  const [consentContact, setConsentContact] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  /* ── ARES autocomplete ── */
  const ares = useAresAutocomplete();
  const companyInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Submission state ── */
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "queued"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [queueCount, setQueueCount] = useState(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [thankYou] = useState(() =>
    THANK_YOU_MESSAGES[Math.floor(Math.random() * THANK_YOU_MESSAGES.length)]
  );

  useSEO({
    title: "Behavera \u2014 Chci uk\u00E1zku Echo Pulse",
    description:
      "60 vte\u0159in a m\u00E1te uk\u00E1zku n\u00E1stroje, kter\u00FD m\u011B\u0159\u00ED engagement va\u0161ich lid\u00ED. Bez spamu, sl\u00EDbujeme.",
  });

  /* ── Close ARES on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        companyInputRef.current &&
        !companyInputRef.current.contains(e.target as Node)
      ) {
        ares.close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ares]);

  /* ── Offline queue flush ── */
  useEffect(() => {
    const onOnline = () => {
      flushQueue().then((sent) => {
        if (sent > 0) setQueueCount(getQueue().length);
      });
    };
    window.addEventListener("online", onOnline);

    if (navigator.onLine) onOnline();

    const interval = setInterval(() => {
      if (navigator.onLine) {
        flushQueue().then((sent) => {
          if (sent > 0) setQueueCount(getQueue().length);
        });
      }
    }, 30_000);

    setQueueCount(getQueue().length);

    return () => {
      window.removeEventListener("online", onOnline);
      clearInterval(interval);
    };
  }, []);

  /* ── Build payload ── */
  const buildPayload = useCallback(() => {
    return {
      company: company.trim(),
      email: email.trim().toLowerCase(),
      phone: formatPhone(phone),
      contact_name: contactName.trim() || undefined,
      phone_required: isKiosk,
      employees_bucket: employeesBucket,
      feedback_frequency: feedbackFreq,
      decision_role: decisionRole,
      consent_contact: consentContact,
      consent_marketing: consentMarketing,
      consent_privacy_url: PRIVACY_URL,
      consent_version: "v1",
      source: {
        page: "behavera.com/scan_QR",
        ...sourceParams,
      },
      client: {
        user_agent: navigator.userAgent,
        locale: navigator.language,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      _hp: honeypot,
    };
  }, [
    company, email, phone, contactName, isKiosk,
    employeesBucket, feedbackFreq, decisionRole,
    consentContact, consentMarketing, honeypot, sourceParams,
  ]);

  /* ── Reset form ── */
  const resetForm = useCallback(() => {
    setStep(1);
    setCompany("");
    setEmail("");
    setPhone("");
    setContactName("");
    setEmployeesBucket("");
    setFeedbackFreq("");
    setDecisionRole("");
    setConsentContact(false);
    setConsentMarketing(false);
    setHoneypot("");
    setStatus("idle");
    setErrorMsg("");
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  }, []);

  /* ── Submit ── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const payload = buildPayload();

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Chyba p\u0159i odes\u00EDl\u00E1n\u00ED");
      }

      setStatus("success");

      if (isKiosk) {
        resetTimerRef.current = setTimeout(resetForm, 10_000);
      }
    } catch {
      pushQueue(payload);
      setQueueCount(getQueue().length);
      setStatus("queued");

      if (isKiosk) {
        resetTimerRef.current = setTimeout(resetForm, 6_000);
      }
    }
  };

  /* ── Validation ── */
  const step1Valid =
    company.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    (!isKiosk || phone.trim().length > 0);

  const step2Valid =
    employeesBucket !== "" &&
    feedbackFreq !== "" &&
    decisionRole !== "" &&
    consentContact;

  /* ── Styles ── */
  const inputCls = `
    w-full rounded-2xl border-2 border-brand-border/60 bg-white text-brand-text-primary
    placeholder:text-brand-text-muted/40
    focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary
    transition-all duration-200 shadow-sm
    ${isKiosk ? "px-5 py-4 text-base min-h-[56px]" : "px-4 py-3.5 text-sm min-h-[48px]"}
  `;
  const labelCls = `block font-semibold text-brand-text-primary mb-1.5 ${
    isKiosk ? "text-base" : "text-sm"
  }`;

  /* ── Event badge ── */
  const eventName = sourceParams.event;

  /* ═══ RENDER ═══ */
  return (
    <>
      {!isKiosk && <Header />}
      <main className={isKiosk ? "min-h-screen bg-gradient-to-br from-white via-brand-background-secondary/30 to-brand-primary/5" : "pt-24"}>
        <section className={`${isKiosk ? "px-6 py-8" : "section-spacing"}`}>
          <div className={`mx-auto ${isKiosk ? "max-w-[600px]" : "container-default max-w-[520px]"}`}>

            {/* ── Kiosk toggle ── */}
            <div className="flex items-center justify-between mb-4">
              <div />
              <label className="inline-flex items-center gap-2 text-xs text-brand-text-muted/50 cursor-pointer select-none opacity-60 hover:opacity-100 transition-opacity">
                <input
                  type="checkbox"
                  checked={isKiosk}
                  onChange={(e) => setIsKiosk(e.target.checked)}
                  className="rounded border-brand-border"
                />
                Kiosk
              </label>
            </div>

            {/* ── Offline queue badge ── */}
            {queueCount > 0 && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800 shadow-sm">
                <WifiOff className="w-3.5 h-3.5 shrink-0" />
                {queueCount} lead{queueCount > 1 ? "\u016F" : ""} \u010Dek\u00E1 na odesl\u00E1n\u00ED
              </div>
            )}

            {/* ──── CARD WRAPPER ──── */}
            <div className="bg-white rounded-3xl shadow-xl shadow-brand-primary/5 border border-brand-border/40 overflow-hidden">

              {/* Card header with gradient */}
              <div className="bg-gradient-to-r from-brand-primary/5 via-brand-accent/5 to-brand-primary/5 px-6 py-5 border-b border-brand-border/30">
                {eventName && (
                  <div className="inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full px-3 py-1 mb-3">
                    <Sparkles className="w-3 h-3" />
                    {eventName}
                  </div>
                )}
                <h1 className={`font-bold tracking-tight leading-tight ${isKiosk ? "text-2xl" : "text-xl"}`}>
                  Chci uk{"\u00E1"}zku Echo Pulse{" "}
                  <span className="inline-block animate-bounce">{"\u26A1"}</span>
                </h1>
                <p className={`text-brand-text-muted mt-1.5 leading-relaxed ${isKiosk ? "text-sm" : "text-[13px]"}`}>
                  60 vte{"\u0159"}in a m{"\u00E1"}te jasno. Bez spamu {"\u2014"} jen konkr{"\u00E9"}tn{"\u00ED"} uk{"\u00E1"}zku, jak m{"\u011B\u0159"}it engagement.
                </p>
              </div>

              <div className="p-6">

                {/* Progress */}
                {(status === "idle" || status === "sending" || status === "error") && (
                  <StepProgress current={step} total={2} />
                )}

                {/* ── SUCCESS ── */}
                {status === "success" && (
                  <div className="relative text-center space-y-5 py-4 animate-in fade-in zoom-in-95 duration-500">
                    <ConfettiBurst />
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200/50">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className={`font-bold text-brand-text-primary ${isKiosk ? "text-2xl" : "text-xl"}`}>
                        {thankYou.title}
                      </h2>
                      <p className="text-sm text-brand-text-muted mt-1.5">{thankYou.sub}</p>

                      <div className="mt-6 space-y-3">
                        <p className="text-xs text-brand-text-muted/70">
                          Chcete rovnou 15minutovou uk{"\u00E1"}zku na{"\u017E"}ivo?
                        </p>
                        <Button
                          onClick={() => openBooking("scan_qr_success")}
                          size={isKiosk ? "lg" : "default"}
                          className="inline-flex items-center gap-2 shadow-md shadow-brand-primary/20"
                        >
                          <Calendar className="w-4 h-4" />
                          Domluvit uk{"\u00E1"}zku
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        {isKiosk && (
                          <div>
                            <Button variant="ghost" onClick={resetForm} className="text-brand-text-muted gap-1.5">
                              <RotateCcw className="w-3.5 h-3.5" />
                              Dal{"\u0161\u00ED"} kontakt
                            </Button>
                          </div>
                        )}
                      </div>

                      {isKiosk && (
                        <p className="text-[11px] text-brand-text-muted/50 mt-4">
                          Automatick{"\u00FD"} reset za p{"\u00E1"}r sekund{"\u2026"}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── QUEUED (offline) ── */}
                {status === "queued" && (
                  <div className="text-center space-y-4 py-4 animate-in fade-in duration-500">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-200/50">
                      <WifiOff className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className={`font-bold text-amber-900 ${isKiosk ? "text-2xl" : "text-xl"}`}>
                      Ulo{"\u017E"}eno offline {"\u2714\uFE0F"}
                    </h2>
                    <p className="text-sm text-amber-700">
                      Ode{"\u0161"}lu, jakmile bude internet. Klid, nic se neztr{"\u00E1"}c{"\u00ED"}.
                    </p>
                    {isKiosk && (
                      <Button variant="outline" onClick={resetForm} className="gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Dal{"\u0161\u00ED"} kontakt
                      </Button>
                    )}
                  </div>
                )}

                {/* ── FORM ── */}
                {(status === "idle" || status === "sending" || status === "error") && (
                  <form onSubmit={handleSubmit} noValidate>

                    {/* STEP 1: Contact info */}
                    {step === 1 && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <p className="text-xs text-brand-text-muted text-center mb-1">
                          {"\u2460"} Kdo jste?
                        </p>

                        {/* Company with ARES autocomplete */}
                        <div className="relative">
                          <label htmlFor="qr-company" className={labelCls}>
                            <Building2 className="w-3.5 h-3.5 inline mr-1.5 opacity-50" />
                            Firma
                          </label>
                          <div className="relative">
                            <input
                              ref={companyInputRef}
                              id="qr-company"
                              type="text"
                              required
                              autoComplete="off"
                              value={company}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setCompany(e.target.value);
                                ares.search(e.target.value);
                              }}
                              onFocus={() => {
                                if (company.trim().length >= 2) ares.search(company);
                              }}
                              placeholder={"Za\u010Dn\u011Bte ps\u00E1t n\u00E1zev firmy\u2026"}
                              className={inputCls}
                            />
                            {ares.loading && (
                              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted animate-spin" />
                            )}
                          </div>

                          {/* ARES dropdown */}
                          {ares.open && ares.results.length > 0 && (
                            <div
                              ref={dropdownRef}
                              className="absolute z-50 w-full mt-1.5 bg-white rounded-2xl border-2 border-brand-primary/20 shadow-xl shadow-brand-primary/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                            >
                              <div className="px-3 py-1.5 bg-brand-primary/5 border-b border-brand-border/30">
                                <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider">
                                  {"\U0001F50D"} Nalezeno v ARES
                                </span>
                              </div>
                              {ares.results.map((r, i) => (
                                <button
                                  key={r.ico}
                                  type="button"
                                  onClick={() => {
                                    setCompany(r.name);
                                    ares.close();
                                    document.getElementById("qr-email")?.focus();
                                  }}
                                  className={`
                                    w-full text-left px-4 py-3 hover:bg-brand-primary/5 transition-colors
                                    ${i < ares.results.length - 1 ? "border-b border-brand-border/20" : ""}
                                  `}
                                >
                                  <div className="font-medium text-sm text-brand-text-primary">{r.name}</div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] text-brand-text-muted">I{"\u010C"}O: {r.ico}</span>
                                    {r.address && (
                                      <>
                                        <span className="text-brand-border">{"\u00B7"}</span>
                                        <span className="text-[11px] text-brand-text-muted truncate">{r.address}</span>
                                      </>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Contact name */}
                        <div>
                          <label htmlFor="qr-contact" className={labelCls}>
                            <Star className="w-3.5 h-3.5 inline mr-1.5 opacity-50" />
                            Va{"\u0161"}e jm{"\u00E9"}no
                          </label>
                          <input
                            id="qr-contact"
                            type="text"
                            autoComplete="name"
                            value={contactName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setContactName(e.target.value)
                            }
                            placeholder={"Jan Nov\u00E1k"}
                            className={inputCls}
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="qr-email" className={labelCls}>
                            E-mail <span className="text-brand-primary">*</span>
                          </label>
                          <input
                            id="qr-email"
                            type="email"
                            required
                            autoComplete="email"
                            inputMode="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEmail(e.target.value)
                            }
                            placeholder="jan@acme.cz"
                            className={inputCls}
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="qr-phone" className={labelCls}>
                            Telefon{isKiosk ? <span className="text-brand-primary"> *</span> : <span className="text-brand-text-muted font-normal text-xs ml-1">(voliteln{"\u00E9"})</span>}
                          </label>
                          <input
                            id="qr-phone"
                            type="tel"
                            required={isKiosk}
                            autoComplete="tel"
                            inputMode="tel"
                            value={phone}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setPhone(e.target.value)
                            }
                            placeholder="+420 777 123 456"
                            className={inputCls}
                          />
                        </div>

                        {/* Honeypot */}
                        <div aria-hidden="true" className="absolute -left-[9999px]">
                          <input
                            tabIndex={-1}
                            autoComplete="off"
                            name="website_url"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                          />
                        </div>

                        <Button
                          type="button"
                          disabled={!step1Valid}
                          onClick={() => setStep(2)}
                          size={isKiosk ? "lg" : "default"}
                          className="w-full inline-flex items-center justify-center gap-2 mt-2 shadow-md shadow-brand-primary/20 transition-all duration-200 hover:shadow-lg"
                        >
                          {"Pokra\u010Dovat"}
                          <ChevronRight className="w-4 h-4" />
                        </Button>

                        <p className="text-center text-[11px] text-brand-text-muted/50 mt-2">
                          {"\U0001F512"} {"Bezpe\u010Dn\u011B. \u017D\u00E1dn\u00FD spam, \u017E\u00E1dn\u00E9 sd\u00EDlen\u00ED."}
                        </p>
                      </div>
                    )}

                    {/* STEP 2: Qualification + GDPR */}
                    {step === 2 && (
                      <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <p className="text-xs text-brand-text-muted text-center mb-1">
                          {"\u2461"} {"Rychl\u00E9 zac\u00EDlen\u00ED"}
                        </p>

                        {/* Back button */}
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-1.5 text-sm text-brand-text-muted hover:text-brand-primary transition-colors group"
                        >
                          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                          {"Zp\u011Bt"}
                        </button>

                        {/* Q1: Employees */}
                        <div>
                          <p className={labelCls}>
                            <Users className="w-3.5 h-3.5 inline mr-1.5 opacity-50" />
                            {"Po\u010Det zam\u011Bstnanc\u016F"} <span className="text-brand-primary">*</span>
                          </p>
                          <ChipGroup
                            options={EMPLOYEES_OPTIONS}
                            value={employeesBucket}
                            onChange={setEmployeesBucket}
                            isKiosk={isKiosk}
                          />
                        </div>

                        {/* Q2: Feedback */}
                        <div>
                          <p className={labelCls}>
                            <MessageCircle className="w-3.5 h-3.5 inline mr-1.5 opacity-50" />
                            {"Sb\u00EDr\u00E1te zp\u011Btnou vazbu?"} <span className="text-brand-primary">*</span>
                          </p>
                          <ChipGroup
                            options={FEEDBACK_OPTIONS}
                            value={feedbackFreq}
                            onChange={setFeedbackFreq}
                            isKiosk={isKiosk}
                          />
                        </div>

                        {/* Q3: Decision role */}
                        <div>
                          <p className={labelCls}>
                            <Shield className="w-3.5 h-3.5 inline mr-1.5 opacity-50" />
                            {"Va\u0161e role v rozhodnut\u00ED"} <span className="text-brand-primary">*</span>
                          </p>
                          <ChipGroup
                            options={ROLE_OPTIONS}
                            value={decisionRole}
                            onChange={setDecisionRole}
                            isKiosk={isKiosk}
                          />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-brand-border/30 pt-4">
                          <p className="text-xs text-brand-text-muted/60 mb-3 font-medium">
                            {"\U0001F4DD"} Formality (GDPR)
                          </p>

                          {/* GDPR: consent_contact */}
                          <label className="flex items-start gap-3 cursor-pointer select-none mb-3 group">
                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${consentContact ? "bg-brand-primary border-brand-primary" : "border-brand-border group-hover:border-brand-primary/50"}`}>
                              {consentContact && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input
                              type="checkbox"
                              checked={consentContact}
                              onChange={(e) => setConsentContact(e.target.checked)}
                              className="sr-only"
                            />
                            <span className="text-xs text-brand-text-body leading-relaxed">
                              {"Souhlas\u00EDm se zpracov\u00E1n\u00EDm \u00FAdaj\u016F za \u00FA\u010Delem nav\u00E1z\u00E1n\u00ED kontaktu."}{" "}
                              <a
                                href={PRIVACY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-brand-primary transition-colors"
                              >
                                {"Z\u00E1sady ochrany"}
                              </a>{" "}
                              <span className="text-brand-primary font-semibold">*</span>
                            </span>
                          </label>

                          {/* GDPR: consent_marketing */}
                          <label className="flex items-start gap-3 cursor-pointer select-none group">
                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${consentMarketing ? "bg-brand-primary border-brand-primary" : "border-brand-border group-hover:border-brand-primary/50"}`}>
                              {consentMarketing && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input
                              type="checkbox"
                              checked={consentMarketing}
                              onChange={(e) => setConsentMarketing(e.target.checked)}
                              className="sr-only"
                            />
                            <span className="text-xs text-brand-text-body leading-relaxed">
                              {"Pos\u00EDlejte mi ob\u010Das tipy a pozv\u00E1nky (\u017E\u00E1dn\u00FD spam, je to 1\u20132\u00D7 m\u011Bs\u00ED\u010Dn\u011B)."}
                            </span>
                          </label>
                        </div>

                        {/* Error */}
                        {status === "error" && (
                          <div className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3 border border-red-200 flex items-center gap-2">
                            <span className="shrink-0">{"\u26A0\uFE0F"}</span>
                            {errorMsg}
                          </div>
                        )}

                        <Button
                          type="submit"
                          disabled={!step2Valid || status === "sending"}
                          size={isKiosk ? "lg" : "default"}
                          className="w-full inline-flex items-center justify-center gap-2 mt-1 shadow-md shadow-brand-primary/20 transition-all duration-200 hover:shadow-lg"
                        >
                          {status === "sending" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {"Odes\u00EDl\u00E1m\u2026"}
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              {"Odeslat a z\u00EDskat uk\u00E1zku"}
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                )}
              </div>

              {/* Card footer */}
              <div className="px-6 py-3 bg-brand-background-secondary/30 border-t border-brand-border/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-brand-text-muted/50">
                  {navigator.onLine ? (
                    <>
                      <Wifi className="w-3 h-3 text-green-500" /> Online
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-amber-500" /> Offline
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-brand-text-muted/40">
                  <Heart className="w-3 h-3" />
                  Behavera
                </div>
              </div>
            </div>

            {/* Trust badges below card */}
            <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-brand-text-muted/40">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> GDPR compliant</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {"60s formul\u00E1\u0159"}</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3" /> Bez spamu</span>
            </div>
          </div>
        </section>
      </main>
      {!isKiosk && <Footer />}

      {/* Confetti animation keyframes */}
      <style>{`
        @keyframes confetti-burst {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.5); }
        }
      `}</style>
    </>
  );
}
