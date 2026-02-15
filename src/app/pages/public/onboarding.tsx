import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2, Users, UserCog, CreditCard, Check, ChevronRight,
  ChevronLeft, Plus, Trash2, ArrowRight, Loader2, ShieldCheck,
  Sparkles, AlertCircle, Rocket, LayoutDashboard, Crown, Lock,
  Globe, Zap, Timer, BarChart3, Star, X, Mail,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { FormField } from "@/app/components/ui/form-field";
import { useLanguage } from "@/app/LanguageContext";
import { submitLead } from "@/app/utils/lead";
import { trackLeadSubmitted } from "@/lib/analytics";
import { cn } from "@/app/components/ui/utils";

/* ─── Types ─── */
type TeamMember = { email: string };
type TeamEntry = { name: string; leaderEmail: string; members: TeamMember[] };

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

/* ─── Steps ─── */
const STEPS = [
  { id: "company", icon: Building2, color: "#9F7AEA" },
  { id: "roles", icon: UserCog, color: "#6366F1" },
  { id: "teams", icon: Users, color: "#818CF8" },
  { id: "confirm", icon: CreditCard, color: "#2D1B69" },
] as const;

/* ═══════════════════════════════════════════════════
   Translations
   ═══════════════════════════════════════════════════ */
const copy = {
  cz: {
    pageTitle: "Vytvořte si Echo Pulse účet",
    pageSubtitle: "Zabere to méně než 2 minuty",
    steps: ["Společnost", "Kontakty", "Týmy", "Potvrzení"],
    brandTagline: "Poznejte svůj tým za 2 minuty",
    socialProof: "Důvěřuje přes 500 firem",
    valueProp1: "AI analýza nálady týmu v reálném čase",
    valueProp2: "Automatické pulse check-iny za 2 minuty",
    valueProp3: "Okamžité výsledky bez čekání",
    valueProp4: "GDPR-ready s ISO certifikací",
    s1Title: "Základní údaje společnosti",
    s1Subtitle: "Tyto údaje použijeme k nastavení vašeho účtu.",
    companyName: "Název společnosti",
    companyNamePh: "Acme s.r.o.",
    companyId: "IČO",
    companyIdPh: "12345678",
    companyIdHelper: "8místné identifikační číslo",
    s2Title: "Kontaktní osoby",
    s2Subtitle: "Kdo zastupuje firmu a kdo bude systém denně používat?",
    repSection: "Zástupce společnosti",
    repSectionDesc: "Osoba, která řeší smlouvu a fakturaci.",
    repName: "Jméno zástupce",
    repNamePh: "Jan Novák",
    repEmail: "Email zástupce",
    repEmailPh: "jan.novak@firma.cz",
    repEmailHelper: "Sem posíláme smlouvu, faktury a důležité aktualizace.",
    billingEmail: "Fakturační email (volitelné)",
    billingEmailPh: "fakturace@firma.cz",
    billingEmailHelper: "Pokud chcete faktury na jiný email.",
    adminSection: "Budoucí administrátor",
    adminSectionDesc: "Kdo bude Echo Pulse denně spravovat.",
    adminName: "Jméno administrátora",
    adminNamePh: "Jana Smolíková",
    adminEmail: "Email administrátora",
    adminEmailPh: "jana.smolikova@firma.cz",
    adminEmailHelper: "Pošleme pozvánku a instrukce k nastavení.",
    s3Title: "Nastavte týmy",
    s3Subtitle: "Vytvořte týmy a přidejte členy. Můžete kdykoliv změnit.",
    teamName: "Název týmu",
    teamNamePh: "Marketing",
    teamLeader: "Email team leadera",
    teamLeaderPh: "leader@firma.cz",
    teamLeaderHelper: "Team leader vidí pouze výsledky svého týmu.",
    teamMembers: "Členové týmu",
    memberPh: "zamestnanec@firma.cz",
    addMember: "Přidat člena",
    addTeam: "Přidat další tým",
    removeTeam: "Odebrat tým",
    skipTeams: "Přeskočit — nastavím později",
    s4Title: "Potvrzení & spuštění",
    s4Subtitle: "Zkontrolujte údaje a potvrďte vytvoření účtu.",
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
    saveTag: "-20 %",
    perPerson: "za osobu / měsíc",
    termsAgree: "Souhlasím s",
    termsLink: "podmínkami",
    termsAnd: "a",
    privacyLink: "ochranou údajů",
    guarantee: "30denní garance vrácení peněz",
    submit: "Vytvořit účet",
    submitting: "Vytváříme váš účet…",
    successTitle: "Vítejte v Echo Pulse!",
    successBody: "Na email administrátora jsme odeslali pozvánku. Do hodiny se ozveme a provedeme vás nastavením.",
    successCta: "Zpět na hlavní stránku",
    next: "Pokračovat",
    back: "Zpět",
    required: "Povinné pole",
    invalidEmail: "Zadejte platný email",
    people: "lidí",
  },
  en: {
    pageTitle: "Create your Echo Pulse account",
    pageSubtitle: "Takes less than 2 minutes",
    steps: ["Company", "Contacts", "Teams", "Confirm"],
    brandTagline: "Understand your team in 2 minutes",
    socialProof: "Trusted by 500+ companies",
    valueProp1: "Real-time AI team mood analysis",
    valueProp2: "Automated 2-minute pulse check-ins",
    valueProp3: "Instant results — no waiting",
    valueProp4: "GDPR-ready with ISO certification",
    s1Title: "Company details",
    s1Subtitle: "We use these details to set up your account.",
    companyName: "Company name",
    companyNamePh: "Acme Inc.",
    companyId: "Company ID",
    companyIdPh: "12345678",
    companyIdHelper: "Official registration number",
    s2Title: "Contact people",
    s2Subtitle: "Who represents the company and who will use the system daily?",
    repSection: "Company representative",
    repSectionDesc: "Handles the contract and billing.",
    repName: "Representative name",
    repNamePh: "John Smith",
    repEmail: "Representative email",
    repEmailPh: "john.smith@company.com",
    repEmailHelper: "We'll send the contract, invoices, and key updates here.",
    billingEmail: "Billing email (optional)",
    billingEmailPh: "billing@company.com",
    billingEmailHelper: "If you want invoices sent elsewhere.",
    adminSection: "Future account admin",
    adminSectionDesc: "Who will use Echo Pulse day to day.",
    adminName: "Admin name",
    adminNamePh: "Jane Doe",
    adminEmail: "Admin email",
    adminEmailPh: "jane.doe@company.com",
    adminEmailHelper: "We'll send an invite and instructions.",
    s3Title: "Set up teams",
    s3Subtitle: "Create teams and add members. You can always change later.",
    teamName: "Team name",
    teamNamePh: "Marketing",
    teamLeader: "Team leader email",
    teamLeaderPh: "leader@company.com",
    teamLeaderHelper: "Sees only their team's results.",
    teamMembers: "Team members",
    memberPh: "employee@company.com",
    addMember: "Add member",
    addTeam: "Add another team",
    removeTeam: "Remove team",
    skipTeams: "Skip — I'll set up teams later",
    s4Title: "Confirm & launch",
    s4Subtitle: "Review the details and confirm account creation.",
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
    saveTag: "-20%",
    perPerson: "per person / month",
    termsAgree: "I agree to the",
    termsLink: "Terms of Service",
    termsAnd: "and",
    privacyLink: "Privacy Policy",
    guarantee: "30-day money-back guarantee",
    submit: "Create account",
    submitting: "Creating your account…",
    successTitle: "Welcome to Echo Pulse!",
    successBody: "We've sent an invite to the admin email. We'll reach out within an hour to walk you through setup.",
    successCta: "Back to homepage",
    next: "Continue",
    back: "Back",
    required: "Required",
    invalidEmail: "Enter a valid email",
    people: "people",
  },
  de: {
    pageTitle: "Erstellen Sie Ihr Echo Pulse Konto",
    pageSubtitle: "Dauert weniger als 2 Minuten",
    steps: ["Unternehmen", "Kontakte", "Teams", "Bestätigung"],
    brandTagline: "Verstehen Sie Ihr Team in 2 Minuten",
    socialProof: "Über 500 Unternehmen vertrauen uns",
    valueProp1: "KI-Teamstimmungsanalyse in Echtzeit",
    valueProp2: "Automatische 2-Minuten-Pulse-Check-ins",
    valueProp3: "Sofortige Ergebnisse — kein Warten",
    valueProp4: "DSGVO-konform mit ISO-Zertifizierung",
    s1Title: "Unternehmensdetails",
    s1Subtitle: "Wir verwenden diese Daten für Ihr Konto.",
    companyName: "Firmenname",
    companyNamePh: "Acme GmbH",
    companyId: "Handelsregister-Nr.",
    companyIdPh: "HRB 12345",
    companyIdHelper: "Offizielle Registrierungsnummer",
    s2Title: "Kontaktpersonen",
    s2Subtitle: "Wer vertritt das Unternehmen und wer nutzt das System täglich?",
    repSection: "Unternehmensvertreter",
    repSectionDesc: "Zuständig für Vertrag und Abrechnung.",
    repName: "Name des Vertreters",
    repNamePh: "Max Mustermann",
    repEmail: "E-Mail des Vertreters",
    repEmailPh: "max.mustermann@firma.de",
    repEmailHelper: "Hier senden wir Vertrag und Rechnungen.",
    billingEmail: "Rechnungs-E-Mail (optional)",
    billingEmailPh: "buchhaltung@firma.de",
    billingEmailHelper: "Falls Rechnungen an andere Adresse gehen.",
    adminSection: "Zukünftiger Account-Admin",
    adminSectionDesc: "Wer Echo Pulse täglich nutzen wird.",
    adminName: "Admin-Name",
    adminNamePh: "Erika Musterfrau",
    adminEmail: "Admin-E-Mail",
    adminEmailPh: "erika.musterfrau@firma.de",
    adminEmailHelper: "Wir senden Einladung und Einrichtungsanleitung.",
    s3Title: "Teams einrichten",
    s3Subtitle: "Erstellen Sie Teams und fügen Sie Mitglieder hinzu.",
    teamName: "Teamname",
    teamNamePh: "Marketing",
    teamLeader: "Teamleiter-E-Mail",
    teamLeaderPh: "leiter@firma.de",
    teamLeaderHelper: "Sieht nur Ergebnisse seines Teams.",
    teamMembers: "Teammitglieder",
    memberPh: "mitarbeiter@firma.de",
    addMember: "Hinzufügen",
    addTeam: "Weiteres Team",
    removeTeam: "Team entfernen",
    skipTeams: "Überspringen — richte ich später ein",
    s4Title: "Bestätigen & starten",
    s4Subtitle: "Überprüfen und bestätigen.",
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
    saveTag: "-20%",
    perPerson: "pro Person / Monat",
    termsAgree: "Ich stimme den",
    termsLink: "Nutzungsbedingungen",
    termsAnd: "und der",
    privacyLink: "Datenschutzerklärung",
    guarantee: "30 Tage Geld-zurück-Garantie",
    submit: "Konto erstellen",
    submitting: "Konto wird erstellt…",
    successTitle: "Willkommen bei Echo Pulse!",
    successBody: "Einladung wurde an die Admin-E-Mail gesendet. Innerhalb einer Stunde melden wir uns.",
    successCta: "Zurück zur Startseite",
    next: "Weiter",
    back: "Zurück",
    required: "Pflichtfeld",
    invalidEmail: "Geben Sie eine gültige E-Mail ein",
    people: "Personen",
  },
};

