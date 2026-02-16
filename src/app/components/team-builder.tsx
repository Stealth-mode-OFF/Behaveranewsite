import { useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Trash2,
  Search,
  Crown,
  GripVertical,
  X,
  Check,
  UserPlus,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";

/* ─── Types ─── */
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
}

interface TeamBuilderProps {
  contacts: TeamContact[];
  language: "cz" | "en" | "de";
  onTeamsChanged: (teams: Team[]) => void;
  initialTeams?: Team[];
}

/* ─── Translations ─── */
const copy = {
  cz: {
    unassigned: "Nepřiřazení zaměstnanci",
    unassignedDesc: "Vyberte a přetáhněte do týmu vpravo",
    searchPlaceholder: "Hledat podle jména nebo emailu…",
    newTeam: "Nový tým",
    teamNamePlaceholder: "Název týmu (např. Marketing)",
    addTeam: "Vytvořit tým",
    removeTeam: "Smazat tým",
    setLeader: "Nastavit jako leadera",
    isLeader: "Team leader",
    removeFromTeam: "Odebrat z týmu",
    moveToTeam: "Přesunout do",
    selectAll: "Vše",
    deselectAll: "Zrušit",
    moveSelected: "Přesunout vybrané",
    emptyTeam: "Přetáhněte sem členy týmu",
    noContacts: "Žádné kontakty — přidejte ručně nebo se vraťte a připojte adresář",
    noResults: "Nic nenalezeno",
    contactsCount: "kontaktů",
    membersCount: "členů",
    addManual: "Přidat email ručně",
    manualPlaceholder: "email@firma.cz",
    cancel: "Zrušit",
    create: "Vytvořit",
    manualAdd: "Přidat",
    summary: "Shrnutí",
    dragHint: "Vyberte více lidí a přetáhněte najednou",
    createTeamFirst: "Nejdřív vytvořte tým →",
  },
  en: {
    unassigned: "Unassigned employees",
    unassignedDesc: "Select and drag into a team on the right",
    searchPlaceholder: "Search by name or email…",
    newTeam: "New team",
    teamNamePlaceholder: "Team name (e.g. Marketing)",
    addTeam: "Create team",
    removeTeam: "Delete team",
    setLeader: "Set as leader",
    isLeader: "Team leader",
    removeFromTeam: "Remove from team",
    moveToTeam: "Move to",
    selectAll: "All",
    deselectAll: "None",
    moveSelected: "Move selected",
    emptyTeam: "Drag team members here",
    noContacts: "No contacts — add manually or go back and connect your directory",
    noResults: "No results",
    contactsCount: "contacts",
    membersCount: "members",
    addManual: "Add email manually",
    manualPlaceholder: "email@company.com",
    cancel: "Cancel",
    create: "Create",
    manualAdd: "Add",
    summary: "Summary",
    dragHint: "Select multiple people and drag them all at once",
    createTeamFirst: "Create a team first →",
  },
  de: {
    unassigned: "Nicht zugewiesene Mitarbeiter",
    unassignedDesc: "Auswählen und ins Team rechts ziehen",
    searchPlaceholder: "Nach Name oder E-Mail suchen…",
    newTeam: "Neues Team",
    teamNamePlaceholder: "Teamname (z.B. Marketing)",
    addTeam: "Team erstellen",
    removeTeam: "Team löschen",
    setLeader: "Als Leiter setzen",
    isLeader: "Teamleiter",
    removeFromTeam: "Aus Team entfernen",
    moveToTeam: "Verschieben nach",
    selectAll: "Alle",
    deselectAll: "Keine",
    moveSelected: "Ausgewählte verschieben",
    emptyTeam: "Teammitglieder hierher ziehen",
    noContacts: "Keine Kontakte — manuell hinzufügen oder Verzeichnis verbinden",
    noResults: "Keine Ergebnisse",
    contactsCount: "Kontakte",
    membersCount: "Mitglieder",
    addManual: "E-Mail manuell hinzufügen",
    manualPlaceholder: "email@firma.de",
    cancel: "Abbrechen",
    create: "Erstellen",
    manualAdd: "Hinzufügen",
    summary: "Zusammenfassung",
    dragHint: "Wählen Sie mehrere Personen und ziehen Sie alle gleichzeitig",
    createTeamFirst: "Erstelle zuerst ein Team →",
  },
};

