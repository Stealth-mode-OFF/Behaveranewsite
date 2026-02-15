import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
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
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { FormField } from "@/app/components/ui/form-field";
import { useLanguage } from "@/app/LanguageContext";
import { submitLead } from "@/app/utils/lead";
import { trackLeadSubmitted } from "@/lib/analytics";
import { cn } from "@/app/components/ui/utils";
import {
  useOAuthContacts,
  type OAuthContact,
} from "@/app/hooks/useOAuthContacts";
import {
  TeamBuilder,
  type Team,
  type TeamContact,
} from "@/app/components/team-builder";
import { useAresLookup, type AresResult } from "@/app/hooks/useAresLookup";

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
  { id: "connect", icon: UserPlus },
  { id: "teams", icon: Users },
  { id: "confirm", icon: CreditCard },
] as const;

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
    pageTitle: "Vytvořte si Echo Pulse účet",
    pageSubtitle: "Zabere to méně než 2 minuty",
    steps: ["Společnost", "Kontakty", "Týmy", "Potvrzení"],
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
    adminSectionDesc: "Kdo bude Echo Pulse denně používat?",
    adminName: "Jméno administrátora",
    adminNamePlaceholder: "Jana Smolíková",
    adminEmail: "Email administrátora",
    adminEmailPlaceholder: "jana@firma.cz",
    adminEmailHelper: "Pošleme pozvánku a instrukce k nastavení.",
    s1Title: "Načtěte zaměstnance",
    s1Subtitle: "Propojte firemní adresář — e-maily načteme automaticky.",
    connectTitle: "Načtěte kontakty jedním klikem",
    connectSubtitle: "Přihlaste se přes firemní účet a my bezpečně načteme seznam zaměstnanců z vašeho adresáře.",
    connectGoogle: "Pokračovat přes Google",
    connectMicrosoft: "Pokračovat přes Microsoft",
    privacyNote: "Čteme pouze jména a e-maily. Nikdy nepřistupujeme k vašim e-mailům, souborům ani kalendářům.",
    connectSuccess: "Načteno kontaktů",
    connectDomain: "z firemní domény",
    connectOther: "ostatní kontakty",
    connectChange: "Připojit jiný účet",
    skipConnect: "Přeskočit — přidám ručně",
    skipConnectNote: "Budete moci přidat zaměstnance ručně v dalším kroku.",
    loadingContacts: "Načítám adresář…",
    errorOAuth: "Nepodařilo se propojit. Zkuste to znovu.",
    s2Title: "Sestavte týmy",
    s2Subtitle: "Přetáhněte zaměstnance do týmů. Nezapomeňte přiřadit team leadera.",
    s3Title: "Potvrzení & spuštění",
    s3Subtitle: "Zkontrolujte údaje a potvrďte vytvoření účtu.",
    summaryCompany: "Společnost",
    summaryRep: "Zástupce",
    summaryAdmin: "Administrátor",
    summaryTeams: "Týmy",
    summaryMembers: "členů",
    employeeCount: "Počet zaměstnanců",
    employeeCountHelper: "Kolik lidí bude Echo Pulse používat?",
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
    successTitle: "Účet vytvořen!",
    successSubtitle: "Pozvánku a instrukce jsme odeslali na email administrátora. Do hodiny se ozveme a provedeme vás úvodním nastavením.",
    successCta: "Zpět na hlavní stránku",
    next: "Pokračovat",
    back: "Zpět",
    required: "Povinné pole",
  },
  en: {
    pageTitle: "Create your Echo Pulse account",
    pageSubtitle: "Takes less than 2 minutes",
    steps: ["Company", "Contacts", "Teams", "Confirm"],
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
    adminSectionDesc: "Who will use Echo Pulse day to day?",
    adminName: "Admin name",
    adminNamePlaceholder: "Jane Doe",
    adminEmail: "Admin email",
    adminEmailPlaceholder: "jane@company.com",
    adminEmailHelper: "We'll send an invite and getting-started instructions.",
    s1Title: "Import employees",
    s1Subtitle: "Connect your company directory — we import emails automatically.",
    connectTitle: "Import contacts in one click",
    connectSubtitle: "Sign in with your company account and we'll securely import your employee directory.",
    connectGoogle: "Continue with Google",
    connectMicrosoft: "Continue with Microsoft",
    privacyNote: "We only read names and emails. We never access your email content, files, or calendars.",
    connectSuccess: "contacts imported",
    connectDomain: "from company domain",
    connectOther: "other contacts",
    connectChange: "Connect different account",
    skipConnect: "Skip — I'll add manually",
    skipConnectNote: "You can add employees manually in the next step.",
    loadingContacts: "Importing directory…",
    errorOAuth: "Connection failed. Please try again.",
    s2Title: "Build teams",
    s2Subtitle: "Drag employees into teams. Don't forget to assign a team leader.",
    s3Title: "Confirm & launch",
    s3Subtitle: "Review the details and confirm account creation.",
    summaryCompany: "Company",
    summaryRep: "Representative",
    summaryAdmin: "Admin",
    summaryTeams: "Teams",
    summaryMembers: "members",
    employeeCount: "Number of employees",
    employeeCountHelper: "How many people will use Echo Pulse?",
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
    successTitle: "Account created!",
    successSubtitle: "We've sent an invite and instructions to the admin email. We'll reach out within an hour to walk you through initial setup.",
    successCta: "Back to homepage",
    next: "Continue",
    back: "Back",
    required: "Required",
  },
  de: {
    pageTitle: "Erstellen Sie Ihr Echo Pulse Konto",
    pageSubtitle: "Dauert weniger als 2 Minuten",
    steps: ["Unternehmen", "Kontakte", "Teams", "Bestätigung"],
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
    adminSectionDesc: "Wer Echo Pulse täglich nutzen wird?",
    adminName: "Admin-Name",
    adminNamePlaceholder: "Erika Musterfrau",
    adminEmail: "Admin-E-Mail",
    adminEmailPlaceholder: "erika@firma.de",
    adminEmailHelper: "Wir senden eine Einladung und Einrichtungsanleitung.",
    s1Title: "Mitarbeiter importieren",
    s1Subtitle: "Verbinden Sie Ihr Firmenverzeichnis — E-Mails werden automatisch importiert.",
    connectTitle: "Kontakte mit einem Klick importieren",
    connectSubtitle: "Melden Sie sich mit Ihrem Firmenkonto an und wir importieren Ihr Mitarbeiterverzeichnis sicher.",
    connectGoogle: "Weiter mit Google",
    connectMicrosoft: "Weiter mit Microsoft",
    privacyNote: "Wir lesen nur Namen und E-Mails. Wir greifen nie auf Ihre E-Mail-Inhalte, Dateien oder Kalender zu.",
    connectSuccess: "Kontakte importiert",
    connectDomain: "aus der Firmendomäne",
    connectOther: "andere Kontakte",
    connectChange: "Anderes Konto verbinden",
    skipConnect: "Überspringen — manuell hinzufügen",
    skipConnectNote: "Sie können Mitarbeiter im nächsten Schritt manuell hinzufügen.",
    loadingContacts: "Verzeichnis wird importiert…",
    errorOAuth: "Verbindung fehlgeschlagen. Bitte erneut versuchen.",
    s2Title: "Teams aufbauen",
    s2Subtitle: "Ziehen Sie Mitarbeiter in Teams. Vergessen Sie nicht, einen Teamleiter zuzuweisen.",
    s3Title: "Bestätigen & starten",
    s3Subtitle: "Überprüfen Sie die Details und bestätigen Sie die Kontoerstellung.",
    summaryCompany: "Unternehmen",
    summaryRep: "Vertreter",
    summaryAdmin: "Admin",
    summaryTeams: "Teams",
    summaryMembers: "Mitglieder",
    employeeCount: "Anzahl der Mitarbeiter",
    employeeCountHelper: "Wie viele Personen werden Echo Pulse nutzen?",
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
    successTitle: "Konto erstellt!",
    successSubtitle: "Wir haben eine Einladung und Anleitung an die Admin-E-Mail gesendet. Innerhalb einer Stunde melden wir uns.",
    successCta: "Zurück zur Startseite",
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
export function OnboardingPage() {
  const { language } = useLanguage();
  const txt = copy[language] || copy.en;

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  // OAuth contacts
  const {
    contacts: oauthContacts,
    loading: oauthLoading,
    error: oauthError,
    provider: oauthProvider,
    fetchContacts,
    clearContacts,
  } = useOAuthContacts();
  const [skippedConnect, setSkippedConnect] = useState(false);

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
      companyName: "",
      companyId: "",
      repName: "",
      repEmail: "",
      billingEmail: "",
      adminName: "",
      adminEmail: "",
      employeeCount: 50,
      billingInterval: "yearly",
      agreedToTerms: false,
    },
    mode: "onBlur",
  });

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

  // Contacts for TeamBuilder
  const teamBuilderContacts: TeamContact[] = useMemo(() => {
    const pool = companyDomain ? domainContacts : oauthContacts;
    return pool.map((c) => ({
      name: c.name,
      email: c.email,
      photo: c.photo,
    }));
  }, [domainContacts, oauthContacts, companyDomain]);

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
        2: [],
        3: ["employeeCount", "agreedToTerms"],
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
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  /* ─── Submit ─── */
  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
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

      trackLeadSubmitted("onboarding");
      setIsSuccess(true);
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── Success screen ─── */
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F6FF] via-white to-[#F0EBFF] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 mx-auto mb-8 bg-brand-success/10 rounded-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Rocket className="w-10 h-10 text-brand-success" />
            </motion.div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 font-[var(--font-display)]">
            {txt.successTitle}
          </h1>
          <p className="text-brand-text-muted text-[16px] leading-relaxed mb-10 max-w-md mx-auto">
            {txt.successSubtitle}
          </p>
          <Link to="/">
            <Button size="lg" className="h-12 px-8 text-[15px] font-semibold">
              {txt.successCta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const StepIcon = STEPS[currentStep].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FF] via-white to-[#F0EBFF]">
      {/* ─── Sticky top bar ─── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-brand-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-brand-text-primary font-bold text-lg tracking-tight font-[var(--font-display)] hover:opacity-80 transition-opacity"
          >
            Echo Pulse
          </Link>
          <div className="flex items-center gap-2 text-[12px] text-brand-text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-success" />
            <span>SSL · GDPR · ISO ready</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* ─── Title ─── */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-text-primary tracking-tight font-[var(--font-display)] mb-2">
            {txt.pageTitle}
          </h1>
          <p className="text-brand-text-muted text-[14px]">
            {txt.pageSubtitle}
          </p>
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
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                        isCompleted
                          ? "bg-brand-primary border-brand-primary text-white"
                          : isCurrent
                            ? "bg-white border-brand-primary text-brand-primary shadow-md shadow-brand-primary/20"
                            : "bg-white border-brand-border text-brand-text-muted"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" strokeWidth={3} />
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
            <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-brand-border/40 bg-gradient-to-r from-brand-background-secondary/50 to-transparent">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <StepIcon className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-brand-text-primary">
                  {currentStep === 0
                    ? txt.s0Title
                    : currentStep === 1
                      ? txt.s1Title
                      : currentStep === 2
                        ? txt.s2Title
                        : txt.s3Title}
                </h2>
              </div>
              <p className="text-[13px] text-brand-text-muted ml-11">
                {currentStep === 0
                  ? txt.s0Subtitle
                  : currentStep === 1
                    ? txt.s1Subtitle
                    : currentStep === 2
                      ? txt.s2Subtitle
                      : txt.s3Subtitle}
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

                  {/* ═════════ STEP 1 — Connect / Import ═════════ */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      {oauthContacts.length > 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-5"
                        >
                          <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-success/5 border border-brand-success/20">
                            <div className="w-10 h-10 rounded-full bg-brand-success/10 flex items-center justify-center shrink-0">
                              <Check className="w-5 h-5 text-brand-success" strokeWidth={3} />
                            </div>
                            <div>
                              <p className="text-[15px] font-bold text-brand-text-primary">
                                {oauthContacts.length} {txt.connectSuccess}
                              </p>
                              <p className="text-[12px] text-brand-text-muted">
                                {domainContacts.length > 0 && (
                                  <span className="font-semibold text-brand-primary">
                                    {domainContacts.length} {txt.connectDomain}
                                  </span>
                                )}
                                {domainContacts.length > 0 && otherContacts.length > 0 && " · "}
                                {otherContacts.length > 0 && (
                                  <span>
                                    {otherContacts.length} {txt.connectOther}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Preview sample contacts */}
                          <div className="rounded-xl border border-brand-border/50 overflow-hidden">
                            <div className="px-4 py-2 bg-brand-background-secondary/50 border-b border-brand-border/30">
                              <span className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider">
                                {companyDomain || "Contacts"}
                              </span>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto">
                              {(companyDomain ? domainContacts : oauthContacts)
                                .slice(0, 20)
                                .map((c) => (
                                  <div
                                    key={c.email}
                                    className="flex items-center gap-3 px-4 py-2 border-b border-brand-border/20 last:border-0"
                                  >
                                    {c.photo ? (
                                      <img
                                        src={c.photo}
                                        alt=""
                                        className="w-6 h-6 rounded-full object-cover shrink-0"
                                      />
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary text-[9px] font-bold flex items-center justify-center shrink-0">
                                        {c.name
                                          ? c.name
                                              .split(" ")
                                              .map((w) => w[0])
                                              .join("")
                                              .slice(0, 2)
                                              .toUpperCase()
                                          : c.email[0].toUpperCase()}
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      {c.name && (
                                        <span className="text-[12px] font-semibold text-brand-text-primary mr-2">
                                          {c.name}
                                        </span>
                                      )}
                                      <span className="text-[11px] text-brand-text-muted">
                                        {c.email}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              {(companyDomain ? domainContacts : oauthContacts).length > 20 && (
                                <div className="px-4 py-2 text-center text-[11px] text-brand-text-muted bg-brand-background-secondary/30">
                                  + {(companyDomain ? domainContacts : oauthContacts).length - 20} more…
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              clearContacts();
                              setSkippedConnect(false);
                            }}
                            className="text-[12px] font-semibold text-brand-text-muted hover:text-brand-primary transition-colors"
                          >
                            {txt.connectChange}
                          </button>
                        </motion.div>
                      ) : oauthLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                          <p className="text-[13px] text-brand-text-muted font-medium">
                            {txt.loadingContacts}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="text-center max-w-sm mx-auto">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center">
                              <UserPlus className="w-7 h-7 text-brand-primary" />
                            </div>
                            <h3 className="text-[16px] font-bold text-brand-text-primary mb-2">
                              {txt.connectTitle}
                            </h3>
                            <p className="text-[13px] text-brand-text-muted leading-relaxed">
                              {txt.connectSubtitle}
                            </p>
                          </div>

                          {oauthError && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                              <AlertCircle className="w-4 h-4 text-brand-error shrink-0" />
                              <p className="text-[12px] text-brand-error">{txt.errorOAuth}</p>
                            </div>
                          )}

                          <div className="space-y-3 max-w-sm mx-auto">
                            <button
                              type="button"
                              onClick={() => fetchContacts("google")}
                              className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 border-brand-border/60 bg-white hover:border-brand-primary/30 hover:bg-brand-primary/[0.02] transition-all text-left group"
                            >
                              <GoogleLogo />
                              <span className="text-[14px] font-semibold text-brand-text-primary group-hover:text-brand-primary transition-colors">
                                {txt.connectGoogle}
                              </span>
                              <ArrowRight className="w-4 h-4 text-brand-text-muted ml-auto group-hover:text-brand-primary transition-colors" />
                            </button>
                            <button
                              type="button"
                              onClick={() => fetchContacts("microsoft")}
                              className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 border-brand-border/60 bg-white hover:border-brand-primary/30 hover:bg-brand-primary/[0.02] transition-all text-left group"
                            >
                              <MicrosoftLogo />
                              <span className="text-[14px] font-semibold text-brand-text-primary group-hover:text-brand-primary transition-colors">
                                {txt.connectMicrosoft}
                              </span>
                              <ArrowRight className="w-4 h-4 text-brand-text-muted ml-auto group-hover:text-brand-primary transition-colors" />
                            </button>
                          </div>

                          {/* Privacy note */}
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-brand-background-secondary/50 max-w-sm mx-auto">
                            <Lock className="w-3.5 h-3.5 text-brand-success mt-0.5 shrink-0" />
                            <p className="text-[11px] text-brand-text-muted leading-relaxed">
                              {txt.privacyNote}
                            </p>
                          </div>

                          {/* Skip option */}
                          <div className="text-center pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSkippedConnect(true);
                                goNext();
                              }}
                              className="text-[13px] font-semibold text-brand-text-muted hover:text-brand-primary transition-colors"
                            >
                              {txt.skipConnect} →
                            </button>
                            <p className="text-[11px] text-brand-text-muted/70 mt-1">
                              {txt.skipConnectNote}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ═════════ STEP 2 — Team Builder ═════════ */}
                  {currentStep === 2 && (
                    <TeamBuilder
                      contacts={teamBuilderContacts}
                      language={language as "cz" | "en" | "de"}
                      onTeamsChanged={setTeams}
                      initialTeams={teams}
                    />
                  )}

                  {/* ═════════ STEP 3 — Confirm ═════════ */}
                  {currentStep === 3 && (
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
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-text-muted hover:text-brand-text-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {txt.back}
                </button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="h-11 px-6 text-[14px] font-semibold"
                >
                  {txt.next}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-8 text-[14px] font-semibold"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {txt.submit}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* ─── Bottom trust strip ─── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[12px] text-brand-text-muted">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-success" />
            <span>GDPR compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-warning" />
            <span>{txt.guarantee}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-brand-primary" />
            <span>hello@behavera.com</span>
          </div>
        </div>
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
  txt: any;
  language: string;
  isEur: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  register: any;
  watch: any;
  getValues: any;
  errors: any;
  teams: Team[];
}) {
  const vals = getValues();
  const currentInterval = watch("billingInterval");
  const currentCount = watch("employeeCount");
  const currentPricePerPerson =
    currentInterval === "monthly" ? monthlyPrice : yearlyPrice;
  const currentBillable = Math.min(currentCount, 200);
  const currentBase = currentPricePerPerson * currentBillable;
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
              ? `\u20AC${currentBase.toLocaleString()}`
              : `${currentBase.toLocaleString()} K\u010D`}
          </span>
          <span className="text-[13px] text-brand-text-muted">
            / {txt.monthly.toLowerCase()}
          </span>
        </div>
        <p className="text-[12px] text-brand-text-muted mt-1">
          {isEur
            ? `\u20AC${currentPricePerPerson}`
            : `${currentPricePerPerson} K\u010D`}{" "}
          {txt.pricePerPerson} × {currentBillable}
        </p>
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
    <div className="rounded-xl border border-brand-border/50 bg-white p-4 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-brand-primary/[0.08] text-brand-primary flex items-center justify-center shrink-0">
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
    </div>
  );
}
