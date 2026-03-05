import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Trash2,
  Search,
  Crown,
  X,
  Check,
  UserPlus,
  Sparkles,
  Eye,
  EyeOff,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Info,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";
import { toast } from "sonner";

/* ═══════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════ */

export interface TeamContact {
  name: string;
  email: string;
  photo: string;
}

export interface Team {
  id: string;
  name: string;
  leaderEmail: string;
  members: TeamContact[];
  resultRecipients: string[];
}

interface TeamBuilderProps {
  contacts: TeamContact[];
  language: "cz" | "en" | "de";
  onTeamsChanged: (teams: Team[]) => void;
  initialTeams?: Team[];
}

/* ═══════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════ */

const MANAGER_TEAM_NAMES = ["manažeři", "manazeri", "managers", "manager"];
const MIN_TEAM_MEMBERS = 3;
const PAGE_SIZE = 30;
const TEAM_COLLAPSE_THRESHOLD = 8;

function isManagerTeamName(name: string): boolean {
  return MANAGER_TEAM_NAMES.includes(name.toLowerCase().trim());
}

/* ═══════════════════════════════════════════════════════
   Translations
   ═══════════════════════════════════════════════════════ */

const copy = {
  cz: {
    // Pool
    unassigned: "Nepřiřazení zaměstnanci",
    searchPlaceholder: "Hledat jméno nebo email…",
    selectAll: "Vybrat vše",
    deselectAll: "Zrušit výběr",
    assignTo: "Přiřadit do",
    addManual: "Přidat email ručně",
    manualPlaceholder: "email@firma.cz",
    noContacts: "Žádné kontakty — přidejte ručně nebo se vraťte a připojte adresář",
    noResults: "Nic nenalezeno",
    showMore: "Zobrazit dalších",
    showAll: "Zobrazit vše",
    collapse: "Sbalit",
    poolCollapsed: "nepřiřazených",

    // Teams
    newTeam: "Nový tým",
    teamNamePlaceholder: "Název týmu (např. Marketing)",
    createTeam: "Vytvořit",
    managersTeam: "Manažeři",
    managersPreset: "Tým Manažeři",
    deleteTeam: "Smazat tým",
    deleteConfirm: "Opravdu smazat tým",
    andMembers: "a všechny jeho členy",
    members: "členů",
    member: "člen",
    emptyTeam: "Přidejte členy z panelu výše",
    addMember: "Přidat člena",
    addMemberPlaceholder: "email@firma.cz",

    // Member actions
    setLeader: "Nastavit jako Team Leadera",
    isLeader: "Team Leader",
    removeLeader: "Odebrat jako Team Leadera",
    receivesResults: "Dostane výsledky",
    noResultAccess: "Nedostane výsledky",
    removeFromTeam: "Odebrat z týmu",
    moveToManagers: "Přesunout do Manažerů",

    // Manager guidance
    managerBanner: "Manažeři nepatří do běžných týmů. Vytvořte samostatný tým \u201EManažeři\u201C \u2014 výsledky budou vyhodnoceny správně.",
    managerBannerAction: "Vytvořit tým Manažeři",
    managerMoveTitle: "Přesunout do týmu Manažeři?",
    managerMoveDesc: "Manažeři by měli být v samostatném týmu pro správné vyhodnocení výsledků.",
    managerMoved: "přesunut(a) do týmu Manažeři",

    // Validation
    minMembers: "Minimálně 3 členové",
    noLeader: "Nastavte Team Leadera",
    teamsValid: "Vše v pořádku",

    // Summary
    summary: "Přehled",
    teams: "týmů",
    totalMembers: "celkem členů",
    unassignedCount: "nepřiřazených",
    warnings: "upozornění",

    // Errors
    duplicateEmail: "Tento email už je přidán",
    invalidEmail: "Neplatný email",
    teamExists: "Tým s tímto názvem už existuje",
    cancel: "Zrušit",
  },
  en: {
    unassigned: "Unassigned employees",
    searchPlaceholder: "Search name or email…",
    selectAll: "Select all",
    deselectAll: "Deselect all",
    assignTo: "Assign to",
    addManual: "Add email manually",
    manualPlaceholder: "email@company.com",
    noContacts: "No contacts — add manually or go back and connect your directory",
    noResults: "No results found",
    showMore: "Show more",
    showAll: "Show all",
    collapse: "Collapse",
    poolCollapsed: "unassigned",

    newTeam: "New team",
    teamNamePlaceholder: "Team name (e.g. Marketing)",
    createTeam: "Create",
    managersTeam: "Managers",
    managersPreset: "Managers team",
    deleteTeam: "Delete team",
    deleteConfirm: "Delete team",
    andMembers: "and all its members",
    members: "members",
    member: "member",
    emptyTeam: "Add members from the panel above",
    addMember: "Add member",
    addMemberPlaceholder: "email@company.com",

    setLeader: "Set as Team Leader",
    isLeader: "Team Leader",
    removeLeader: "Remove as Team Leader",
    receivesResults: "Receives results",
    noResultAccess: "No result access",
    removeFromTeam: "Remove from team",
    moveToManagers: "Move to Managers",

    managerBanner: "Managers don't belong in regular teams. Create a separate \"Managers\" team — results will be evaluated correctly.",
    managerBannerAction: "Create Managers team",
    managerMoveTitle: "Move to Managers team?",
    managerMoveDesc: "Managers should be in a separate team for correct evaluation.",
    managerMoved: "moved to Managers team",

    minMembers: "Minimum 3 members",
    noLeader: "Set a Team Leader",
    teamsValid: "Everything looks good",

    summary: "Summary",
    teams: "teams",
    totalMembers: "total members",
    unassignedCount: "unassigned",
    warnings: "warnings",

    duplicateEmail: "This email is already added",
    invalidEmail: "Invalid email",
    teamExists: "A team with this name already exists",
    cancel: "Cancel",
  },
  de: {
    unassigned: "Nicht zugewiesene Mitarbeiter",
    searchPlaceholder: "Name oder E-Mail suchen…",
    selectAll: "Alle auswählen",
    deselectAll: "Auswahl aufheben",
    assignTo: "Zuweisen zu",
    addManual: "E-Mail manuell hinzufügen",
    manualPlaceholder: "email@firma.de",
    noContacts: "Keine Kontakte — manuell hinzufügen oder Verzeichnis verbinden",
    noResults: "Keine Ergebnisse gefunden",
    showMore: "Mehr anzeigen",
    showAll: "Alle anzeigen",
    collapse: "Einklappen",
    poolCollapsed: "nicht zugewiesen",

    newTeam: "Neues Team",
    teamNamePlaceholder: "Teamname (z.B. Marketing)",
    createTeam: "Erstellen",
    managersTeam: "Manager",
    managersPreset: "Manager-Team",
    deleteTeam: "Team löschen",
    deleteConfirm: "Team wirklich löschen",
    andMembers: "und alle Mitglieder",
    members: "Mitglieder",
    member: "Mitglied",
    emptyTeam: "Mitglieder aus dem Panel oben hinzufügen",
    addMember: "Mitglied hinzufügen",
    addMemberPlaceholder: "email@firma.de",

    setLeader: "Als Teamleiter setzen",
    isLeader: "Teamleiter",
    removeLeader: "Als Teamleiter entfernen",
    receivesResults: "Erhält Ergebnisse",
    noResultAccess: "Kein Ergebniszugang",
    removeFromTeam: "Aus Team entfernen",
    moveToManagers: "Zu Managern verschieben",

    managerBanner: "Manager gehören nicht in reguläre Teams. Erstellen Sie ein separates \"Manager\"-Team — die Ergebnisse werden korrekt ausgewertet.",
    managerBannerAction: "Manager-Team erstellen",
    managerMoveTitle: "Zum Manager-Team verschieben?",
    managerMoveDesc: "Manager sollten für korrekte Auswertung in einem separaten Team sein.",
    managerMoved: "zum Manager-Team verschoben",

    minMembers: "Mindestens 3 Mitglieder",
    noLeader: "Teamleiter festlegen",
    teamsValid: "Alles in Ordnung",

    summary: "Zusammenfassung",
    teams: "Teams",
    totalMembers: "Mitglieder gesamt",
    unassignedCount: "nicht zugewiesen",
    warnings: "Hinweise",

    duplicateEmail: "Diese E-Mail wurde bereits hinzugefügt",
    invalidEmail: "Ungültige E-Mail",
    teamExists: "Ein Team mit diesem Namen existiert bereits",
    cancel: "Abbrechen",
  },
};

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

