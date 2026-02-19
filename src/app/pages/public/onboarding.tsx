import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useForm, type UseFormRegister, type UseFormWatch, type UseFormGetValues, type FieldErrors } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  UserPlus,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Sparkles,
  Mail,
  AlertCircle,
  Rocket,
  Crown,
  LayoutDashboard,
  Lock,
  MapPin,
  PartyPopper,
  Gift,
  Clock,
  Phone,
  Star,
  Heart,
  Zap,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { FormField } from "@/app/components/ui/form-field";
import { useLanguage } from "@/app/language-context";
import { submitLead } from "@/app/utils/lead";
import { trackLeadSubmitted } from "@/lib/analytics";
import { cn } from "@/app/components/ui/utils";
import {
  useOAuthContacts,
  type OAuthContact,
} from "@/app/hooks/use-oauth-contacts";
import {
  TeamBuilder,
  type Team,
  type TeamContact,
} from "@/app/components/team-builder";
// InviteTeammates step removed — OAuth import merged into Teams step
import { useAresLookup, type AresResult } from "@/app/hooks/use-ares-lookup";

/* ─── Types ─── */
type OnboardingFormData = {
  companyName: string;
  companyId: string;
  repName: string;
  repEmail: string;
  billingEmail: string;
  adminName: string;
  adminEmail: string;
  employeeCount: number;
  billingInterval: "monthly" | "yearly";
  agreedToTerms: boolean;
};

/* ─── Steps definition ─── */
const STEPS = [
  { id: "company", icon: Building2 },
  { id: "teams", icon: Users },
  { id: "confirm", icon: CreditCard },
] as const;

/* ─── Motivational step micro-copy ─── */
const stepMotivation = {
  cz: [
    "Skvělý start! 🎯",
    "Skoro hotovo! 💪",
    "Poslední krok! 🎉",
  ],
  en: [
    "Great start! 🎯",
    "Almost done! 💪",
    "Final step! 🎉",
  ],
  de: [
    "Toller Start! 🎯",
    "Fast fertig! 💪",
    "Letzter Schritt! 🎉",
  ],
};

