/**
 * InviteTeammates — Premium "Invite your colleagues" component
 *
 * Three paths:
 *  1. Google Workspace → OAuth popup → People/Directory API → select → invite
 *  2. Microsoft 365    → OAuth popup → Graph API            → select → invite
 *  3. Fallback         → Paste emails / CSV upload / domain suggestions
 *
 * GDPR compliance:
 *  - Only scopes for contacts/directory — NEVER email content
 *  - Full contact list is NEVER stored server-side
 *  - Only the emails the user EXPLICITLY selects are sent to the backend
 *  - Clear privacy copy in the UI
 *
 * i18n: CZ / EN / DE
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Search,
  Check,
  X,
  Plus,
  Users,
  ShieldCheck,
  Loader2,
  Mail,
  Globe,
  UserPlus,
  Sparkles,
  AlertCircle,
  ChevronDown,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/components/ui/utils";

/* ─── Types ─── */
export interface ContactEntry {
  name: string;
  email: string;
  photo?: string;
  selected: boolean;
}

interface InviteTeammatesProps {
  /** Admin email from previous step — used to detect domain */
  adminEmail: string;
  /** Inviter name from previous step */
  inviterName: string;
  /** Company name */
  companyName: string;
  /** Current language */
  language: "cz" | "en" | "de";
  /** Callback with selected invitees when user proceeds */
  onInvitesSaved: (invitees: Array<{ email: string; name: string }>) => void;
  /** Whether this step is optional (user can skip) */
  optional?: boolean;
}

