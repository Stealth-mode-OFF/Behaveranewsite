import { useCallback, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { useModal } from "@/app/ModalContext";
import { useLanguage } from "@/app/LanguageContext";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { FormField } from "@/app/components/ui/form-field";
import { submitLead } from "@/app/utils/lead";
import { trackLeadSubmitted } from "@/lib/analytics";
import { cn } from "@/app/components/ui/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  User,
  Users,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Rocket,
  Crown,
  LayoutDashboard,
  AlertCircle,
  Sparkles,
  X,
} from "lucide-react";

/* ─── Form types ─── */
type TeamMember = { email: string };
type TeamEntry = { name: string; leaderEmail: string; members: TeamMember[] };

type SignupFormData = {
  /* Step 1 */
  companyName: string;
  companyId: string;
  contactName: string;
  contactEmail: string;
  adminName: string;
  adminEmail: string;
  /* Step 2 */
  teams: TeamEntry[];
  /* Step 3 */
  employeeCount: number;
  billingInterval: "monthly" | "yearly";
  agreedToTerms: boolean;
};

/* ─── Step meta ─── */
const STEPS = [
  { id: "company", icon: Building2 },
  { id: "team", icon: Users },
  { id: "confirm", icon: CreditCard },
] as const;

/* ─── Translations ─── */
const copy = {
  cz: {
    modalTitle: "Vytvořte si účet",
    modalSubtitle: "Zabere to méně než 2 minuty",
    steps: ["Společnost", "Týmy", "Potvrzení"],
    /* Step 1 */
    s1Title: "Vaše firma & kontakt",
    s1Subtitle: "Základní údaje pro nastavení účtu.",
    companyName: "Název společnosti",
    companyNamePh: "Acme s.r.o.",
    companyId: "IČO",
    companyIdPh: "12345678",
    companyIdHelper: "8místné identifikační číslo",
    repSection: "Zástupce společnosti",
    repSectionDesc: "Osoba, která řeší smlouvu a fakturaci.",
    contactName: "Vaše jméno",
    contactNamePh: "Jan Novák",
    contactEmail: "Firemní e-mail",
    contactEmailPh: "jan.novak@firma.cz",
    contactEmailHelper: "Sem posíláme smlouvu a důležité aktualizace.",
    adminSection: "Budoucí administrátor",
    adminSectionDesc: "Kdo bude Echo Pulse denně používat.",
    adminName: "Jméno administrátora",
    adminNamePh: "Jana Smolíková",
    adminEmail: "Email administrátora",
    adminEmailPh: "jana.smolikova@firma.cz",
    adminEmailHelper: "Pošleme pozvánku a instrukce k nastavení.",
    sameAsContact: "Stejný jako kontakt",
    /* Step 2 */
    s2Title: "Nastavte týmy",
    s2Subtitle: "Vytvořte týmy a přidejte členy pro Echo Pulse.",
    teamName: "Název týmu",
    teamNamePh: "Marketing",
    teamLeader: "Email team leadera",
    teamLeaderPh: "leader@firma.cz",
    teamLeaderHelper: "Team leader vidí pouze výsledky svého týmu.",
    teamMembers: "Členové týmu",
    memberPh: "zamestnanec@firma.cz",
    memberHelper: "Zaměstnanci, kteří budou vyplňovat Echo Pulse.",
    addMember: "Přidat člena",
    addTeam: "Přidat další tým",
    removeTeam: "Odebrat tým",
    skipTeams: "Přeskočit — nastavím později",
    /* Step 3 */
    s3Title: "Potvrzení & spuštění",
    s3Subtitle: "Zkontrolujte údaje a zvolte svůj plán.",
    summaryCompany: "Společnost",
    summaryContact: "Kontakt",
    summaryAdmin: "Administrátor",
    summaryTeams: "Týmy",
    summaryMembers: "členů",
    employeeCount: "Počet zaměstnanců",
    employeeCountHelper: "Kolik lidí bude Echo Pulse používat?",
    plan: "Ceník",
    monthly: "Měsíčně",
    yearly: "Ročně",
    saveTag: "Ušetřete 20 %",
    perPerson: "za osobu / měsíc",
    termsAgree: "Souhlasím s",
    termsLink: "Obchodními podmínkami",
    termsAnd: "a",
    privacyLink: "Ochranou osobních údajů",
    guarantee: "30denní garance vrácení peněz",
    submit: "Vytvořit účet",
    submitting: "Vytváření…",
    /* Success */
    successTitle: "Účet vytvořen! 🎉",
    successBody: "Na e-mail administrátora jsme odeslali pozvánku a instrukce. Do hodiny se ozveme a provedeme vás úvodním nastavením.",
    successCta: "Zavřít",
    /* Nav */
    next: "Pokračovat",
    back: "Zpět",
    required: "Povinné pole",
    invalidEmail: "Zadejte platný e-mail",
  },
  en: {
    modalTitle: "Create your account",
    modalSubtitle: "Takes less than 2 minutes",
    steps: ["Company", "Teams", "Confirm"],
    s1Title: "Your company & contact",
    s1Subtitle: "Basic details to set up your account.",
    companyName: "Company name",
    companyNamePh: "Acme Inc.",
    companyId: "Company ID",
    companyIdPh: "12345678",
    companyIdHelper: "Official registration number",
    repSection: "Company representative",
    repSectionDesc: "Handles the contract and billing on your side.",
    contactName: "Your name",
    contactNamePh: "John Smith",
    contactEmail: "Work email",
    contactEmailPh: "john@company.com",
    contactEmailHelper: "We'll send the contract and key updates here.",
    adminSection: "Future account admin",
    adminSectionDesc: "Who will use Echo Pulse day to day.",
    adminName: "Admin name",
    adminNamePh: "Jane Doe",
    adminEmail: "Admin email",
    adminEmailPh: "jane@company.com",
    adminEmailHelper: "We'll send an invite and getting-started instructions.",
    sameAsContact: "Same as contact",
    s2Title: "Set up teams",
    s2Subtitle: "Create teams and add members for Echo Pulse.",
    teamName: "Team name",
    teamNamePh: "Marketing",
    teamLeader: "Team leader email",
    teamLeaderPh: "leader@company.com",
    teamLeaderHelper: "Team leader only sees their team's results.",
    teamMembers: "Team members",
    memberPh: "employee@company.com",
    memberHelper: "Employees who will complete Echo Pulses.",
    addMember: "Add member",
    addTeam: "Add another team",
    removeTeam: "Remove team",
    skipTeams: "Skip — I'll set up teams later",
    s3Title: "Confirm & launch",
    s3Subtitle: "Review the details and choose your plan.",
    summaryCompany: "Company",
    summaryContact: "Contact",
    summaryAdmin: "Admin",
    summaryTeams: "Teams",
    summaryMembers: "members",
    employeeCount: "Number of employees",
    employeeCountHelper: "How many people will use Echo Pulse?",
    plan: "Pricing",
    monthly: "Monthly",
    yearly: "Yearly",
    saveTag: "Save 20%",
    perPerson: "per person / month",
    termsAgree: "I agree to the",
    termsLink: "Terms of Service",
    termsAnd: "and",
    privacyLink: "Privacy Policy",
    guarantee: "30-day money-back guarantee",
    submit: "Create account",
    submitting: "Creating…",
    successTitle: "Account created! 🎉",
    successBody: "We've sent an invite and instructions to the admin email. We'll reach out within an hour to walk you through setup.",
    successCta: "Close",
    next: "Continue",
    back: "Back",
    required: "Required",
    invalidEmail: "Enter a valid email",
  },
  de: {
    modalTitle: "Konto erstellen",
    modalSubtitle: "Dauert weniger als 2 Minuten",
    steps: ["Unternehmen", "Teams", "Bestätigung"],
    s1Title: "Ihr Unternehmen & Kontakt",
    s1Subtitle: "Grunddaten für die Kontoeinrichtung.",
    companyName: "Firmenname",
    companyNamePh: "Acme GmbH",
    companyId: "Handelsregister-Nr.",
    companyIdPh: "HRB 12345",
    companyIdHelper: "Offizielle Registrierungsnummer",
    repSection: "Unternehmensvertreter",
    repSectionDesc: "Zuständig für Vertrag und Abrechnung.",
    contactName: "Ihr Name",
    contactNamePh: "Max Mustermann",
    contactEmail: "Geschäftliche E-Mail",
    contactEmailPh: "max@firma.de",
    contactEmailHelper: "Hier senden wir Vertrag und wichtige Updates.",
    adminSection: "Zukünftiger Account-Admin",
    adminSectionDesc: "Wer Echo Pulse täglich nutzen wird.",
    adminName: "Admin-Name",
    adminNamePh: "Erika Musterfrau",
    adminEmail: "Admin-E-Mail",
    adminEmailPh: "erika@firma.de",
    adminEmailHelper: "Wir senden eine Einladung und Einrichtungsanleitung.",
    sameAsContact: "Gleich wie Kontakt",
    s2Title: "Teams einrichten",
    s2Subtitle: "Erstellen Sie Teams und fügen Sie Mitglieder hinzu.",
    teamName: "Teamname",
    teamNamePh: "Marketing",
    teamLeader: "Teamleiter-E-Mail",
    teamLeaderPh: "leiter@firma.de",
    teamLeaderHelper: "Der Teamleiter sieht nur die Ergebnisse seines Teams.",
    teamMembers: "Teammitglieder",
    memberPh: "mitarbeiter@firma.de",
    memberHelper: "Mitarbeiter, die Echo Pulse ausfüllen werden.",
    addMember: "Mitglied hinzufügen",
    addTeam: "Weiteres Team hinzufügen",
    removeTeam: "Team entfernen",
    skipTeams: "Überspringen — richte ich später ein",
    s3Title: "Bestätigen & starten",
    s3Subtitle: "Überprüfen Sie die Details und wählen Sie Ihren Plan.",
    summaryCompany: "Unternehmen",
    summaryContact: "Kontakt",
    summaryAdmin: "Admin",
    summaryTeams: "Teams",
    summaryMembers: "Mitglieder",
    employeeCount: "Anzahl der Mitarbeiter",
    employeeCountHelper: "Wie viele Personen werden Echo Pulse nutzen?",
    plan: "Preise",
    monthly: "Monatlich",
    yearly: "Jährlich",
    saveTag: "20 % sparen",
    perPerson: "pro Person / Monat",
    termsAgree: "Ich stimme den",
    termsLink: "Nutzungsbedingungen",
    termsAnd: "und der",
    privacyLink: "Datenschutzerklärung",
    guarantee: "30 Tage Geld-zurück-Garantie",
    submit: "Konto erstellen",
    submitting: "Wird erstellt…",
    successTitle: "Konto erstellt! 🎉",
    successBody: "Wir haben eine Einladung und Anleitung an die Admin-E-Mail gesendet. Innerhalb einer Stunde melden wir uns für das Erst-Setup.",
    successCta: "Schließen",
    next: "Weiter",
    back: "Zurück",
    required: "Pflichtfeld",
    invalidEmail: "Geben Sie eine gültige E-Mail ein",
  },
};