/* ═══════════════════════════════════════════════════
   Reusable UI atoms (matching signup-modal premium design)
   ═══════════════════════════════════════════════════ */

/* Floating decorative orb */
function FloatingOrb({ delay = 0, size = 120, x = 0, y = 0, color = "#9F7AEA" }: {
  delay?: number; size?: number; x?: number; y?: number; color?: string;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size, left: x, top: y,
        background: `radial-gradient(circle, ${color}40 0%, ${color}00 70%)`,
        filter: "blur(40px)",
      }}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -20, 15, -10, 0],
        scale: [1, 1.2, 0.9, 1.1, 1],
      }}
      transition={{
        duration: 12 + delay * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/* Confetti celebration */
function CelebrationParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
        size: 4 + Math.random() * 8,
        color: ["#9F7AEA", "#6366F1", "#2D1B69", "#F59E0B", "#10B981", "#EC4899"][
          Math.floor(Math.random() * 6)
        ],
        rotation: Math.random() * 360,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`, top: "-5%", width: p.size, height: p.size,
            borderRadius: p.size > 8 ? "2px" : "50%", backgroundColor: p.color,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: [0, window.innerHeight * 1.2],
            opacity: [1, 1, 0.8, 0],
            rotate: [0, p.rotation + 360],
            x: [0, (Math.random() - 0.5) * 200],
          }}
          transition={{
            duration: p.duration, delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}

/* Animated progress bar */
function ProgressBar({ step, total }: { step: number; total: number }) {
  const progress = ((step + 1) / total) * 100;
  return (
    <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: "linear-gradient(90deg, #9F7AEA, #6366F1, #2D1B69)",
          backgroundSize: "200% 100%",
        }}
        animate={{ width: `${progress}%`, backgroundPosition: ["0% 0%", "100% 0%"] }}
        transition={{
          width: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
        }}
      />
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: "linear-gradient(90deg, #9F7AEA80 0%, #6366F180 100%)", filter: "blur(4px)" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/* Value prop cycling */
function ValuePropCarousel({ items }: { items: string[] }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % items.length), 3000);
    return () => clearInterval(timer);
  }, [items.length]);
  const icons = [Zap, Timer, BarChart3, Lock];
  return (
    <div className="relative h-20 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center gap-4"
        >
          {(() => {
            const Icon = icons[current % icons.length];
            return (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/10">
                  <Icon className="w-6 h-6 text-white/90" />
                </div>
                <p className="text-white/80 text-[15px] leading-relaxed font-medium">{items[current]}</p>
              </>
            );
          })()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* Glow input */
function GlowInput({
  className, helperText, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string; helperText?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div className="relative group">
        <motion.div
          className="absolute -inset-[2px] rounded-xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, #9F7AEA, #6366F1)", opacity: 0 }}
          animate={{ opacity: focused ? 0.3 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <input
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={cn(
            "relative w-full h-12 px-4 rounded-xl border bg-white text-brand-text-primary text-[14px]",
            "placeholder:text-brand-text-muted/50",
            "transition-all duration-200",
            "border-brand-border/60 hover:border-brand-primary/30",
            "focus:outline-none focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
        />
      </div>
      {helperText && (
        <p className="text-[11px] text-brand-text-muted mt-1 ml-1">{helperText}</p>
      )}
    </div>
  );
}

/* Slide variants */
const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0, filter: "blur(4px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (d: number) => ({ x: d < 0 ? 80 : -80, opacity: 0, filter: "blur(4px)" }),
};

/* ═══════════════════════════════════════════════════
   MAIN: OnboardingPage
   ═══════════════════════════════════════════════════ */
export function OnboardingPage() {
  const { language } = useLanguage();
  const txt = (copy as any)[language] || copy.en;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isEur = language === "en" || language === "de";
  const monthlyPrice = isEur ? 5 : 129;
  const yearlyPrice = isEur ? 4 : 99;

  const {
    register, handleSubmit, control, watch, trigger, getValues,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    defaultValues: {
      companyName: "", companyId: "",
      repName: "", repEmail: "", billingEmail: "",
      adminName: "", adminEmail: "",
      teams: [{ name: "", leaderEmail: "", members: [{ email: "" }] }],
      employeeCount: 50,
      billingInterval: "yearly",
      agreedToTerms: false,
    },
    mode: "onBlur",
  });

  const { fields: teamFields, append: appendTeam, remove: removeTeamField } = useFieldArray({ control, name: "teams" });

  const billingInterval = watch("billingInterval");
  const employeeCount = watch("employeeCount");
  const price = billingInterval === "monthly" ? monthlyPrice : yearlyPrice;
  const billable = Math.min(employeeCount, 200);
  const total = price * billable;

  /* Step validation */
  const fieldsByStep: Record<number, (keyof OnboardingFormData)[]> = useMemo(() => ({
    0: ["companyName"],
    1: ["repName", "repEmail", "adminName", "adminEmail"],
    2: [],
    3: ["agreedToTerms"],
  }), []);

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

  /* Submit */
  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    const totalMembers = data.teams.reduce(
      (sum, t) => sum + t.members.filter((m) => m.email.trim()).length, 0
    );
    try {
      await submitLead({
        email: data.repEmail,
        name: data.repName,
        company: data.companyName,
        companySize: String(data.employeeCount),
        source: `onboarding:${data.billingInterval}:${totalMembers}m:${data.teams.length}t`,
      });
      trackLeadSubmitted("onboarding");
    } catch { /* fire-and-forget */ }
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const valuePropItems = [txt.valueProp1, txt.valueProp2, txt.valueProp3, txt.valueProp4];

  /* ═════ SUCCESS ═════ */
  if (isSuccess) {
    return (
      <div
        className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2D1B69 0%, #1E0F4D 30%, #4C1D95 60%, #2D1B69 100%)" }}
      >
        <CelebrationParticles />
        <FloatingOrb x={100} y={100} size={200} color="#9F7AEA" delay={0} />
        <FloatingOrb x={600} y={300} size={180} color="#6366F1" delay={1} />

        <div className="relative z-20 text-center px-6 max-w-lg">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-brand-success/20 flex items-center justify-center"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 300 }}>
              <Check className="w-12 h-12 text-brand-success" strokeWidth={3} />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-3xl md:text-5xl font-bold text-white font-[var(--font-display)] mb-4"
          >
            {txt.successTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-white/70 text-[16px] leading-relaxed mb-10 max-w-md mx-auto"
          >
            {txt.successBody}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Link to="/">
              <Button size="lg" className="h-14 px-12 text-[16px] font-semibold rounded-2xl bg-white text-brand-primary hover:bg-white/90 shadow-2xl shadow-brand-primary/30">
                {txt.successCta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-6 mt-8 text-white/30 text-[11px]">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> GDPR</span>
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> ISO</span>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ═════ MAIN LAYOUT ═════ */
  return (
    <div className="min-h-[100dvh] flex bg-white">
      {/* ═══════════ LEFT PANEL — Brand & Social Proof (desktop) ═══════════ */}
      <div className="hidden lg:flex w-[420px] xl:w-[460px] shrink-0 flex-col relative overflow-hidden sticky top-0 h-[100dvh]">
        <div
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: "linear-gradient(135deg, #2D1B69 0%, #1E0F4D 25%, #4C1D95 50%, #2D1B69 75%, #1E0F4D 100%)",
            backgroundSize: "400% 400%",
          }}
        />

        <FloatingOrb x={-40} y={100} size={200} color="#9F7AEA" delay={0} />
        <FloatingOrb x={250} y={300} size={160} color="#6366F1" delay={2} />
        <FloatingOrb x={100} y={500} size={180} color="#A78BFA" delay={4} />
        <FloatingOrb x={300} y={150} size={100} color="#818CF8" delay={1} />

        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 flex flex-col h-full p-8 xl:p-10">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-auto">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight font-[var(--font-display)]">Echo Pulse</span>
            </Link>
          </motion.div>

          {/* Hero text */}
          <div className="mt-auto mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white text-3xl xl:text-4xl font-bold leading-tight font-[var(--font-display)] mb-6"
            >
              {txt.brandTagline}
            </motion.h2>
            <ValuePropCarousel items={valuePropItems} />
          </div>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 bg-gradient-to-br from-brand-accent/60 to-brand-primary/60 flex items-center justify-center">
                    <Star className="w-3 h-3 text-white/80" />
                  </div>
                ))}
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-white/60 text-[13px] font-medium">{txt.socialProof}</p>

            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
              {[
                { icon: ShieldCheck, label: "GDPR" },
                { icon: Lock, label: "SSL" },
                { icon: Globe, label: "ISO" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-white/40 text-[11px] font-medium">
                  <Icon className="w-3.5 h-3.5" /><span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════ RIGHT PANEL — Form ═══════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile gradient header */}
        <div className="lg:hidden h-16 relative overflow-hidden shrink-0" style={{ background: "linear-gradient(135deg, #2D1B69 0%, #4C1D95 100%)" }}>
          <FloatingOrb x={-20} y={-20} size={80} color="#9F7AEA" delay={0} />
          <div className="relative z-10 h-full flex items-center justify-between px-5">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/80" />
              <span className="text-white font-bold text-sm tracking-tight">Echo Pulse</span>
            </Link>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 sm:px-10 lg:px-14 pt-6 lg:pt-10 shrink-0">
          <ProgressBar step={step} total={STEPS.length} />

          <div className="flex items-center justify-between mt-4 mb-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <button
                  key={s.id} type="button"
                  onClick={() => { if (i < step) { setDirection(-1); setStep(i); } }}
                  className={cn(
                    "flex items-center gap-2 text-[12px] font-semibold transition-all duration-300",
                    active ? "text-brand-primary"
                      : done ? "text-brand-text-secondary cursor-pointer hover:text-brand-primary"
                      : "text-brand-text-muted/50 cursor-default"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300",
                    active ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30"
                      : done ? "bg-brand-success/10 text-brand-success"
                      : "bg-brand-background-muted text-brand-text-muted/50"
                  )}>
                    {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="hidden sm:block">{txt.steps[i]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-y-auto px-6 sm:px-10 lg:px-14 pb-6">
          {/* Step title */}
          <motion.div key={`title-${step}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8 mt-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-primary font-[var(--font-display)] mb-1">
              {step === 0 ? txt.s1Title : step === 1 ? txt.s2Title : step === 2 ? txt.s3Title : txt.s4Title}
            </h2>
            <p className="text-brand-text-muted text-[14px]">
              {step === 0 ? txt.s1Subtitle : step === 1 ? txt.s2Subtitle : step === 2 ? txt.s3Subtitle : txt.s4Subtitle}
            </p>
          </motion.div>

          {/* Animated steps */}
          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step} custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 0 && <Step1 register={register} errors={errors} txt={txt} />}
                {step === 1 && <Step2 register={register} errors={errors} txt={txt} />}
                {step === 2 && <Step3 teamFields={teamFields} appendTeam={appendTeam} removeTeam={removeTeamField} control={control} register={register} errors={errors} txt={txt} />}
                {step === 3 && <Step4 register={register} watch={watch} getValues={getValues} errors={errors} txt={txt} isEur={isEur} monthlyPrice={monthlyPrice} yearlyPrice={yearlyPrice} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between pt-6 mt-auto border-t border-brand-border/30">
            {step > 0 ? (
              <button type="button" onClick={goBack} className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-text-muted hover:text-brand-text-primary transition-colors">
                <ChevronLeft className="w-4 h-4" />{txt.back}
              </button>
            ) : (
              <Link to="/" className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-text-muted hover:text-brand-text-primary transition-colors">
                <ChevronLeft className="w-4 h-4" />{txt.back}
              </Link>
            )}

            <div className="flex items-center gap-4">
              {step === 2 && (
                <button type="button" onClick={() => { setDirection(1); setStep(3); }} className="text-[12px] text-brand-text-muted hover:text-brand-primary transition-colors font-medium">
                  {txt.skipTeams}
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={goNext} className="h-12 px-8 text-[14px] font-semibold rounded-xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all">
                  {txt.next}<ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className={cn(
                  "h-12 px-10 text-[14px] font-semibold rounded-xl transition-all",
                  isSubmitting ? "opacity-80" : "shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30"
                )}>
                  {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />{txt.submitting}</>) : (<><Rocket className="w-4 h-4 mr-2" />{txt.submit}</>)}
                </Button>
              )}
            </div>
          </div>

          {/* Trust */}
          <div className="flex items-center justify-center gap-6 mt-4 text-[11px] text-brand-text-muted/60">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> GDPR</span>
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {txt.guarantee}</span>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STEP 1 — Company
   ═══════════════════════════════════════════════════ */
