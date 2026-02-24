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
  ArrowRight,
  Search,
  Clock,
  User,
  Mail,
  Phone,
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

/* ══ Chip option data ════════════════════════ */

const EMPLOYEES_OPTIONS = [
  { value: "1-49", label: "1–49", sub: "Malá firma" },
  { value: "50-199", label: "50–199", sub: "Střední firma" },
  { value: "200-999", label: "200–999", sub: "Velká firma" },
  { value: "1000+", label: "1\u00a0000+", sub: "Enterprise" },
] as const;

const FEEDBACK_OPTIONS = [
  { value: "no", label: "Zatím ne", sub: "Ale zajímá mě to" },
  { value: "ad_hoc", label: "Občas", sub: "Ad hoc průzkumy" },
  { value: "quarterly", label: "Čtvrtletně", sub: "Pravidelně" },
  { value: "monthly_plus", label: "Měsíčně+", sub: "Pokročilí" },
] as const;

const ROLE_OPTIONS = [
  { value: "decision_maker", label: "Rozhoduji", sub: "Mám to v rukou" },
  { value: "co_decision_maker", label: "Spolurozhoduji", sub: "Jsem u toho" },
  { value: "connector", label: "Propojím", sub: "Znám správného člověka" },
] as const;

/* Random thank-you messages */
const THANK_YOU_MESSAGES = [
  { title: "Paráda, díky!", sub: "Už se na to koukáme. Ozveme se brzy." },
  { title: "Super, máme to!", sub: "Ozveme se — bez spamu, slíbujeme." },
  { title: "Děkujeme!", sub: "Jste v dobrých rukou." },
  { title: "Hotovo!", sub: "Teď si užijte zbytek eventu." },
  { title: "Výborně!", sub: "Ukázku vám pošleme co nejdřív." },
];

/* ══ Offline queue helpers ═════════════════ */

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
      if (res.ok) sent++;
      else remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }
  setQueue(remaining);
  return sent;
}

/* ══ Phone formatter ═══════════════════ */

function formatPhone(raw?: string): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("420")) return `+${digits}`;
  if (digits.startsWith("00420")) return `+${digits.slice(2)}`;
  return `+420${digits}`;
}

/* ══ iPad detect ═════════════════════ */