let teamIdCounter = 0;
function nextTeamId() {
  return `team_${++teamIdCounter}_${Date.now()}`;
}

function getInitials(name: string, email: string) {
  if (name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return (email?.[0] || "?").toUpperCase();
}

function normalizeTeams(raw: Team[]): Team[] {
  return raw.map((t) => ({
    ...t,
    resultRecipients: t.resultRecipients || (t.leaderEmail ? [t.leaderEmail] : []),
  }));
}

/* ═══════════════════════════════════════════════════════
   ContactAvatar
   ═══════════════════════════════════════════════════════ */

function ContactAvatar({
  contact,
  size = "sm",
}: {
  contact: TeamContact;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const textSize = size === "sm" ? "text-[10px]" : "text-[11px]";
  const initials = getInitials(contact.name, contact.email);

  if (contact.photo) {
    return (
      <img
        src={contact.photo}
        alt=""
        className={cn(dim, "rounded-full object-cover shrink-0")}
      />
    );
  }

  return (
    <div
      className={cn(
        dim,
        "rounded-full flex items-center justify-center font-bold shrink-0 bg-brand-primary/10 text-brand-primary",
        textSize
      )}
    >
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TeamBuilder — Main Component
   ═══════════════════════════════════════════════════════ */

export function TeamBuilder({
  contacts,
  language,
  onTeamsChanged,
  initialTeams,
}: TeamBuilderProps) {
  const txt = copy[language] || copy.en;

  /* ─── State ─── */
  const [teams, setTeams] = useState<Team[]>(() => normalizeTeams(initialTeams || []));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [poolExpanded, setPoolExpanded] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // New team creation
  const [showNewTeamInput, setShowNewTeamInput] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const newTeamRef = useRef<HTMLInputElement>(null);

  // Manual contacts
  const [manualEmail, setManualEmail] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualContacts, setManualContacts] = useState<TeamContact[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("behavera_manual_contacts") || "[]");
    } catch {
      return [];
    }
  });

  // Per-card add member
  const [addMemberFor, setAddMemberFor] = useState<string | null>(null);
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const addMemberRef = useRef<HTMLInputElement>(null);

  // Assign dropdown
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
  const assignRef = useRef<HTMLDivElement>(null);

  // Team card expansion (for large teams)
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Manager banner dismissed
  const [managerBannerDismissed, setManagerBannerDismissed] = useState(false);

  // Drag & drop
  const [dragContact, setDragContact] = useState<{ contact: TeamContact; sourceTeamId: string | null } | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null); // teamId or "pool"

  /* ─── Persist manual contacts ─── */
  useEffect(() => {
    try {
      localStorage.setItem("behavera_manual_contacts", JSON.stringify(manualContacts));
    } catch {
      /* quota */
    }
  }, [manualContacts]);

  /* ─── Derived state ─── */
  const allContacts = useMemo(
    () => [...contacts, ...manualContacts],
    [contacts, manualContacts]
  );

  const assignedEmails = useMemo(() => {
    const set = new Set<string>();
    teams.forEach((t) => t.members.forEach((m) => set.add(m.email.toLowerCase())));
    return set;
  }, [teams]);

  const unassigned = useMemo(
    () => allContacts.filter((c) => !assignedEmails.has(c.email.toLowerCase())),
    [allContacts, assignedEmails]
  );

  const filteredUnassigned = useMemo(() => {
    if (!searchQuery.trim()) return unassigned;
    const q = searchQuery.toLowerCase();
    return unassigned.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [unassigned, searchQuery]);

  const visibleUnassigned = useMemo(
    () => filteredUnassigned.slice(0, visibleCount),
    [filteredUnassigned, visibleCount]
  );

  const hasMore = filteredUnassigned.length > visibleCount;
  const hasManagerTeam = useMemo(() => teams.some((t) => isManagerTeamName(t.name)), [teams]);

  // Validation
  const teamWarnings = useMemo(() => {
    const warnings = new Map<string, string[]>();
    for (const t of teams) {
      const errs: string[] = [];
      if (t.members.length > 0 && t.members.length < MIN_TEAM_MEMBERS) errs.push(txt.minMembers);
      if (t.members.length > 0 && !t.leaderEmail) errs.push(txt.noLeader);
      if (errs.length > 0) warnings.set(t.id, errs);
    }
    return warnings;
  }, [teams, txt]);

  const totalWarnings = useMemo(
    () => Array.from(teamWarnings.values()).reduce((s, w) => s + w.length, 0),
    [teamWarnings]
  );

  const totalMembers = useMemo(
    () => teams.reduce((s, t) => s + t.members.length, 0),
    [teams]
  );

  /* ─── Close dropdown on outside click ─── */
  useEffect(() => {
    if (!assignDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (assignRef.current && !assignRef.current.contains(e.target as Node)) {
        setAssignDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [assignDropdownOpen]);

  /* ─── Core update helper ─── */
  const updateTeams = useCallback(
    (newTeams: Team[]) => {
      setTeams(newTeams);
      onTeamsChanged(newTeams);
    },
    [onTeamsChanged]
  );

  /* ─── Selection ─── */
  const toggleSelect = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const selectAllVisible = () =>
    setSelectedEmails(new Set(filteredUnassigned.map((c) => c.email)));
  const deselectAll = () => setSelectedEmails(new Set());

  /* ─── Pool operations ─── */
  const assignSelectedToTeam = (teamId: string) => {
    const toMove = unassigned.filter((c) => selectedEmails.has(c.email));
    if (toMove.length === 0) return;
    updateTeams(
      teams.map((t) => {
        if (t.id !== teamId) return t;
        const existing = new Set(t.members.map((m) => m.email.toLowerCase()));
        const fresh = toMove.filter((c) => !existing.has(c.email.toLowerCase()));
        return { ...t, members: [...t.members, ...fresh] };
      })
    );
    setSelectedEmails(new Set());
    setAssignDropdownOpen(false);
  };

  /* ─── Manual contact ─── */
  const addManualContact = () => {
    const email = manualEmail.trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error(txt.invalidEmail);
      return;
    }
    const allEmails = new Set([
      ...allContacts.map((c) => c.email.toLowerCase()),
      ...teams.flatMap((t) => t.members.map((m) => m.email.toLowerCase())),
    ]);
    if (allEmails.has(email)) {
      toast.error(txt.duplicateEmail);
      setManualEmail("");
      return;
    }
    setManualContacts((prev) => [...prev, { name: "", email, photo: "" }]);
    setManualEmail("");
  };

  /* ─── Team CRUD ─── */
  const createTeam = (name?: string) => {
    const teamName = (name || newTeamName).trim();
    if (!teamName) return;
    if (teams.some((t) => t.name.toLowerCase() === teamName.toLowerCase())) {
      toast.error(txt.teamExists);
      return;
    }
    const team: Team = {
      id: nextTeamId(),
      name: teamName,
      leaderEmail: "",
      members: [],
      resultRecipients: [],
    };
    updateTeams([...teams, team]);
    setNewTeamName("");
    setShowNewTeamInput(false);
  };

  const createManagerTeam = () => {
    if (hasManagerTeam) return;
    const name = txt.managersTeam;
    createTeam(name);
    setManagerBannerDismissed(true);
  };

  const removeTeam = (teamId: string) => {
    updateTeams(teams.filter((t) => t.id !== teamId));
    setDeleteConfirm(null);
  };

  /* ─── Member operations ─── */
  const setLeader = (teamId: string, email: string) => {
    updateTeams(
      teams.map((t) => {
        if (t.id !== teamId) return t;
        const newLeader = t.leaderEmail === email ? "" : email;
        const rr = new Set(t.resultRecipients);
        if (newLeader) rr.add(newLeader);
        return { ...t, leaderEmail: newLeader, resultRecipients: [...rr] };
      })
    );
  };

  const toggleResultRecipient = (teamId: string, email: string) => {
    updateTeams(
      teams.map((t) => {
        if (t.id !== teamId) return t;
        const rr = new Set(t.resultRecipients);
        if (rr.has(email)) {
          // Can't remove leader from results
          if (t.leaderEmail === email) return t;
          rr.delete(email);
        } else {
          rr.add(email);
        }
        return { ...t, resultRecipients: [...rr] };
      })
    );
  };

  const removeMember = (teamId: string, email: string) => {
    updateTeams(
      teams.map((t) => {
        if (t.id !== teamId) return t;
        return {
          ...t,
          members: t.members.filter((m) => m.email !== email),
          leaderEmail: t.leaderEmail === email ? "" : t.leaderEmail,
          resultRecipients: t.resultRecipients.filter((e) => e !== email),
        };
      })
    );
  };

  /* ─── Drag & drop helpers ─── */
  const handleDragStart = (contact: TeamContact, sourceTeamId: string | null) => {
    setDragContact({ contact, sourceTeamId });
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTarget(targetId);
  };

  const handleDragLeave = (e: React.DragEvent, targetId: string) => {
    const relatedTarget = e.relatedTarget as Node | null;
    const currentTarget = e.currentTarget as Node;
    if (relatedTarget && currentTarget.contains(relatedTarget)) return;
    if (dragOverTarget === targetId) setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetTeamId: string) => {
    e.preventDefault();
    setDragOverTarget(null);
    if (!dragContact) return;
    const { contact, sourceTeamId } = dragContact;
    setDragContact(null);

    // Same source = no-op
    if (sourceTeamId === targetTeamId) return;

    // Already in target team?
    const targetTeam = teams.find((t) => t.id === targetTeamId);
    if (targetTeam?.members.some((m) => m.email.toLowerCase() === contact.email.toLowerCase())) return;

    updateTeams(
      teams.map((t) => {
        // Remove from source team
        if (sourceTeamId && t.id === sourceTeamId) {
          return {
            ...t,
            members: t.members.filter((m) => m.email !== contact.email),
            leaderEmail: t.leaderEmail === contact.email ? "" : t.leaderEmail,
            resultRecipients: t.resultRecipients.filter((e) => e !== contact.email),
          };
        }
        // Add to target team
        if (t.id === targetTeamId) {
          return { ...t, members: [...t.members, contact] };
        }
        return t;
      })
    );
  };

  const handleDropToPool = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverTarget(null);
    if (!dragContact || !dragContact.sourceTeamId) { setDragContact(null); return; }
    const { contact, sourceTeamId } = dragContact;
    setDragContact(null);
    removeMember(sourceTeamId, contact.email);
  };

  const handleDragEnd = () => {
    setDragContact(null);
    setDragOverTarget(null);
  };

  const moveToManagerTeam = (fromTeamId: string, member: TeamContact) => {
    let targetTeam = teams.find((t) => isManagerTeamName(t.name));
    let newTeams = teams;

    // Auto-create Managers team if needed
    if (!targetTeam) {
      targetTeam = {
        id: nextTeamId(),
        name: txt.managersTeam,
        leaderEmail: "",
        members: [],
        resultRecipients: [],
      };
      newTeams = [...teams, targetTeam];
    }

    // Remove from source, add to managers
    const updated = newTeams.map((t) => {
      if (t.id === fromTeamId) {
        return {
          ...t,
          members: t.members.filter((m) => m.email !== member.email),
          leaderEmail: t.leaderEmail === member.email ? "" : t.leaderEmail,
          resultRecipients: t.resultRecipients.filter((e) => e !== member.email),
        };
      }
      if (t.id === targetTeam!.id) {
        const already = t.members.some((m) => m.email.toLowerCase() === member.email.toLowerCase());
        if (already) return t;
        return { ...t, members: [...t.members, member] };
      }
      return t;
    });

    updateTeams(updated);
    toast.success(`${member.name || member.email} ${txt.managerMoved}`);
  };

  /* ─── Add member directly to team (inline input) ─── */
  const addMemberToTeam = (teamId: string) => {
    const email = addMemberEmail.trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error(txt.invalidEmail);
      return;
    }

    // Check if already in any team
    if (assignedEmails.has(email)) {
      toast.error(txt.duplicateEmail);
      setAddMemberEmail("");
      return;
    }

    // Find in pool or create new
    const existing = allContacts.find((c) => c.email.toLowerCase() === email);
    const contact: TeamContact = existing || { name: "", email, photo: "" };

    // If it's a brand new contact, add to manual
    if (!existing) {
      setManualContacts((prev) => [...prev, contact]);
    }

    updateTeams(
      teams.map((t) => {
        if (t.id !== teamId) return t;
        return { ...t, members: [...t.members, contact] };
      })
    );
    setAddMemberEmail("");
    setAddMemberFor(null);
  };

  /* ─── Toggle team expansion ─── */
  const toggleTeamExpanded = (teamId: string) => {
    setExpandedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);
      return next;
    });
  };

  /* ═══════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════ */

  return (
    <div className="space-y-5">
      {/* ═══ Manager guidance banner ═══ */}
      {teams.length > 0 && !hasManagerTeam && !managerBannerDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/80"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-amber-800 leading-relaxed">{txt.managerBanner}</p>
            <div className="flex items-center gap-3 mt-2.5">
              <Button
                type="button"
                size="sm"
                onClick={createManagerTeam}
                className="h-8 px-4 text-[12px] font-bold bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="w-3 h-3 mr-1.5" />
                {txt.managerBannerAction}
              </Button>
              <button
                type="button"
                onClick={() => setManagerBannerDismissed(true)}
                className="text-[12px] text-amber-600 hover:text-amber-800 font-medium"
              >
                {txt.cancel}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setManagerBannerDismissed(true)}
            className="p-1 text-amber-400 hover:text-amber-600 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* ═══ Unassigned Pool (collapsible) ═══ */}
      <div
        onDragOver={(e) => handleDragOver(e, "pool")}
        onDragLeave={(e) => handleDragLeave(e, "pool")}
        onDrop={handleDropToPool}
        className={cn(
          "rounded-xl border bg-white overflow-hidden shadow-sm transition-all",
          dragOverTarget === "pool" ? "border-brand-primary ring-2 ring-brand-primary/20" : "border-brand-border/50"
        )}
      >
        {/* Pool header */}
        <button
          type="button"
          onClick={() => setPoolExpanded(!poolExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-brand-primary/[0.04] to-transparent hover:from-brand-primary/[0.07] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-[13px] font-bold text-brand-text-primary">
              {txt.unassigned}
            </h3>
            <span className="text-[11px] text-white bg-brand-primary/80 px-2 py-0.5 rounded-full font-bold">
              {unassigned.length}
            </span>
          </div>
          {poolExpanded ? (
            <ChevronUp className="w-4 h-4 text-brand-text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-brand-text-muted" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {poolExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {/* Search + batch controls */}
              <div className="px-4 py-2.5 border-t border-brand-border/30 flex flex-col sm:flex-row gap-2">
                {unassigned.length > 5 && (
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setVisibleCount(PAGE_SIZE);
                      }}
                      placeholder={txt.searchPlaceholder}
                      className="w-full pl-9 pr-3 py-2 text-[12px] rounded-lg border border-brand-border/50 bg-brand-background-secondary/30 placeholder:text-brand-text-muted/50 focus:outline-none focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 shrink-0">
                  {filteredUnassigned.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={selectedEmails.size === filteredUnassigned.length ? deselectAll : selectAllVisible}
                        className="text-[11px] font-bold text-brand-primary hover:underline px-2 py-1.5"
                      >
                        {selectedEmails.size === filteredUnassigned.length ? txt.deselectAll : txt.selectAll}
                      </button>

                      {/* Assign dropdown */}
                      {selectedEmails.size > 0 && teams.length > 0 && (
                        <div ref={assignRef} className="relative">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setAssignDropdownOpen(!assignDropdownOpen)}
                            className="h-8 px-3 text-[11px] font-bold"
                          >
                            <ArrowRight className="w-3 h-3 mr-1" />
                            {txt.assignTo} ({selectedEmails.size})
                          </Button>
                          {assignDropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] py-1 bg-white rounded-lg border border-brand-border shadow-xl">
                              {teams.map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => assignSelectedToTeam(t.id)}
                                  className="w-full text-left px-3 py-2 text-[12px] font-medium text-brand-text-primary hover:bg-brand-primary/5 hover:text-brand-primary flex items-center gap-2"
                                >
                                  {isManagerTeamName(t.name) ? (
                                    <Briefcase className="w-3 h-3 text-amber-500" />
                                  ) : (
                                    <Users className="w-3 h-3 text-brand-primary/60" />
                                  )}
                                  {t.name}
                                  <span className="text-[10px] text-brand-text-muted ml-auto">
                                    {t.members.length}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Contact list */}
              <div className="max-h-[280px] overflow-y-auto border-t border-brand-border/20">
                {filteredUnassigned.length === 0 ? (
                  <div className="py-8 px-6 text-center">
                    <div className="w-10 h-10 rounded-xl bg-brand-background-muted text-brand-text-muted/40 flex items-center justify-center mx-auto mb-2">
                      <Users className="w-4 h-4" />
                    </div>
                    <p className="text-[12px] text-brand-text-muted">
                      {unassigned.length === 0 ? txt.noContacts : txt.noResults}
                    </p>
                  </div>
                ) : (
                  <>
                    {visibleUnassigned.map((contact) => {
                      const isSel = selectedEmails.has(contact.email);
                      return (
                        <div
                          key={contact.email}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = "move";
                            handleDragStart(contact, null);
                          }}
                          onDragEnd={handleDragEnd}
                          onClick={() => toggleSelect(contact.email)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 hover:bg-brand-background-secondary/50 transition-colors cursor-grab active:cursor-grabbing group select-none",
                            isSel && "bg-brand-primary/5",
                            dragContact?.contact.email === contact.email && "opacity-40"
                          )}
                        >
                          <div
                            className={cn(
                              "w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all shrink-0",
                              isSel
                                ? "bg-brand-primary border-brand-primary"
                                : "border-brand-border group-hover:border-brand-primary/50"
                            )}
                          >
                            {isSel && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                          </div>
                          <ContactAvatar contact={contact} size="sm" />
                          <div className="flex-1 min-w-0">
                            {contact.name && (
                              <p className="text-[12px] font-semibold text-brand-text-primary truncate leading-tight">
                                {contact.name}
                              </p>
                            )}
                            <p className="text-[11px] text-brand-text-muted truncate">{contact.email}</p>
                          </div>
                        </div>
                      );
                    })}
                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="w-full py-2.5 text-[12px] font-bold text-brand-primary hover:bg-brand-primary/5 transition-colors"
                      >
                        {txt.showMore} ({filteredUnassigned.length - visibleCount})
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Manual email input */}
              <div className="px-4 py-2.5 border-t border-brand-border/30 bg-brand-background-secondary/20">
                {showManualInput ? (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addManualContact();
                        }
                        if (e.key === "Escape") {
                          setShowManualInput(false);
                          setManualEmail("");
                        }
                      }}
                      placeholder={txt.manualPlaceholder}
                      className="flex-1 px-3 py-1.5 text-[12px] rounded-lg border border-brand-border/50 bg-white placeholder:text-brand-text-muted/50 focus:outline-none focus:border-brand-primary/40"
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={addManualContact}
                      disabled={!manualEmail.trim()}
                      className="text-[11px] h-7 px-3"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      OK
                    </Button>
                    <button
                      type="button"
                      onClick={() => { setShowManualInput(false); setManualEmail(""); }}
                      className="p-1.5 text-brand-text-muted hover:text-brand-error transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowManualInput(true)}
                    className="flex items-center gap-2 text-[12px] font-bold text-brand-primary/70 hover:text-brand-primary transition-colors"
                  >
                    <div className="w-5 h-5 rounded-md bg-brand-primary/10 flex items-center justify-center">
                      <Plus className="w-3 h-3" />
                    </div>
                    {txt.addManual}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Teams Grid — ALL teams visible at once ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {teams.map((team) => {
          const isManagerTeam = isManagerTeamName(team.name);
          const warnings = teamWarnings.get(team.id) || [];
          const isExpanded = expandedTeams.has(team.id);
          const showCollapse = team.members.length > TEAM_COLLAPSE_THRESHOLD;
          const visibleMembers = showCollapse && !isExpanded
            ? team.members.slice(0, TEAM_COLLAPSE_THRESHOLD)
            : team.members;
          const hiddenCount = team.members.length - TEAM_COLLAPSE_THRESHOLD;

          return (
            <motion.div
              key={team.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onDragOver={(e) => handleDragOver(e, team.id)}
              onDragLeave={(e) => handleDragLeave(e, team.id)}
              onDrop={(e) => handleDrop(e, team.id)}
              className={cn(
                "rounded-xl border bg-white overflow-hidden shadow-sm transition-all",
                dragOverTarget === team.id
                  ? "border-brand-primary ring-2 ring-brand-primary/20 bg-brand-primary/[0.02]"
                  : isManagerTeam
                    ? "border-amber-300/60 ring-1 ring-amber-200/40"
                    : warnings.length > 0
                      ? "border-red-300/60 ring-1 ring-red-200/30"
                      : "border-brand-border/50"
              )}
            >
              {/* ─── Team card header ─── */}
              <div
                className={cn(
                  "px-4 py-3 flex items-center justify-between gap-2",
                  isManagerTeam
                    ? "bg-gradient-to-r from-amber-50 to-amber-50/30 border-b border-amber-200/50"
                    : "bg-gradient-to-r from-brand-primary/[0.04] to-transparent border-b border-brand-border/30"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                      isManagerTeam
                        ? "bg-amber-100 text-amber-600"
                        : "bg-brand-primary/10 text-brand-primary"
                    )}
                  >
                    {isManagerTeam ? <Briefcase className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-bold text-brand-text-primary truncate leading-tight">
                      {team.name}
                    </h4>
                    <p className="text-[11px] text-brand-text-muted">
                      {team.members.length} {team.members.length === 1 ? txt.member : txt.members}
                      {team.leaderEmail && (
                        <span className="ml-1.5 inline-flex items-center gap-0.5 text-amber-600">
                          · <Crown className="w-2.5 h-2.5 inline" /> {team.leaderEmail.split("@")[0]}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {/* Validation badges */}
                  {warnings.length > 0 && (
                    <span className="p-1 text-red-400" title={warnings.join(", ")}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {/* Delete button */}
                  {deleteConfirm === team.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => removeTeam(team.id)}
                        className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                        title={txt.deleteTeam}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(null)}
                        className="p-1 rounded-md text-brand-text-muted hover:bg-brand-background-muted transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(team.id)}
                      className="p-1.5 rounded-md text-brand-text-muted/40 hover:text-red-500 hover:bg-red-50 transition-all"
                      title={txt.deleteTeam}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* ─── Members list ─── */}
              <div className="divide-y divide-brand-border/20">
                {team.members.length === 0 ? (
                  <div className={cn(
                    "py-8 px-4 text-center transition-colors",
                    dragOverTarget === team.id && "bg-brand-primary/5"
                  )}>
                    <div className="w-10 h-10 rounded-xl bg-brand-background-muted text-brand-text-muted/30 flex items-center justify-center mx-auto mb-2">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <p className="text-[12px] text-brand-text-muted italic">
                      {dragContact ? (language === "cz" ? "Přetáhněte sem" : language === "de" ? "Hierher ziehen" : "Drop here") : txt.emptyTeam}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {visibleMembers.map((member) => {
                      const isLeader = team.leaderEmail === member.email;
                      const getsResults = team.resultRecipients.includes(member.email);

                      return (
                        <motion.div
                          key={member.email}
                          layout
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = "move";
                            handleDragStart(member, team.id);
                          }}
                          onDragEnd={handleDragEnd}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            "flex items-center gap-2.5 px-4 py-2 hover:bg-brand-background-secondary/30 transition-colors group cursor-grab active:cursor-grabbing",
                            dragContact?.contact.email === member.email && "opacity-40"
                          )}
                        >
                          <ContactAvatar contact={member} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {member.name && (
                                <p className="text-[12px] font-semibold text-brand-text-primary truncate leading-tight">
                                  {member.name}
                                </p>
                              )}
                              {isLeader && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wide shrink-0">
                                  <Crown className="w-2.5 h-2.5" />
                                  {txt.isLeader}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-brand-text-muted truncate">{member.email}</p>
                          </div>

                          {/* Actions — visible on hover (mobile: always) */}
                          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity max-sm:opacity-100">
                            {/* Crown — set/unset leader */}
                            {!isLeader && (
                              <button
                                type="button"
                                onClick={() => setLeader(team.id, member.email)}
                                className="p-1.5 rounded-md text-brand-text-muted/50 hover:text-amber-600 hover:bg-amber-50 transition-all"
                                title={txt.setLeader}
                              >
                                <Crown className="w-3 h-3" />
                              </button>
                            )}
                            {isLeader && (
                              <button
                                type="button"
                                onClick={() => setLeader(team.id, member.email)}
                                className="p-1.5 rounded-md text-amber-600 bg-amber-50 hover:bg-amber-100 transition-all"
                                title={txt.removeLeader}
                              >
                                <Crown className="w-3 h-3" />
                              </button>
                            )}

                            {/* Eye — toggle receives results */}
                            <button
                              type="button"
                              onClick={() => toggleResultRecipient(team.id, member.email)}
                              disabled={isLeader}
                              className={cn(
                                "p-1.5 rounded-md transition-all",
                                getsResults
                                  ? "text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/15"
                                  : "text-brand-text-muted/40 hover:text-brand-primary hover:bg-brand-primary/5",
                                isLeader && "opacity-50 cursor-not-allowed"
                              )}
                              title={getsResults ? txt.receivesResults : txt.noResultAccess}
                            >
                              {getsResults ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>

                            {/* Move to managers (only in non-manager teams) */}
                            {!isManagerTeam && (
                              <button
                                type="button"
                                onClick={() => moveToManagerTeam(team.id, member)}
                                className="p-1.5 rounded-md text-brand-text-muted/40 hover:text-amber-600 hover:bg-amber-50 transition-all"
                                title={txt.moveToManagers}
                              >
                                <Briefcase className="w-3 h-3" />
                              </button>
                            )}

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() => removeMember(team.id, member.email)}
                              className="p-1.5 rounded-md text-brand-text-muted/40 hover:text-red-500 hover:bg-red-50 transition-all"
                              title={txt.removeFromTeam}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}

                {/* Show more / collapse for large teams */}
                {showCollapse && (
                  <button
                    type="button"
                    onClick={() => toggleTeamExpanded(team.id)}
                    className="w-full py-2 text-[11px] font-bold text-brand-primary hover:bg-brand-primary/5 transition-colors flex items-center justify-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        {txt.collapse}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        {txt.showAll} ({hiddenCount} {txt.showMore.toLowerCase()})
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* ─── Validation warnings footer ─── */}
              {warnings.length > 0 && (
                <div className="px-4 py-2 border-t border-red-200/50 bg-red-50/50">
                  {warnings.map((w, i) => (
                    <p key={i} className="text-[11px] text-red-600 font-medium flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {w}
                    </p>
                  ))}
                </div>
              )}

              {/* ─── Add member inline ─── */}
              <div className="px-4 py-2 border-t border-brand-border/20 bg-brand-background-secondary/20">
                {addMemberFor === team.id ? (
                  <div className="flex gap-2">
                    <input
                      ref={addMemberRef}
                      type="email"
                      value={addMemberEmail}
                      onChange={(e) => setAddMemberEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addMemberToTeam(team.id);
                        }
                        if (e.key === "Escape") {
                          setAddMemberFor(null);
                          setAddMemberEmail("");
                        }
                      }}
                      placeholder={txt.addMemberPlaceholder}
                      className="flex-1 px-3 py-1.5 text-[12px] rounded-lg border border-brand-border/50 bg-white placeholder:text-brand-text-muted/50 focus:outline-none focus:border-brand-primary/40"
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addMemberToTeam(team.id)}
                      disabled={!addMemberEmail.trim()}
                      className="text-[11px] h-7 px-3"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      OK
                    </Button>
                    <button
                      type="button"
                      onClick={() => { setAddMemberFor(null); setAddMemberEmail(""); }}
                      className="p-1.5 text-brand-text-muted hover:text-brand-error transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAddMemberFor(team.id);
                      setAddMemberEmail("");
                      setTimeout(() => addMemberRef.current?.focus(), 50);
                    }}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-brand-primary/60 hover:text-brand-primary transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    {txt.addMember}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* ═══ Create new team card ═══ */}
        <motion.div
          layout
          className={cn(
            "rounded-xl border-2 border-dashed overflow-hidden transition-all",
            teams.length === 0
              ? "border-brand-primary/40 bg-brand-primary/[0.02] lg:col-span-2"
              : "border-brand-border/40 hover:border-brand-primary/30 hover:bg-brand-primary/[0.02]"
          )}
        >
          {showNewTeamInput ? (
            <div className="p-5">
              <h4 className="text-[13px] font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                {txt.newTeam}
              </h4>
              <div className="flex gap-2 mb-3">
                <input
                  ref={newTeamRef}
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createTeam();
                    }
                    if (e.key === "Escape") {
                      setShowNewTeamInput(false);
                      setNewTeamName("");
                    }
                  }}
                  placeholder={txt.teamNamePlaceholder}
                  className="flex-1 px-3 py-2.5 text-[13px] rounded-lg border-2 border-brand-primary/30 bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 placeholder:text-brand-text-muted/40 font-medium"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => createTeam()}
                  disabled={!newTeamName.trim()}
                  className="h-10 px-5 text-[13px] font-bold"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  {txt.createTeam}
                </Button>
                <button
                  type="button"
                  onClick={() => { setShowNewTeamInput(false); setNewTeamName(""); }}
                  className="p-2 text-brand-text-muted hover:text-brand-error transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick preset: Managers */}
              {!hasManagerTeam && (
                <button
                  type="button"
                  onClick={createManagerTeam}
                  className="flex items-center gap-2 text-[12px] font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  {txt.managersPreset}
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowNewTeamInput(true);
                setTimeout(() => newTeamRef.current?.focus(), 100);
              }}
              className={cn(
                "w-full flex flex-col items-center justify-center gap-2 transition-all",
                teams.length === 0 ? "py-12" : "py-8"
              )}
            >
              <div
                className={cn(
                  "rounded-xl flex items-center justify-center",
                  teams.length === 0
                    ? "w-14 h-14 bg-brand-primary/10 text-brand-primary ring-4 ring-brand-primary/5"
                    : "w-10 h-10 bg-brand-background-muted text-brand-text-muted"
                )}
              >
                <Plus className={teams.length === 0 ? "w-6 h-6" : "w-4 h-4"} />
              </div>
              <span
                className={cn(
                  "font-bold",
                  teams.length === 0
                    ? "text-[15px] text-brand-primary"
                    : "text-[13px] text-brand-text-muted"
                )}
              >
                {txt.newTeam}
              </span>
              {teams.length === 0 && (
                <p className="text-[12px] text-brand-text-muted max-w-[260px] text-center mt-1">
                  {txt.teamNamePlaceholder}
                </p>
              )}
            </button>
          )}
        </motion.div>
      </div>

      {/* ═══ Summary bar ═══ */}
      {teams.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 rounded-xl border",
            totalWarnings > 0
              ? "bg-red-50/50 border-red-200/60"
              : "bg-brand-primary/5 border-brand-primary/15"
          )}
        >
          <Sparkles className={cn("w-4 h-4 shrink-0", totalWarnings > 0 ? "text-red-400" : "text-brand-primary")} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
            <span>
              <strong className={totalWarnings > 0 ? "text-red-600" : "text-brand-primary"}>
                {teams.length}
              </strong>{" "}
              <span className="text-brand-text-muted">{txt.teams}</span>
            </span>
            <span>
              <strong className={totalWarnings > 0 ? "text-red-600" : "text-brand-primary"}>
                {totalMembers}
              </strong>{" "}
              <span className="text-brand-text-muted">{txt.totalMembers}</span>
            </span>
            <span>
              <strong className="text-brand-text-muted">{unassigned.length}</strong>{" "}
              <span className="text-brand-text-muted">{txt.unassignedCount}</span>
            </span>
            {totalWarnings > 0 && (
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <strong className="text-red-600">{totalWarnings}</strong>{" "}
                <span className="text-red-500">{txt.warnings}</span>
              </span>
            )}
            {totalWarnings === 0 && totalMembers > 0 && (
              <span className="flex items-center gap-1 text-brand-success">
                <Check className="w-3 h-3" />
                <span className="font-semibold">{txt.teamsValid}</span>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
