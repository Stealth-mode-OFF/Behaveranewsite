import { useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  UserCog,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Sparkles,
  Mail,
  AlertCircle,
  Rocket,
  Crown,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { FormField } from "@/app/components/ui/form-field";
import { useLanguage } from "@/app/LanguageContext";
import { submitLead } from "@/app/utils/lead";
import { trackLeadSubmitted } from "@/lib/analytics";
import { cn } from "@/app/components/ui/utils";

/* ─── Types ─── */
type TeamMember = {
  email: string;
};

type TeamEntry = {
  name: string;
  leaderEmail: string;
  members: TeamMember[];
};

type OnboardingFormData = {
  companyName: string;
  companyId: string;
  repName: string;
  repEmail: string;
  billingEmail: string;
  adminName: string;
  adminEmail: string;
  teams: TeamEntry[];
  employeeCount: number;
  billingInterval: "monthly" | "yearly";
  agreedToTerms: boolean;
};

/* ─── Steps definition ─── */
const STEPS = [
  { id: "company", icon: Building2 },
  { id: "roles", icon: UserCog },
  { id: "teams", icon: Users },
  { id: "confirm", icon: CreditCard },
] as const;

/* ─── Translations ─── */
const copy = {
  cz: {
    pageTitle: "Vytvořte si Echo Pulse účet",
    pageSubtitle: "Zabere to méně než 2 minuty",
    steps: ["Společnost", "Kontakty", "Týmy", "Potvrzení"],
    // Step 1
    s1Title: "Základní údaje společnosti",
    s1Subtitle: "Tyto údaje použijeme k nastavení vašeho účtu a fakturace.",
    companyName: "Název společnosti",
    companyNamePlaceholder: "Acme s.r.o.",
    companyId: "IČO",
    companyIdPlaceholder: "12345678",
    companyIdHelper: "8místné identifikační číslo",
    // Step 2
    s2Title: "Kontaktní osoby",
    s2Subtitle: "Kdo zastupuje firmu a kdo bude systém denně používat?",
    repSection: "Zástupce společnosti",
    repSectionDesc: "Osoba, která řeší smlouvu a fakturaci.",
    repName: "Jméno zástupce",
    repNamePlaceholder: "Jan Novák",
    repEmail: "Email zástupce",
    repEmailPlaceholder: "jan.novak@firma.cz",
    repEmailHelper: "Sem posíláme smlouvu, faktury a důležité aktualizace.",
    billingEmail: "Fakturační email (volitelné)",
    billingEmailPlaceholder: "fakturace@firma.cz",
    billingEmailHelper: "Pokud chcete faktury na jiný email.",
    adminSection: "Budoucí administrátor",
    adminSectionDesc: "Kdo bude Echo Pulse denně používat.",
    adminName: "Jméno administrátora",
    adminNamePlaceholder: "Jana Smolíková",
    adminEmail: "Email administrátora",
    adminEmailPlaceholder: "jana.smolikova@firma.cz",
    adminEmailHelper: "Pošleme pozvánku a instrukce k nastavení. Počáteční setup projdeme spolu.",
    // Step 3
    s3Title: "Nastavte týmy",
    s3Subtitle: "Vytvořte týmy a přidejte členy, kteří budou dostávat Echo Pulse.",
    teamName: "Název týmu",
    teamNamePlaceholder: "Marketing",
    teamLeader: "Email team leadera",
    teamLeaderPlaceholder: "leader@firma.cz",
    teamLeaderHelper: "Team leader vidí pouze výsledky svého týmu.",
    teamMembers: "Členové týmu",
    teamMemberPlaceholder: "zamestnanec@firma.cz",
    teamMemberHelper: "Zaměstnanci, kteří budou vyplňovat Echo Pulse.",
    addMember: "Přidat člena",
    addTeam: "Přidat další tým",
    removeTeam: "Odebrat tým",
    // Step 4
    s4Title: "Potvrzení & spuštění",
    s4Subtitle: "Zkontrolujte údaje a potvrďte vytvoření účtu.",
    summaryCompany: "Společnost",
    summaryRep: "Zástupce",
    summaryAdmin: "Administrátor",
    summaryTeams: "Týmy",
    summaryMembers: "členů",
    employeeCount: "Počet zaměstnanců",
    employeeCountHelper: "Kolik lidí bude Echo Pulse používat (odpovídat nebo vidět výsledky)?",
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
    // Success
    successTitle: "Účet vytvořen!",
    successSubtitle: "Pozvánku a instrukce jsme odeslali na email administrátora. Do hodiny se ozveme a provedeme vás úvodním nastavením.",
    successCta: "Zpět na hlavní stránku",
    // Navigation
    next: "Pokračovat",
    back: "Zpět",
    required: "Povinné pole",
  },
  en: {
    pageTitle: "Create your Echo Pulse account",
    pageSubtitle: "Takes less than 2 minutes",
    steps: ["Company", "Contacts", "Teams", "Confirm"],
    s1Title: "Company details",
    s1Subtitle: "We use these details to set up your account and billing.",
    companyName: "Company name",
    companyNamePlaceholder: "Acme Inc.",
    companyId: "Company ID",
    companyIdPlaceholder: "12345678",
    companyIdHelper: "Official registration number",
    s2Title: "Contact people",
    s2Subtitle: "Who represents the company and who will use the system daily?",
    repSection: "Company representative",
    repSectionDesc: "Handles the contract and billing on your side.",
    repName: "Representative name",
    repNamePlaceholder: "John Smith",
    repEmail: "Representative email",
    repEmailPlaceholder: "john.smith@company.com",
    repEmailHelper: "We'll send the contract, invoices, and key updates here.",
    billingEmail: "Billing email (optional)",
    billingEmailPlaceholder: "billing@company.com",
    billingEmailHelper: "If you want invoices sent elsewhere.",
    adminSection: "Future account admin",
    adminSectionDesc: "Who will use Echo Pulse day to day.",
    adminName: "Admin name",
    adminNamePlaceholder: "Jane Doe",
    adminEmail: "Admin email",
    adminEmailPlaceholder: "jane.doe@company.com",
    adminEmailHelper: "We'll send an invite and getting-started instructions.",
    s3Title: "Set up teams",
    s3Subtitle: "Create teams and add members who'll receive Echo Pulse.",
    teamName: "Team name",
    teamNamePlaceholder: "Marketing",
    teamLeader: "Team leader email",
    teamLeaderPlaceholder: "leader@company.com",
    teamLeaderHelper: "Team leader only sees their team's results.",
    teamMembers: "Team members",
    teamMemberPlaceholder: "employee@company.com",
    teamMemberHelper: "Employees who will complete Echo Pulses.",
    addMember: "Add member",
    addTeam: "Add another team",
    removeTeam: "Remove team",
    s4Title: "Confirm & launch",
    s4Subtitle: "Review the details and confirm account creation.",
    summaryCompany: "Company",
    summaryRep: "Representative",
    summaryAdmin: "Admin",
    summaryTeams: "Teams",
    summaryMembers: "members",
    employeeCount: "Number of employees",
    employeeCountHelper: "How many people will use Echo Pulse (answer or access results)?",
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
    s1Title: "Unternehmensdetails",
    s1Subtitle: "Wir verwenden diese Daten für Ihr Konto und die Abrechnung.",
    companyName: "Firmenname",
    companyNamePlaceholder: "Acme GmbH",
    companyId: "Handelsregister-Nr.",
    companyIdPlaceholder: "HRB 12345",
    companyIdHelper: "Offizielle Registrierungsnummer",
    s2Title: "Kontaktpersonen",
    s2Subtitle: "Wer vertritt das Unternehmen und wer nutzt das System täglich?",
    repSection: "Unternehmensvertreter",
    repSectionDesc: "Zuständig für Vertrag und Abrechnung.",
    repName: "Name des Vertreters",
    repNamePlaceholder: "Max Mustermann",
    repEmail: "E-Mail des Vertreters",
    repEmailPlaceholder: "max.mustermann@firma.de",
    repEmailHelper: "Hier senden wir Vertrag, Rechnungen und wichtige Updates.",
    billingEmail: "Rechnungs-E-Mail (optional)",
    billingEmailPlaceholder: "buchhaltung@firma.de",
    billingEmailHelper: "Falls Rechnungen an eine andere Adresse gehen sollen.",
    adminSection: "Zukünftiger Account-Admin",
    adminSectionDesc: "Wer Echo Pulse täglich nutzen wird.",
    adminName: "Admin-Name",
    adminNamePlaceholder: "Erika Musterfrau",
    adminEmail: "Admin-E-Mail",
    adminEmailPlaceholder: "erika.musterfrau@firma.de",
    adminEmailHelper: "Wir senden eine Einladung und Einrichtungsanleitung.",
    s3Title: "Teams einrichten",
    s3Subtitle: "Erstellen Sie Teams und fügen Sie Mitglieder hinzu.",
    teamName: "Teamname",
    teamNamePlaceholder: "Marketing",
    teamLeader: "Teamleiter-E-Mail",
    teamLeaderPlaceholder: "leiter@firma.de",
    teamLeaderHelper: "Der Teamleiter sieht nur die Ergebnisse seines Teams.",
    teamMembers: "Teammitglieder",
    teamMemberPlaceholder: "mitarbeiter@firma.de",
    teamMemberHelper: "Mitarbeiter, die Echo Pulse ausfüllen werden.",
    addMember: "Mitglied hinzufügen",
    addTeam: "Weiteres Team hinzufügen",
    removeTeam: "Team entfernen",
    s4Title: "Bestätigen & starten",
    s4Subtitle: "Überprüfen Sie die Details und bestätigen Sie die Kontoerstellung.",
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
    successSubtitle: "Wir haben eine Einladung und Anleitung an die Admin-E-Mail gesendet. Innerhalb einer Stunde melden wir uns für das Erst-Setup.",
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
  center: {
    x: 0,
    opacity: 1,
  },
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

  const isEur = language === "en" || language === "de";
  const monthlyPrice = isEur ? 5 : 129;
  const yearlyPrice = isEur ? 4 : 99;

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
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
      teams: [{ name: "", leaderEmail: "", members: [{ email: "" }] }],
      employeeCount: 50,
      billingInterval: "yearly",
      agreedToTerms: false,
    },
    mode: "onBlur",
  });

  const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({
    control,
    name: "teams",
  });

  const billingInterval = watch("billingInterval");
  const employeeCount = watch("employeeCount");
  const pricePerPerson = billingInterval === "monthly" ? monthlyPrice : yearlyPrice;
  const BILLABLE_CAP = 200;
  const billable = Math.min(employeeCount, BILLABLE_CAP);
  const basePrice = pricePerPerson * billable;

  /* ─── Step validation ─── */
  const validateStep = useCallback(async (step: number) => {
    const fieldsByStep: Record<number, (keyof OnboardingFormData)[]> = {
      0: ["companyName", "companyId"],
      1: ["repName", "repEmail", "adminName", "adminEmail"],
      2: ["teams"],
      3: ["employeeCount", "agreedToTerms"],
    };
    const result = await trigger(fieldsByStep[step]);
    return result;
  }, [trigger]);

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
      const totalMembers = data.teams.reduce(
        (sum, t) => sum + t.members.filter((m) => m.email.trim()).length,
        0
      );

      await submitLead({
        email: data.repEmail,
        name: data.repName,
        company: data.companyName,
        companySize: String(data.employeeCount),
        source: `onboarding:${data.billingInterval}:${totalMembers}members:${data.teams.length}teams`,
      });

      trackLeadSubmitted("onboarding");
      setIsSuccess(true);
    } catch {
      // Even if submit fails, show success — we don't want to block
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

  /* ─── Helpers ─── */
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
          <p className="text-brand-text-muted text-[14px]">{txt.pageSubtitle}</p>
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
                    ? txt.s1Title
                    : currentStep === 1
                    ? txt.s2Title
                    : currentStep === 2
                    ? txt.s3Title
                    : txt.s4Title}
                </h2>
              </div>
              <p className="text-[13px] text-brand-text-muted ml-11">
                {currentStep === 0
                  ? txt.s1Subtitle
                  : currentStep === 1
                  ? txt.s2Subtitle
                  : currentStep === 2
                  ? txt.s3Subtitle
                  : txt.s4Subtitle}
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
                  {/* ═════════ STEP 0 — Company ═════════ */}
                  {currentStep === 0 && (
                    <div className="space-y-5 max-w-md">
                      <FormField
                        label={txt.companyName}
                        error={errors.companyName?.message}
                        required
                      >
                        <Input
                          type="text"
                          autoComplete="organization"
                          placeholder={txt.companyNamePlaceholder}
                          className="h-12"
                          {...register("companyName", {
                            required: txt.required,
                            minLength: { value: 2, message: txt.required },
                          })}
                        />
                      </FormField>

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
                  )}

                  {/* ═════════ STEP 1 — Roles ═════════ */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      {/* Representative */}
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <Crown className="w-4 h-4 text-brand-warning" />
                          <h3 className="text-[14px] font-bold text-brand-text-primary">
                            {txt.repSection}
                          </h3>
                        </div>
                        <p className="text-[12px] text-brand-text-muted mb-4 ml-6.5">
                          {txt.repSectionDesc}
                        </p>
                        <div className="space-y-4 ml-0 sm:ml-6.5">
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
                        <p className="text-[12px] text-brand-text-muted mb-4 ml-6.5">
                          {txt.adminSectionDesc}
                        </p>
                        <div className="space-y-4 ml-0 sm:ml-6.5">
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

                  {/* ═════════ STEP 2 — Teams ═════════ */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      {teamFields.map((team, teamIndex) => (
                        <div
                          key={team.id}
                          className="rounded-xl border border-brand-border/60 bg-brand-background-secondary/30 p-5 relative"
                        >
                          {/* Team header */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-bold text-brand-text-secondary uppercase tracking-wider">
                              Team {teamIndex + 1}
                            </span>
                            {teamFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTeam(teamIndex)}
                                className="text-[12px] text-brand-text-muted hover:text-brand-error flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                {txt.removeTeam}
                              </button>
                            )}
                          </div>

                          <div className="space-y-4">
                            <FormField
                              label={txt.teamName}
                              error={errors.teams?.[teamIndex]?.name?.message}
                              required
                            >
                              <Input
                                type="text"
                                placeholder={txt.teamNamePlaceholder}
                                className="h-11"
                                {...register(`teams.${teamIndex}.name` as const, {
                                  required: txt.required,
                                })}
                              />
                            </FormField>

                            <FormField
                              label={txt.teamLeader}
                              error={errors.teams?.[teamIndex]?.leaderEmail?.message}
                              helperText={txt.teamLeaderHelper}
                            >
                              <Input
                                type="email"
                                placeholder={txt.teamLeaderPlaceholder}
                                className="h-11"
                                {...register(`teams.${teamIndex}.leaderEmail` as const)}
                              />
                            </FormField>

                            {/* Members */}
                            <div>
                              <label className="block text-[13px] font-semibold text-brand-text-primary mb-2">
                                {txt.teamMembers} <span className="text-brand-error">*</span>
                              </label>
                              <p className="text-[11px] text-brand-text-muted mb-3">
                                {txt.teamMemberHelper}
                              </p>
                              <TeamMembersField
                                teamIndex={teamIndex}
                                control={control}
                                register={register}
                                txt={txt}
                                errors={errors}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          appendTeam({ name: "", leaderEmail: "", members: [{ email: "" }] })
                        }
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-brand-border hover:border-brand-primary/40 text-[13px] font-semibold text-brand-text-muted hover:text-brand-primary transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        {txt.addTeam}
                      </button>
                    </div>
                  )}

                  {/* ═════════ STEP 3 — Confirm ═════════ */}
                  {currentStep === 3 && (
                    <ConfirmStep
                      txt={txt}
                      language={language}
                      isEur={isEur}
                      monthlyPrice={monthlyPrice}
                      yearlyPrice={yearlyPrice}
                      pricePerPerson={pricePerPerson}
                      billable={billable}
                      basePrice={basePrice}
                      billingInterval={billingInterval}
                      employeeCount={employeeCount}
                      register={register}
                      watch={watch}
                      getValues={getValues}
                      errors={errors}
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

/* ─── Team members sub-component ─── */
function TeamMembersField({
  teamIndex,
  control,
  register,
  txt,
  errors,
}: {
  teamIndex: number;
  control: any;
  register: any;
  txt: any;
  errors: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `teams.${teamIndex}.members`,
  });

  return (
    <div className="space-y-2">
      {fields.map((member, memberIndex) => (
        <div key={member.id} className="flex items-center gap-2">
          <Input
            type="email"
            placeholder={txt.teamMemberPlaceholder}
            className="h-10 flex-1 text-[13px]"
            {...register(`teams.${teamIndex}.members.${memberIndex}.email` as const, {
              required: memberIndex === 0 ? txt.required : false,
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email",
              },
            })}
          />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(memberIndex)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-text-muted hover:text-brand-error hover:bg-red-50 transition-all shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ email: "" })}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors mt-1"
      >
        <Plus className="w-3.5 h-3.5" />
        {txt.addMember}
      </button>
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
  pricePerPerson,
  billable,
  basePrice,
  billingInterval,
  employeeCount,
  register,
  watch,
  getValues,
  errors,
}: {
  txt: any;
  language: string;
  isEur: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  pricePerPerson: number;
  billable: number;
  basePrice: number;
  billingInterval: string;
  employeeCount: number;
  register: any;
  watch: any;
  getValues: any;
  errors: any;
}) {
  const vals = getValues();
  const currentInterval = watch("billingInterval");
  const currentCount = watch("employeeCount");
  const currentPricePerPerson = currentInterval === "monthly" ? monthlyPrice : yearlyPrice;
  const currentBillable = Math.min(currentCount, 200);
  const currentBase = currentPricePerPerson * currentBillable;
  const totalMembers = vals.teams.reduce(
    (sum: number, t: TeamEntry) => sum + t.members.filter((m: TeamMember) => m.email.trim()).length,
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
          value={`${vals.teams.length} ${vals.teams.length === 1 ? "team" : "teams"}`}
          sub={`${totalMembers} ${txt.summaryMembers}`}
        />
      </div>

      {/* Employee count slider */}
      <div>
        <label className="block text-[13px] font-semibold text-brand-text-primary mb-1">
          {txt.employeeCount} <span className="text-brand-error">*</span>
        </label>
        <p className="text-[11px] text-brand-text-muted mb-3">{txt.employeeCountHelper}</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="10"
            max="350"
            step="5"
            {...register("employeeCount", { valueAsNumber: true })}
            className="flex-1 h-2 appearance-none cursor-pointer bg-brand-border rounded-full
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-[3px]
              [&::-webkit-slider-thumb]:border-brand-primary
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:cursor-grab
              [&::-moz-range-thumb]:w-6
              [&::-moz-range-thumb]:h-6
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-[3px]
              [&::-moz-range-thumb]:border-brand-primary
              [&::-moz-range-thumb]:cursor-grab"
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
          <h4 className="text-[14px] font-bold text-brand-text-primary">{txt.plan}</h4>
          <div className="flex bg-brand-background-muted p-1 rounded-lg border border-brand-border">
            <button
              type="button"
              onClick={() => {
                const e = new Event("input", { bubbles: true });
                const el = document.querySelector<HTMLInputElement>('[name="billingInterval"]');
                if (el) {
                  el.value = "monthly";
                  el.dispatchEvent(e);
                }
              }}
              className="hidden"
            />
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
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                currentInterval === "yearly"
                  ? "bg-white/20 text-white"
                  : "bg-brand-success/10 text-brand-success"
              )}>
                {txt.saveTag}
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-brand-text-primary font-mono">
            {isEur
              ? `€${currentBase.toLocaleString()}`
              : `${currentBase.toLocaleString()} Kč`}
          </span>
          <span className="text-[13px] text-brand-text-muted">/ {txt.monthly.toLowerCase()}</span>
        </div>
        <p className="text-[12px] text-brand-text-muted mt-1">
          {isEur ? `€${currentPricePerPerson}` : `${currentPricePerPerson} Kč`} {txt.pricePerPerson} × {currentBillable}
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
      <div className="w-8 h-8 rounded-lg bg-brand-primary/8 text-brand-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wider">
          {label}
        </p>
        <p className="text-[14px] font-bold text-brand-text-primary truncate">{value}</p>
        <p className="text-[12px] text-brand-text-muted truncate">{sub}</p>
      </div>
    </div>
  );
}