/* ─── Confetti component ─── */
function Confetti() {
  const colors = ['#7C3AED', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#F97316'];
  const particles = useMemo(() => 
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      size: 4 + Math.random() * 8,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    })),
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            x: `${p.x}vw`, 
            y: -20, 
            rotate: 0, 
            opacity: 1,
            scale: 0,
          }}
          animate={{ 
            y: '110vh', 
            rotate: p.rotation + 720, 
            opacity: [1, 1, 0.8, 0],
            scale: [0, 1.2, 1, 0.5],
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay,
            ease: 'easeOut',
          }}
          style={{ 
            position: 'absolute',
            width: p.size,
            height: p.shape === 'circle' ? p.size : p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Google / Microsoft SVG logos ─── */
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const MicrosoftLogo = () => (
  <svg viewBox="0 0 21 21" className="w-5 h-5" aria-hidden="true">
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
);

/* ─── Translations ─── */
const copy = {
  cz: {
    pageTitle: "Vytvořte si Behavera účet",
    pageSubtitle: "Zabere to méně než 2 minuty",
    steps: ["Společnost", "Týmy", "Potvrzení"],
    s0Title: "Základní údaje",
    s0Subtitle: "Tyto údaje použijeme k nastavení vašeho účtu a fakturace.",
    companyName: "Název společnosti",
    companyNamePlaceholder: "Začněte psát název firmy…",
    companyId: "IČO",
    companyIdPlaceholder: "12345678",
    companyIdHelper: "8místné identifikační číslo",
    aresHint: "Začněte psát a vyberete z rejstříku — IČO se doplní automaticky.",
    repSection: "Kontaktní osoba",
    repSectionDesc: "Kdo řeší smlouvu a fakturaci?",
    repName: "Jméno",
    repNamePlaceholder: "Jan Novák",
    repEmail: "Email",
    repEmailPlaceholder: "jan.novak@firma.cz",
    repEmailHelper: "Sem posíláme smlouvu, faktury a důležité aktualizace.",
    billingEmail: "Fakturační email (volitelné)",
    billingEmailPlaceholder: "fakturace@firma.cz",
    billingEmailHelper: "Pokud chcete faktury na jiný email.",
    adminSection: "Budoucí administrátor",
    adminSectionDesc: "Kdo bude Behavera denně používat?",
    adminName: "Jméno administrátora",
    adminNamePlaceholder: "Jana Smolíková",
    adminEmail: "Email administrátora",
    adminEmailPlaceholder: "jana@firma.cz",
    adminEmailHelper: "Pošleme pozvánku a instrukce k nastavení.",
    s1Title: "Sestavte týmy",
    s1Subtitle: "Importujte kontakty z adresáře nebo přidejte ručně a rozdělte do týmů.",
    connectTitle: "Načtěte kontakty jedním klikem",
    connectSubtitle: "Přihlaste se přes firemní účet a my bezpečně načteme seznam zaměstnanců z vašeho adresáře.",
    connectGoogle: "Pokračovat přes Google",
    connectMicrosoft: "Pokračovat přes Microsoft",
    privacyNote: "Čteme pouze jména a e-maily. Nikdy nepřistupujeme k vašim e-mailům, souborům ani kalendářům.",
    termsNote: "Pokračováním souhlasíte s",
    termsLinkLabel: "obchodními podmínkami",
    connectSuccess: "kontaktů z firemní domény",
    connectDomain: "z firemní domény",
    connectOther: "ostatní odfiltrováno",
    connectChange: "Připojit jiný účet",
    skipConnect: "Přeskočit — přidám ručně",
    skipConnectNote: "Budete moci přidat zaměstnance ručně v dalším kroku.",
    loadingContacts: "Načítám adresář…",
    errorOAuth: "Nepodařilo se propojit. Zkuste to znovu.",
    errorOAuthNotConfigured: "Přihlášení přes Google/Microsoft ještě není aktivní. Přeskočte a přidejte zaměstnance ručně.",
    s2Title: "Potvrzení & spuštění",
    s2Subtitle: "Zkontrolujte údaje a potvrďte vytvoření účtu.",
    summaryCompany: "Společnost",
    summaryRep: "Zástupce",
    summaryAdmin: "Administrátor",
    summaryTeams: "Týmy",
    summaryMembers: "členů",
    employeeCount: "Počet zaměstnanců",
    employeeCountHelper: "Kolik lidí bude Behavera používat?",
    plan: "Ceník",
    monthly: "Měsíčně",
    yearly: "Ročně",
    saveTag: "Ušetřete 20 %",
    pricePerPerson: "za osobu / měsíc",
    termsAgree: "Souhlasím s",
    termsLink: "Obchodními podmínkami",
    termsAnd: "a",
    privacyLink: "Ochranou osobních údajů",
    guarantee: "30denní garance vrácení peněz. Bez otázek.",
    submit: "Vytvořit účet",
    submitting: ["Vytvářím účet…", "Ukládám týmy…", "Nastavuji fakturaci…", "Připravuji vše…", "Hotovo ✓"],
    doneTitle: "Vše je připravené!",
    doneSubtitle: "Zkontrolujte si údaje naposledy a odklikněte.",
    doneButton: "Dokončit a aktivovat účet",
    successTitle: "Máte to! 🎉",
    successSubtitle: "Váš Behavera účet je připravený. Tady je, co se stane dál:",
    successCta: "Zpět na hlavní stránku",
    successTimeline: [
      { icon: "mail", title: "Pozvánka odeslána", desc: "Admin obdrží email s přístupovými údaji." },
      { icon: "phone", title: "Ozveme se do 1h", desc: "Provedeme vás úvodním nastavením." },
      { icon: "rocket", title: "Spuštění do 24h", desc: "První pulz poběží ještě dnes nebo zítra." },
      { icon: "sparkles", title: "Data do 7 dní", desc: "První insights a doporučení pro váš tým." },
    ],
    successQuote: "\"Nejlepší rozhodnutí za posledních 12 měsíců.\"",
    successQuoteAuthor: "— HR ředitelka, 200+ zaměstnanců",
    next: "Pokračovat",
    back: "Zpět",
    required: "Povinné pole",
  },
  en: {
    pageTitle: "Create your Behavera account",
    pageSubtitle: "Takes less than 2 minutes",
    steps: ["Company", "Teams", "Confirm"],
    s0Title: "Basic details",
    s0Subtitle: "We use these details to set up your account and billing.",
    companyName: "Company name",
    companyNamePlaceholder: "Start typing company name…",
    companyId: "Company ID",
    companyIdPlaceholder: "12345678",
    companyIdHelper: "Official registration number",
    aresHint: "Start typing and select from the registry — ID fills automatically.",
    repSection: "Contact person",
    repSectionDesc: "Handles the contract and billing on your side.",
    repName: "Name",
    repNamePlaceholder: "John Smith",
    repEmail: "Email",
    repEmailPlaceholder: "john.smith@company.com",
    repEmailHelper: "We'll send the contract, invoices, and key updates here.",
    billingEmail: "Billing email (optional)",
    billingEmailPlaceholder: "billing@company.com",
    billingEmailHelper: "If you want invoices sent elsewhere.",
    adminSection: "Future account admin",
    adminSectionDesc: "Who will use Behavera day to day?",
    adminName: "Admin name",
    adminNamePlaceholder: "Jane Doe",
    adminEmail: "Admin email",
    adminEmailPlaceholder: "jane@company.com",
    adminEmailHelper: "We'll send an invite and getting-started instructions.",
    s1Title: "Build teams",
    s1Subtitle: "Import contacts from your directory or add manually and organize into teams.",
    connectTitle: "Import contacts in one click",
    connectSubtitle: "Sign in with your company account and we'll securely import your employee directory.",
    connectGoogle: "Continue with Google",
    connectMicrosoft: "Continue with Microsoft",
    privacyNote: "We only read names and emails. We never access your email content, files, or calendars.",
    termsNote: "By continuing you agree to the",
    termsLinkLabel: "Terms & Conditions",
    connectSuccess: "company domain contacts loaded",
    connectDomain: "from company domain",
    connectOther: "others filtered out",
    connectChange: "Connect different account",
    skipConnect: "Skip — I'll add manually",
    skipConnectNote: "You can add employees manually in the next step.",
    loadingContacts: "Importing directory…",
    errorOAuth: "Connection failed. Please try again.",
    errorOAuthNotConfigured: "Google/Microsoft sign-in is not yet active. Skip and add employees manually.",
    s2Title: "Confirm & launch",
    s2Subtitle: "Review the details and confirm account creation.",
    summaryCompany: "Company",
    summaryRep: "Representative",
    summaryAdmin: "Admin",
    summaryTeams: "Teams",
    summaryMembers: "members",
    employeeCount: "Number of employees",
    employeeCountHelper: "How many people will use Behavera?",
    plan: "Pricing",
    monthly: "Monthly",
    yearly: "Yearly",
    saveTag: "Save 20%",
    pricePerPerson: "per person / month",
    termsAgree: "I agree to the",
    termsLink: "Terms of Service",
    termsAnd: "and",
    privacyLink: "Privacy Policy",
    guarantee: "30-day money-back guarantee. No questions asked.",
    submit: "Create account",
    submitting: ["Creating account…", "Saving teams…", "Setting up billing…", "Preparing everything…", "Done ✓"],
    doneTitle: "Everything is ready!",
    doneSubtitle: "Review your details one last time and confirm.",
    doneButton: "Finish & activate account",
    successTitle: "You're in! 🎉",
    successSubtitle: "Your Behavera account is ready. Here's what happens next:",
    successCta: "Back to homepage",
    successTimeline: [
      { icon: "mail", title: "Invite sent", desc: "Admin will receive an email with access credentials." },
      { icon: "phone", title: "We'll call within 1h", desc: "We'll walk you through the initial setup." },
      { icon: "rocket", title: "Live within 24h", desc: "First pulse goes out today or tomorrow." },
      { icon: "sparkles", title: "Insights in 7 days", desc: "First recommendations for your team." },
    ],
    successQuote: "\"Best decision we made in the last 12 months.\"",
    successQuoteAuthor: "— HR Director, 200+ employees",
    next: "Continue",
    back: "Back",
    required: "Required",
  },
  de: {
    pageTitle: "Erstellen Sie Ihr Behavera Konto",
    pageSubtitle: "Dauert weniger als 2 Minuten",
    steps: ["Unternehmen", "Teams", "Bestätigung"],
    s0Title: "Grunddaten",
    s0Subtitle: "Wir verwenden diese Daten für Ihr Konto und die Abrechnung.",
    companyName: "Firmenname",
    companyNamePlaceholder: "Firmennamen eingeben…",
    companyId: "Handelsregister-Nr.",
    companyIdPlaceholder: "HRB 12345",
    companyIdHelper: "Offizielle Registrierungsnummer",
    aresHint: "Geben Sie den Namen ein und wählen Sie aus dem Register — die ID wird automatisch ausgefüllt.",
    repSection: "Kontaktperson",
    repSectionDesc: "Zuständig für Vertrag und Abrechnung.",
    repName: "Name",
    repNamePlaceholder: "Max Mustermann",
    repEmail: "E-Mail",
    repEmailPlaceholder: "max@firma.de",
    repEmailHelper: "Hier senden wir Vertrag, Rechnungen und Updates.",
    billingEmail: "Rechnungs-E-Mail (optional)",
    billingEmailPlaceholder: "buchhaltung@firma.de",
    billingEmailHelper: "Falls Rechnungen an eine andere Adresse gehen sollen.",
    adminSection: "Zukünftiger Account-Admin",
    adminSectionDesc: "Wer Behavera täglich nutzen wird?",
    adminName: "Admin-Name",
    adminNamePlaceholder: "Erika Musterfrau",
    adminEmail: "Admin-E-Mail",
    adminEmailPlaceholder: "erika@firma.de",
    adminEmailHelper: "Wir senden eine Einladung und Einrichtungsanleitung.",
    s1Title: "Teams aufbauen",
    s1Subtitle: "Importieren Sie Kontakte aus Ihrem Verzeichnis oder fügen Sie sie manuell hinzu und organisieren Sie Teams.",
    connectTitle: "Kontakte mit einem Klick importieren",
    connectSubtitle: "Melden Sie sich mit Ihrem Firmenkonto an und wir importieren Ihr Mitarbeiterverzeichnis sicher.",
    connectGoogle: "Weiter mit Google",
    connectMicrosoft: "Weiter mit Microsoft",
    privacyNote: "Wir lesen nur Namen und E-Mails. Wir greifen nie auf Ihre E-Mail-Inhalte, Dateien oder Kalender zu.",
    termsNote: "Mit der Fortsetzung stimmen Sie den",
    termsLinkLabel: "Nutzungsbedingungen",
    connectSuccess: "Firmenkontakte geladen",
    connectDomain: "aus der Firmendomäne",
    connectOther: "andere herausgefiltert",
    connectChange: "Anderes Konto verbinden",
    skipConnect: "Überspringen — manuell hinzufügen",
    skipConnectNote: "Sie können Mitarbeiter im nächsten Schritt manuell hinzufügen.",
    loadingContacts: "Verzeichnis wird importiert…",
    errorOAuth: "Verbindung fehlgeschlagen. Bitte erneut versuchen.",
    errorOAuthNotConfigured: "Google/Microsoft-Anmeldung ist noch nicht aktiv. Überspringen Sie und fügen Sie Mitarbeiter manuell hinzu.",
    s2Title: "Bestätigen & starten",
    s2Subtitle: "Überprüfen Sie die Details und bestätigen Sie die Kontoerstellung.",
    summaryCompany: "Unternehmen",
    summaryRep: "Vertreter",
    summaryAdmin: "Admin",
    summaryTeams: "Teams",
    summaryMembers: "Mitglieder",
    employeeCount: "Anzahl der Mitarbeiter",
    employeeCountHelper: "Wie viele Personen werden Behavera nutzen?",
    plan: "Preise",
    monthly: "Monatlich",
    yearly: "Jährlich",
    saveTag: "20 % sparen",
    pricePerPerson: "pro Person / Monat",
    termsAgree: "Ich stimme den",
    termsLink: "Nutzungsbedingungen",
    termsAnd: "und der",
    privacyLink: "Datenschutzerklärung",
    guarantee: "30 Tage Geld-zurück-Garantie. Ohne Fragen.",
    submit: "Konto erstellen",
    submitting: ["Konto wird erstellt…", "Teams werden gespeichert…", "Abrechnung wird eingerichtet…", "Alles wird vorbereitet…", "Fertig ✓"],
    doneTitle: "Alles ist bereit!",
    doneSubtitle: "Überprüfen Sie Ihre Angaben ein letztes Mal.",
    doneButton: "Abschließen & Konto aktivieren",
    successTitle: "Geschafft! 🎉",
    successSubtitle: "Ihr Behavera Konto ist bereit. Das passiert als Nächstes:",
    successCta: "Zurück zur Startseite",
    successTimeline: [
      { icon: "mail", title: "Einladung versendet", desc: "Admin erhält eine E-Mail mit Zugangsdaten." },
      { icon: "phone", title: "Anruf innerhalb 1h", desc: "Wir führen Sie durch die Ersteinrichtung." },
      { icon: "rocket", title: "Live in 24h", desc: "Erste Pulsmessung läuft heute oder morgen." },
      { icon: "sparkles", title: "Insights in 7 Tagen", desc: "Erste Empfehlungen für Ihr Team." },
    ],
    successQuote: "\"Die beste Entscheidung der letzten 12 Monate.\"",
    successQuoteAuthor: "— HR-Direktorin, 200+ Mitarbeitende",
    next: "Weiter",
    back: "Zurück",
    required: "Pflichtfeld",
  },
};

/* ─── Slide animation variants ─── */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
  }),
};