/* ─── Slide animation ─── */
const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d < 0 ? 50 : -50, opacity: 0 }),
};

/* ═══════════════════════════════════════════════════
   SignupModal
   ═══════════════════════════════════════════════════ */
export function SignupModal() {
  const { isSignupOpen, closeSignup } = useModal();
  const { language } = useLanguage();
  const txt = (copy as any)[language] || copy.en;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sameAsContact, setSameAsContact] = useState(false);

  const isEur = language === "en" || language === "de";
  const monthlyPrice = isEur ? 5 : 129;
  const yearlyPrice = isEur ? 4 : 99;

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    defaultValues: {
      companyName: "",
      companyId: "",
      contactName: "",
      contactEmail: "",
      adminName: "",
      adminEmail: "",
      teams: [{ name: "", leaderEmail: "", members: [{ email: "" }] }],
      employeeCount: 50,
      billingInterval: "yearly",
      agreedToTerms: false,
    },
    mode: "onBlur",
  });

  const {
    fields: teamFields,
    append: appendTeam,
    remove: removeTeam,
  } = useFieldArray({ control, name: "teams" });

  const billingInterval = watch("billingInterval");
  const employeeCount = watch("employeeCount");
  const pricePerPerson = billingInterval === "monthly" ? monthlyPrice : yearlyPrice;
  const billable = Math.min(employeeCount, 200);
  const total = pricePerPerson * billable;

  /* ─── Validation ─── */
  const fieldsByStep: Record<number, (keyof SignupFormData)[]> = useMemo(
    () => ({
      0: ["companyName", "companyId", "contactName", "contactEmail", "adminName", "adminEmail"],
      1: [],      // teams step is optional
      2: ["agreedToTerms"],
    }),
    []
  );

  const goNext = useCallback(async () => {
    const fields = fieldsByStep[step];
    if (fields.length > 0) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [step, trigger, fieldsByStep]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  /* ─── Submit ─── */
  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const totalMembers = data.teams.reduce(
        (sum, t) => sum + t.members.filter((m) => m.email.trim()).length,
        0
      );
      // Fire and forget — don't block UX
      submitLead({
        email: data.contactEmail,
        name: data.contactName,
        company: data.companyName,
        companySize: String(data.employeeCount),
        source: `signup_modal:${data.billingInterval}:${totalMembers}members:${data.teams.length}teams`,
      }).catch(() => {});
      trackLeadSubmitted("signup_modal");
    } catch {
      // noop
    }
    // Always show success
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  /* ─── Handle "same as contact" checkbox ─── */
  const handleSameAsContact = useCallback(
    (checked: boolean) => {
      setSameAsContact(checked);
      if (checked) {
        const name = getValues("contactName");
        const email = getValues("contactEmail");
        setValue("adminName", name);
        setValue("adminEmail", email);
      }
    },
    [getValues, setValue]
  );

  /* ─── Reset on close ─── */
  const handleClose = useCallback(() => {
    closeSignup();
    setTimeout(() => {
      setStep(0);
      setDirection(0);
      setIsSuccess(false);
      setIsSubmitting(false);
      setSameAsContact(false);
      reset();
    }, 300);
  }, [closeSignup, reset]);

  /* ─── Computed ─── */
  const StepIcon = STEPS[step].icon;

  return (
    <Dialog open={isSignupOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className={cn(
          "sm:max-w-[600px] max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-3xl border-brand-border/50",
          "bg-gradient-to-b from-white to-[#FDFBFF]",
          "shadow-2xl shadow-brand-primary/[0.08]"
        )}
        aria-describedby="signup-desc"
      >
        {/* Hidden accessibility */}
        <DialogTitle className="sr-only">{txt.modalTitle}</DialogTitle>
        <DialogDescription id="signup-desc" className="sr-only">
          {txt.modalSubtitle}
        </DialogDescription>

        {/* ─── Custom close button ─── */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-brand-background-muted/80 hover:bg-brand-background-muted flex items-center justify-center text-brand-text-muted hover:text-brand-text-primary transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* ═══ SUCCESS SCREEN ═══ */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="px-8 py-14 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-brand-success/10 rounded-full flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Rocket className="w-10 h-10 text-brand-success" />
                </motion.div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-3 font-[var(--font-display)]">
                {txt.successTitle}
              </h2>
              <p className="text-brand-text-muted text-[14px] leading-relaxed mb-8 max-w-sm mx-auto">
                {txt.successBody}
              </p>
              <Button
                size="lg"
                onClick={handleClose}
                className="h-12 px-10 text-[15px] font-semibold rounded-2xl"
              >
                {txt.successCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ) : (
            /* ═══ FORM FLOW ═══ */
            <form onSubmit={handleSubmit(onSubmit)} key="form">
              {/* ─── Header ─── */}
              <div className="px-6 sm:px-8 pt-7 pb-4">
                <h2 className="text-xl font-bold text-brand-text-primary font-[var(--font-display)] mb-0.5">
                  {txt.modalTitle}
                </h2>
                <p className="text-[13px] text-brand-text-muted flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-warning" />
                  {txt.modalSubtitle}
                </p>
              </div>

              {/* ─── Step indicator ─── */}
              <nav className="px-6 sm:px-8 pb-5">
                <div className="flex items-center justify-center gap-0">
                  {STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const done = i < step;
                    const current = i === step;
                    return (
                      <div key={s.id} className="flex items-center">
                        {i > 0 && (
                          <div
                            className={cn(
                              "w-12 sm:w-16 h-[2px] transition-colors duration-300",
                              done ? "bg-brand-primary" : "bg-brand-border"
                            )}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (i < step) {
                              setDirection(-1);
                              setStep(i);
                            }
                          }}
                          className={cn(
                            "flex flex-col items-center gap-1.5 transition-all duration-300",
                            i <= step ? "cursor-pointer" : "cursor-default"
                          )}
                        >
                          <div
                            className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                              done
                                ? "bg-brand-primary border-brand-primary text-white"
                                : current
                                ? "bg-white border-brand-primary text-brand-primary shadow-md shadow-brand-primary/20"
                                : "bg-white border-brand-border text-brand-text-muted"
                            )}
                          >
                            {done ? (
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            ) : (
                              <Icon className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-[10px] font-semibold tracking-wide transition-colors",
                              current
                                ? "text-brand-primary"
                                : done
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

              {/* ─── Step content card ─── */}
              <div className="mx-4 sm:mx-6 rounded-2xl border border-brand-border/40 bg-white overflow-hidden mb-4">
                {/* Step header */}
                <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-brand-border/30 bg-gradient-to-r from-brand-background-secondary/40 to-transparent">
                  <div className="flex items-center gap-2.5 mb-0.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <StepIcon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-[15px] font-bold text-brand-text-primary">
                      {step === 0 ? txt.s1Title : step === 1 ? txt.s2Title : txt.s3Title}
                    </h3>
                  </div>
                  <p className="text-[12px] text-brand-text-muted ml-[38px]">
                    {step === 0 ? txt.s1Subtitle : step === 1 ? txt.s2Subtitle : txt.s3Subtitle}
                  </p>
                </div>

                {/* Step body */}
                <div className="px-5 sm:px-6 py-5 min-h-[240px] relative">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* ═══ STEP 0 — Company & Contact ═══ */}
                      {step === 0 && (
                        <div className="space-y-6">
                          {/* Company fields */}
                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                              label={txt.companyName}
                              error={errors.companyName?.message}
                              required
                            >
                              <Input
                                type="text"
                                autoComplete="organization"
                                placeholder={txt.companyNamePh}
                                className="h-11"
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
                                placeholder={txt.companyIdPh}
                                className="h-11"
                                {...register("companyId", { required: txt.required })}
                              />
                            </FormField>
                          </div>

                          {/* Rep */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Crown className="w-3.5 h-3.5 text-brand-warning" />
                              <h4 className="text-[13px] font-bold text-brand-text-primary">
                                {txt.repSection}
                              </h4>
                            </div>
                            <p className="text-[11px] text-brand-text-muted mb-3 ml-[22px]">
                              {txt.repSectionDesc}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3 ml-0">
                              <FormField
                                label={txt.contactName}
                                error={errors.contactName?.message}
                                required
                              >
                                <Input
                                  type="text"
                                  autoComplete="name"
                                  placeholder={txt.contactNamePh}
                                  className="h-11"
                                  {...register("contactName", {
                                    required: txt.required,
                                    minLength: { value: 2, message: txt.required },
                                  })}
                                />
                              </FormField>
                              <FormField
                                label={txt.contactEmail}
                                error={errors.contactEmail?.message}
                                helperText={txt.contactEmailHelper}
                                required
                              >
                                <Input
                                  type="email"
                                  autoComplete="email"
                                  placeholder={txt.contactEmailPh}
                                  className="h-11"
                                  {...register("contactEmail", {
                                    required: txt.required,
                                    pattern: {
                                      value: /^\S+@\S+\.\S+$/,
                                      message: txt.invalidEmail,
                                    },
                                  })}
                                />
                              </FormField>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-brand-border/30" />

                          {/* Admin */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <LayoutDashboard className="w-3.5 h-3.5 text-brand-primary" />
                                <h4 className="text-[13px] font-bold text-brand-text-primary">
                                  {txt.adminSection}
                                </h4>
                              </div>
                              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-brand-text-muted hover:text-brand-primary transition-colors">
                                <input
                                  type="checkbox"
                                  checked={sameAsContact}
                                  onChange={(e) => handleSameAsContact(e.target.checked)}
                                  className="h-3.5 w-3.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer"
                                />
                                {txt.sameAsContact}
                              </label>
                            </div>
                            <p className="text-[11px] text-brand-text-muted mb-3 ml-[22px]">
                              {txt.adminSectionDesc}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <FormField
                                label={txt.adminName}
                                error={errors.adminName?.message}
                                required
                              >
                                <Input
                                  type="text"
                                  placeholder={txt.adminNamePh}
                                  className="h-11"
                                  disabled={sameAsContact}
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
                                  placeholder={txt.adminEmailPh}
                                  className="h-11"
                                  disabled={sameAsContact}
                                  {...register("adminEmail", {
                                    required: txt.required,
                                    pattern: {
                                      value: /^\S+@\S+\.\S+$/,
                                      message: txt.invalidEmail,
                                    },
                                  })}
                                />
                              </FormField>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ═══ STEP 1 — Teams ═══ */}
                      {step === 1 && (
                        <div className="space-y-5">
                          {teamFields.map((team, ti) => (
                            <div
                              key={team.id}
                              className="rounded-xl border border-brand-border/50 bg-brand-background-secondary/20 p-4 relative"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">
                                  Team {ti + 1}
                                </span>
                                {teamFields.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTeam(ti)}
                                    className="text-[11px] text-brand-text-muted hover:text-brand-error flex items-center gap-1 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    {txt.removeTeam}
                                  </button>
                                )}
                              </div>

                              <div className="space-y-3">
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <FormField
                                    label={txt.teamName}
                                    error={errors.teams?.[ti]?.name?.message}
                                  >
                                    <Input
                                      type="text"
                                      placeholder={txt.teamNamePh}
                                      className="h-10 text-[13px]"
                                      {...register(`teams.${ti}.name`)}
                                    />
                                  </FormField>
                                  <FormField
                                    label={txt.teamLeader}
                                    error={errors.teams?.[ti]?.leaderEmail?.message}
                                    helperText={txt.teamLeaderHelper}
                                  >
                                    <Input
                                      type="email"
                                      placeholder={txt.teamLeaderPh}
                                      className="h-10 text-[13px]"
                                      {...register(`teams.${ti}.leaderEmail`)}
                                    />
                                  </FormField>
                                </div>

                                {/* Members */}
                                <div>
                                  <label className="block text-[12px] font-semibold text-brand-text-primary mb-1.5">
                                    {txt.teamMembers}
                                  </label>
                                  <p className="text-[10px] text-brand-text-muted mb-2">
                                    {txt.memberHelper}
                                  </p>
                                  <InlineMembers
                                    teamIndex={ti}
                                    control={control}
                                    register={register}
                                    txt={txt}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() =>
                              appendTeam({
                                name: "",
                                leaderEmail: "",
                                members: [{ email: "" }],
                              })
                            }
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-brand-border hover:border-brand-primary/40 text-[12px] font-semibold text-brand-text-muted hover:text-brand-primary transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            {txt.addTeam}
                          </button>
                        </div>
                      )}

                      {/* ═══ STEP 2 — Confirm ═══ */}
                      {step === 2 && (
                        <ConfirmPane
                          txt={txt}
                          isEur={isEur}
                          monthlyPrice={monthlyPrice}
                          yearlyPrice={yearlyPrice}
                          pricePerPerson={pricePerPerson}
                          billable={billable}
                          total={total}
                          register={register}
                          watch={watch}
                          getValues={getValues}
                          errors={errors}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ─── Footer navigation ─── */}
              <div className="px-6 sm:px-8 py-4 flex items-center justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1 text-[13px] font-semibold text-brand-text-muted hover:text-brand-text-primary transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {txt.back}
                  </button>
                ) : (
                  <div />
                )}

                {step < STEPS.length - 1 ? (
                  <div className="flex items-center gap-3">
                    {step === 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setDirection(1);
                          setStep(2);
                        }}
                        className="text-[12px] text-brand-text-muted hover:text-brand-primary transition-colors underline underline-offset-2"
                      >
                        {txt.skipTeams}
                      </button>
                    )}
                    <Button
                      type="button"
                      onClick={goNext}
                      className="h-10 px-6 text-[13px] font-semibold rounded-xl"
                    >
                      {txt.next}
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-8 text-[13px] font-semibold rounded-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                        {txt.submitting}
                      </>
                    ) : (
                      <>
                        {txt.submit}
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* ─── Bottom trust strip ─── */}
              <div className="px-6 sm:px-8 pb-5 flex items-center justify-center gap-5 text-[11px] text-brand-text-muted">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-brand-success" />
                  GDPR
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-warning" />
                  {txt.guarantee}
                </span>
              </div>
            </form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════ Sub-components ═══════ */

function InlineMembers({
  teamIndex,
  control,
  register,
  txt,
}: {
  teamIndex: number;
  control: any;
  register: any;
  txt: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `teams.${teamIndex}.members`,
  });

  return (
    <div className="space-y-2">
      {fields.map((member, mi) => (
        <div key={member.id} className="flex items-center gap-2">
          <Input
            type="email"
            placeholder={txt.memberPh}
            className="h-9 flex-1 text-[12px]"
            {...register(`teams.${teamIndex}.members.${mi}.email`)}
          />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(mi)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-text-muted hover:text-brand-error hover:bg-brand-error/5 transition-all shrink-0"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ email: "" })}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors mt-1"
      >
        <Plus className="w-3 h-3" />
        {txt.addMember}
      </button>
    </div>
  );
}

function ConfirmPane({
  txt,
  isEur,
  monthlyPrice,
  yearlyPrice,
  pricePerPerson,
  billable,
  total,
  register,
  watch,
  getValues,
  errors,
}: {
  txt: any;
  isEur: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  pricePerPerson: number;
  billable: number;
  total: number;
  register: any;
  watch: any;
  getValues: any;
  errors: any;
}) {
  const vals = getValues();
  const interval = watch("billingInterval");
  const count = watch("employeeCount");
  const price = interval === "monthly" ? monthlyPrice : yearlyPrice;
  const bill = Math.min(count, 200);
  const base = price * bill;
  const totalMembers = vals.teams.reduce(
    (sum: number, t: TeamEntry) =>
      sum + t.members.filter((m: TeamMember) => m.email.trim()).length,
    0
  );

  return (
    <div className="space-y-5">
      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <MiniCard
          icon={<Building2 className="w-3.5 h-3.5" />}
          label={txt.summaryCompany}
          value={vals.companyName || "—"}
          sub={vals.companyId || "—"}
        />
        <MiniCard
          icon={<Crown className="w-3.5 h-3.5" />}
          label={txt.summaryContact}
          value={vals.contactName || "—"}
          sub={vals.contactEmail || "—"}
        />
        <MiniCard
          icon={<LayoutDashboard className="w-3.5 h-3.5" />}
          label={txt.summaryAdmin}
          value={vals.adminName || "—"}
          sub={vals.adminEmail || "—"}
        />
        <MiniCard
          icon={<Users className="w-3.5 h-3.5" />}
          label={txt.summaryTeams}
          value={`${vals.teams.length} ${vals.teams.length === 1 ? "team" : "teams"}`}
          sub={`${totalMembers} ${txt.summaryMembers}`}
        />
      </div>

      {/* Employee count */}
      <div>
        <label className="block text-[12px] font-semibold text-brand-text-primary mb-1">
          {txt.employeeCount}
        </label>
        <p className="text-[10px] text-brand-text-muted mb-2">{txt.employeeCountHelper}</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="10"
            max="350"
            step="5"
            {...register("employeeCount", { valueAsNumber: true })}
            className="flex-1 h-1.5 appearance-none cursor-pointer bg-brand-border rounded-full
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-[2.5px]
              [&::-webkit-slider-thumb]:border-brand-primary
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:cursor-grab
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-[2.5px]
              [&::-moz-range-thumb]:border-brand-primary
              [&::-moz-range-thumb]:cursor-grab"
          />
          <div className="text-lg font-bold font-mono text-brand-primary min-w-[48px] text-right">
            {count}
          </div>
        </div>
      </div>

      {/* Billing toggle + price */}
      <div className="rounded-xl border border-brand-border/50 p-4 bg-gradient-to-r from-brand-background-secondary/40 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[13px] font-bold text-brand-text-primary">{txt.plan}</h4>
          <div className="flex bg-brand-background-muted p-0.5 rounded-lg border border-brand-border">
            <label
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all",
                interval === "monthly"
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
                "px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1",
                interval === "yearly"
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
                  "text-[9px] px-1.5 py-0.5 rounded-full font-bold",
                  interval === "yearly"
                    ? "bg-white/20 text-white"
                    : "bg-brand-success/10 text-brand-success"
                )}
              >
                {txt.saveTag}
              </span>
            </label>
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-brand-text-primary font-mono">
            {isEur
              ? `€${base.toLocaleString()}`
              : `${base.toLocaleString()} Kč`}
          </span>
          <span className="text-[12px] text-brand-text-muted">/ {txt.monthly.toLowerCase()}</span>
        </div>
        <p className="text-[11px] text-brand-text-muted mt-0.5">
          {isEur ? `€${price}` : `${price} Kč`} {txt.perPerson} × {bill}
        </p>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2.5 cursor-pointer group">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer"
          {...register("agreedToTerms", { required: txt.required })}
        />
        <span className="text-[12px] text-brand-text-secondary leading-relaxed group-hover:text-brand-text-primary transition-colors">
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
        <p className="text-[11px] text-brand-error flex items-center gap-1 ml-7">
          <AlertCircle className="w-3 h-3" />
          {errors.agreedToTerms.message}
        </p>
      )}
    </div>
  );
}

function MiniCard({
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
    <div className="rounded-lg border border-brand-border/40 bg-white p-3 flex items-start gap-2.5">
      <div className="w-6 h-6 rounded-md bg-brand-primary/8 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-brand-text-muted uppercase tracking-wider">
          {label}
        </p>
        <p className="text-[13px] font-bold text-brand-text-primary truncate">{value}</p>
        <p className="text-[11px] text-brand-text-muted truncate">{sub}</p>
      </div>
    </div>
  );
}