/* ─── Helpers ─── */
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
  return email[0].toUpperCase();
}

/* ═══════════════════════════════════════════════════════════
   TeamBuilder Component — side-by-side layout
   ═══════════════════════════════════════════════════════════ */
export function TeamBuilder({
  contacts,
  language,
  onTeamsChanged,
  initialTeams,
}: TeamBuilderProps) {
  const txt = copy[language] || copy.en;

  const [teams, setTeams] = useState<Team[]>(initialTeams || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [dragOverTeamId, setDragOverTeamId] = useState<string | null>(null);
  const [manualEmail, setManualEmail] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualContacts, setManualContacts] = useState<TeamContact[]>([]);
  const newTeamInputRef = useRef<HTMLInputElement>(null);

  const allContacts = useMemo(
    () => [...contacts, ...manualContacts],
    [contacts, manualContacts]
  );

  const assignedEmails = useMemo(() => {
    const set = new Set<string>();
    teams.forEach((t) =>
      t.members.forEach((m) => set.add(m.email.toLowerCase()))
    );
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
      (c) =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [unassigned, searchQuery]);

  const activeTeam = teams.find((t) => t.id === activeTeamId) || null;
  const currentActiveValid = teams.some((t) => t.id === activeTeamId);
  if (!currentActiveValid && teams.length > 0 && activeTeamId !== teams[0].id) {
    setTimeout(() => setActiveTeamId(teams[0].id), 0);
  }

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
  const selectAll = () =>
    setSelectedEmails(new Set(filteredUnassigned.map((c) => c.email)));
  const deselectAll = () => setSelectedEmails(new Set());

  /* ─── Multi-select drag & drop ─── */
  const handleDragStart = (
    e: React.DragEvent,
    contact: TeamContact,
    source: "pool" | string
  ) => {
    let dragEmails: string[];
    if (source === "pool" && selectedEmails.has(contact.email)) {
      dragEmails = Array.from(selectedEmails);
    } else {
      dragEmails = [contact.email];
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ emails: dragEmails, source })
    );

    if (dragEmails.length > 1) {
      const badge = document.createElement("div");
      badge.textContent = String(dragEmails.length);
      badge.style.cssText =
        "position:fixed;top:-100px;background:#6366f1;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;";
      document.body.appendChild(badge);
      e.dataTransfer.setDragImage(badge, 14, 14);
      setTimeout(() => badge.remove(), 0);
    }
  };

  const handleDropOnTeam = (teamId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverTeamId(null);
    let data: { emails: string[]; source: string };
    try {
      data = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      return;
    }

    const emailSet = new Set(data.emails.map((em) => em.toLowerCase()));

    setTeams((prev) => {
      // Remove from all teams first
      let updated = prev.map((t) => ({
        ...t,
        members: t.members.filter(
          (m) => !emailSet.has(m.email.toLowerCase())
        ),
      }));

      // Find actual contacts to move
      const contactsToAdd: TeamContact[] = [];
      for (const email of data.emails) {
        const lc = email.toLowerCase();
        const fromPool = allContacts.find(
          (c) => c.email.toLowerCase() === lc
        );
        if (fromPool) {
          contactsToAdd.push(fromPool);
          continue;
        }
        for (const t of prev) {
          const fromTeam = t.members.find(
            (m) => m.email.toLowerCase() === lc
          );
          if (fromTeam) {
            contactsToAdd.push(fromTeam);
            break;
          }
        }
      }

      // Add to target team
      updated = updated.map((t) => {
        if (t.id !== teamId) return t;
        const existing = new Set(
          t.members.map((m) => m.email.toLowerCase())
        );
        const fresh = contactsToAdd.filter(
          (c) => !existing.has(c.email.toLowerCase())
        );
        return { ...t, members: [...t.members, ...fresh] };
      });

      onTeamsChanged(updated);
      return updated;
    });
    setSelectedEmails(new Set());
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    let data: { emails: string[]; source: string };
    try {
      data = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      return;
    }
    const emailSet = new Set(data.emails.map((em) => em.toLowerCase()));
    setTeams((prev) => {
      const updated = prev.map((t) => ({
        ...t,
        members: t.members.filter(
          (m) => !emailSet.has(m.email.toLowerCase())
        ),
        leaderEmail: emailSet.has(t.leaderEmail.toLowerCase())
          ? ""
          : t.leaderEmail,
      }));
      onTeamsChanged(updated);
      return updated;
    });
  };

  const moveSelectedToTeam = (teamId: string) => {
    const toMove = unassigned.filter((c) => selectedEmails.has(c.email));
    if (toMove.length === 0) return;
    setTeams((prev) => {
      const updated = prev.map((t) =>
        t.id === teamId
          ? { ...t, members: [...t.members, ...toMove] }
          : t
      );
      onTeamsChanged(updated);
      return updated;
    });
    setSelectedEmails(new Set());
  };

  /* ─── Team operations ─── */
  const createTeam = () => {
    if (!newTeamName.trim()) return;
    const team: Team = {
      id: nextTeamId(),
      name: newTeamName.trim(),
      leaderEmail: "",
      members: [],
    };
    const updated = [...teams, team];
    updateTeams(updated);
    setNewTeamName("");
    setShowNewTeam(false);
    setActiveTeamId(team.id);
  };

  const removeTeam = (teamId: string) => {
    const updated = teams.filter((t) => t.id !== teamId);
    updateTeams(updated);
    if (activeTeamId === teamId)
      setActiveTeamId(updated[0]?.id || null);
  };

  const setLeader = (teamId: string, email: string) => {
    updateTeams(
      teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              leaderEmail: t.leaderEmail === email ? "" : email,
            }
          : t
      )
    );
  };

  const removeMember = (teamId: string, email: string) => {
    updateTeams(
      teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.filter((m) => m.email !== email),
              leaderEmail:
                t.leaderEmail === email ? "" : t.leaderEmail,
            }
          : t
      )
    );
  };

  const addManualContact = () => {
    const email = manualEmail.trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return;
    const allEmails = new Set([
      ...allContacts.map((c) => c.email.toLowerCase()),
      ...teams.flatMap((t) =>
        t.members.map((m) => m.email.toLowerCase())
      ),
    ]);
    if (allEmails.has(email)) {
      setManualEmail("");
      return;
    }
    setManualContacts((prev) => [
      ...prev,
      { name: "", email, photo: "" },
    ]);
    setManualEmail("");
  };

  /* ─── Render ─── */
  return (
    <div className="space-y-4">
      {/* ═══ Side-by-side layout ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ─── LEFT: Unassigned Pool ─── */}
        <div
          className="rounded-xl border border-brand-border/60 bg-white overflow-hidden flex flex-col"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={handleDropOnPool}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-brand-background-secondary/50 border-b border-brand-border/40">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-primary" />
                <h3 className="text-[13px] font-bold text-brand-text-primary">
                  {txt.unassigned}
                </h3>
                <span className="text-[11px] text-brand-text-muted bg-brand-background-muted px-2 py-0.5 rounded-full font-semibold">
                  {filteredUnassigned.length}
                </span>
              </div>
              {filteredUnassigned.length > 0 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-[10px] font-bold text-brand-primary hover:underline px-1.5 py-0.5"
                  >
                    {txt.selectAll}
                  </button>
                  <span className="text-brand-border">|</span>
                  <button
                    type="button"
                    onClick={deselectAll}
                    className="text-[10px] font-bold text-brand-text-muted hover:underline px-1.5 py-0.5"
                  >
                    {txt.deselectAll}
                  </button>
                </div>
              )}
            </div>
            <p className="text-[11px] text-brand-text-muted mt-0.5">
              {txt.unassignedDesc}
            </p>
          </div>

          {/* Search */}
          {unassigned.length > 5 && (
            <div className="px-4 py-2 border-b border-brand-border/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={txt.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-[12px] rounded-lg border border-brand-border/50 bg-brand-background-secondary/30 placeholder:text-brand-text-muted/50 focus:outline-none focus:border-brand-primary/40"
                />
              </div>
            </div>
          )}

          {/* Contact list */}
          <div className="flex-1 max-h-[360px] overflow-y-auto">
            {filteredUnassigned.length === 0 && !showManualInput ? (
              <div className="py-8 text-center">
                <p className="text-[12px] text-brand-text-muted">
                  {unassigned.length === 0 ? txt.noContacts : txt.noResults}
                </p>
              </div>
            ) : (
              filteredUnassigned.map((contact) => {
                const isSel = selectedEmails.has(contact.email);
                return (
                  <div
                    key={contact.email}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, contact, "pool")
                    }
                    onClick={() => toggleSelect(contact.email)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 hover:bg-brand-background-secondary/50 transition-colors cursor-grab active:cursor-grabbing group select-none",
                      isSel && "bg-brand-primary/5"
                    )}
                  >
                    <GripVertical className="w-3 h-3 text-brand-text-muted/20 group-hover:text-brand-text-muted shrink-0" />
                    <div
                      className={cn(
                        "w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all shrink-0",
                        isSel
                          ? "bg-brand-primary border-brand-primary"
                          : "border-brand-border hover:border-brand-primary/50"
                      )}
                    >
                      {isSel && (
                        <Check
                          className="w-2.5 h-2.5 text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <ContactAvatar contact={contact} size="sm" />
                    <div className="flex-1 min-w-0">
                      {contact.name && (
                        <p className="text-[12px] font-semibold text-brand-text-primary truncate">
                          {contact.name}
                        </p>
                      )}
                      <p className="text-[11px] text-brand-text-muted truncate">
                        {contact.email}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Move selected button */}
          <AnimatePresence>
            {selectedEmails.size > 0 && activeTeam && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-2.5 border-t border-brand-border/40 bg-brand-primary/5">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => moveSelectedToTeam(activeTeam.id)}
                    className="w-full h-9 text-[12px] font-bold"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                    {txt.moveSelected} ({selectedEmails.size}) →{" "}
                    {activeTeam.name}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Manual email input */}
          <div className="px-4 py-2.5 border-t border-brand-border/30">
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
                  {txt.manualAdd}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setShowManualInput(false);
                    setManualEmail("");
                  }}
                  className="p-1.5 text-brand-text-muted hover:text-brand-error transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowManualInput(true)}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-text-muted hover:text-brand-primary transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {txt.addManual}
              </button>
            )}
          </div>
        </div>

        {/* ─── RIGHT: Teams panel ─── */}
        <div className="flex flex-col rounded-xl border border-brand-border/60 bg-white overflow-hidden">
          {/* Team tabs */}
          <div className="flex items-center gap-1 px-3 py-2 bg-brand-background-secondary/50 border-b border-brand-border/40 overflow-x-auto">
            {teams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => setActiveTeamId(team.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setActiveTeamId(team.id);
                  setDragOverTeamId(team.id);
                }}
                onDragLeave={() => setDragOverTeamId(null)}
                onDrop={(e) => handleDropOnTeam(team.id, e)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all shrink-0",
                  activeTeamId === team.id
                    ? "bg-brand-primary text-white shadow-sm"
                    : dragOverTeamId === team.id
                      ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30"
                      : "text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/5"
                )}
              >
                <Users className="w-3 h-3" />
                {team.name}
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                    activeTeamId === team.id
                      ? "bg-white/20"
                      : "bg-brand-background-muted"
                  )}
                >
                  {team.members.length}
                </span>
              </button>
            ))}

            {/* Add team */}
            {!showNewTeam ? (
              <button
                type="button"
                onClick={() => {
                  setShowNewTeam(true);
                  setTimeout(() => newTeamInputRef.current?.focus(), 100);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/5 transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                {txt.newTeam}
              </button>
            ) : (
              <div className="flex items-center gap-1 shrink-0">
                <input
                  ref={newTeamInputRef}
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createTeam();
                    }
                    if (e.key === "Escape") {
                      setShowNewTeam(false);
                      setNewTeamName("");
                    }
                  }}
                  placeholder={txt.teamNamePlaceholder}
                  className="w-36 px-2 py-1 text-[12px] rounded-lg border border-brand-primary/30 bg-white focus:outline-none focus:border-brand-primary"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={createTeam}
                  disabled={!newTeamName.trim()}
                  className="p-1 rounded-lg text-brand-success hover:bg-brand-success/10 disabled:opacity-30 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewTeam(false);
                    setNewTeamName("");
                  }}
                  className="p-1 rounded-lg text-brand-text-muted hover:text-brand-error transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Active team content */}
          <div className="flex-1 min-h-[300px]">
            {!activeTeam ? (
              <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6" />
                </div>
                <p className="text-[14px] font-semibold text-brand-text-primary mb-1">
                  {txt.createTeamFirst}
                </p>
                <p className="text-[12px] text-brand-text-muted max-w-[200px]">
                  {txt.dragHint}
                </p>
              </div>
            ) : (
              <div
                className={cn(
                  "flex flex-col h-full transition-colors",
                  dragOverTeamId === activeTeam.id &&
                    "bg-brand-primary/[0.03]"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setDragOverTeamId(activeTeam.id);
                }}
                onDragLeave={() => setDragOverTeamId(null)}
                onDrop={(e) => handleDropOnTeam(activeTeam.id, e)}
              >
                {/* Team header */}
                <div className="px-4 py-2.5 border-b border-brand-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[13px] font-bold text-brand-text-primary">
                      {activeTeam.name}
                    </h4>
                    <span className="text-[11px] text-brand-text-muted">
                      {activeTeam.members.length} {txt.membersCount}
                    </span>
                    {activeTeam.leaderEmail && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-warning/10 text-brand-warning text-[10px] font-bold">
                        <Crown className="w-2.5 h-2.5" />
                        {activeTeam.leaderEmail.split("@")[0]}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTeam(activeTeam.id)}
                    className="p-1.5 rounded-lg text-brand-text-muted hover:text-brand-error hover:bg-red-50 transition-all"
                    title={txt.removeTeam}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Members */}
                <div className="flex-1 max-h-[320px] overflow-y-auto">
                  {activeTeam.members.length === 0 ? (
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center py-12 text-center transition-colors",
                        dragOverTeamId === activeTeam.id
                          ? "bg-brand-primary/5"
                          : ""
                      )}
                    >
                      <motion.div
                        animate={
                          dragOverTeamId === activeTeam.id
                            ? { scale: 1.1 }
                            : { scale: 1 }
                        }
                        className="w-12 h-12 rounded-xl bg-brand-background-muted text-brand-text-muted flex items-center justify-center mb-3"
                      >
                        <Users className="w-5 h-5" />
                      </motion.div>
                      <p className="text-[12px] text-brand-text-muted italic">
                        {txt.emptyTeam}
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {activeTeam.members.map((member) => (
                        <motion.div
                          key={member.email}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.15 }}
                          draggable
                          onDragStart={(e) =>
                            handleDragStart(
                              e as unknown as React.DragEvent,
                              member,
                              activeTeam.id
                            )
                          }
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-background-secondary/30 transition-colors group cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="w-3 h-3 text-brand-text-muted/30 group-hover:text-brand-text-muted shrink-0" />
                          <ContactAvatar contact={member} size="sm" />
                          <div className="flex-1 min-w-0">
                            {member.name && (
                              <p className="text-[12px] font-semibold text-brand-text-primary truncate">
                                {member.name}
                              </p>
                            )}
                            <p className="text-[11px] text-brand-text-muted truncate">
                              {member.email}
                            </p>
                          </div>
                          {activeTeam.leaderEmail === member.email ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-warning/10 text-brand-warning text-[10px] font-bold shrink-0">
                              <Crown className="w-2.5 h-2.5" />
                              {txt.isLeader}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setLeader(activeTeam.id, member.email)
                              }
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-brand-text-muted hover:text-brand-warning hover:bg-brand-warning/10 transition-all shrink-0"
                              title={txt.setLeader}
                            >
                              <Crown className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              removeMember(activeTeam.id, member.email)
                            }
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-brand-text-muted hover:text-brand-error hover:bg-red-50 transition-all shrink-0"
                            title={txt.removeFromTeam}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Summary ─── */}
      {teams.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/5 border border-brand-primary/15"
        >
          <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
          <p className="text-[12px] text-brand-text-secondary">
            <span className="font-bold text-brand-primary">
              {teams.length}
            </span>{" "}
            {teams.length === 1 ? "team" : "teams"},{" "}
            <span className="font-bold text-brand-primary">
              {teams.reduce((s, t) => s + t.members.length, 0)}
            </span>{" "}
            {txt.membersCount},{" "}
            <span className="font-bold text-brand-text-muted">
              {unassigned.length}
            </span>{" "}
            {txt.unassigned.toLowerCase()}
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Avatar ─── */
function ContactAvatar({
  contact,
  size = "sm",
}: {
  contact: TeamContact;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-7 h-7" : "w-8 h-8";
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