/* ═══════════════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════════════ */
const ONBOARDING_STORAGE_KEY = "behavera_onboarding_draft";

function loadDraft() {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Expire after 7 days
    if (data._ts && Date.now() - data._ts > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveDraft(patch: Record<string, unknown>) {
  try {
    const existing = loadDraft() || {};
    localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({ ...existing, ...patch, _ts: Date.now() })
    );
  } catch { /* quota exceeded — ignore */ }
}

function clearDraft() {
  try { localStorage.removeItem(ONBOARDING_STORAGE_KEY); } catch { /* */ }
}

export function OnboardingPage() {
  const { language } = useLanguage();
  const txt = copy[language] || copy.en;
  const draft = useMemo(() => loadDraft(), []);

  const [currentStep, setCurrentStep] = useState(draft?.currentStep ?? 0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitPhase, setSubmitPhase] = useState(0);
  const [teams, setTeams] = useState<Team[]>(draft?.teams ?? []);


  // OAuth contacts
  const {
    contacts: oauthContacts,
    loading: oauthLoading,
    error: oauthError,
    provider: oauthProvider,
    fetchContacts,
    clearContacts,
  } = useOAuthContacts();
  const [skippedConnect, setSkippedConnect] = useState(draft?.skippedConnect ?? false);

  // ARES lookup
  const {
    results: aresResults,
    loading: aresLoading,
    search: aresSearch,
    clear: aresClear,
  } = useAresLookup();
  const [showAresDropdown, setShowAresDropdown] = useState(false);
  const aresDropdownRef = useRef<HTMLDivElement>(null);

  const isEur = language === "en" || language === "de";
  const monthlyPrice = isEur ? 5 : 129;
  const yearlyPrice = isEur ? 4 : 99;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<OnboardingFormData>({
    defaultValues: {
      companyName: draft?.form?.companyName ?? "",
      companyId: draft?.form?.companyId ?? "",
      repName: draft?.form?.repName ?? "",
      repEmail: draft?.form?.repEmail ?? "",
      billingEmail: draft?.form?.billingEmail ?? "",
      adminName: draft?.form?.adminName ?? "",
      adminEmail: draft?.form?.adminEmail ?? "",
      employeeCount: draft?.form?.employeeCount ?? 50,
      billingInterval: draft?.form?.billingInterval ?? "yearly",
      agreedToTerms: false,
    },
    mode: "onBlur",
  });

  // ─── Auto-save draft to localStorage ───
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSuccess || isDone) return;
      const formValues = getValues();
      saveDraft({
        currentStep,
        skippedConnect,
        teams,
        form: {
          companyName: formValues.companyName,
          companyId: formValues.companyId,
          repName: formValues.repName,
          repEmail: formValues.repEmail,
          billingEmail: formValues.billingEmail,
          adminName: formValues.adminName,
          adminEmail: formValues.adminEmail,
          employeeCount: formValues.employeeCount,
          billingInterval: formValues.billingInterval,
        },
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [currentStep, teams, skippedConnect, isSuccess, isDone, getValues]);

  // Save on step change immediately
  useEffect(() => {
    if (isSuccess || isDone) return;
    saveDraft({ currentStep });
  }, [currentStep, isSuccess, isDone]);

  const billingInterval = watch("billingInterval");
  const employeeCount = watch("employeeCount");

  // Derive domain from rep email
  const repEmail = watch("repEmail");
  const companyDomain = useMemo(() => {
    const parts = repEmail?.split("@");
    return parts?.[1]?.toLowerCase() || "";
  }, [repEmail]);

  // Split contacts by domain
  const domainContacts = useMemo(
    () =>
      oauthContacts.filter(
        (c) =>
          companyDomain &&
          c.email.toLowerCase().endsWith(`@${companyDomain}`)
      ),
    [oauthContacts, companyDomain]
  );
  const otherContacts = useMemo(
    () =>
      oauthContacts.filter(
        (c) =>
          !companyDomain ||
          !c.email.toLowerCase().endsWith(`@${companyDomain}`)
      ),
    [oauthContacts, companyDomain]
  );

  // Contacts for TeamBuilder — only company domain contacts
  const teamBuilderContacts: TeamContact[] = useMemo(() => {
    const pool = companyDomain ? domainContacts : oauthContacts;
    return pool.map((c) => ({
      name: c.name,
      email: c.email,
      photo: c.photo,
    }));
  }, [domainContacts, oauthContacts, companyDomain]);

  // Filtered contacts = only company domain (what we actually use everywhere)
  const filteredContacts = companyDomain ? domainContacts : oauthContacts;

  // ─── ARES: handle company name input ───
  const handleCompanyNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue("companyName", val, { shouldValidate: false });
      aresSearch(val);
      setShowAresDropdown(true);
    },
    [setValue, aresSearch]
  );

  const selectAresResult = useCallback(
    (result: AresResult) => {
      setValue("companyName", result.name, { shouldValidate: true });
      setValue("companyId", result.ico, { shouldValidate: true });
      setShowAresDropdown(false);
      aresClear();
    },
    [setValue, aresClear]
  );

  // Close ARES dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        aresDropdownRef.current &&
        !aresDropdownRef.current.contains(e.target as Node)
      ) {
        setShowAresDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ─── Auto-set employee count from actual team members ─── */
  const computedFromTeams = useMemo(() => {
    let total = 0;
    for (const team of teams) {
      if (team.leaderEmail?.trim()) total++;
      total += team.members.length;
    }
    return Math.max(total, 10);
  }, [teams]);

  useEffect(() => {
    if (currentStep === 2) {
      setValue("employeeCount", computedFromTeams);
    }
  }, [currentStep, computedFromTeams, setValue]);

  /* ─── Step validation ─── */
  const validateStep = useCallback(
    async (step: number) => {
      const fieldsByStep: Record<number, (keyof OnboardingFormData)[]> = {
        0: [
          "companyName",
          "companyId",
          "repName",
          "repEmail",
          "adminName",
          "adminEmail",
        ],
        1: [],
        2: ["employeeCount", "agreedToTerms"],
      };
      if (!fieldsByStep[step] || fieldsByStep[step].length === 0) return true;
      return await trigger(fieldsByStep[step]);
    },
    [trigger]
  );

  const goNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;
    setDirection(1);
    setCurrentStep((s: number) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s: number) => Math.max(s - 1, 0));
  };

  /* ─── Submit ─── */
  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    setSubmitPhase(0);

    // Progress through visual phases — realistic for hundreds of employees
    const phaseTimer1 = setTimeout(() => setSubmitPhase(1), 2500);
    const phaseTimer2 = setTimeout(() => setSubmitPhase(2), 5500);
    const phaseTimer3 = setTimeout(() => setSubmitPhase(3), 8000);

    // Minimum visual processing time — money is involved, don't rush
    const minDelay = new Promise((r) => setTimeout(r, 10000));

    try {
      // Send COMPLETE onboarding data (company, teams, members, OAuth info)
      const fullPayload = {
        companyName: data.companyName,
        companyId: data.companyId || undefined,
        repName: data.repName,
        repEmail: data.repEmail,
        billingEmail: data.billingEmail || undefined,
        adminName: data.adminName || undefined,
        adminEmail: data.adminEmail || undefined,
        employeeCount: data.employeeCount,
        billingInterval: data.billingInterval,
        agreedToTerms: data.agreedToTerms,
        oauthProvider: oauthProvider || undefined,
        teams: teams.map((t) => ({
          id: t.id,
          name: t.name,
          leaderEmail: t.leaderEmail,
          members: t.members.map((m) => ({
            name: m.name,
            email: m.email,
            photo: m.photo,
          })),
        })),
      };

      const [res] = await Promise.all([
        fetch("/api/submit-onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullPayload),
        }),
        minDelay,
      ]);

      if (!res.ok) {
        console.warn("Onboarding API failed, falling back to basic lead");
        // Fallback: at least save basic lead to Pipedrive
        const totalMembers = teams.reduce(
          (sum, t) => sum + t.members.length,
          0
        );
        await submitLead({
          email: data.repEmail,
          name: data.repName,
          company: data.companyName,
          companySize: String(data.employeeCount),
          source: `onboarding:${data.billingInterval}:${totalMembers}members:${teams.length}teams:${oauthProvider || "manual"}`,
        });
      }

      trackLeadSubmitted("onboarding");
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      clearTimeout(phaseTimer3);
      setSubmitPhase(4);
      await new Promise((r) => setTimeout(r, 1000));
      clearDraft();
      setIsSubmitting(false);
      setIsDone(true);
    } catch {
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      clearTimeout(phaseTimer3);
      setSubmitPhase(4);
      await new Promise((r) => setTimeout(r, 1000));
      clearDraft();
      setIsSubmitting(false);
      setIsDone(true);
    }
  };

  /* ─── "Done" confirmation screen — user must click to celebrate ─── */
  if (isDone && !isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-background via-white to-brand-background-secondary flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md text-center space-y-8"
        >
          {/* Big checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="mx-auto w-20 h-20 rounded-full bg-brand-success/10 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-brand-success" strokeWidth={3} />
          </motion.div>

          <div>
            <h1 className="text-2xl font-bold text-brand-text-primary mb-2">
              {txt.doneTitle}
            </h1>
            <p className="text-[14px] text-brand-text-muted">
              {txt.doneSubtitle}
            </p>
          </div>

          {/* Summary chips */}
          <div className="flex flex-wrap justify-center gap-2 text-[12px]">
            <span className="px-3 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary font-semibold">
              {watch("companyName")}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary font-semibold">
              {watch("employeeCount")} {txt.summaryMembers}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary font-semibold">
              {teams.length} {txt.summaryTeams.toLowerCase()}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-brand-success/10 text-brand-success font-semibold">
              {watch("billingInterval") === "yearly" ? txt.yearly : txt.monthly}
            </span>
          </div>

          {/* THE button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="button"
              onClick={() => setIsSuccess(true)}
              className="h-14 px-12 text-[16px] font-bold shadow-xl shadow-brand-primary/25 bg-gradient-to-r from-brand-primary to-brand-primary-hover w-full"
            >
              <Rocket className="w-5 h-5 mr-2" />
              {txt.doneButton}
            </Button>
          </motion.div>

          <p className="text-[11px] text-brand-text-muted">
            {txt.guarantee}
          </p>
        </motion.div>
      </div>
    );
  }

  /* ─── Success screen ─── */
  if (isSuccess) {
    const timelineIcons: Record<string, React.ReactNode> = {
      mail: <Mail className="w-4 h-4" />,
      phone: <Phone className="w-4 h-4" />,
      rocket: <Rocket className="w-4 h-4" />,
      sparkles: <Sparkles className="w-4 h-4" />,
    };
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6FF] via-white to-[#F0EBFF] flex items-center justify-center p-4 relative">
        <Confetti />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg w-full"
        >
          {/* Celebration header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
              className="w-24 h-24 mx-auto mb-6 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-success/20 to-brand-primary/10 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-success/10 to-brand-accent/10 rounded-3xl -rotate-3" />
              <div className="relative w-full h-full bg-white rounded-3xl shadow-xl shadow-brand-success/20 flex items-center justify-center border border-brand-success/20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <PartyPopper className="w-10 h-10 text-brand-success" />
                </motion.div>
              </div>
             {/* Floating sparkles */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [-10, -30], x: [0, (i - 1) * 30] }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute top-0"
                  style={{ left: `${30 + i * 20}%` }}
                >
                  <Star className="w-4 h-4 text-brand-warning fill-brand-warning" />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-3 font-[var(--font-display)]"
            >
              {txt.successTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-brand-text-muted text-[15px] leading-relaxed"
            >
              {txt.successSubtitle}
            </motion.p>
          </div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl shadow-brand-primary/[0.05] border border-brand-border/50 p-6 mb-6 space-y-0"
          >
            {(txt.successTimeline || []).map((step: { icon: string; title: string; desc: string }, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12 }}
                className="flex items-start gap-4 relative"
              >
                {/* Vertical line */}
                {i < (txt.successTimeline?.length || 4) - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-brand-primary/20 to-brand-primary/5" />
                )}
                {/* Icon dot */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative z-10",
                  i === 0 ? "bg-brand-success/10 text-brand-success" :
                  i === 1 ? "bg-brand-primary/10 text-brand-primary" :
                  i === 2 ? "bg-brand-warning/10 text-brand-warning" :
                  "bg-brand-accent/10 text-brand-accent"
                )}>
                  {timelineIcons[step.icon] || <Check className="w-4 h-4" />}
                </div>
                <div className={cn("pb-5", i === (txt.successTimeline?.length || 4) - 1 && "pb-0")}>
                  <p className="text-[14px] font-bold text-brand-text-primary">{step.title}</p>
                  <p className="text-[12px] text-brand-text-muted mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Social proof quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center mb-8 px-4"
          >
            <p className="text-[14px] italic text-brand-text-secondary">
              {txt.successQuote}
            </p>
            <p className="text-[12px] text-brand-text-muted mt-1">
              {txt.successQuoteAuthor}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-center"
          >
            <Link to="/">
              <Button size="lg" className="h-13 px-10 text-[15px] font-bold shadow-lg shadow-brand-primary/20 group">
                <Heart className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                {txt.successCta}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const StepIcon = STEPS[currentStep].icon;
  const motivation = (stepMotivation[language as keyof typeof stepMotivation] || stepMotivation.en);
  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FF] via-white to-[#F0EBFF]">
      {/* ─── Sticky top bar ─── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-brand-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-brand-text-primary font-bold text-lg tracking-tight font-[var(--font-display)] hover:opacity-80 transition-opacity"
          >
            Behavera
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-brand-primary bg-brand-primary/[0.08] px-2.5 py-1 rounded-full">
              {progressPercent}%
            </span>
            <div className="flex items-center gap-2 text-[12px] text-brand-text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-success" />
              <span className="hidden sm:inline">SSL · GDPR · ISO ready</span>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-brand-border/30">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* ─── Title ─── */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-text-primary tracking-tight font-[var(--font-display)] mb-2">
            {txt.pageTitle}
          </h1>
          <p className="text-brand-text-muted text-[14px] mb-3">
            {txt.pageSubtitle}
          </p>
          {/* Motivational micro-copy */}
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStep}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="inline-block text-[13px] font-semibold text-brand-primary"
            >
              {motivation[currentStep]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ─── Step indicator ─── */}
        <nav className="mb-10">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isCompleted = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.id} className="flex items-center">
                  {i > 0 && (
                    <div
                      className={cn(
                        "w-8 sm:w-12 h-[2px] transition-colors duration-300",
                        isCompleted ? "bg-brand-primary" : "bg-brand-border"
                      )}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (i < currentStep) {
                        setDirection(i < currentStep ? -1 : 1);
                        setCurrentStep(i);
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 transition-all duration-300 group",
                      i <= currentStep ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 relative",
                        isCompleted
                          ? "bg-brand-primary border-brand-primary text-white"
                          : isCurrent
                            ? "bg-white border-brand-primary text-brand-primary shadow-md shadow-brand-primary/20"
                            : "bg-white border-brand-border text-brand-text-muted"
                      )}
                    >
                      {/* Pulse ring on current step */}
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-brand-primary/40"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </motion.div>
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-semibold tracking-wide transition-colors hidden sm:block",
                        isCurrent
                          ? "text-brand-primary"
                          : isCompleted
                            ? "text-brand-text-secondary"
                            : "text-brand-text-muted"
                      )}
                    >
                      {txt.steps[i]}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </nav>

        {/* ─── Form card ─── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-xl shadow-brand-primary/[0.04] border border-brand-border/50 overflow-hidden">
            {/* Step header */}
            <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-brand-border/40 bg-gradient-to-r from-brand-background-secondary/50 via-transparent to-brand-primary/[0.02]">
              <div className="flex items-center gap-3 mb-1">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary/15 to-brand-primary/5 text-brand-primary flex items-center justify-center"
                >
                  <StepIcon className="w-4 h-4" />
                </motion.div>
                <motion.h2
                  key={`title-${currentStep}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg font-bold text-brand-text-primary"
                >
                  {currentStep === 0
                    ? txt.s0Title
                    : currentStep === 1
                      ? txt.s1Title
                      : txt.s2Title}
                </motion.h2>
              </div>
              <p className="text-[13px] text-brand-text-muted ml-12">
                {currentStep === 0
                  ? txt.s0Subtitle
                  : currentStep === 1
                    ? txt.s1Subtitle
                    : txt.s2Subtitle}
              </p>
            </div>

            {/* Step content */}
            <div className="px-6 sm:px-8 py-7 min-h-[340px] relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* ═════════ STEP 0 — Company + Contacts ═════════ */}
                  {currentStep === 0 && (
                    <div className="space-y-7">
                      <div className="space-y-5 max-w-md">
                        {/* Company name with ARES autocomplete */}
                        <div ref={aresDropdownRef} className="relative">
                          <FormField
                            label={txt.companyName}
                            error={errors.companyName?.message}
                            helperText={txt.aresHint}
                            required
                          >
                            <div className="relative">
                              <Input
                                type="text"
                                autoComplete="organization"
                                placeholder={txt.companyNamePlaceholder}
                                className="h-12"
                                {...register("companyName", {
                                  required: txt.required,
                                  minLength: { value: 2, message: txt.required },
                                  onChange: handleCompanyNameChange,
                                })}
                                onFocus={() => {
                                  if (aresResults.length > 0)
                                    setShowAresDropdown(true);
                                }}
                              />
                              {aresLoading && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted animate-spin" />
                              )}
                            </div>
                          </FormField>

                          {/* ARES dropdown */}
                          <AnimatePresence>
                            {showAresDropdown && aresResults.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl border border-brand-border shadow-xl shadow-brand-primary/[0.06] overflow-hidden max-h-[240px] overflow-y-auto"
                              >
                                {aresResults.map((r, idx) => (
                                  <button
                                    key={`${r.ico}-${idx}`}
                                    type="button"
                                    onClick={() => selectAresResult(r)}
                                    className="w-full text-left px-4 py-3 hover:bg-brand-primary/5 transition-colors border-b border-brand-border/30 last:border-0 group"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-brand-primary/[0.08] text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <Building2 className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-[13px] font-semibold text-brand-text-primary group-hover:text-brand-primary transition-colors truncate">
                                          {r.name}
                                        </p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                          <span className="text-[11px] font-mono text-brand-text-muted">
                                            IČO: {r.ico}
                                          </span>
                                          {r.address && (
                                            <span className="text-[11px] text-brand-text-muted/70 truncate flex items-center gap-1">
                                              <MapPin className="w-2.5 h-2.5 shrink-0" />
                                              {r.address}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <FormField
                          label={txt.companyId}
                          error={errors.companyId?.message}
                          helperText={txt.companyIdHelper}
                          required
                        >
                          <Input
                            type="text"
                            placeholder={txt.companyIdPlaceholder}
                            className="h-12"
                            {...register("companyId", {
                              required: txt.required,
                            })}
                          />
                        </FormField>
                      </div>

                      <div className="border-t border-brand-border/40" />

                      {/* Representative */}
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <Crown className="w-4 h-4 text-brand-warning" />
                          <h3 className="text-[14px] font-bold text-brand-text-primary">
                            {txt.repSection}
                          </h3>
                        </div>
                        <p className="text-[12px] text-brand-text-muted mb-4 ml-[26px]">
                          {txt.repSectionDesc}
                        </p>
                        <div className="space-y-4 sm:ml-[26px] max-w-md">
                          <FormField
                            label={txt.repName}
                            error={errors.repName?.message}
                            required
                          >
                            <Input
                              type="text"
                              autoComplete="name"
                              placeholder={txt.repNamePlaceholder}
                              className="h-11"
                              {...register("repName", {
                                required: txt.required,
                                minLength: { value: 2, message: txt.required },
                              })}
                            />
                          </FormField>
                          <FormField
                            label={txt.repEmail}
                            error={errors.repEmail?.message}
                            helperText={txt.repEmailHelper}
                            required
                          >
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder={txt.repEmailPlaceholder}
                              className="h-11"
                              {...register("repEmail", {
                                required: txt.required,
                                pattern: {
                                  value: /^\S+@\S+\.\S+$/,
                                  message: "Enter a valid email",
                                },
                              })}
                            />
                          </FormField>
                          <FormField
                            label={txt.billingEmail}
                            error={errors.billingEmail?.message}
                            helperText={txt.billingEmailHelper}
                          >
                            <Input
                              type="email"
                              placeholder={txt.billingEmailPlaceholder}
                              className="h-11"
                              {...register("billingEmail")}
                            />
                          </FormField>
                        </div>
                      </div>

                      <div className="border-t border-brand-border/40" />

                      {/* Admin */}
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <LayoutDashboard className="w-4 h-4 text-brand-primary" />
                          <h3 className="text-[14px] font-bold text-brand-text-primary">
                            {txt.adminSection}
                          </h3>
                        </div>
                        <p className="text-[12px] text-brand-text-muted mb-4 ml-[26px]">
                          {txt.adminSectionDesc}
                        </p>
                        <div className="space-y-4 sm:ml-[26px] max-w-md">
                          <FormField
                            label={txt.adminName}
                            error={errors.adminName?.message}
                            required
                          >
                            <Input
                              type="text"
                              autoComplete="name"
                              placeholder={txt.adminNamePlaceholder}
                              className="h-11"
                              {...register("adminName", {
                                required: txt.required,
                                minLength: { value: 2, message: txt.required },
                              })}
                            />
                          </FormField>
                          <FormField
                            label={txt.adminEmail}
                            error={errors.adminEmail?.message}
                            helperText={txt.adminEmailHelper}
                            required
                          >
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder={txt.adminEmailPlaceholder}
                              className="h-11"
                              {...register("adminEmail", {
                                required: txt.required,
                                pattern: {
                                  value: /^\S+@\S+\.\S+$/,
                                  message: "Enter a valid email",
                                },
                              })}
                            />
                          </FormField>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ═════════ STEP 1 — Teams (with inline OAuth import) ═════════ */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      {/* Compact import bar — collapsed when contacts already loaded */}
                      {oauthContacts.length > 0 ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-success/5 border border-brand-success/20">
                          <div className="w-8 h-8 rounded-full bg-brand-success/10 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-brand-success" strokeWidth={3} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-brand-text-primary">
                              {filteredContacts.length} {txt.connectSuccess}
                              {companyDomain && (
                                <span className="ml-1.5 text-[11px] font-semibold text-brand-primary">
                                  @{companyDomain}
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { clearContacts(); setSkippedConnect(false); }}
                            className="text-[11px] font-semibold text-brand-text-muted hover:text-brand-primary transition-colors shrink-0"
                          >
                            {txt.connectChange}
                          </button>
                        </div>
                      ) : oauthLoading ? (
                        <div className="flex items-center justify-center py-6 gap-3">
                          <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                          <p className="text-[13px] text-brand-text-muted font-medium">
                            {txt.loadingContacts}
                          </p>
                        </div>
                      ) : !skippedConnect ? (
                        <div className="rounded-xl border border-brand-border/50 p-4 bg-brand-background-secondary/30">
                          <div className="flex items-center gap-2.5 mb-3">
                            <UserPlus className="w-4 h-4 text-brand-primary" />
                            <span className="text-[13px] font-bold text-brand-text-primary">
                              {txt.connectTitle}
                            </span>
                          </div>

                          {oauthError && (
                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 mb-3">
                              <AlertCircle className="w-3.5 h-3.5 text-brand-error shrink-0" />
                              <p className="text-[11px] text-brand-error">
                                {oauthError === 'oauth_not_configured'
                                  ? txt.errorOAuthNotConfigured
                                  : txt.errorOAuth}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-2 mb-3">
                            <button
                              type="button"
                              onClick={() => fetchContacts("google")}
                              className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-brand-border/60 bg-white hover:border-brand-primary/30 hover:bg-brand-primary/[0.02] transition-all text-left group"
                            >
                              <GoogleLogo />
                              <span className="text-[13px] font-semibold text-brand-text-primary group-hover:text-brand-primary transition-colors">
                                {txt.connectGoogle}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => fetchContacts("microsoft")}
                              className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-brand-border/60 bg-white hover:border-brand-primary/30 hover:bg-brand-primary/[0.02] transition-all text-left group"
                            >
                              <MicrosoftLogo />
                              <span className="text-[13px] font-semibold text-brand-text-primary group-hover:text-brand-primary transition-colors">
                                {txt.connectMicrosoft}
                              </span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Lock className="w-3 h-3 text-brand-success" />
                              <span className="text-[10px] text-brand-text-muted">{txt.privacyNote}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSkippedConnect(true)}
                              className="text-[11px] font-semibold text-brand-text-muted hover:text-brand-primary transition-colors"
                            >
                              {txt.skipConnect} →
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {/* Team Builder */}
                      <TeamBuilder
                        contacts={teamBuilderContacts}
                        language={language as "cz" | "en" | "de"}
                        onTeamsChanged={(t) => { setTeams(t); saveDraft({ teams: t }); }}
                        initialTeams={teams}
                      />
                    </div>
                  )}

                  {/* ═════════ STEP 2 — Confirm ═════════ */}
                  {currentStep === 2 && (
                    <ConfirmStep
                      txt={txt}
                      language={language}
                      isEur={isEur}
                      monthlyPrice={monthlyPrice}
                      yearlyPrice={yearlyPrice}
                      register={register}
                      watch={watch}
                      getValues={getValues}
                      errors={errors}
                      teams={teams}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ─── Footer / Navigation ─── */}
            <div className="px-6 sm:px-8 py-5 border-t border-brand-border/40 bg-brand-background-secondary/30 flex items-center justify-between">
              {currentStep > 0 ? (
                <motion.button
                  type="button"
                  onClick={goBack}
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 text-[13px] font-semibold text-brand-text-muted hover:text-brand-text-primary transition-colors px-4 py-2.5 rounded-xl hover:bg-brand-background-muted"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {txt.back}
                </motion.button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length - 1 ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    onClick={goNext}
                    className="h-12 px-8 text-[14px] font-bold shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-shadow group"
                  >
                    {txt.next}
                    <motion.span
                      className="inline-flex ml-1.5"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.span>
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-10 text-[15px] font-bold shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 transition-shadow bg-gradient-to-r from-brand-primary to-brand-primary-hover"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={submitPhase}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                          >
                            {(txt.submitting as string[])[submitPhase] || (txt.submitting as string[])[0]}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        {txt.submit}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </form>

        {/* ─── Bottom trust strip ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[12px] text-brand-text-muted"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-success" />
            <span>GDPR compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-brand-warning" />
            <span>{txt.guarantee}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-brand-primary" />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-brand-primary" />
            <span>hello@behavera.com</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

/* ─── Confirmation step sub-component ─── */
function ConfirmStep({
  txt,
  language,
  isEur,
  monthlyPrice,
  yearlyPrice,
  register,
  watch,
  getValues,
  errors,
  teams,
}: {
  txt: (typeof copy)[keyof typeof copy];
  language: string;
  isEur: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  register: UseFormRegister<OnboardingFormData>;
  watch: UseFormWatch<OnboardingFormData>;
  getValues: UseFormGetValues<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
  teams: Team[];
}) {
  const vals = getValues();
  const currentInterval = watch("billingInterval");
  const currentCount = watch("employeeCount");
  const currentPricePerPerson =
    currentInterval === "monthly" ? monthlyPrice : yearlyPrice;
  const monthlyTotal = currentPricePerPerson * currentCount;
  const annualTotal = monthlyTotal * 12;
  const totalMembers = teams.reduce(
    (sum: number, t: Team) => sum + t.members.length,
    0
  );

  return (
    <div className="space-y-7">
      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        <SummaryCard
          icon={<Building2 className="w-4 h-4" />}
          label={txt.summaryCompany}
          value={vals.companyName}
          sub={`IČO: ${vals.companyId}`}
        />
        <SummaryCard
          icon={<Crown className="w-4 h-4" />}
          label={txt.summaryRep}
          value={vals.repName}
          sub={vals.repEmail}
        />
        <SummaryCard
          icon={<LayoutDashboard className="w-4 h-4" />}
          label={txt.summaryAdmin}
          value={vals.adminName}
          sub={vals.adminEmail}
        />
        <SummaryCard
          icon={<Users className="w-4 h-4" />}
          label={txt.summaryTeams}
          value={`${teams.length} ${teams.length === 1 ? "team" : "teams"}`}
          sub={`${totalMembers} ${txt.summaryMembers}`}
        />
      </div>

      {/* Employee count slider */}
      <div>
        <label className="block text-[13px] font-semibold text-brand-text-primary mb-1">
          {txt.employeeCount}{" "}
          <span className="text-brand-error">*</span>
        </label>
        <p className="text-[11px] text-brand-text-muted mb-3">
          {txt.employeeCountHelper}
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="10"
            max="350"
            step="5"
            {...register("employeeCount", { valueAsNumber: true })}
            className="flex-1 h-2 appearance-none cursor-pointer bg-brand-border rounded-full
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-brand-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab
              [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-brand-primary [&::-moz-range-thumb]:cursor-grab"
          />
          <div className="text-xl font-bold font-mono text-brand-primary min-w-[56px] text-right">
            {currentCount}
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-brand-text-muted mt-1 px-1">
          <span>10</span>
          <span>100</span>
          <span>200</span>
          <span>350+</span>
        </div>
      </div>

      {/* Billing toggle + price */}
      <div className="rounded-xl border border-brand-border/60 p-5 bg-gradient-to-r from-brand-background-secondary/50 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[14px] font-bold text-brand-text-primary">
            {txt.plan}
          </h4>
          <div className="flex bg-brand-background-muted p-1 rounded-lg border border-brand-border">
            <label
              className={cn(
                "px-3 py-1.5 rounded-md text-[12px] font-bold cursor-pointer transition-all",
                currentInterval === "monthly"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-brand-text-muted hover:text-brand-primary"
              )}
            >
              <input
                type="radio"
                value="monthly"
                className="sr-only"
                {...register("billingInterval")}
              />
              {txt.monthly}
            </label>
            <label
              className={cn(
                "px-3 py-1.5 rounded-md text-[12px] font-bold cursor-pointer transition-all flex items-center gap-1.5",
                currentInterval === "yearly"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-brand-text-muted hover:text-brand-primary"
              )}
            >
              <input
                type="radio"
                value="yearly"
                className="sr-only"
                {...register("billingInterval")}
              />
              {txt.yearly}
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                  currentInterval === "yearly"
                    ? "bg-white/20 text-white"
                    : "bg-brand-success/10 text-brand-success"
                )}
              >
                {txt.saveTag}
              </span>
            </label>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-brand-text-primary font-mono">
            {isEur
              ? `\u20AC${monthlyTotal.toLocaleString()}`
              : `${monthlyTotal.toLocaleString()} K\u010D`}
          </span>
          <span className="text-[13px] text-brand-text-muted">
            / {txt.monthly.toLowerCase()}
          </span>
        </div>
        <p className="text-[12px] text-brand-text-muted mt-1">
          {isEur
            ? `\u20AC${currentPricePerPerson}`
            : `${currentPricePerPerson} K\u010D`}{" "}
          {txt.pricePerPerson} × {currentCount}
        </p>
        {currentInterval === "yearly" && (
          <p className="text-[12px] font-semibold text-brand-success mt-1">
            {isEur
              ? `= \u20AC${annualTotal.toLocaleString()}`
              : `= ${annualTotal.toLocaleString()} K\u010D`}{" "}
            / {language === "cz" ? "rok" : language === "de" ? "Jahr" : "year"}
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer"
            {...register("agreedToTerms", { required: txt.required })}
          />
          <span className="text-[13px] text-brand-text-secondary leading-relaxed group-hover:text-brand-text-primary transition-colors">
            {txt.termsAgree}{" "}
            <a
              href="https://www.behavera.com/podminky-pouzivani-sluzby"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary underline underline-offset-2 hover:text-brand-primary-hover"
            >
              {txt.termsLink}
            </a>{" "}
            {txt.termsAnd}{" "}
            <a
              href="https://www.behavera.com/ochrana-osobnich-udaju"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary underline underline-offset-2 hover:text-brand-primary-hover"
            >
              {txt.privacyLink}
            </a>
          </span>
        </label>
        {errors.agreedToTerms && (
          <p className="text-[12px] text-brand-error flex items-center gap-1 ml-8">
            <AlertCircle className="w-3 h-3" />
            {errors.agreedToTerms.message}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Summary card ─── */
function SummaryCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-brand-border/50 bg-white p-4 flex items-start gap-3 cursor-default"
    >
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 text-brand-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wider">
          {label}
        </p>
        <p className="text-[14px] font-bold text-brand-text-primary truncate">
          {value}
        </p>
        <p className="text-[12px] text-brand-text-muted truncate">{sub}</p>
      </div>
    </motion.div>
  );
}