/* ─── Translations ─── */
const inviteCopy = {
  cz: {
    title: "Pozvěte kolegy",
    subtitle:
      "Přidejte kolegy, kteří budou s Echo Pulse pracovat. Čím víc lidí, tím lepší data.",
    privacyNote:
      "Použijeme to pouze k návrhu kolegů k pozvání. Nikdy nečteme vaše e-maily.",
    googleBtn: "Import z Google Workspace",
    microsoftBtn: "Import z Microsoft 365",
    manualBtn: "Zadat e-maily ručně",
    csvBtn: "Nahrát CSV / Excel",
    searchPlaceholder: "Hledat v kontaktech…",
    selectAll: "Vybrat všechny ze stejné domény",
    deselectAll: "Zrušit výběr",
    selectedCount: "vybráno",
    inviteSelected: "Pozvat vybrané",
    skip: "Přeskočit",
    skipNote: "Kolegy můžete pozvat i později z dashboardu.",
    manualTitle: "Zadejte e-maily kolegů",
    manualPlaceholder: "jan@firma.cz, petra@firma.cz",
    manualHelper:
      "Zadejte e-maily oddělené čárkami nebo novými řádky.",
    csvTitle: "Nahrajte CSV soubor",
    csvHelper:
      "Soubor by měl obsahovat sloupec s e-maily. Podporujeme .csv a .txt soubory.",
    csvDrop: "Přetáhněte soubor sem",
    csvOr: "nebo",
    csvBrowse: "vyberte soubor",
    domainSuggestion: "Navrhovaní kolegové z domény",
    noContacts: "Žádné kontakty nalezeny",
    noContactsSub: "Zkuste jinou metodu nebo zadejte e-maily ručně.",
    loading: "Načítání kontaktů…",
    errorOAuth: "Připojení selhalo. Zkuste to znovu nebo zadejte e-maily ručně.",
    addEmail: "Přidat",
    emailInvalid: "Neplatný e-mail",
    addedCount: "přidáno",
    back: "Zpět na výběr",
    inviteSent: "Pozvánky odeslány!",
    inviteSentDesc: "Vybraní kolegové obdrží e-mail s pozvánkou.",
  },
  en: {
    title: "Invite teammates",
    subtitle:
      "Add colleagues who'll work with Echo Pulse. More people = better data.",
    privacyNote:
      "We'll only use this to suggest colleagues to invite. We never read your emails.",
    googleBtn: "Import from Google Workspace",
    microsoftBtn: "Import from Microsoft 365",
    manualBtn: "Enter emails manually",
    csvBtn: "Upload CSV / Excel",
    searchPlaceholder: "Search contacts…",
    selectAll: "Select all from same domain",
    deselectAll: "Deselect all",
    selectedCount: "selected",
    inviteSelected: "Invite selected",
    skip: "Skip for now",
    skipNote: "You can always invite teammates later from the dashboard.",
    manualTitle: "Enter teammate emails",
    manualPlaceholder: "john@company.com, jane@company.com",
    manualHelper:
      "Enter emails separated by commas or new lines.",
    csvTitle: "Upload a CSV file",
    csvHelper:
      "File should contain a column with emails. We support .csv and .txt files.",
    csvDrop: "Drop file here",
    csvOr: "or",
    csvBrowse: "browse files",
    domainSuggestion: "Suggested colleagues from domain",
    noContacts: "No contacts found",
    noContactsSub: "Try another method or enter emails manually.",
    loading: "Loading contacts…",
    errorOAuth: "Connection failed. Try again or enter emails manually.",
    addEmail: "Add",
    emailInvalid: "Invalid email",
    addedCount: "added",
    back: "Back to methods",
    inviteSent: "Invitations sent!",
    inviteSentDesc: "Selected colleagues will receive an invite email.",
  },
  de: {
    title: "Kollegen einladen",
    subtitle:
      "Fügen Sie Kollegen hinzu, die mit Echo Pulse arbeiten werden. Mehr Personen = bessere Daten.",
    privacyNote:
      "Wir nutzen dies nur, um Kollegen vorzuschlagen. Wir lesen niemals Ihre E-Mails.",
    googleBtn: "Import aus Google Workspace",
    microsoftBtn: "Import aus Microsoft 365",
    manualBtn: "E-Mails manuell eingeben",
    csvBtn: "CSV / Excel hochladen",
    searchPlaceholder: "Kontakte durchsuchen…",
    selectAll: "Alle aus gleicher Domain wählen",
    deselectAll: "Alle abwählen",
    selectedCount: "ausgewählt",
    inviteSelected: "Ausgewählte einladen",
    skip: "Überspringen",
    skipNote: "Sie können Kollegen auch später über das Dashboard einladen.",
    manualTitle: "E-Mails der Kollegen eingeben",
    manualPlaceholder: "max@firma.de, erika@firma.de",
    manualHelper:
      "E-Mails durch Kommas oder Zeilenumbrüche getrennt eingeben.",
    csvTitle: "CSV-Datei hochladen",
    csvHelper:
      "Die Datei sollte eine Spalte mit E-Mails enthalten. Wir unterstützen .csv und .txt.",
    csvDrop: "Datei hier ablegen",
    csvOr: "oder",
    csvBrowse: "Datei auswählen",
    domainSuggestion: "Vorgeschlagene Kollegen aus der Domain",
    noContacts: "Keine Kontakte gefunden",
    noContactsSub:
      "Versuchen Sie eine andere Methode oder geben Sie E-Mails manuell ein.",
    loading: "Kontakte werden geladen…",
    errorOAuth:
      "Verbindung fehlgeschlagen. Versuchen Sie es erneut oder geben Sie E-Mails manuell ein.",
    addEmail: "Hinzufügen",
    emailInvalid: "Ungültige E-Mail",
    addedCount: "hinzugefügt",
    back: "Zurück zur Auswahl",
    inviteSent: "Einladungen gesendet!",
    inviteSentDesc: "Ausgewählte Kollegen erhalten eine Einladungs-E-Mail.",
  },
} as const;

/* ─── Provider logos as SVG inline ─── */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.78.42 3.46 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

/* ─── Views ─── */
type View = "picker" | "contacts" | "manual" | "csv";

/* ═══════════════════════════════════════════════════════════
   InviteTeammates Component
   ═══════════════════════════════════════════════════════════ */