function isIPad(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/* ══ Source params from URL ══════════════ */

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

/* ══ ARES Company Autocomplete ════════════ */

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
        const res = await fetch(
          `/api/ares-lookup?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("ARES error");
        const data = await res.json();
        const r = data.results || [];
        setResults(r);
        setOpen(r.length > 0);
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

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return { results, loading, open, search, close };
}

/* ══ Connectivity hook (reactive) ══════════ */

function useOnlineStatus() {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

/* ══ Confetti component ══════════════════ */

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 400;
    const H = 300;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const colors = ["#7c3aed", "#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#3b82f6", "#8b5cf6", "#f97316"];
    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; rotation: number; spin: number;
      opacity: number; shape: number;
    }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: W / 2,
        y: H / 2 - 20,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 3,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 15,
        opacity: 1,
        shape: Math.floor(Math.random() * 3), // 0=rect, 1=circle, 2=triangle
      });
    }

    let frame = 0;
    const maxFrames = 90;

    function draw() {
      if (frame >= maxFrames) return;
      frame++;
      ctx!.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.vy += 0.25; // gravity
        p.vx *= 0.98; // air resistance
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.opacity = Math.max(0, 1 - frame / maxFrames);

        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.fillStyle = p.color;

        if (p.shape === 0) {
          ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (p.shape === 1) {
          ctx!.beginPath();
          ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          ctx!.beginPath();
          ctx!.moveTo(0, -p.size / 2);
          ctx!.lineTo(p.size / 2, p.size / 2);
          ctx!.lineTo(-p.size / 2, p.size / 2);
          ctx!.closePath();
          ctx!.fill();
        }
        ctx!.restore();
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

/* ══ Step indicator ═════════════════════ */

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: total }, (_, i) => {
        const s = i + 1;
        const done = s < current;
        const active = s === current;
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-500 ease-out
                  ${done ? "bg-green-500 text-white shadow-md shadow-green-500/25" : ""}
                  ${active ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 ring-4 ring-brand-primary/10" : ""}
                  ${!done && !active ? "bg-brand-background-secondary text-brand-text-muted border border-brand-border" : ""}
                `}
              >
                {done ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-[10px] font-medium transition-colors duration-300 ${active ? "text-brand-primary" : "text-brand-text-muted/60"}`}>
                {s === 1 ? "Kontakt" : "Upresnení"}
              </span>
            </div>
            {i < total - 1 && (
              <div className={`w-12 h-[2px] rounded-full transition-all duration-500 mb-5 ${done ? "bg-green-500" : "bg-brand-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══ Chip selector ═════════════════════ */

function ChipGroup({
  options,
  value,
  onChange,
  isKiosk,
  compact,
}: {
  options: readonly { value: string; label: string; sub?: string }[];
  value: string;
  onChange: (v: string) => void;
  isKiosk: boolean;
  compact: boolean;
}) {
  const gridClass = options.length <= 3
    ? (compact ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3")
    : (compact ? "grid-cols-4" : "grid-cols-2");

  return (
    <div className={`grid ${compact ? "gap-1.5" : "gap-2.5"} ${gridClass}`}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              relative rounded-xl border-2 text-left transition-all duration-200 select-none group
              ${compact ? "p-2" : isKiosk ? "p-4" : "p-3"}
              ${
                selected
                  ? "border-brand-primary bg-gradient-to-br from-brand-primary/[0.06] to-brand-primary/[0.02] shadow-md shadow-brand-primary/10"
                  : "border-brand-border bg-white hover:border-brand-primary/30 hover:bg-brand-background-secondary/50 active:scale-[0.97]"
              }
            `}
          >
            {selected && (
              <div className={`absolute ${compact ? "-top-1 -right-1 w-4 h-4" : "-top-2 -right-2 w-5 h-5"} bg-brand-primary rounded-full flex items-center justify-center shadow-md shadow-brand-primary/30 animate-in zoom-in-50 duration-200`}>
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
            <div className="min-w-0">
              <div className={`font-semibold leading-tight ${compact ? "text-[11px]" : isKiosk ? "text-base" : "text-sm"} ${selected ? "text-brand-primary" : "text-brand-text-primary"}`}>
                {opt.label}
              </div>
              {!compact && opt.sub && (
                <div className={`text-[11px] leading-tight mt-0.5 ${selected ? "text-brand-primary/60" : "text-brand-text-muted"}`}>
                  {opt.sub}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ══ Custom checkbox ════════════════════ */

function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none group py-1.5">
      <div
        className={`
          mt-0.5 w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center shrink-0
          transition-all duration-200 ease-out
          ${checked
            ? "bg-brand-primary border-brand-primary shadow-sm shadow-brand-primary/20"
            : "border-brand-border-strong bg-white group-hover:border-brand-primary/50"
          }
        `}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {children}
    </label>
  );
}

/* ═════════════════════════════════════════════════
 *  MAIN COMPONENT
 * ═════════════════════════════════════════════════ */

export function ScanQrPage() {
  const [searchParams] = useSearchParams();
  const { openBooking } = useModal();
  const sourceParams = useSourceParams();
  const isOnline = useOnlineStatus();

  /* Mode */
  const [isKiosk, setIsKiosk] = useState(
    () => searchParams.get("mode") === "kiosk" || isIPad(),
  );

  /* Step */
  const [step, setStep] = useState(1);

  /* Form state */
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

  /* ARES autocomplete */
  const ares = useAresAutocomplete();
  const companyInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Submission */
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "queued"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [queueCount, setQueueCount] = useState(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [thankYou] = useState(() =>
    THANK_YOU_MESSAGES[Math.floor(Math.random() * THANK_YOU_MESSAGES.length)],
  );
  const [viewportHeight, setViewportHeight] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerHeight : 900,
  );

  useSEO({
    title: "Behavera — Chci ukázku Echo Pulse",
    description:
      "60 vteřin a máte ukázku nástroje, který měří engagement vašich lidí. Bez spamu, slíbujeme.",
  });

  useEffect(() => {
    const updateViewport = () => setViewportHeight(window.innerHeight);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  /* Close ARES dropdown on outside click */
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

  /* Offline queue flush */
  useEffect(() => {
    const flush = () => {
      if (!navigator.onLine) return;
      flushQueue().then((sent) => {
        if (sent > 0) setQueueCount(getQueue().length);
      });
    };
    window.addEventListener("online", flush);
    flush();
    const interval = setInterval(flush, 30_000);
    setQueueCount(getQueue().length);
    return () => {
      window.removeEventListener("online", flush);
      clearInterval(interval);
    };
  }, []);

  /* Build payload */
  const buildPayload = useCallback(() => ({
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
    source: { page: "behavera.com/scan_QR", ...sourceParams },
    client: {
      user_agent: navigator.userAgent,
      locale: navigator.language,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    _hp: honeypot,
  }), [
    company, email, phone, contactName, isKiosk,
    employeesBucket, feedbackFreq, decisionRole,
    consentContact, consentMarketing, honeypot, sourceParams,
  ]);

  /* Reset */
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

  /* Submit */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const payload = buildPayload();

    if (!navigator.onLine) {
      pushQueue(payload);
      setQueueCount(getQueue().length);
      setStatus("queued");
      if (isKiosk) resetTimerRef.current = setTimeout(resetForm, 6_000);
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Chyba při odesílání");
      }

      setStatus("success");
      if (isKiosk) resetTimerRef.current = setTimeout(resetForm, 10_000);
    } catch (err) {
      if (!navigator.onLine || (err instanceof TypeError && err.message === "Failed to fetch")) {
        pushQueue(payload);
        setQueueCount(getQueue().length);
        setStatus("queued");
        if (isKiosk) resetTimerRef.current = setTimeout(resetForm, 6_000);
      } else {
        setErrorMsg((err as Error).message || "Něco se pokazilo. Zkuste to znovu.");
        setStatus("error");
      }
    }
  };

  /* Validation */
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const step1Valid =
    company.trim().length > 0 &&
    emailValid &&
    (!isKiosk || phone.trim().length > 0);

  const step2Valid =
    employeesBucket !== "" &&
    feedbackFreq !== "" &&
    decisionRole !== "" &&
    consentContact;

  /* Input classes using design tokens */
  const inputCls = `
    w-full bg-white text-brand-text-primary border
    placeholder:text-brand-text-muted/50
    focus:outline-none focus:ring-[3px] focus:ring-brand-primary/15 focus:border-brand-primary
    transition-all duration-200
    ${isKiosk
      ? "rounded-xl border-brand-border px-5 py-4 text-base min-h-[56px]"
      : "rounded-[var(--form-field-radius)] border-brand-border px-4 py-3 text-[16px] min-h-[var(--form-field-height)]"
    }
  `;
  const labelCls = `flex items-center gap-1.5 font-semibold text-brand-text-primary mb-2 ${
    isKiosk ? "text-base" : "text-[var(--form-label-size)]"
  }`;

  const eventName = sourceParams.event;
  const compactLayout = viewportHeight < 860;
  const ultraCompact = viewportHeight < 740;

  /* ═══ RENDER ═══ */
  return (
    <>
      <main className="h-[100dvh] overflow-hidden bg-gradient-to-br from-brand-background-secondary via-white to-brand-primary/[0.03]">
        <section className={`h-full px-3 sm:px-4 ${compactLayout ? "py-2" : "py-4"}`}>
          <div className={`mx-auto h-full flex flex-col justify-center ${isKiosk ? "max-w-[720px]" : "max-w-[620px]"}`}>

            {/* Kiosk toggle (hidden UI) */}
            <div className={`flex items-center justify-end ${compactLayout ? "mb-1" : "mb-3"}`}>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-brand-text-muted/30 cursor-pointer select-none hover:text-brand-text-muted/60 transition-colors">
                <input
                  type="checkbox"
                  checked={isKiosk}
                  onChange={(e) => setIsKiosk(e.target.checked)}
                  className="rounded border-brand-border w-3 h-3"
                />
                Kiosk
              </label>
            </div>

            {/* Offline queue notice */}
            {queueCount > 0 && (
              <div className={`flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 animate-in fade-in slide-in-from-top-2 duration-300 ${compactLayout ? "mb-2 px-3 py-2" : "mb-4 px-4 py-3"}`}>
                <WifiOff className="w-4 h-4 shrink-0 text-amber-500" />
                <span>{queueCount} {queueCount === 1 ? "lead čeká" : "leadů čeká"} na odeslání</span>
              </div>
            )}

            {/* ════ MAIN CARD ════ */}
            <div className="bg-white rounded-2xl shadow-lg shadow-brand-primary/[0.04] border border-brand-border/60 overflow-hidden flex flex-col">

              {/* Card header */}
              <div className={`bg-gradient-to-r from-brand-primary via-brand-primary to-[#3D2175] px-5 ${compactLayout ? "py-3" : "py-5"}`}>
                {eventName && (
                  <div className={`inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/95 text-[11px] font-semibold rounded-full px-3 py-1 border border-white/10 ${compactLayout ? "mb-2" : "mb-3"}`}>
                    {eventName}
                  </div>
                )}
                <h1 className={`font-display font-bold text-white leading-tight tracking-tight ${compactLayout ? "text-lg" : isKiosk ? "text-2xl" : "text-xl"}`}>
                  Chci ukázku Echo Pulse
                </h1>
                <p className={`text-white/75 leading-relaxed ${compactLayout ? "text-[12px] mt-1" : isKiosk ? "text-sm mt-2" : "text-[13px] mt-2"}`}>
                  60 vteřin a máte jasno. Bez spamu — jen konkrétní ukázku,
                  jak měřit engagement.
                </p>
              </div>

              {/* Card body */}
              <div className={`${compactLayout ? "p-3" : "p-5"} flex-1`}>

                {/* Step indicator (only during form) */}
                {(status === "idle" || status === "sending" || status === "error") && (
                  <div className={compactLayout ? "mb-2" : "mb-0"}>
                    <StepIndicator current={step} total={2} />
                  </div>
                )}

                {/* ══ SUCCESS ══ */}
                {status === "success" && (
                  <div className="relative text-center py-6 animate-in fade-in zoom-in-95 duration-500">
                    <ConfettiCanvas />
                    <div className="relative z-10 space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/25">
                        <Check className="w-9 h-9 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h2 className={`font-display font-bold text-brand-text-primary ${isKiosk ? "text-2xl" : "text-xl"}`}>
                          {thankYou.title}
                        </h2>
                        <p className="text-sm text-brand-text-muted mt-1">{thankYou.sub}</p>
                      </div>

                      <div className="pt-4 space-y-3">
                        <div className="inline-block bg-brand-background-secondary rounded-xl px-5 py-3">
                          <p className="text-xs text-brand-text-muted mb-2">
                            Chcete rovnou 15min ukázku naživo?
                          </p>
                          <Button
                            onClick={() => openBooking("scan_qr_success")}
                            size={isKiosk ? "lg" : "default"}
                            className="gap-2"
                          >
                            <Calendar className="w-4 h-4" />
                            Domluvit ukázku
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>

                        {isKiosk && (
                          <div>
                            <button
                              onClick={resetForm}
                              className="inline-flex items-center gap-1.5 text-sm text-brand-text-muted hover:text-brand-primary transition-colors mt-2"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Další kontakt
                            </button>
                            <p className="text-[11px] text-brand-text-muted/40 mt-3">
                              Automatický reset za pár sekund…
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ══ QUEUED (offline) ══ */}
                {status === "queued" && (
                  <div className="text-center py-6 space-y-4 animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25">
                      <WifiOff className="w-9 h-9 text-white" />
                    </div>
                    <div>
                      <h2 className={`font-display font-bold text-amber-900 ${isKiosk ? "text-2xl" : "text-xl"}`}>
                        Uloženo offline
                      </h2>
                      <p className="text-sm text-amber-700 mt-1">
                        Odešlu, jakmile bude internet. Klid, nic se neztrácí.
                      </p>
                    </div>
                    {isKiosk && (
                      <button
                        onClick={resetForm}
                        className="inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Další kontakt
                      </button>
                    )}
                  </div>
                )}

                {/* ══ FORM ══ */}
                {(status === "idle" || status === "sending" || status === "error") && (
                  <form onSubmit={handleSubmit} noValidate>

                    {/* STEP 1 */}
                    {step === 1 && (
                      <div className={`${compactLayout ? "space-y-3" : "space-y-5"} animate-in fade-in slide-in-from-right-4 duration-300`} key="step1">

                        {/* Company with ARES */}
                        <div className="relative">
                          <label htmlFor="qr-company" className={labelCls}>
                            <Building2 className="w-4 h-4 text-brand-text-muted" />
                            Firma <span className="text-brand-primary text-xs">*</span>
                          </label>
                          <div className="relative">
                            <input
                              ref={companyInputRef}
                              id="qr-company"
                              type="text"
                              required
                              autoComplete="off"
                              autoFocus={!isKiosk}
                              value={company}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setCompany(e.target.value);
                                ares.search(e.target.value);
                              }}
                              onFocus={() => {
                                if (company.trim().length >= 2) ares.search(company);
                              }}
                              placeholder="Začněte psát název firmy…"
                              className={`${inputCls} ${compactLayout ? "py-2.5 min-h-[46px]" : ""}`}
                            />
                            {ares.loading && (
                              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary animate-spin" />
                            )}
                            {!ares.loading && company.length >= 2 && (
                              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted/30" />
                            )}
                          </div>

                          {/* ARES dropdown */}
                          {ares.open && ares.results.length > 0 && (
                            <div
                              ref={dropdownRef}
                              className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-brand-border shadow-xl shadow-brand-primary/[0.08] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                            >
                              <div className="px-3 py-2 bg-brand-background-secondary/70 border-b border-brand-border/50 flex items-center gap-1.5">
                                <Search className="w-3 h-3 text-brand-primary" />
                                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                                  Nalezeno v ARES
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
                                    w-full text-left px-4 py-3 hover:bg-brand-primary/[0.04] transition-colors cursor-pointer
                                    ${i < ares.results.length - 1 ? "border-b border-brand-border/30" : ""}
                                  `}
                                >
                                  <div className="font-medium text-sm text-brand-text-primary leading-snug">{r.name}</div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] text-brand-text-muted font-mono">IČO {r.ico}</span>
                                    {r.address && (
                                      <>
                                        <span className="text-brand-border">·</span>
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
                            <User className="w-4 h-4 text-brand-text-muted" />
                            Vaše jméno
                          </label>
                          <input
                            id="qr-contact"
                            type="text"
                            autoComplete="name"
                            value={contactName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setContactName(e.target.value)}
                            placeholder="Jan Novák"
                            className={`${inputCls} ${compactLayout ? "py-2.5 min-h-[46px]" : ""}`}
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="qr-email" className={labelCls}>
                            <Mail className="w-4 h-4 text-brand-text-muted" />
                            E-mail <span className="text-brand-primary text-xs">*</span>
                          </label>
                          <input
                            id="qr-email"
                            type="email"
                            required
                            autoComplete="email"
                            inputMode="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="jan@firma.cz"
                            className={`${inputCls} ${compactLayout ? "py-2.5 min-h-[46px]" : ""} ${email && !emailValid ? "border-brand-error/60 focus:ring-brand-error/15 focus:border-brand-error" : ""}`}
                          />
                          {email && !emailValid && (
                            <p className="text-xs text-brand-error mt-1.5 ml-1">Zadejte platný e-mail</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="qr-phone" className={labelCls}>
                            <Phone className="w-4 h-4 text-brand-text-muted" />
                            Telefon
                            {isKiosk
                              ? <span className="text-brand-primary text-xs">*</span>
                              : <span className="text-brand-text-muted font-normal text-xs ml-1">(volitelné)</span>
                            }
                          </label>
                          <input
                            id="qr-phone"
                            type="tel"
                            required={isKiosk}
                            autoComplete="tel"
                            inputMode="tel"
                            value={phone}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                            placeholder="+420 777 123 456"
                            className={`${inputCls} ${compactLayout ? "py-2.5 min-h-[46px]" : ""}`}
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

                        <div className={`${compactLayout ? "pt-1 space-y-2" : "pt-2 space-y-3"}`}>
                          <Button
                            type="button"
                            disabled={!step1Valid}
                            onClick={() => setStep(2)}
                            size={isKiosk ? "lg" : "default"}
                            className="w-full gap-2"
                          >
                            Pokračovat
                            <ChevronRight className="w-4 h-4" />
                          </Button>

                          <p className="text-center text-[11px] text-brand-text-muted/50 flex items-center justify-center gap-1.5">
                            <Shield className="w-3 h-3" />
                            Bezpečně. Žádný spam, žádné sdílení.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <div className={`${compactLayout ? "space-y-3" : "space-y-5"} animate-in fade-in slide-in-from-right-4 duration-300`} key="step2">

                        {/* Back */}
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-1 text-sm text-brand-text-muted hover:text-brand-primary transition-colors group -mt-1"
                        >
                          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                          Zpět
                        </button>

                        {/* Employees */}
                        <div>
                          <p className={labelCls}>
                            <Users className="w-4 h-4 text-brand-text-muted" />
                            Počet zaměstnanců <span className="text-brand-primary text-xs">*</span>
                          </p>
                          <ChipGroup
                            options={EMPLOYEES_OPTIONS}
                            value={employeesBucket}
                            onChange={setEmployeesBucket}
                            isKiosk={isKiosk}
                            compact={compactLayout}
                          />
                        </div>

                        {/* Feedback */}
                        <div>
                          <p className={labelCls}>
                            <MessageCircle className="w-4 h-4 text-brand-text-muted" />
                            Sbíráte zpětnou vazbu? <span className="text-brand-primary text-xs">*</span>
                          </p>
                          <ChipGroup
                            options={FEEDBACK_OPTIONS}
                            value={feedbackFreq}
                            onChange={setFeedbackFreq}
                            isKiosk={isKiosk}
                            compact={compactLayout}
                          />
                        </div>

                        {/* Role */}
                        <div>
                          <p className={labelCls}>
                            <Shield className="w-4 h-4 text-brand-text-muted" />
                            Vaše role <span className="text-brand-primary text-xs">*</span>
                          </p>
                          <ChipGroup
                            options={ROLE_OPTIONS}
                            value={decisionRole}
                            onChange={setDecisionRole}
                            isKiosk={isKiosk}
                            compact={compactLayout}
                          />
                        </div>

                        {/* GDPR */}
                        <div className={`border-t border-brand-border/40 ${compactLayout ? "pt-3" : "pt-5"}`}>
                          <Checkbox checked={consentContact} onChange={setConsentContact}>
                            <span className={`${compactLayout ? "text-[11px]" : "text-xs"} text-brand-text-body leading-relaxed`}>
                              Souhlasím se zpracováním údajů za účelem navázání kontaktu.{" "}
                              <a
                                href={PRIVACY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-brand-primary/80 hover:text-brand-primary transition-colors"
                              >
                                Zásady ochrany
                              </a>{" "}
                              <span className="text-brand-primary font-bold">*</span>
                            </span>
                          </Checkbox>

                          <Checkbox checked={consentMarketing} onChange={setConsentMarketing}>
                            <span className={`${compactLayout ? "text-[11px]" : "text-xs"} text-brand-text-body leading-relaxed`}>
                              Posílejte mi občas tipy a pozvánky
                              <span className="text-brand-text-muted"> (1–2× měsíčně, žádný spam)</span>
                            </span>
                          </Checkbox>
                        </div>

                        {/* Error */}
                        {status === "error" && errorMsg && (
                          <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-200/80 flex items-center gap-2 animate-in fade-in shake duration-300">
                            {errorMsg}
                          </div>
                        )}

                        <div className={compactLayout ? "pt-0" : "pt-1"}>
                          <Button
                            type="submit"
                            disabled={!step2Valid || status === "sending"}
                            size={isKiosk ? "lg" : "default"}
                            className="w-full gap-2"
                          >
                            {status === "sending" ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Odesílám…
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Odeslat a získat ukázku
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>

              {/* Card footer */}
              <div className="px-6 py-2.5 bg-brand-background-secondary/40 border-t border-brand-border/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-brand-text-muted/50">
                  {isOnline ? (
                    <><Wifi className="w-3 h-3 text-green-500" /> Online</>
                  ) : (
                    <><WifiOff className="w-3 h-3 text-amber-500" /> Offline</>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-brand-text-muted/30">
                  Behavera
                </div>
              </div>
            </div>

            {/* Trust badges */}
            {!ultraCompact && (
              <div className={`${compactLayout ? "mt-2" : "mt-5"} flex items-center justify-center gap-5 flex-wrap`}>
                <span className="flex items-center gap-1.5 text-[11px] text-brand-text-muted/40">
                  <Shield className="w-3.5 h-3.5" /> GDPR
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-brand-text-muted/40">
                  <Clock className="w-3.5 h-3.5" /> 60s formulář
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-brand-text-muted/40">
                  <Shield className="w-3.5 h-3.5" /> Bez spamu
                </span>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