function Step1({ register, errors, txt }: { register: any; errors: any; txt: any }) {
  return (
    <div className="space-y-6 max-w-lg">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label={txt.companyName} error={errors.companyName?.message} required>
            <GlowInput type="text" autoComplete="organization" placeholder={txt.companyNamePh}
              {...register("companyName", { required: txt.required, minLength: { value: 2, message: txt.required } })} />
          </FormField>
          <FormField label={txt.companyId} error={errors.companyId?.message}>
            <GlowInput type="text" placeholder={txt.companyIdPh} helperText={txt.companyIdHelper}
              {...register("companyId")} />
          </FormField>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STEP 2 — Contacts (Rep + Admin)
   ═══════════════════════════════════════════════════ */
function Step2({ register, errors, txt }: { register: any; errors: any; txt: any }) {
  return (
    <div className="space-y-6 max-w-lg">
      {/* Representative */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="rounded-2xl border border-brand-border/40 bg-brand-background-secondary/30 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-brand-primary" />
            <h4 className="text-[14px] font-bold text-brand-text-primary">{txt.repSection}</h4>
          </div>
          <p className="text-[12px] text-brand-text-muted mb-4 ml-6">{txt.repSectionDesc}</p>
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label={txt.repName} error={errors.repName?.message} required>
                <GlowInput type="text" autoComplete="name" placeholder={txt.repNamePh}
                  {...register("repName", { required: txt.required })} />
              </FormField>
              <FormField label={txt.repEmail} error={errors.repEmail?.message} required>
                <GlowInput type="email" autoComplete="email" placeholder={txt.repEmailPh} helperText={txt.repEmailHelper}
                  {...register("repEmail", { required: txt.required, pattern: { value: /^\S+@\S+\.\S+$/, message: txt.invalidEmail } })} />
              </FormField>
            </div>
            <FormField label={txt.billingEmail} error={errors.billingEmail?.message}>
              <GlowInput type="email" placeholder={txt.billingEmailPh} helperText={txt.billingEmailHelper}
                {...register("billingEmail")} />
            </FormField>
          </div>
        </div>
      </motion.div>

      {/* Admin */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="rounded-2xl border border-brand-border/40 bg-brand-background-secondary/30 p-5">
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="w-4 h-4 text-brand-primary" />
            <h4 className="text-[14px] font-bold text-brand-text-primary">{txt.adminSection}</h4>
          </div>
          <p className="text-[12px] text-brand-text-muted mb-4 ml-6">{txt.adminSectionDesc}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label={txt.adminName} error={errors.adminName?.message} required>
              <GlowInput type="text" placeholder={txt.adminNamePh}
                {...register("adminName", { required: txt.required })} />
            </FormField>
            <FormField label={txt.adminEmail} error={errors.adminEmail?.message} required>
              <GlowInput type="email" placeholder={txt.adminEmailPh} helperText={txt.adminEmailHelper}
                {...register("adminEmail", { required: txt.required, pattern: { value: /^\S+@\S+\.\S+$/, message: txt.invalidEmail } })} />
            </FormField>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STEP 3 — Teams
   ═══════════════════════════════════════════════════ */
function Step3({ teamFields, appendTeam, removeTeam, control, register, errors, txt }: {
  teamFields: any[]; appendTeam: any; removeTeam: any; control: any; register: any; errors: any; txt: any;
}) {
  return (
    <div className="space-y-5 max-w-lg">
      {teamFields.map((team: any, ti: number) => (
        <motion.div key={team.id}
          initial={{ opacity: 0, y: 15, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ duration: 0.3 }}
          className="rounded-2xl border border-brand-border/40 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-brand-primary" />
              </div>
              <span className="text-[13px] font-bold text-brand-text-primary">Team {ti + 1}</span>
            </div>
            {teamFields.length > 1 && (
              <button type="button" onClick={() => removeTeam(ti)}
                className="text-[11px] text-brand-text-muted hover:text-brand-error flex items-center gap-1 transition-colors">
                <Trash2 className="w-3 h-3" />{txt.removeTeam}
              </button>
            )}
          </div>
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label={txt.teamName} error={errors.teams?.[ti]?.name?.message}>
                <GlowInput type="text" placeholder={txt.teamNamePh} {...register(`teams.${ti}.name`)} />
              </FormField>
              <FormField label={txt.teamLeader} error={errors.teams?.[ti]?.leaderEmail?.message}>
                <GlowInput type="email" placeholder={txt.teamLeaderPh} helperText={txt.teamLeaderHelper}
                  {...register(`teams.${ti}.leaderEmail`)} />
              </FormField>
            </div>
            <InlineMembers teamIndex={ti} control={control} register={register} txt={txt} />
          </div>
        </motion.div>
      ))}

      <motion.button type="button"
        onClick={() => appendTeam({ name: "", leaderEmail: "", members: [{ email: "" }] })}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-brand-border/60 hover:border-brand-primary/40 text-[13px] font-semibold text-brand-text-muted hover:text-brand-primary transition-all hover:bg-brand-primary/[0.02]"
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
      >
        <Plus className="w-4 h-4" />{txt.addTeam}
      </motion.button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STEP 4 — Confirm & Plan
   ═══════════════════════════════════════════════════ */
function Step4({ register, watch, getValues, errors, txt, isEur, monthlyPrice, yearlyPrice }: {
  register: any; watch: any; getValues: any; errors: any; txt: any;
  isEur: boolean; monthlyPrice: number; yearlyPrice: number;
}) {
  const interval = watch("billingInterval");
  const count = watch("employeeCount");
  const price = interval === "monthly" ? monthlyPrice : yearlyPrice;
  const bill = Math.min(count, 200);
  const base = price * bill;

  const vals = getValues();
  const totalMembers = vals.teams.reduce(
    (s: number, t: TeamEntry) => s + t.members.filter((m: TeamMember) => m.email.trim()).length, 0
  );
  const teamCount = vals.teams.filter((t: TeamEntry) => t.name.trim()).length;

  return (
    <div className="space-y-6 max-w-lg">
      {/* Summary chips */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-3">
        {[
          { icon: Building2, value: vals.companyName || "—", color: "text-brand-primary" },
          { icon: Mail, value: vals.repEmail || "—", color: "text-indigo-500" },
          { icon: Users, value: `${teamCount} team${teamCount !== 1 ? "s" : ""} · ${totalMembers} ${txt.people}`, color: "text-violet-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-background-secondary/50 border border-brand-border/30">
            <item.icon className={cn("w-3.5 h-3.5", item.color)} />
            <span className="text-[13px] font-medium text-brand-text-primary">{item.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Employee slider */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl border border-brand-border/40 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <label className="text-[14px] font-bold text-brand-text-primary">{txt.employeeCount}</label>
          <motion.div key={count} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold font-mono text-brand-primary">
            {count}
          </motion.div>
        </div>
        <p className="text-[12px] text-brand-text-muted mb-4">{txt.employeeCountHelper}</p>
        <input type="range" min="10" max="350" step="5"
          {...register("employeeCount", { valueAsNumber: true })}
          className="w-full h-2 appearance-none cursor-pointer rounded-full bg-brand-border/50
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px]
            [&::-webkit-slider-thumb]:border-brand-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand-primary/20
            [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:transition-shadow
            [&::-webkit-slider-thumb]:hover:shadow-xl [&::-webkit-slider-thumb]:hover:shadow-brand-primary/30
            [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-brand-primary [&::-moz-range-thumb]:cursor-grab"
        />
        <div className="flex justify-between text-[10px] text-brand-text-muted/50 mt-1 px-0.5">
          <span>10</span><span>100</span><span>200</span><span>350+</span>
        </div>
      </motion.div>

      {/* Billing card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-brand-border/40 bg-gradient-to-br from-brand-background-secondary/30 via-white to-brand-background-secondary/20 p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-primary/5 to-transparent rounded-bl-[60px]" />
        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-[14px] font-bold text-brand-text-primary">{txt.plan}</h4>
            <div className="flex bg-brand-background-muted rounded-xl p-1 border border-brand-border/50">
              <label className={cn(
                "px-3 py-1.5 rounded-lg text-[12px] font-bold cursor-pointer transition-all duration-200",
                interval === "monthly" ? "bg-white text-brand-primary shadow-sm" : "text-brand-text-muted hover:text-brand-primary"
              )}>
                <input type="radio" value="monthly" className="sr-only" {...register("billingInterval")} />{txt.monthly}
              </label>
              <label className={cn(
                "px-3 py-1.5 rounded-lg text-[12px] font-bold cursor-pointer transition-all duration-200 flex items-center gap-1.5",
                interval === "yearly" ? "bg-white text-brand-primary shadow-sm" : "text-brand-text-muted hover:text-brand-primary"
              )}>
                <input type="radio" value="yearly" className="sr-only" {...register("billingInterval")} />{txt.yearly}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-success/10 text-brand-success font-bold">{txt.saveTag}</span>
              </label>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <motion.span key={base} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-brand-text-primary font-mono tracking-tight">
              {isEur ? `€${base.toLocaleString()}` : `${base.toLocaleString()} Kč`}
            </motion.span>
            <span className="text-[13px] text-brand-text-muted">/ {txt.monthly.toLowerCase()}</span>
          </div>
          <p className="text-[12px] text-brand-text-muted mt-1">
            {isEur ? `€${price}` : `${price} Kč`} {txt.perPerson} × {bill}
          </p>
        </div>
      </motion.div>

      {/* Terms */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="mt-0.5 relative">
            <input type="checkbox" className="peer sr-only" {...register("agreedToTerms", { required: txt.required })} />
            <div className="w-5 h-5 rounded-md border-2 border-brand-border peer-checked:border-brand-primary peer-checked:bg-brand-primary transition-all duration-200 flex items-center justify-center">
              <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-[13px] text-brand-text-secondary leading-relaxed group-hover:text-brand-text-primary transition-colors">
            {txt.termsAgree}{" "}
            <a href="https://www.behavera.com/podminky-pouzivani-sluzby" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline underline-offset-2 hover:text-brand-primary-hover">{txt.termsLink}</a>{" "}
            {txt.termsAnd}{" "}
            <a href="https://www.behavera.com/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline underline-offset-2 hover:text-brand-primary-hover">{txt.privacyLink}</a>
          </span>
        </label>
        {errors.agreedToTerms && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="text-[12px] text-brand-error flex items-center gap-1 mt-2 ml-8">
            <AlertCircle className="w-3 h-3" />{errors.agreedToTerms.message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INLINE MEMBERS
   ═══════════════════════════════════════════════════ */
function InlineMembers({ teamIndex, control, register, txt }: {
  teamIndex: number; control: any; register: any; txt: any;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: `teams.${teamIndex}.members` });

  return (
    <div>
      <label className="block text-[12px] font-semibold text-brand-text-primary mb-2">{txt.teamMembers}</label>
      <div className="space-y-2">
        {fields.map((member: any, mi: number) => (
          <div key={member.id} className="flex items-center gap-2">
            <GlowInput type="email" placeholder={txt.memberPh} className="!h-10 text-[13px]"
              {...register(`teams.${teamIndex}.members.${mi}.email`)} />
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(mi)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-text-muted hover:text-brand-error hover:bg-brand-error/5 transition-all shrink-0">
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => append({ email: "" })}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors mt-1">
          <Plus className="w-3.5 h-3.5" />{txt.addMember}
        </button>
      </div>
    </div>
  );
}