export function InviteTeammates({
  adminEmail,
  inviterName,
  companyName,
  language,
  onInvitesSaved,
  optional = true,
}: InviteTeammatesProps) {
  const txt = inviteCopy[language] || inviteCopy.en;
  const domain = adminEmail.split("@")[1] || "";

  const [view, setView] = useState<View>("picker");
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [manualEmails, setManualEmails] = useState<
    Array<{ email: string; name: string }>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<
    "google" | "microsoft" | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── OAuth popup listener ───
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;

      const { type, payload } = event.data || {};

      if (type === "GOOGLE_CONTACTS" || type === "MICROSOFT_CONTACTS") {
        setLoading(false);

        if (payload.error) {
          setError(txt.errorOAuth);
          return;
        }

        const providerContacts: ContactEntry[] = (payload.contacts || []).map(
          (c: { name: string; email: string; photo?: string }) => ({
            name: c.name || "",
            email: c.email,
            photo: c.photo || "",
            selected: false,
          })
        );

        // Auto-select contacts from same domain
        const domainLower = domain.toLowerCase();
        const withAutoSelect = providerContacts.map((c) => ({
          ...c,
          selected: c.email.toLowerCase().endsWith(`@${domainLower}`),
        }));

        setContacts(withAutoSelect);
        setView("contacts");
        setActiveProvider(
          type === "GOOGLE_CONTACTS" ? "google" : "microsoft"
        );
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [domain, txt.errorOAuth]);

  // ─── OAuth popup opener ───
  const openOAuth = useCallback(
    (provider: "google" | "microsoft") => {
      setLoading(true);
      setError(null);

      const state = Math.random().toString(36).slice(2);
      const url =
        provider === "google"
          ? `/api/oauth/google/start?state=${state}`
          : `/api/oauth/microsoft/start?state=${state}`;

      const w = 500;
      const h = 650;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;

      const popup = window.open(
        url,
        `${provider}_oauth`,
        `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`
      );

      // Detect popup close without response
      const timer = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(timer);
          setLoading(false);
        }
      }, 500);
    },
    []
  );

  // ─── Contact selection ───
  const toggleContact = useCallback((email: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.email === email ? { ...c, selected: !c.selected } : c
      )
    );
  }, []);

  const selectAllDomain = useCallback(() => {
    const domainLower = domain.toLowerCase();
    setContacts((prev) =>
      prev.map((c) =>
        c.email.toLowerCase().endsWith(`@${domainLower}`)
          ? { ...c, selected: true }
          : c
      )
    );
  }, [domain]);

  const deselectAll = useCallback(() => {
    setContacts((prev) => prev.map((c) => ({ ...c, selected: false })));
  }, []);

  // ─── Manual email handling ───
  const [manualInput, setManualInput] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);

  const addManualEmail = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emails = manualInput
      .split(/[,\n;]+/)
      .map((e) => e.trim())
      .filter(Boolean);

    const valid: Array<{ email: string; name: string }> = [];
    let hasInvalid = false;

    for (const em of emails) {
      if (emailRegex.test(em)) {
        if (!manualEmails.some((e) => e.email === em)) {
          valid.push({ email: em, name: em.split("@")[0] });
        }
      } else {
        hasInvalid = true;
      }
    }

    if (valid.length > 0) {
      setManualEmails((prev) => [...prev, ...valid]);
      setManualInput("");
      setManualError(null);
    }
    if (hasInvalid) {
      setManualError(txt.emailInvalid);
    }
  }, [manualInput, manualEmails, txt.emailInvalid]);

  const removeManualEmail = useCallback((email: string) => {
    setManualEmails((prev) => prev.filter((e) => e.email !== email));
  }, []);

  // ─── CSV parsing ───
  const handleCSV = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!text) return;

        const emailRegex = /[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+/g;
        const found = text.match(emailRegex) || [];
        const unique = [...new Set(found.map((e) => e.toLowerCase()))];

        const newEmails = unique
          .filter((em) => !manualEmails.some((e) => e.email === em))
          .map((em) => ({ email: em, name: em.split("@")[0] }));

        if (newEmails.length > 0) {
          setManualEmails((prev) => [...prev, ...newEmails]);
          setView("manual"); // Show the list
        }
      };
      reader.readAsText(file);
    },
    [manualEmails]
  );

  // ─── Submit invites ───
  const submitInvites = useCallback(async () => {
    setSubmitting(true);

    // Combine selected contacts + manual emails
    const fromContacts = contacts
      .filter((c) => c.selected)
      .map((c) => ({ email: c.email, name: c.name }));
    const allInvitees = [...fromContacts, ...manualEmails];

    if (allInvitees.length === 0) {
      onInvitesSaved([]);
      return;
    }

    try {
      await fetch("/api/invitations/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviterEmail: adminEmail,
          inviterName,
          companyName,
          invitees: allInvitees,
          source: activeProvider || "manual",
        }),
      });
    } catch {
      // Fire and forget — don't block onboarding
    }

    onInvitesSaved(allInvitees);
    setSubmitting(false);
  }, [
    contacts,
    manualEmails,
    adminEmail,
    inviterName,
    companyName,
    activeProvider,
    onInvitesSaved,
  ]);

  // ─── Filtered contacts ───
  const filteredContacts = searchQuery
    ? contacts.filter(
        (c) =>
          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  const domainContacts = filteredContacts.filter((c) =>
    c.email.toLowerCase().endsWith(`@${domain.toLowerCase()}`)
  );
  const otherContacts = filteredContacts.filter(
    (c) => !c.email.toLowerCase().endsWith(`@${domain.toLowerCase()}`)
  );
  const selectedCount = contacts.filter((c) => c.selected).length;
  const totalSelected = selectedCount + manualEmails.length;

  return (
    <div className="space-y-6">
      {/* ─── Privacy banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 p-4 rounded-xl bg-brand-success/5 border border-brand-success/20"
      >
        <ShieldCheck className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-brand-text-primary">
            {txt.privacyNote}
          </p>
          <p className="text-[11px] text-brand-text-muted mt-0.5">
            GDPR · SSL · ISO 27001 ready
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ═════════ PICKER VIEW — Choose import method ═════════ */}
        {view === "picker" && (
          <motion.div
            key="picker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Google Workspace */}
            <button
              type="button"
              onClick={() => openOAuth("google")}
              disabled={loading}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 border-brand-border/60",
                "bg-white hover:border-brand-primary/40 hover:shadow-md hover:shadow-brand-primary/5",
                "transition-all duration-200 text-left group",
                loading && "opacity-60 pointer-events-none"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-brand-border/60 flex items-center justify-center shrink-0 group-hover:border-brand-primary/30 transition-colors">
                <GoogleLogo className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-brand-text-primary">
                  {txt.googleBtn}
                </p>
                <p className="text-[11px] text-brand-text-muted">
                  Gmail, Google Workspace
                </p>
              </div>
              {loading ? (
                <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
              ) : (
                <ChevronDown className="w-4 h-4 text-brand-text-muted -rotate-90 group-hover:text-brand-primary transition-colors" />
              )}
            </button>

            {/* Microsoft 365 */}
            <button
              type="button"
              onClick={() => openOAuth("microsoft")}
              disabled={loading}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 border-brand-border/60",
                "bg-white hover:border-brand-primary/40 hover:shadow-md hover:shadow-brand-primary/5",
                "transition-all duration-200 text-left group",
                loading && "opacity-60 pointer-events-none"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-brand-border/60 flex items-center justify-center shrink-0 group-hover:border-brand-primary/30 transition-colors">
                <MicrosoftLogo className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-brand-text-primary">
                  {txt.microsoftBtn}
                </p>
                <p className="text-[11px] text-brand-text-muted">
                  Outlook, Office 365, Azure AD
                </p>
              </div>
              {loading ? (
                <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
              ) : (
                <ChevronDown className="w-4 h-4 text-brand-text-muted -rotate-90 group-hover:text-brand-primary transition-colors" />
              )}
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-brand-border/60" />
              <span className="text-[11px] text-brand-text-muted font-medium uppercase tracking-wide">
                {txt.csvOr}
              </span>
              <div className="flex-1 h-px bg-brand-border/60" />
            </div>

            {/* Manual entry */}
            <button
              type="button"
              onClick={() => setView("manual")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-brand-border/60 bg-white hover:border-brand-primary/40 hover:shadow-md hover:shadow-brand-primary/5 transition-all duration-200 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-primary/8 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-brand-text-primary">
                  {txt.manualBtn}
                </p>
                <p className="text-[11px] text-brand-text-muted">
                  Seznam, IMAP, Yahoo…
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-brand-text-muted -rotate-90 group-hover:text-brand-primary transition-colors" />
            </button>

            {/* CSV upload */}
            <button
              type="button"
              onClick={() => setView("csv")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-brand-border/60 bg-white hover:border-brand-primary/40 hover:shadow-md hover:shadow-brand-primary/5 transition-all duration-200 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-warning/8 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5 text-brand-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-brand-text-primary">
                  {txt.csvBtn}
                </p>
                <p className="text-[11px] text-brand-text-muted">.csv, .txt</p>
              </div>
              <ChevronDown className="w-4 h-4 text-brand-text-muted -rotate-90 group-hover:text-brand-primary transition-colors" />
            </button>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-brand-error/5 border border-brand-error/20"
              >
                <AlertCircle className="w-4 h-4 text-brand-error shrink-0" />
                <p className="text-[12px] text-brand-error">{error}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═════════ CONTACTS VIEW — Contact list with selection ═════════ */}
        {view === "contacts" && (
          <motion.div
            key="contacts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Search + bulk actions */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <Input
                  type="text"
                  placeholder={txt.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-[13px]"
                />
              </div>
            </div>

            {/* Bulk selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllDomain}
                  className="text-[12px] font-semibold text-brand-primary hover:underline"
                >
                  {txt.selectAll}
                </button>
                <span className="text-brand-border">·</span>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="text-[12px] font-semibold text-brand-text-muted hover:text-brand-text-primary"
                >
                  {txt.deselectAll}
                </button>
              </div>
              <span className="text-[12px] font-bold text-brand-primary">
                {selectedCount} {txt.selectedCount}
              </span>
            </div>

            {/* Contact list */}
            {contacts.length === 0 ? (
              <div className="text-center py-10">
                <Users className="w-10 h-10 text-brand-text-muted/40 mx-auto mb-3" />
                <p className="text-[14px] font-semibold text-brand-text-secondary">
                  {txt.noContacts}
                </p>
                <p className="text-[12px] text-brand-text-muted mt-1">
                  {txt.noContactsSub}
                </p>
              </div>
            ) : (
              <div className="max-h-[320px] overflow-y-auto rounded-xl border border-brand-border/50 divide-y divide-brand-border/30">
                {/* Domain contacts first */}
                {domainContacts.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-brand-primary/5 sticky top-0 z-10">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-brand-primary" />
                        <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider">
                          {txt.domainSuggestion} @{domain}
                        </span>
                        <Sparkles className="w-3 h-3 text-brand-warning" />
                      </div>
                    </div>
                    {domainContacts.map((contact) => (
                      <ContactRow
                        key={contact.email}
                        contact={contact}
                        onToggle={toggleContact}
                      />
                    ))}
                  </div>
                )}

                {/* Other contacts */}
                {otherContacts.length > 0 && (
                  <div>
                    {domainContacts.length > 0 && (
                      <div className="px-4 py-2 bg-brand-background-secondary/50 sticky top-0 z-10">
                        <span className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider">
                          Other contacts
                        </span>
                      </div>
                    )}
                    {otherContacts.map((contact) => (
                      <ContactRow
                        key={contact.email}
                        contact={contact}
                        onToggle={toggleContact}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                setView("picker");
                setContacts([]);
                setSearchQuery("");
              }}
              className="text-[12px] font-semibold text-brand-text-muted hover:text-brand-primary transition-colors"
            >
              ← {txt.back}
            </button>
          </motion.div>
        )}

        {/* ═════════ MANUAL VIEW — Paste emails ═════════ */}
        {view === "manual" && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <h4 className="text-[14px] font-bold text-brand-text-primary mb-1">
                {txt.manualTitle}
              </h4>
              <p className="text-[12px] text-brand-text-muted">
                {txt.manualHelper}
              </p>
            </div>

            <div className="flex gap-2">
              <textarea
                value={manualInput}
                onChange={(e) => {
                  setManualInput(e.target.value);
                  setManualError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addManualEmail();
                  }
                }}
                placeholder={txt.manualPlaceholder}
                rows={3}
                className="flex-1 rounded-xl border border-brand-border/60 bg-white px-4 py-3 text-[13px] placeholder:text-brand-text-muted/50 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 resize-none"
              />
            </div>

            {manualError && (
              <p className="text-[12px] text-brand-error flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {manualError}
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addManualEmail}
              disabled={!manualInput.trim()}
              className="text-[13px]"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {txt.addEmail}
            </Button>

            {/* Added emails list */}
            {manualEmails.length > 0 && (
              <div className="space-y-2">
                <p className="text-[12px] font-bold text-brand-text-secondary">
                  {manualEmails.length} {txt.addedCount}
                </p>
                <div className="flex flex-wrap gap-2">
                  {manualEmails.map((e) => (
                    <span
                      key={e.email}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/8 text-[12px] font-medium text-brand-primary border border-brand-primary/15"
                    >
                      {e.email}
                      <button
                        type="button"
                        onClick={() => removeManualEmail(e.email)}
                        className="hover:bg-brand-primary/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back button */}
            <button
              type="button"
              onClick={() => setView("picker")}
              className="text-[12px] font-semibold text-brand-text-muted hover:text-brand-primary transition-colors"
            >
              ← {txt.back}
            </button>
          </motion.div>
        )}

        {/* ═════════ CSV VIEW — File upload ═════════ */}
        {view === "csv" && (
          <motion.div
            key="csv"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <h4 className="text-[14px] font-bold text-brand-text-primary mb-1">
                {txt.csvTitle}
              </h4>
              <p className="text-[12px] text-brand-text-muted">
                {txt.csvHelper}
              </p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-brand-primary");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("border-brand-primary");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-brand-primary");
                const file = e.dataTransfer.files[0];
                if (file) handleCSV(file);
              }}
              className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-brand-border/60 bg-brand-background-secondary/30 hover:border-brand-primary/40 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-brand-text-muted/40" />
              <div className="text-center">
                <p className="text-[13px] font-semibold text-brand-text-secondary">
                  {txt.csvDrop}
                </p>
                <p className="text-[12px] text-brand-text-muted">
                  {txt.csvOr}{" "}
                  <span className="text-brand-primary font-semibold underline underline-offset-2">
                    {txt.csvBrowse}
                  </span>
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.tsv,.xls,.xlsx"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCSV(file);
                }}
              />
            </div>

            {/* Back button */}
            <button
              type="button"
              onClick={() => setView("picker")}
              className="text-[12px] font-semibold text-brand-text-muted hover:text-brand-primary transition-colors"
            >
              ← {txt.back}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Bottom bar: selected count + actions ─── */}
      {totalSelected > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/15"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-brand-primary" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-brand-primary">
                {totalSelected} {txt.selectedCount}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={submitInvites}
            disabled={submitting}
            size="sm"
            className="text-[13px] h-9 px-5"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                {txt.inviteSelected}
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* ─── Skip option ─── */}
      {optional && totalSelected === 0 && view === "picker" && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onInvitesSaved([])}
            className="text-[13px] font-semibold text-brand-text-muted hover:text-brand-primary transition-colors"
          >
            {txt.skip} →
          </button>
          <p className="text-[11px] text-brand-text-muted/70 mt-1">
            {txt.skipNote}
          </p>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 py-4"
        >
          <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
          <span className="text-[13px] text-brand-text-muted font-medium">
            {txt.loading}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Contact Row sub-component ─── */
function ContactRow({
  contact,
  onToggle,
}: {
  contact: ContactEntry;
  onToggle: (email: string) => void;
}) {
  const initials = contact.name
    ? contact.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : contact.email[0].toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onToggle(contact.email)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-background-secondary/50 transition-colors text-left",
        contact.selected && "bg-brand-primary/3"
      )}
    >
      {/* Avatar */}
      {contact.photo ? (
        <img
          src={contact.photo}
          alt=""
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
            contact.selected
              ? "bg-brand-primary text-white"
              : "bg-brand-primary/10 text-brand-primary"
          )}
        >
          {initials}
        </div>
      )}

      {/* Name + email */}
      <div className="flex-1 min-w-0">
        {contact.name && (
          <p className="text-[13px] font-semibold text-brand-text-primary truncate">
            {contact.name}
          </p>
        )}
        <p className="text-[12px] text-brand-text-muted truncate">
          {contact.email}
        </p>
      </div>

      {/* Checkbox */}
      <div
        className={cn(
          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
          contact.selected
            ? "bg-brand-primary border-brand-primary"
            : "border-brand-border hover:border-brand-primary/50"
        )}
      >
        {contact.selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
    </button>
  );
}
