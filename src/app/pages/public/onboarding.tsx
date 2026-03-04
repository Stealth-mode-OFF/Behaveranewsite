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
  Upload,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { FormField } from "@/app/components/ui/form-field";
import { useLanguage } from "@/app/contexts/language-context";
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
} from "@/app/components/onboarding/team-builder";
// InviteTeammates step removed — OAuth import merged into Teams step
import { useAresLookup, type AresResult } from "@/app/hooks/use-ares-lookup";
import { parseContactsFile, CSV_ACCEPT, type ParsedContact } from "@/app/utils/csv-parser";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51T7Bp6Rq27QBJtVSvx0Z8vDBVWXEaLQDDXCMF099R0SpjDJY4B2d2iNwNiNvf3IhQpz4d7DJf1IutbdkeD6sQjcX003PTS8i2N");

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
  billingInterval: "monthly" | "yearly" | "custom";
  agreedToTerms: boolean;
};

/* ─── Steps definition ─── */
const STEPS = [
  { id: "company", icon: Building2 },
  { id: "teams", icon: Users },
  { id: "signup", icon: Rocket },
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
    steps: ["Společnost", "Týmy", "Registrace"],
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
    connectCSV: "Nahrát CSV soubor",
    csvOrDivider: "nebo nahrajte soubor",
    csvDropHint: "CSV, TSV nebo TXT (jméno + e-mail)",
    csvSuccess: "kontaktů načteno ze souboru",
    csvError: "Chyba při čtení souboru",
    csvParsing: "Zpracovávám soubor…",
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
    s2Title: "Vyberte si plán",
    s2Subtitle: "Zvolte plán, který vyhovuje vaší firmě.",
    summaryCompany: "Společnost",
    summaryRep: "Zástupce",
    summaryAdmin: "Administrátor",
    summaryTeams: "Týmy",
    summaryMembers: "členů",
    employeeCount: "Počet zaměstnanců",
    employeeCountPlaceholder: "Minimálně 5",
    employeeCountHelper: "Kolik lidí bude Behavera používat (vyplňovat Pulz nebo přistupovat k výsledkům)?",
    planOptions: "Plán",
    annual: "Roční plán",
    annualRecommended: "DOPORUČENO",
    annualDesc: "Nejlepší hodnota\nRoční fakturace, bez skrytých poplatků",
    monthly: "Měsíční plán",
    monthlyDesc: "Flexibilní, bez závazku",
    custom: "Individuální plán",
    customDesc: "Potřebujete speciální podmínky? Ozveme se vám.",
    customSelected: "Budeme vás kontaktovat s individuální nabídkou do 24 hodin.",
    yearly: "Ročně",
    saveTag: "Ušetřete 20 %",
    pricePerPerson: "za osobu / měsíc",
    termsAgree: "Souhlasím s",
    termsLink: "Obchodními podmínkami",
    guarantee: "30denní garance vrácení peněz. Pokud se rozhodnete, že Behavera není pro vás, vrátíme vám peníze — bez otázek.",
    legalNote: "Níže potvrzujete plán, cenu a podmínky spolupráce. Odesláním formuláře uzavíráte smlouvu. Pokud jste obdrželi individuální nabídku, potvrzujete podmínky v ní uvedené.",
    adjustLater: "Počet zaměstnanců můžete kdykoli upravit.",
    billingStarts: "Fakturace začíná až po aktivaci.",
    teamsConfigLater: "Týmy můžete přidat nebo změnit i později.",
    submit: "Vytvořit účet",
    submitting: ["Vytvářím účet…", "Ukládám týmy…", "Připravuji platbu…", "Otevírám platební bránu…", "Hotovo ✓"],
    successTitle: "Děkujeme! 🎉",
    successSubtitle: "Vaše registrace proběhla úspěšně. Tady je, co se stane dál:",
    successCta: "Zpět na hlavní stránku",
    successTimeline: [
      { icon: "mail", title: "Potvrzení odesláno", desc: "Na váš email jsme odeslali potvrzení registrace." },
      { icon: "phone", title: "Ozveme se vám", desc: "Náš tým vás bude kontaktovat do 24 hodin." },
      { icon: "rocket", title: "Společně nastavíme", desc: "Provedeme vás úvodním nastavením a spuštěním." },
      { icon: "sparkles", title: "Insights do 7 dní", desc: "První přehledy a doporučení pro váš tým." },
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
    steps: ["Company", "Teams", "Sign up"],
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
    connectCSV: "Upload CSV file",
    csvOrDivider: "or upload a file",
    csvDropHint: "CSV, TSV, or TXT (name + email)",
    csvSuccess: "contacts imported from file",
    csvError: "Failed to read file",
    csvParsing: "Processing file…",
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
    s2Title: "Choose your plan",
    s2Subtitle: "Select the plan that fits your company.",
    summaryCompany: "Company",
    summaryRep: "Representative",
    summaryAdmin: "Admin",
    summaryTeams: "Teams",
    summaryMembers: "members",
    employeeCount: "Number of employees",
    employeeCountPlaceholder: "Minimum is 5",
    employeeCountHelper: "How many people will use Behavera (answer Pulse or access the results)?",
    planOptions: "Plan options",
    annual: "Annual plan",
    annualRecommended: "RECOMMENDED",
    annualDesc: "Best value\nAnnual billing, no hidden fees",
    monthly: "Monthly plan",
    monthlyDesc: "Flexible option with no commitment",
    custom: "Custom plan",
    customDesc: "Need special terms? We'll get in touch.",
    customSelected: "We'll contact you with a custom offer within 24 hours.",
    yearly: "Yearly",
    saveTag: "Save 20%",
    pricePerPerson: "per employee / month",
    termsAgree: "I agree to the",
    termsLink: "Terms of Service",
    guarantee: "30-day money-back guarantee. If you decide Behavera isn't for you, we'll refund you — no questions asked.",
    legalNote: "Below you confirm the plan, price, and terms for our cooperation. By submitting this form, you enter into the agreement. If you received a custom offer from us, you confirm the terms stated there.",
    adjustLater: "You can adjust the number of employees anytime.",
    billingStarts: "Billing starts after activation.",
    teamsConfigLater: "You can add or change teams later.",
    submit: "Create account",
    submitting: ["Creating account…", "Saving teams…", "Preparing payment…", "Opening checkout…", "Done ✓"],
    successTitle: "Thank you! 🎉",
    successSubtitle: "Your registration was successful. Here's what happens next:",
    successCta: "Back to homepage",
    successTimeline: [
      { icon: "mail", title: "Confirmation sent", desc: "We've sent a confirmation to your email." },
      { icon: "phone", title: "We'll be in touch", desc: "Our team will contact you within 24 hours." },
      { icon: "rocket", title: "Setup together", desc: "We'll walk you through setup and launch." },
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
    steps: ["Unternehmen", "Teams", "Registrierung"],
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
    connectCSV: "CSV-Datei hochladen",
    csvOrDivider: "oder Datei hochladen",
    csvDropHint: "CSV, TSV oder TXT (Name + E-Mail)",
    csvSuccess: "Kontakte aus Datei importiert",
    csvError: "Datei konnte nicht gelesen werden",
    csvParsing: "Datei wird verarbeitet…",
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
    s2Title: "Wählen Sie Ihren Plan",
    s2Subtitle: "Wählen Sie den Plan, der zu Ihrem Unternehmen passt.",
    summaryCompany: "Unternehmen",
    summaryRep: "Vertreter",
    summaryAdmin: "Admin",
    summaryTeams: "Teams",
    summaryMembers: "Mitglieder",
    employeeCount: "Anzahl der Mitarbeiter",
    employeeCountPlaceholder: "Minimum 5",
    employeeCountHelper: "Wie viele Personen werden Behavera nutzen (Pulse beantworten oder Ergebnisse einsehen)?",
    planOptions: "Planoptionen",
    annual: "Jahresplan",
    annualRecommended: "EMPFOHLEN",
    annualDesc: "Bestes Preis-Leistungs-Verhältnis\nJährliche Abrechnung, keine versteckten Gebühren",
    monthly: "Monatsplan",
    monthlyDesc: "Flexibel und ohne Bindung",
    custom: "Individueller Plan",
    customDesc: "Brauchen Sie Sonderkonditionen? Wir melden uns.",
    customSelected: "Wir kontaktieren Sie innerhalb von 24 Stunden mit einem individuellen Angebot.",
    yearly: "Jährlich",
    saveTag: "20 % sparen",
    pricePerPerson: "pro Mitarbeiter / Monat",
    termsAgree: "Ich stimme den",
    termsLink: "Nutzungsbedingungen",
    guarantee: "30 Tage Geld-zurück-Garantie. Wenn Behavera nicht das Richtige für Sie ist, erstatten wir Ihnen den Betrag — ohne Fragen.",
    legalNote: "Nachfolgend bestätigen Sie Plan, Preis und Kooperationsbedingungen. Mit dem Absenden gehen Sie eine Vereinbarung ein. Falls Sie ein individuelles Angebot erhalten haben, bestätigen Sie die dort genannten Konditionen.",
    adjustLater: "Anzahl der Mitarbeiter jederzeit anpassbar.",
    billingStarts: "Abrechnung beginnt nach der Aktivierung.",
    teamsConfigLater: "Teams können Sie später hinzufügen oder ändern.",
    submit: "Konto erstellen",
    submitting: ["Konto wird erstellt…", "Teams werden gespeichert…", "Zahlung wird vorbereitet…", "Checkout wird geöffnet…", "Fertig ✓"],
    successTitle: "Vielen Dank! 🎉",
    successSubtitle: "Ihre Registrierung war erfolgreich. Das passiert als Nächstes:",
    successCta: "Zurück zur Startseite",
    successTimeline: [
      { icon: "mail", title: "Bestätigung gesendet", desc: "Wir haben eine Bestätigung an Ihre E-Mail gesendet." },
      { icon: "phone", title: "Wir melden uns", desc: "Unser Team kontaktiert Sie innerhalb von 24 Stunden." },
      { icon: "rocket", title: "Gemeinsam einrichten", desc: "Wir führen Sie durch die Einrichtung und den Start." },
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

  // Stripe embedded checkout
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null);
  const checkoutContainerRef = useRef<HTMLDivElement>(null);

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

  // CSV upload contacts
  const [csvContacts, setCsvContacts] = useState<ParsedContact[]>([]);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = useCallback(async (file: File) => {
    setCsvLoading(true);
    setCsvError(null);
    try {
      const result = await parseContactsFile(file);
      if (result.errors.length > 0) {
        setCsvError(result.errors[0]);
        setCsvLoading(false);
        return;
      }
      if (result.contacts.length === 0) {
        setCsvError("No valid contacts found in file");
        setCsvLoading(false);
        return;
      }
      setCsvContacts(result.contacts);
      setSkippedConnect(false);
    } catch {
      setCsvError("Failed to read file");
    } finally {
      setCsvLoading(false);
    }
  }, []);

  const handleCSVInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleCSVUpload(file);
    // Reset so same file can be re-uploaded
    e.target.value = "";
  }, [handleCSVUpload]);

  const clearCSVContacts = useCallback(() => {
    setCsvContacts([]);
    setCsvError(null);
  }, []);

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

  // Handle Stripe redirect back (success/cancel)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      clearDraft();
      setIsSuccess(true);
      window.history.replaceState({}, "", "/start");
    }
    if (params.get("canceled") === "true") {
      toast.error(
        language === "cz"
          ? "Platba byla zrušena. Můžete to zkusit znovu."
          : language === "de"
            ? "Zahlung abgebrochen. Versuchen Sie es erneut."
            : "Payment was canceled. You can try again."
      );
      setCurrentStep(2);
      window.history.replaceState({}, "", "/start");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Mount Stripe Embedded Checkout when clientSecret is available
  useEffect(() => {
    if (!checkoutClientSecret || !checkoutContainerRef.current) return;

    let checkoutInstance: { unmount: () => void; destroy: () => void } | null = null;

    (async () => {
      const stripe = await stripePromise;
      if (!stripe || !checkoutContainerRef.current) return;

      const secret = checkoutClientSecret;
      const checkout = await stripe.initEmbeddedCheckout({
        fetchClientSecret: () => Promise.resolve(secret),
        onComplete: () => {
          checkout.destroy();
          setCheckoutClientSecret(null);
          clearDraft();
          setIsSuccess(true);
        },
      });

      checkoutInstance = checkout;
      checkout.mount(checkoutContainerRef.current);
    })();

    return () => {
      if (checkoutInstance) {
        checkoutInstance.destroy();
      }
    };
  }, [checkoutClientSecret]);

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

  // Contacts for TeamBuilder — OAuth (domain-filtered) + CSV contacts merged
  const teamBuilderContacts: TeamContact[] = useMemo(() => {
    const oauthPool = companyDomain ? domainContacts : oauthContacts;
    const seen = new Set<string>();
    const result: TeamContact[] = [];

    // OAuth contacts first (may have photos)
    for (const c of oauthPool) {
      const key = c.email.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ name: c.name, email: c.email, photo: c.photo });
      }
    }

    // CSV contacts (no photo), skip duplicates
    for (const c of csvContacts) {
      const key = c.email.toLowerCase();
      if (!seen.has(key)) {
        // If company domain is set, only include matching domain contacts
        if (companyDomain && !key.endsWith(`@${companyDomain}`)) continue;
        seen.add(key);
        result.push({ name: c.name, email: c.email, photo: "" });
      }
    }

    return result;
  }, [domainContacts, oauthContacts, companyDomain, csvContacts]);

  // Filtered contacts = only company domain (what we actually use everywhere)
  const filteredContacts = companyDomain ? domainContacts : oauthContacts;

  // Combined import count for the success bar
  const totalImportedContacts = teamBuilderContacts.length;
  const hasImportedContacts = oauthContacts.length > 0 || csvContacts.length > 0;

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

  /* ─── Suggest employee count from team members (if they imported teams) ─── */
  const computedFromTeams = useMemo(() => {
    let total = 0;
    for (const team of teams) {
      if (team.leaderEmail?.trim()) total++;
      total += team.members.length;
    }
    return total;
  }, [teams]);

  useEffect(() => {
    // Only pre-fill if they actually built teams AND haven't manually entered a count
    if (currentStep === 2 && computedFromTeams >= 5) {
      const current = getValues("employeeCount");
      if (!current || current === 50) {
        setValue("employeeCount", computedFromTeams);
      }
    }
  }, [currentStep, computedFromTeams, setValue, getValues]);

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
        2: ["agreedToTerms"],
      };
      if (!fieldsByStep[step] || fieldsByStep[step].length === 0) return true;
      return await trigger(fieldsByStep[step]);
    },
    [trigger]
  );

  const goNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    // Step 1 (teams): validate min 3 members per team + leader set
    if (currentStep === 1 && teams.length > 0) {
      const teamErrors: string[] = [];
      for (const t of teams) {
        if (t.members.length > 0 && t.members.length < 3) {
          teamErrors.push(`${t.name}: ${language === 'cz' ? 'minimálně 3 členové' : language === 'de' ? 'mindestens 3 Mitglieder' : 'minimum 3 members'}`);
        }
        if (t.members.length > 0 && !t.leaderEmail) {
          teamErrors.push(`${t.name}: ${language === 'cz' ? 'nastavte Team Leadera' : language === 'de' ? 'Teamleiter festlegen' : 'set a Team Leader'}`);
        }
      }
      if (teamErrors.length > 0) {
        toast.error(teamErrors.join('\n'), {
          duration: 5000,
          description: language === 'cz' ? 'Opravte chyby v týmech' : language === 'de' ? 'Beheben Sie die Teamfehler' : 'Fix team errors',
        });
        return;
      }
    }

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

    const phaseTimer1 = setTimeout(() => setSubmitPhase(1), 2000);
    const phaseTimer2 = setTimeout(() => setSubmitPhase(2), 4000);

    const minDelay = new Promise((r) => setTimeout(r, 5000));

    try {
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
          resultRecipients: t.resultRecipients || [],
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

      let submissionId: string | null = null;

      if (!res.ok) {
        console.warn("Onboarding API failed, falling back to basic lead");
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
      } else {
        const result = await res.json();
        submissionId = result.submissionId || null;
      }

      trackLeadSubmitted("onboarding");

      // ─── Stripe Embedded Checkout for paid plans ───
      if (data.billingInterval !== "custom" && submissionId) {
        setSubmitPhase(3); // "Preparing payment..."
        try {
          const checkoutRes = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              submissionId,
              billingInterval: data.billingInterval,
              employeeCount: data.employeeCount,
              currency: isEur ? "eur" : "czk",
              customerEmail: data.repEmail,
              companyName: data.companyName,
            }),
          });

          const checkout = await checkoutRes.json();
          if (checkout.clientSecret) {
            clearTimeout(phaseTimer1);
            clearTimeout(phaseTimer2);
            setIsSubmitting(false);
            setCheckoutClientSecret(checkout.clientSecret);
            return; // Modal will take over from here
          }
        } catch (err) {
          console.warn("Stripe checkout failed, showing success anyway:", err);
          // Fall through to success screen if Stripe fails
        }
      }

      // Custom plan or Stripe unavailable — show success directly
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      setSubmitPhase(4); // "Done ✓"
      await new Promise((r) => setTimeout(r, 1000));
      clearDraft();
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch {
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      setSubmitPhase(4);
      await new Promise((r) => setTimeout(r, 1000));
      clearDraft();
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  /* ─── Skip "Done" intermediate — go straight to success ─── */

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
                      {hasImportedContacts ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-success/5 border border-brand-success/20">
                          <div className="w-8 h-8 rounded-full bg-brand-success/10 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-brand-success" strokeWidth={3} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-brand-text-primary">
                              {totalImportedContacts} {oauthContacts.length > 0 ? txt.connectSuccess : txt.csvSuccess}
                              {companyDomain && (
                                <span className="ml-1.5 text-[11px] font-semibold text-brand-primary">
                                  @{companyDomain}
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { clearContacts(); clearCSVContacts(); setSkippedConnect(false); }}
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
                        <div className="rounded-2xl border-2 border-brand-primary/20 p-5 sm:p-6 bg-gradient-to-br from-brand-primary/[0.03] to-brand-background-secondary/40 shadow-sm">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                              <UserPlus className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-brand-text-primary leading-tight">
                                {txt.connectTitle}
                              </h3>
                              <p className="text-[12px] text-brand-text-muted mt-0.5 leading-relaxed">
                                {txt.connectSubtitle}
                              </p>
                            </div>
                          </div>

                          {(oauthError || csvError) && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
                              <AlertCircle className="w-4 h-4 text-brand-error shrink-0" />
                              <p className="text-[12px] text-brand-error font-medium">
                                {csvError ? csvError : oauthError === 'oauth_not_configured'
                                  ? txt.errorOAuthNotConfigured
                                  : txt.errorOAuth}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-3 mb-3">
                            <button
                              type="button"
                              onClick={() => fetchContacts("google")}
                              className="flex-1 flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border-2 border-brand-border/40 bg-white hover:border-brand-primary/40 hover:shadow-md transition-all text-center group"
                            >
                              <GoogleLogo />
                              <span className="text-[14px] font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors">
                                {txt.connectGoogle}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => fetchContacts("microsoft")}
                              className="flex-1 flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border-2 border-brand-border/40 bg-white hover:border-brand-primary/40 hover:shadow-md transition-all text-center group"
                            >
                              <MicrosoftLogo />
                              <span className="text-[14px] font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors">
                                {txt.connectMicrosoft}
                              </span>
                            </button>
                          </div>

                          {/* ── CSV upload divider + button ── */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1 h-px bg-brand-border/40" />
                            <span className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wider">
                              {txt.csvOrDivider}
                            </span>
                            <div className="flex-1 h-px bg-brand-border/40" />
                          </div>

                          <input
                            ref={csvInputRef}
                            type="file"
                            accept={CSV_ACCEPT}
                            onChange={handleCSVInputChange}
                            className="hidden"
                            aria-label={txt.connectCSV}
                          />

                          {csvLoading ? (
                            <div className="flex items-center justify-center py-4 gap-3 rounded-xl border-2 border-dashed border-brand-border/40 bg-brand-background-muted/30">
                              <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                              <p className="text-[13px] text-brand-text-muted font-medium">{txt.csvParsing}</p>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => csvInputRef.current?.click()}
                              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const file = e.dataTransfer.files?.[0];
                                if (file) handleCSVUpload(file);
                              }}
                              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border-2 border-dashed border-brand-border/40 bg-white hover:border-brand-primary/40 hover:bg-brand-primary/[0.02] hover:shadow-md transition-all text-center group mb-3"
                            >
                              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/15 transition-colors">
                                <FileSpreadsheet className="w-4 h-4 text-brand-primary" />
                              </div>
                              <div className="text-left">
                                <span className="text-[14px] font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors block leading-tight">
                                  {txt.connectCSV}
                                </span>
                                <span className="text-[11px] text-brand-text-muted leading-tight">
                                  {txt.csvDropHint}
                                </span>
                              </div>
                            </button>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-brand-success" />
                              <span className="text-[11px] text-brand-text-muted">{txt.privacyNote}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSkippedConnect(true)}
                              className="text-[12px] font-bold text-brand-text-muted hover:text-brand-primary transition-colors whitespace-nowrap ml-3"
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

                  {/* ═════════ STEP 2 — Sign up ═════════ */}
                  {currentStep === 2 && (
                    <SignupStep
                      txt={txt}
                      language={language}
                      isEur={isEur}
                      monthlyPrice={monthlyPrice}
                      yearlyPrice={yearlyPrice}
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
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
            <span>{language === "cz" ? "30denní garance" : language === "de" ? "30 Tage Garantie" : "30-day guarantee"}</span>
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

      {/* ─── Stripe Embedded Checkout Modal ─── */}
      <AnimatePresence>
        {checkoutClientSecret && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setCheckoutClientSecret(null);
                toast.info(
                  language === "cz"
                    ? "Platba byla zrušena. Můžete to zkusit znovu."
                    : language === "de"
                      ? "Zahlung abgebrochen. Versuchen Sie es erneut."
                      : "Payment was canceled. You can try again."
                );
              }}
            />
            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[600px] max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/50 bg-gradient-to-r from-brand-primary/5 to-transparent">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-primary" />
                  <span className="text-[15px] font-semibold text-brand-text-primary">
                    {language === "cz" ? "Zabezpečená platba" : language === "de" ? "Sichere Zahlung" : "Secure Payment"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setCheckoutClientSecret(null);
                    toast.info(
                      language === "cz"
                        ? "Platba byla zrušena. Můžete to zkusit znovu."
                        : language === "de"
                          ? "Zahlung abgebrochen. Versuchen Sie es erneut."
                          : "Payment was canceled. You can try again."
                    );
                  }}
                  className="text-brand-text-muted hover:text-brand-text-primary transition-colors p-1 rounded-lg hover:bg-brand-border/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              {/* Stripe checkout iframe */}
              <div className="flex-1 overflow-y-auto p-1" ref={checkoutContainerRef} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sign-up step sub-component — premium Behavera design ─── */
function SignupStep({
  txt,
  language,
  isEur,
  monthlyPrice,
  yearlyPrice,
  register,
  watch,
  setValue,
  errors,
}: {
  txt: (typeof copy)[keyof typeof copy];
  language: string;
  isEur: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  register: UseFormRegister<OnboardingFormData>;
  watch: UseFormWatch<OnboardingFormData>;
  setValue: (name: keyof OnboardingFormData, value: unknown, options?: { shouldValidate?: boolean }) => void;
  errors: FieldErrors<OnboardingFormData>;
}) {
  const currentInterval = watch("billingInterval");
  const currentCount = watch("employeeCount");
  const currency = isEur ? "€" : "Kč";
  const validCount = currentCount >= 5 ? currentCount : 0;
  const selectedPrice = currentInterval === "yearly" ? yearlyPrice : monthlyPrice;
  const monthlyTotal = validCount * selectedPrice;
  const annualSaving = validCount * (monthlyPrice - yearlyPrice) * 12;

  const l = {
    teamSize: language === "cz" ? "Velikost týmu" : language === "de" ? "Teamgröße" : "Team size",
    people: language === "cz" ? "lidí" : language === "de" ? "Personen" : "people",
    perMonth: language === "cz" ? "/ měsíc" : language === "de" ? "/ Monat" : "/ month",
    totalMonthly: language === "cz" ? "Celkem měsíčně" : language === "de" ? "Gesamt monatlich" : "Total monthly",
    youSave: language === "cz" ? "S ročním plánem ušetříte" : language === "de" ? "Mit dem Jahresplan sparen Sie" : "You save with annual plan",
    perYear: language === "cz" ? "/ rok" : language === "de" ? "/ Jahr" : "/ year",
    orCustom: language === "cz" ? "nebo" : language === "de" ? "oder" : "or",
  };

  return (
    <div className="space-y-7">
      {/* ── Employee count ── */}
      <div>
        <label className="block text-[13px] font-semibold text-brand-text-primary mb-1">
          {txt.employeeCount} <span className="text-brand-error">*</span>
        </label>
        <p className="text-[11px] text-brand-text-muted mb-2">
          {txt.employeeCountHelper}
        </p>
        <div className="flex items-center gap-3">
          <div className="relative max-w-[160px]">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted pointer-events-none" />
            <Input
              type="number"
              min="5"
              placeholder={txt.employeeCountPlaceholder}
              className="h-12 pl-10 text-[16px] font-semibold"
              {...register("employeeCount", {
                valueAsNumber: true,
                min: { value: 5, message: "Minimum 5" },
              })}
            />
          </div>
          {validCount > 0 && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[13px] text-brand-text-muted"
            >
              {validCount} {l.people}
            </motion.span>
          )}
        </div>
        {errors.employeeCount && (
          <p className="text-[12px] text-brand-error flex items-center gap-1 mt-1.5">
            <AlertCircle className="w-3 h-3" />
            {errors.employeeCount.message}
          </p>
        )}
      </div>

      {/* ── Plan cards ── */}
      <div>
        <label className="block text-[13px] font-semibold text-brand-text-primary mb-3">
          {txt.planOptions} <span className="text-brand-error">*</span>
        </label>

        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          {/* ── Annual plan ── */}
          <motion.button
            type="button"
            whileHover={{ y: -3, boxShadow: "0 12px 24px -4px rgba(124, 58, 237, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setValue("billingInterval", "yearly", { shouldValidate: true })}
            className={cn(
              "relative rounded-2xl border-2 p-5 text-left transition-all cursor-pointer overflow-hidden",
              currentInterval === "yearly"
                ? "border-brand-primary bg-gradient-to-br from-brand-primary/[0.06] via-white to-brand-accent/[0.04] shadow-lg shadow-brand-primary/10 ring-1 ring-brand-primary/20"
                : "border-brand-border/50 bg-white hover:border-brand-primary/30"
            )}
          >
            {/* Corner ribbon */}
            <div className="absolute -top-px -right-px">
              <div className="bg-gradient-to-r from-brand-primary to-brand-accent text-white text-[9px] font-bold uppercase tracking-widest px-5 py-1 rounded-bl-xl rounded-tr-xl shadow-sm">
                {txt.annualRecommended}
              </div>
            </div>

            <div className="flex items-center gap-2.5 mb-4">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                currentInterval === "yearly" ? "border-brand-primary bg-brand-primary" : "border-brand-border"
              )}>
                {currentInterval === "yearly" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>
              <span className="text-[15px] font-bold text-brand-text-primary">{txt.annual}</span>
            </div>

            <div className="ml-[30px]">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-brand-text-primary tracking-tight">
                  {currency === "Kč" ? yearlyPrice : yearlyPrice}
                </span>
                <span className="text-[13px] text-brand-text-muted font-medium">
                  {currency === "Kč" ? ` Kč` : ``}
                </span>
                {currency !== "Kč" && <span className="text-[15px] font-semibold text-brand-text-muted">{currency}</span>}
              </div>
              <p className="text-[12px] text-brand-text-muted -mt-0.5 mb-3">
                {txt.pricePerPerson}
              </p>
              <div className="space-y-1.5">
                <p className="text-[12px] text-brand-text-secondary flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-brand-warning/15 flex items-center justify-center shrink-0">
                    <Zap className="w-2.5 h-2.5 text-brand-warning" />
                  </span>
                  {(txt.annualDesc || "").split("\n")[0]}
                </p>
                <p className="text-[12px] text-brand-text-secondary flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-brand-success/15 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-brand-success" />
                  </span>
                  {(txt.annualDesc || "").split("\n")[1]}
                </p>
              </div>
            </div>

            {/* Savings badge */}
            {currentInterval === "yearly" && validCount >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 ml-[30px] inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-success bg-brand-success/10 px-3 py-1.5 rounded-lg"
              >
                <Sparkles className="w-3 h-3" />
                {l.youSave} {currency === "Kč" ? `${annualSaving.toLocaleString("cs-CZ")} Kč` : `${currency}${annualSaving}`} {l.perYear}
              </motion.div>
            )}
          </motion.button>

          {/* ── Monthly plan ── */}
          <motion.button
            type="button"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setValue("billingInterval", "monthly", { shouldValidate: true })}
            className={cn(
              "relative rounded-2xl border-2 p-5 text-left transition-all cursor-pointer",
              currentInterval === "monthly"
                ? "border-brand-primary bg-gradient-to-br from-brand-primary/[0.04] to-white shadow-lg shadow-brand-primary/10 ring-1 ring-brand-primary/20"
                : "border-brand-border/50 bg-white hover:border-brand-primary/30"
            )}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                currentInterval === "monthly" ? "border-brand-primary bg-brand-primary" : "border-brand-border"
              )}>
                {currentInterval === "monthly" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>
              <span className="text-[15px] font-bold text-brand-text-primary">{txt.monthly}</span>
            </div>

            <div className="ml-[30px]">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-brand-text-primary tracking-tight">
                  {monthlyPrice}
                </span>
                <span className="text-[13px] text-brand-text-muted font-medium">
                  {currency === "Kč" ? ` Kč` : ``}
                </span>
                {currency !== "Kč" && <span className="text-[15px] font-semibold text-brand-text-muted">{currency}</span>}
              </div>
              <p className="text-[12px] text-brand-text-muted -mt-0.5 mb-3">
                {txt.pricePerPerson}
              </p>
              <p className="text-[12px] text-brand-text-secondary flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-brand-primary" />
                </span>
                {txt.monthlyDesc}
              </p>
            </div>
          </motion.button>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-brand-border/30" />
          <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">{l.orCustom}</span>
          <div className="flex-1 h-px bg-brand-border/30" />
        </div>

        {/* ── Custom plan ── */}
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setValue("billingInterval", "custom", { shouldValidate: true })}
          className={cn(
            "w-full relative rounded-2xl border-2 p-5 text-left transition-all cursor-pointer",
            currentInterval === "custom"
              ? "border-brand-accent bg-gradient-to-r from-brand-accent/[0.06] to-brand-primary/[0.03] shadow-lg shadow-brand-accent/10 ring-1 ring-brand-accent/20"
              : "border-brand-border/50 bg-white hover:border-brand-accent/30"
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
              currentInterval === "custom" ? "border-brand-accent bg-brand-accent" : "border-brand-border"
            )}>
              {currentInterval === "custom" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </div>
            <span className="text-[15px] font-bold text-brand-text-primary">{txt.custom}</span>
            <div className="ml-auto w-8 h-8 rounded-xl bg-brand-accent/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-brand-accent" />
            </div>
          </div>
          <p className="text-[12px] text-brand-text-muted mt-1.5 ml-[30px]">
            {txt.customDesc}
          </p>
        </motion.button>

        <AnimatePresence>
          {currentInterval === "custom" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-brand-accent/5 to-brand-primary/5 border border-brand-accent/20 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-brand-accent" />
                </div>
                <p className="text-[13px] text-brand-text-secondary leading-relaxed">
                  {txt.customSelected}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Live price summary (only for non-custom plans) ── */}
      <AnimatePresence>
        {currentInterval !== "custom" && validCount >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl bg-gradient-to-br from-brand-primary/[0.06] via-white to-brand-accent/[0.04] border border-brand-primary/15 p-5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-semibold text-brand-text-muted uppercase tracking-wider">{l.totalMonthly}</span>
              <div className="flex items-center gap-1.5 text-[11px] text-brand-text-muted">
                <Users className="w-3 h-3" />
                {validCount} × {currency === "Kč" ? `${selectedPrice} Kč` : `${currency}${selectedPrice}`}
              </div>
            </div>
            <motion.p
              key={monthlyTotal}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-extrabold text-brand-text-primary tracking-tight"
            >
              {currency === "Kč"
                ? `${monthlyTotal.toLocaleString("cs-CZ")} Kč`
                : `${currency}${monthlyTotal.toLocaleString()}`}
              <span className="text-[14px] font-semibold text-brand-text-muted ml-1">{l.perMonth}</span>
            </motion.p>
            {currentInterval === "monthly" && annualSaving > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-[11px] text-brand-primary font-semibold mt-1.5 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {l.youSave} {currency === "Kč" ? `${annualSaving.toLocaleString("cs-CZ")} Kč` : `${currency}${annualSaving}`} {l.perYear}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Guarantee ── */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-success/[0.06] to-brand-success/[0.02] border border-brand-success/15 p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-brand-success/10 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4 text-brand-success" />
        </div>
        <p className="text-[13px] text-brand-text-secondary leading-relaxed">
          <span className="font-bold text-brand-text-primary">
            {language === "cz" ? "30denní garance vrácení peněz." : language === "de" ? "30 Tage Geld-zurück-Garantie." : "30-day money-back guarantee."}
          </span>{" "}
          {txt.guarantee.replace(/^30[^.]+\.\s*/, "")}
        </p>
      </div>

      {/* ── Legal note ── */}
      <p className="text-[11px] text-brand-text-muted/70 leading-relaxed">
        {txt.legalNote}
      </p>

      {/* ── Terms checkbox ── */}
      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-brand-primary/[0.02] transition-colors">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 rounded border-brand-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer"
            {...register("agreedToTerms", { required: txt.required })}
          />
          <span className="text-[13px] text-brand-text-secondary leading-relaxed group-hover:text-brand-text-primary transition-colors">
            {txt.termsAgree}{" "}
            <a
              href="https://www.behavera.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary underline underline-offset-2 hover:text-brand-primary-hover font-semibold"
              onClick={(e) => e.stopPropagation()}
            >
              {txt.termsLink}
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

