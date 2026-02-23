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
  Loader2,
  Send,
  Wifi,
  WifiOff,
  RotateCcw,
  Calendar,
} from "lucide-react";

/* ───────────────────────────────────────────────────
 *  /scan_QR  — Event lead capture (QR mobile + kiosk)
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
  { value: "1-49", label: "1–49" },
  { value: "50-199", label: "50–199" },
  { value: "200-999", label: "200–999" },
  { value: "1000+", label: "1 000+" },
] as const;

const FEEDBACK_OPTIONS = [
  { value: "no", label: "Ne" },
  { value: "ad_hoc", label: "Ad hoc" },
  { value: "quarterly", label: "Ano (kvartálně)" },
  { value: "monthly_plus", label: "Ano (měsíčně+)" },
] as const;

const ROLE_OPTIONS = [
  { value: "decision_maker", label: "Rozhodovatel" },
  { value: "co_decision_maker", label: "Spolurozhodovatel" },
  { value: "connector", label: "Nejsem, ale propojím" },
] as const;

/* ── Offline queue helpers ─────────────────────── */

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

  // Collect any extra query params as source_meta
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

/* ── Chip selector component ───────────────────── */

function ChipGroup({
  options,
  value,
  onChange,
  isKiosk,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  isKiosk: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`
            rounded-xl border px-4 font-medium transition-all select-none
            ${isKiosk ? "py-4 text-base min-h-[56px]" : "py-3 text-sm min-h-[44px]"}
            ${
              value === opt.value
                ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/30"
                : "border-brand-border bg-white text-brand-text-body hover:border-brand-primary/40"
            }
          `}
        >
          {opt.label}
        </button>
      ))}
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

  /* ── Mode ────────────────────────────────────── */
  const [isKiosk, setIsKiosk] = useState(
    () => searchParams.get("mode") === "kiosk" || isIPad(),
  );

  /* ── Step (1 or 2) ──────────────────────────── */
  const [step, setStep] = useState(1);

  /* ── Form state ─────────────────────────────── */
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

  /* ── Submission state ────────────────────────── */
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "queued"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [queueCount, setQueueCount] = useState(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useSEO({
    title: "Behavera — Event Lead Capture",
    description:
      "Pošleme vám ukázku Echo Pulse. Vyplňte rychlý formulář na veletrhu.",
  });

  /* ── Offline queue flush ─────────────────────── */
  useEffect(() => {
    const onOnline = () => {
      flushQueue().then((sent) => {
        if (sent > 0) setQueueCount(getQueue().length);
      });
    };
    window.addEventListener("online", onOnline);

    // Also try on mount
    if (navigator.onLine) onOnline();

    // Periodic retry every 30 s
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

  /* ── Build payload ───────────────────────────── */
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
    company,
    email,
    phone,
    contactName,
    isKiosk,
    employeesBucket,
    feedbackFreq,
    decisionRole,
    consentContact,
    consentMarketing,
    honeypot,
    sourceParams,
  ]);

  /* ── Reset form ──────────────────────────────── */
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

  /* ── Submit ──────────────────────────────────── */
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
        throw new Error(data.error || "Chyba při odesílání");
      }

      setStatus("success");

      // Kiosk: auto-reset after 10 s
      if (isKiosk) {
        resetTimerRef.current = setTimeout(resetForm, 10_000);
      }
    } catch {
      // Offline or server error → queue locally
      pushQueue(payload);
      setQueueCount(getQueue().length);
      setStatus("queued");

      // Kiosk: auto-reset after 6 s even when queued
      if (isKiosk) {
        resetTimerRef.current = setTimeout(resetForm, 6_000);
      }
    }
  };

  /* ── Step 1 validation ───────────────────────── */
  const step1Valid =
    company.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    (!isKiosk || phone.trim().length > 0);

  /* ── Step 2 validation ───────────────────────── */
  const step2Valid =
    employeesBucket !== "" &&
    feedbackFreq !== "" &&
    decisionRole !== "" &&
    consentContact;

  /* ── Derived ─────────────────────────────────── */
  const inputCls = `w-full rounded-xl border border-brand-border bg-white text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all ${
    isKiosk ? "px-5 py-4 text-base min-h-[56px]" : "px-4 py-3 text-sm min-h-[44px]"
  }`;
  const labelCls = `block font-medium text-brand-text-primary mb-1 ${
    isKiosk ? "text-base" : "text-sm"
  }`;

  /* ═══════════════════════════════════════════════
   *  RENDER
   * ═══════════════════════════════════════════════ */

  return (
    <>
      {!isKiosk && <Header />}
      <main className={isKiosk ? "min-h-screen bg-white" : "pt-24"}>
        <section
          className={`${
            isKiosk ? "px-8 py-10" : "section-spacing"
          } bg-white`}
        >
          <div
            className={`mx-auto ${
              isKiosk ? "max-w-[600px]" : "container-default max-w-[480px]"
            }`}
          >
            {/* ── Kiosk toggle (top-right) ─── */}
            <div className="flex items-center justify-between mb-6">
              <div />
              <label className="inline-flex items-center gap-2 text-xs text-brand-text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isKiosk}
                  onChange={(e) => setIsKiosk(e.target.checked)}
                  className="rounded border-brand-border"
                />
                Kiosk
              </label>
            </div>

            {/* ── Offline queue badge ──────── */}
            {queueCount > 0 && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
                <WifiOff className="w-3.5 h-3.5 shrink-0" />
                {queueCount} lead{queueCount > 1 ? "ů" : ""} čeká na odeslání
              </div>
            )}

            {/* ── Headline ─────────────────── */}
            <h1
              className={`font-bold tracking-tight leading-tight mb-2 ${
                isKiosk ? "text-3xl" : "text-2xl"
              }`}
            >
              Pošlu vám ukázku Echo Pulse{" "}
              <span className="text-brand-text-muted font-normal">
                (60 vteřin).
              </span>
            </h1>
            <p
              className={`text-brand-text-muted mb-8 ${
                isKiosk ? "text-base" : "text-sm"
              }`}
            >
              Bez spamu. Jen navazující domluva.
            </p>

            {/* ── SUCCESS state ────────────── */}
            {status === "success" && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center space-y-4">
                <Check className="w-12 h-12 text-green-600 mx-auto" />
                <h2
                  className={`font-bold text-green-900 ${
                    isKiosk ? "text-2xl" : "text-xl"
                  }`}
                >
                  Hotovo. Díky!
                </h2>
                <p className="text-sm text-green-700">
                  Chcete rovnou 15minutovou ukázku?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => openBooking("scan_qr_success")}
                    className="inline-flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Domluvit ukázku
                  </Button>
                  {isKiosk && (
                    <Button variant="outline" onClick={resetForm}>
                      <RotateCcw className="w-4 h-4" />
                      Zadat další lead
                    </Button>
                  )}
                </div>
                {isKiosk && (
                  <p className="text-xs text-green-600 mt-2">
                    Automatický reset za pár sekund…
                  </p>
                )}
              </div>
            )}

            {/* ── QUEUED (offline) state ───── */}
            {status === "queued" && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center space-y-4">
                <WifiOff className="w-12 h-12 text-amber-600 mx-auto" />
                <h2
                  className={`font-bold text-amber-900 ${
                    isKiosk ? "text-2xl" : "text-xl"
                  }`}
                >
                  Uloženo offline
                </h2>
                <p className="text-sm text-amber-700">
                  Odešlu, jakmile bude internet.
                </p>
                {isKiosk && (
                  <Button variant="outline" onClick={resetForm}>
                    <RotateCcw className="w-4 h-4" />
                    Zadat další lead
                  </Button>
                )}
              </div>
            )}

            {/* ── FORM ─────────────────────── */}
            {(status === "idle" ||
              status === "sending" ||
              status === "error") && (
              <form onSubmit={handleSubmit} noValidate>
                {/* STEP 1: Company + Email + Phone */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="qr-company" className={labelCls}>
                        Firma *
                      </label>
                      <input
                        id="qr-company"
                        type="text"
                        required
                        autoComplete="organization"
                        value={company}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCompany(e.target.value)
                        }
                        placeholder="Acme s.r.o."
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label htmlFor="qr-email" className={labelCls}>
                        E-mail *
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

                    <div>
                      <label htmlFor="qr-phone" className={labelCls}>
                        Telefon{isKiosk ? " *" : ""}
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
                        placeholder="777 123 456"
                        className={inputCls}
                      />
                    </div>

                    {/* Optional contact name — kiosk only */}
                    {isKiosk && (
                      <div>
                        <label htmlFor="qr-contact" className={labelCls}>
                          Kontaktní osoba (volitelné)
                        </label>
                        <input
                          id="qr-contact"
                          type="text"
                          autoComplete="name"
                          value={contactName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setContactName(e.target.value)
                          }
                          placeholder="Jan Novák"
                          className={inputCls}
                        />
                      </div>
                    )}

                    {/* Honeypot — hidden from users */}
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
                      className="w-full inline-flex items-center justify-center gap-2"
                    >
                      Pokračovat
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* STEP 2: Qualification + GDPR */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* Back to step 1 */}
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-brand-text-muted hover:text-brand-primary transition-colors"
                    >
                      ← Zpět
                    </button>

                    {/* Q1: Employees */}
                    <div>
                      <p className={labelCls}>Počet zaměstnanců *</p>
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
                        Sbíráte pravidelně zpětnou vazbu? *
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
                      <p className={labelCls}>Role v rozhodnutí *</p>
                      <ChipGroup
                        options={ROLE_OPTIONS}
                        value={decisionRole}
                        onChange={setDecisionRole}
                        isKiosk={isKiosk}
                      />
                    </div>

                    {/* GDPR: consent_contact */}
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consentContact}
                        onChange={(e) => setConsentContact(e.target.checked)}
                        className="mt-1 rounded border-brand-border min-w-[18px] min-h-[18px]"
                      />
                      <span className="text-xs text-brand-text-body leading-relaxed">
                        Souhlasím se zpracováním uvedených údajů za účelem
                        navázání kontaktu.{" "}
                        <a
                          href={PRIVACY_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-brand-primary"
                        >
                          Zásady ochrany osobních údajů
                        </a>{" "}
                        *
                      </span>
                    </label>

                    {/* GDPR: consent_marketing */}
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consentMarketing}
                        onChange={(e) => setConsentMarketing(e.target.checked)}
                        className="mt-1 rounded border-brand-border min-w-[18px] min-h-[18px]"
                      />
                      <span className="text-xs text-brand-text-body leading-relaxed">
                        Souhlasím se zasíláním marketingových sdělení
                        (newslettery, pozvánky na webináře).
                      </span>
                    </label>

                    {/* Error */}
                    {status === "error" && (
                      <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                        {errorMsg}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={!step2Valid || status === "sending"}
                      size={isKiosk ? "lg" : "default"}
                      className="w-full inline-flex items-center justify-center gap-2"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Odesílám…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Odeslat
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            )}

            {/* ── Online indicator (small) ─── */}
            <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-brand-text-muted">
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
          </div>
        </section>
      </main>
      {!isKiosk && <Footer />}
    </>
  );
}
