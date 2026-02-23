import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  Building2,
  Users,
  Mail,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  Loader2,
  ArrowLeft,
  UserCircle,
  Shield,
  Receipt,
  Calendar,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { toast } from 'sonner';

/* ─── Types ─── */
interface MemberData {
  email: string;
  firstName: string;
  lastName: string;
  isLeader: boolean;
}

interface TeamData {
  id: string;
  name: string;
  leaderEmail: string;
  members: MemberData[];
}

interface CompanyData {
  id: string;
  companyName: string;
  ico: string;
  repName: string;
  repEmail: string;
  adminName: string;
  adminEmail: string;
  billingEmail: string;
  billingInterval: string;
  oauthProvider: string;
  employeeCount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  teams: TeamData[];
}

/* ─── Copy helper ─── */
async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} zkopírováno`);
  } catch {
    toast.error('Kopírování selhalo');
  }
}

/* ─── Date formatting ─── */
function formatDate(iso: string): string {
  if (!iso) return '–';
  const d = new Date(iso);
  return d.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ─── Company List View ─── */
function CompanyList({
  companies,
  onSelect,
}: {
  companies: CompanyData[];
  onSelect: (c: CompanyData) => void;
}) {
  const [search, setSearch] = useState('');

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(q) ||
      c.ico.includes(q) ||
      c.adminEmail.toLowerCase().includes(q)
    );
  });

  // Deduplicate by company name — show latest submission
  const unique = new Map<string, CompanyData>();
  for (const c of filtered) {
    const key = `${c.companyName}__${c.ico}`;
    if (!unique.has(key) || new Date(c.createdAt) > new Date(unique.get(key)!.createdAt)) {
      unique.set(key, c);
    }
  }
  const deduped = [...unique.values()];

  const totalMembers = (c: CompanyData) =>
    c.teams.reduce((sum, t) => sum + t.members.length, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Onboardings</h1>
          <p className="text-sm text-brand-text-muted mt-1">
            {companies.length} odeslání celkem · {deduped.length} unikátních firem
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
          <Input
            placeholder="Hledat firmu, IČO, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white border-brand-border"
          />
        </div>
      </div>

      {deduped.length === 0 ? (
        <div className="text-center py-12 text-brand-text-muted">
          {search ? 'Žádné výsledky' : 'Žádná data'}
        </div>
      ) : (
        <div className="grid gap-3">
          {deduped.map((c) => {
            const members = totalMembers(c);
            return (
              <Card
                key={c.id}
                className="cursor-pointer hover:shadow-md hover:border-brand-primary/30 transition-all duration-200 border-brand-border/60"
                onClick={() => onSelect(c)}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-brand-text-primary truncate">
                          {c.companyName || 'Bez názvu'}
                        </div>
                        <div className="text-xs text-brand-text-muted flex items-center gap-2 mt-0.5 flex-wrap">
                          {c.ico && <span>IČO {c.ico}</span>}
                          <span>·</span>
                          <span>{c.teams.length} týmů</span>
                          <span>·</span>
                          <span>{members} členů</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex flex-col items-end text-xs text-brand-text-muted">
                        <span>{c.billingInterval === 'yearly' ? 'Roční' : 'Měsíční'}</span>
                        <span className="font-medium text-brand-text-primary">
                          {c.totalPrice?.toLocaleString('cs-CZ')} Kč/měs
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-brand-text-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Show all submissions (including duplicates) */}
      {deduped.length < filtered.length && (
        <details className="mt-4">
          <summary className="text-sm text-brand-text-muted cursor-pointer hover:text-brand-primary">
            Zobrazit všechna odeslání ({filtered.length})
          </summary>
          <div className="grid gap-2 mt-3">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-brand-border/40 cursor-pointer hover:border-brand-primary/30 transition-colors"
                onClick={() => onSelect(c)}
              >
                <div className="text-sm">
                  <span className="font-medium text-brand-text-primary">{c.companyName}</span>
                  <span className="text-brand-text-muted ml-2">{formatDate(c.createdAt)}</span>
                </div>
                <div className="text-xs text-brand-text-muted">
                  {c.teams.length} týmů · {totalMembers(c)} členů
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

/* ─── Team Card with Copy ─── */
function TeamCard({ team }: { team: TeamData }) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const emails = team.members.map((m) => m.email).filter(Boolean);

  const handleCopyEmails = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (emails.length === 0) return;
    await copyToClipboard(emails.join('\n'), `${emails.length} emailů`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const leader = team.members.find((m) => m.isLeader);

  return (
    <Card className="border-brand-border/50 overflow-hidden">
      {/* Team Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-blue-50 border-b border-blue-100 cursor-pointer hover:bg-blue-100/60 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-blue-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-blue-600" />
          )}
          <div>
            <span className="font-semibold text-blue-900">{team.name}</span>
            <span className="text-xs text-blue-600 ml-2">
              {team.members.length} {team.members.length === 1 ? 'člen' : team.members.length < 5 ? 'členové' : 'členů'}
            </span>
          </div>
          {leader && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              {leader.firstName} {leader.lastName}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyEmails}
          disabled={emails.length === 0}
          className={cn(
            'h-8 px-3 text-xs font-medium gap-1.5 shrink-0',
            copied
              ? 'text-green-700 bg-green-50 hover:bg-green-50'
              : 'text-blue-700 hover:bg-blue-100'
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Zkopírováno
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Kopírovat emaily
            </>
          )}
        </Button>
      </div>

      {/* Members */}
      {expanded && (
        <div className="divide-y divide-brand-border/30">
          {team.members.length === 0 ? (
            <div className="px-4 py-3 text-sm text-brand-text-muted italic">
              Žádní členové
            </div>
          ) : (
            team.members.map((m, idx) => (
              <div
                key={m.email || idx}
                className={cn(
                  'flex items-center justify-between px-4 py-2.5 text-sm',
                  m.isLeader && 'bg-blue-50/50'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-brand-background-secondary flex items-center justify-center text-xs font-medium text-brand-text-muted shrink-0">
                    {m.firstName?.[0] || m.email?.[0]?.toUpperCase() || '?'}
                    {m.lastName?.[0] || ''}
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-brand-text-primary">
                      {m.firstName} {m.lastName}
                    </span>
                    {m.isLeader && (
                      <span className="text-xs text-blue-600 ml-1.5">(Team Leader)</span>
                    )}
                  </div>
                </div>
                <span className="text-brand-text-muted truncate ml-3">{m.email}</span>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}

/* ─── Company Detail View ─── */
function CompanyDetail({
  company,
  onBack,
}: {
  company: CompanyData;
  onBack: () => void;
}) {
  const [allCopied, setAllCopied] = useState(false);

  const allEmails = company.teams.flatMap((t) => t.members.map((m) => m.email)).filter(Boolean);
  const uniqueEmails = [...new Set(allEmails)];
  const totalMembers = company.teams.reduce((sum, t) => sum + t.members.length, 0);

  const handleCopyAll = async () => {
    if (uniqueEmails.length === 0) return;
    await copyToClipboard(uniqueEmails.join('\n'), `${uniqueEmails.length} emailů`);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back + Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-brand-text-muted hover:text-brand-primary mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na seznam
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-text-primary">
              {company.companyName || 'Bez názvu'}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-brand-text-muted flex-wrap">
              {company.ico && <span>IČO {company.ico}</span>}
              <span>·</span>
              <span>{company.teams.length} týmů</span>
              <span>·</span>
              <span>{totalMembers} členů</span>
              <span>·</span>
              <span>{formatDate(company.createdAt)}</span>
            </div>
          </div>
          <Button
            onClick={handleCopyAll}
            disabled={uniqueEmails.length === 0}
            size="sm"
            className={cn(
              'gap-2 shrink-0',
              allCopied && 'bg-green-600 hover:bg-green-600 border-green-600'
            )}
          >
            {allCopied ? (
              <>
                <Check className="w-4 h-4" />
                Zkopírováno ({uniqueEmails.length})
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Kopírovat všechny emaily ({uniqueEmails.length})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Info Grid */}
      <Card className="border-brand-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-brand-text-primary">Informace o firmě</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem icon={UserCircle} label="Zástupce" value={company.repName} sub={company.repEmail} />
            <InfoItem icon={Shield} label="Admin" value={company.adminName} sub={company.adminEmail} />
            <InfoItem icon={Receipt} label="Fakturační email" value={company.billingEmail || '–'} />
            <InfoItem icon={Users} label="Zaměstnanců" value={String(company.employeeCount || '–')} />
            <InfoItem icon={Calendar} label="Plán" value={`${company.billingInterval === 'yearly' ? 'Roční' : 'Měsíční'} · ${company.totalPrice?.toLocaleString('cs-CZ')} Kč/měs`} />
            {company.oauthProvider && (
              <InfoItem icon={Shield} label="OAuth" value={company.oauthProvider} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Teams */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-brand-text-primary">
          Týmy ({company.teams.length})
        </h2>
        {company.teams.length === 0 ? (
          <Card className="border-brand-border/50">
            <CardContent className="p-6 text-center text-brand-text-muted">
              Žádné týmy
            </CardContent>
          </Card>
        ) : (
          company.teams.map((team) => <TeamCard key={team.id} team={team} />)
        )}
      </div>
    </div>
  );
}

/* ─── Info Item ─── */
function InfoItem({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-md bg-brand-background-secondary flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-brand-text-muted" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-brand-text-muted">{label}</div>
        <div className="text-sm font-medium text-brand-text-primary truncate">{value || '–'}</div>
        {sub && <div className="text-xs text-brand-text-muted truncate">{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Main Onboardings Page ─── */
export function OnboardingsPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<CompanyData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get auth token from Supabase session
      let token = '';
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        token = data.session?.access_token || '';
      }
      if (!token) {
        // Fallback: check sessionStorage for local auth
        const stored = sessionStorage.getItem('behavera_admin_session');
        if (stored) token = 'local-admin';
      }

      const res = await fetch('/api/admin-onboardings', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || `HTTP ${res.status}`);
      }

      const data: CompanyData[] = await res.json();
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Načítání selhalo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
        <span className="ml-2 text-brand-text-muted">Načítám…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-brand-error font-medium">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchData}>
          Zkusit znovu
        </Button>
      </div>
    );
  }

  if (selected) {
    return <CompanyDetail company={selected} onBack={() => setSelected(null)} />;
  }

  return <CompanyList companies={companies} onSelect={setSelected} />;
}
