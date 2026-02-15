import { useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Trash2,
  Search,
  Crown,
  GripVertical,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  UserPlus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
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
    unassignedDesc: "Přetáhněte do týmu nebo použijte šipku",
    searchPlaceholder: "Hledat podle jména nebo emailu…",
    newTeam: "Nový tým",
    teamNamePlaceholder: "Název týmu (např. Marketing)",
    addTeam: "Vytvořit tým",
    removeTeam: "Smazat tým",
    setLeader: "Nastavit jako leadera",
    isLeader: "Team leader",
    removeFromTeam: "Odebrat z týmu",
    moveToTeam: "Přesunout do",
    selectAll: "Vybrat vše",
    deselectAll: "Zrušit výběr",
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
  },
  en: {
    unassigned: "Unassigned employees",
    unassignedDesc: "Drag into a team or use the arrow",
    searchPlaceholder: "Search by name or email…",
    newTeam: "New team",
    teamNamePlaceholder: "Team name (e.g. Marketing)",
    addTeam: "Create team",
    removeTeam: "Delete team",
    setLeader: "Set as leader",
    isLeader: "Team leader",
    removeFromTeam: "Remove from team",
    moveToTeam: "Move to",
    selectAll: "Select all",
    deselectAll: "Deselect all",
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
  },
  de: {
    unassigned: "Nicht zugewiesene Mitarbeiter",
    unassignedDesc: "In ein Team ziehen oder Pfeil verwenden",
    searchPlaceholder: "Nach Name oder E-Mail suchen…",
    newTeam: "Neues Team",
    teamNamePlaceholder: "Teamname (z.B. Marketing)",
    addTeam: "Team erstellen",
    removeTeam: "Team löschen",
    setLeader: "Als Leiter setzen",
    isLeader: "Teamleiter",
    removeFromTeam: "Aus Team entfernen",
    moveToTeam: "Verschieben nach",
    selectAll: "Alle auswählen",
    deselectAll: "Auswahl aufheben",
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
   TeamBuilder Component
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
  const [draggedContact, setDraggedContact] = useState<TeamContact | null>(
    null
  );
  const [dragSourceTeamId, setDragSourceTeamId] = useState<string | null>(null);
  const [dragOverTeamId, setDragOverTeamId] = useState<string | null>(null);
  const [collapsedTeams, setCollapsedTeams] = useState<Set<string>>(new Set());
  const [manualEmail, setManualEmail] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualContacts, setManualContacts] = useState<TeamContact[]>([]);
  const newTeamInputRef = useRef<HTMLInputElement>(null);

  // All contacts = OAuth + manually added
  const allContacts = useMemo(
    () => [...contacts, ...manualContacts],
    [contacts, manualContacts]
  );

  // Compute assigned emails
  const assignedEmails = useMemo(() => {
    const set = new Set<string>();
    teams.forEach((t) =>
      t.members.forEach((m) => set.add(m.email.toLowerCase()))
    );
    return set;
  }, [teams]);

  // Unassigned contacts = all contacts not in any team
  const unassigned = useMemo(() => {
    return allContacts.filter(
      (c) => !assignedEmails.has(c.email.toLowerCase())
    );
  }, [allContacts, assignedEmails]);

  // Filtered unassigned
  const filteredUnassigned = useMemo(() => {
    if (!searchQuery.trim()) return unassigned;
    const q = searchQuery.toLowerCase();
    return unassigned.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [unassigned, searchQuery]);

  // Propagate changes
  const updateTeams = useCallback(
    (newTeams: Team[]) => {
      setTeams(newTeams);
      onTeamsChanged(newTeams);
    },
    [onTeamsChanged]
  );

  // ─── Drag & Drop (HTML5) ───
  const handleDragStart = (
    contact: TeamContact,
    sourceTeamId?: string | null
  ) => {
    setDraggedContact(contact);
    setDragSourceTeamId(sourceTeamId || null);
  };

  const handleDragOver = (e: React.DragEvent, teamId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTeamId(teamId);
  };

  const handleDragLeave = () => {
    setDragOverTeamId(null);
  };

  const handleDropOnTeam = (teamId: string) => {
    setDragOverTeamId(null);
    if (!draggedContact) return;

    setTeams((prev) => {
      // Remove from source team if dragged from another team
      let updated = prev.map((t) => ({
        ...t,
        members: t.members.filter(
          (m) => m.email.toLowerCase() !== draggedContact.email.toLowerCase()
        ),
      }));

      // Add to target team
      updated = updated.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: [
                ...t.members,
                {
                  name: draggedContact.name,
                  email: draggedContact.email,
                  photo: draggedContact.photo,
                },
              ],
            }
          : t
      );

      onTeamsChanged(updated);
      return updated;
    });

    setDraggedContact(null);
    setDragSourceTeamId(null);
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedContact) return;

    // Remove from any team → goes back to unassigned pool
    setTeams((prev) => {
      const updated = prev.map((t) => ({
        ...t,
        members: t.members.filter(
          (m) => m.email.toLowerCase() !== draggedContact.email.toLowerCase()
        ),
      }));
      onTeamsChanged(updated);
      return updated;
    });

    setDraggedContact(null);
    setDragSourceTeamId(null);
  };

  // ─── Selection (mobile-friendly) ───
  const toggleSelect = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const moveSelectedToTeam = (teamId: string) => {
    const toMove = unassigned.filter((c) => selectedEmails.has(c.email));
    if (toMove.length === 0) return;

    setTeams((prev) => {
      const updated = prev.map((t) =>
        t.id === teamId ? { ...t, members: [...t.members, ...toMove] } : t
      );
      onTeamsChanged(updated);
      return updated;
    });
    setSelectedEmails(new Set());
  };

  // ─── Team operations ───
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
  };

  const removeTeam = (teamId: string) => {
    updateTeams(teams.filter((t) => t.id !== teamId));
  };

  const setLeader = (teamId: string, email: string) => {
    updateTeams(
      teams.map((t) =>
        t.id === teamId
          ? { ...t, leaderEmail: t.leaderEmail === email ? "" : email }
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
              leaderEmail: t.leaderEmail === email ? "" : t.leaderEmail,
            }
          : t
      )
    );
  };

  const toggleCollapse = (teamId: string) => {
    setCollapsedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);
      return next;
    });
  };

  // ─── Add manual contact to pool ───
  const addManualContact = () => {
    const email = manualEmail.trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return;
    // Check duplicates
    const allEmails = new Set([
      ...allContacts.map((c) => c.email.toLowerCase()),
      ...teams.flatMap((t) => t.members.map((m) => m.email.toLowerCase())),
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

  return (
    <div className="space-y-5">
      {/* ─── Top: Unassigned Pool ─── */}
      <div
        className="rounded-xl border border-brand-border/60 bg-white overflow-hidden"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={handleDropOnPool}
      >
        {/* Pool header */}
        <div className="px-4 py-3 bg-brand-background-secondary/50 border-b border-brand-border/40 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-primary" />
            <h3 className="text-[13px] font-bold text-brand-text-primary">
              {txt.unassigned}
            </h3>
            <span className="text-[11px] text-brand-text-muted bg-brand-background-muted px-2 py-0.5 rounded-full font-semibold">
              {filteredUnassigned.length}
            </span>
          </div>
          {/* Selection actions */}
          {selectedEmails.size > 0 && teams.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-brand-primary">
                {selectedEmails.size} selected
              </span>
              <select
                className="text-[12px] h-7 px-2 rounded-lg border border-brand-primary/30 bg-brand-primary/5 text-brand-primary font-semibold cursor-pointer"
                value=""
                onChange={(e) => {
                  if (e.target.value) moveSelectedToTeam(e.target.value);
                }}
              >
                <option value="">{txt.moveToTeam}…</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}
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
        <div className="max-h-[280px] overflow-y-auto">
          {filteredUnassigned.length === 0 && !showManualInput ? (
            <div className="py-8 text-center">
              <p className="text-[12px] text-brand-text-muted">
                {unassigned.length === 0 ? txt.noContacts : txt.noResults}
              </p>
            </div>
          ) : (
            filteredUnassigned.map((contact) => (
              <ContactCard
                key={contact.email}
                contact={contact}
                isSelected={selectedEmails.has(contact.email)}
                onSelect={() => toggleSelect(contact.email)}
                onDragStart={() => handleDragStart(contact)}
                teams={teams}
                onMoveToTeam={(teamId) => {
                  setTeams((prev) => {
                    const updated = prev.map((t) =>
                      t.id === teamId
                        ? { ...t, members: [...t.members, contact] }
                        : t
                    );
                    onTeamsChanged(updated);
                    return updated;
                  });
                }}
                txt={txt}
              />
            ))
          )}
        </div>

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

      {/* ─── Teams ─── */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {teams.map((team) => {
            const isCollapsed = collapsedTeams.has(team.id);
            const isDropTarget = dragOverTeamId === team.id;

            return (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "rounded-xl border-2 overflow-hidden transition-colors",
                  isDropTarget
                    ? "border-brand-primary bg-brand-primary/[0.03] shadow-lg shadow-brand-primary/10"
                    : "border-brand-border/50 bg-white"
                )}
                onDragOver={(e) => handleDragOver(e, team.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDropOnTeam(team.id)}
              >
                {/* Team header */}
                <div className="px-4 py-3 bg-brand-background-secondary/30 border-b border-brand-border/30 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(team.id)}
                    className="flex items-center gap-2 text-left flex-1 min-w-0"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-bold text-brand-text-primary truncate">
                        {team.name}
                      </h4>
                      <p className="text-[11px] text-brand-text-muted">
                        {team.members.length} {txt.membersCount}
                        {team.leaderEmail && (
                          <span className="ml-1.5 text-brand-warning">
                            ·{" "}
                            <Crown className="w-2.5 h-2.5 inline" />{" "}
                            {team.leaderEmail.split("@")[0]}
                          </span>
                        )}
                      </p>
                    </div>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-brand-text-muted shrink-0" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-brand-text-muted shrink-0" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTeam(team.id)}
                    className="ml-2 p-1.5 rounded-lg text-brand-text-muted hover:text-brand-error hover:bg-red-50 transition-all shrink-0"
                    title={txt.removeTeam}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Team members */}
                {!isCollapsed && (
                  <div className="min-h-[48px]">
                    {team.members.length === 0 ? (
                      <div
                        className={cn(
                          "py-6 text-center transition-colors",
                          isDropTarget ? "bg-brand-primary/5" : ""
                        )}
                      >
                        <p className="text-[12px] text-brand-text-muted italic">
                          {txt.emptyTeam}
                        </p>
                      </div>
                    ) : (
                      team.members.map((member) => (
                        <div
                          key={member.email}
                          draggable
                          onDragStart={() =>
                            handleDragStart(member, team.id)
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
                          {/* Leader badge / set leader */}
                          {team.leaderEmail === member.email ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-warning/10 text-brand-warning text-[10px] font-bold shrink-0">
                              <Crown className="w-2.5 h-2.5" />
                              {txt.isLeader}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setLeader(team.id, member.email)
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
                              removeMember(team.id, member.email)
                            }
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-brand-text-muted hover:text-brand-error hover:bg-red-50 transition-all shrink-0"
                            title={txt.removeFromTeam}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* New team form */}
        <AnimatePresence>
          {showNewTeam && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border-2 border-dashed border-brand-primary/30 bg-brand-primary/[0.02] p-4 space-y-3">
                <Input
                  ref={newTeamInputRef}
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createTeam();
                    }
                    if (e.key === "Escape") setShowNewTeam(false);
                  }}
                  placeholder={txt.teamNamePlaceholder}
                  className="h-10 text-[13px]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={createTeam}
                    disabled={!newTeamName.trim()}
                    className="text-[12px] h-8"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    {txt.create}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowNewTeam(false);
                      setNewTeamName("");
                    }}
                    className="text-[12px] h-8"
                  >
                    {txt.cancel}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add team button */}
        {!showNewTeam && (
          <button
            type="button"
            onClick={() => {
              setShowNewTeam(true);
              setTimeout(() => newTeamInputRef.current?.focus(), 100);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-brand-border hover:border-brand-primary/40 text-[13px] font-semibold text-brand-text-muted hover:text-brand-primary transition-all"
          >
            <Plus className="w-4 h-4" />
            {txt.newTeam}
          </button>
        )}
      </div>

      {/* ─── Summary ─── */}
      {teams.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/5 border border-brand-primary/15">
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
        </div>
      )}
    </div>
  );
}

/* ─── Contact Card (in unassigned pool) ─── */
function ContactCard({
  contact,
  isSelected,
  onSelect,
  onDragStart,
  teams,
  onMoveToTeam,
  txt,
}: {
  contact: TeamContact;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  teams: Team[];
  onMoveToTeam: (teamId: string) => void;
  txt: any;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 hover:bg-brand-background-secondary/50 transition-colors cursor-grab active:cursor-grabbing group",
        isSelected && "bg-brand-primary/5"
      )}
    >
      <GripVertical className="w-3 h-3 text-brand-text-muted/20 group-hover:text-brand-text-muted shrink-0" />

      {/* Checkbox */}
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all shrink-0",
          isSelected
            ? "bg-brand-primary border-brand-primary"
            : "border-brand-border hover:border-brand-primary/50"
        )}
      >
        {isSelected && (
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        )}
      </button>

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

      {/* Quick-assign dropdown (mobile-friendly) */}
      {teams.length > 0 && (
        <select
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-[11px] h-6 px-1.5 rounded border border-brand-border/50 bg-white text-brand-text-muted cursor-pointer shrink-0 max-w-[100px]"
          value=""
          onChange={(e) => {
            if (e.target.value) onMoveToTeam(e.target.value);
          }}
        >
          <option value="">{txt.moveToTeam}</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
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
