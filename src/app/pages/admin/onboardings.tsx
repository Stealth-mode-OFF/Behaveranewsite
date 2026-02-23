import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
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
  Download,
  RefreshCw,
  ExternalLink,
  Crown,
  Hash,
  Clock,
  TrendingUp,
  AlertCircle,
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

/* ─── Helpers ─── */
async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} zkopirováno do schránky`);
  } catch {
    toast.error('Kopírování selhalo');
  }
}

function formatDate(iso: string): string {
  if (!iso) return '\u2013';
  const d = new Date(iso);
  return d.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  if (!iso) return '\u2013';
  const d = new Date(iso);
  return d.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function timeAgo(iso: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `p\u0159ed ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `p\u0159ed ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'v\u010Dera';
  if (days < 7) return `p\u0159ed ${days} dny`;
  return formatDate(iso);
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Nov\u00fd', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  contacted: { label: 'Kontaktov\u00e1n', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  onboarding: { label: 'Onboarding', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  active: { label: 'Aktivn\u00ed', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  rejected: { label: 'Odm\u00edtnuto', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || {
    label: status || '\u2013',
    color: 'text-gray-600',
    bg: 'bg-gray-50 border-gray-200',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        cfg.bg,
        cfg.color
      )}
    >
      {cfg.label}
    </span>
  );
}

function countMembers(c: CompanyData) {
  return c.teams.reduce((sum, t) => sum + t.members.length, 0);
}

/* ─── Stat Card ─── */
function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-brand-border/50 shadow-sm">
      <div
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          accent || 'bg-brand-primary/10'
        )}
      >
        <Icon className={cn('w-5 h-5', accent ? 'text-white' : 'text-brand-primary')} />
      </div>
      <div>
        <div className="text-2xl font-bold text-brand-text-primary leading-none">{value}</div>
        <div className="text-xs text-brand-text-muted mt-0.5">{label}</div>
      </div>
    </div>
  );
}

/* ─── CSV Export ─── */
function exportCSV(companies: CompanyData[]) {
  const rows = [
    ['Firma', 'I\u010cO', 'Z\u00e1stupce', 'Email z\u00e1stupce', 'Admin', 'Admin email', 'Faktura\u010dn\u00ed email', 'Zam\u011bstnanc\u016f', 'T\u00fdm\u016f', '\u010clen\u016f', 'Pl\u00e1n', 'Cena/m\u011bs', 'OAuth', 'Status', 'Datum'].join(';'),
    ...companies.map((c) =>
      [
        c.companyName, c.ico, c.repName, c.repEmail, c.adminName, c.adminEmail,
        c.billingEmail, c.employeeCount, c.teams.length, countMembers(c),
        c.billingInterval === 'yearly' ? 'Ro\u010dn\u00ed' : 'M\u011bs\u00ed\u010dn\u00ed',
        c.totalPrice, c.oauthProvider || '',
        statusConfig[c.status]?.label || c.status, formatDate(c.createdAt),
      ].join(';')
    ),
  ];
  const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `onboardings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('CSV exportov\u00e1no');
}

/* ─── Clickable Email ─── */
function EmailLink({ email, className }: { email: string; className?: string }) {
  if (!email) return <span className="text-brand-text-muted">{'\u2013'}</span>;
  return (
    <a
      href={`mailto:${email}`}
      className={cn(
        'text-brand-primary hover:underline hover:text-brand-primary/80 transition-colors',
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {email}
    </a>
  );
}

/* ─── Copy Button ─── */
function CopyBtn({ text, label, size = 'sm' }: { text: string; label: string; size?: 'sm' | 'xs' }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await copyText(text, label);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-medium transition-all',
        size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1',
        copied
          ? 'text-emerald-600 bg-emerald-50'
          : 'text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/5'
      )}
      title={`Kopirovat ${label}`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'OK' : ''}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TEAM CARD
   ════════════════════════════════════════════════════════════════════ */
function TeamCard({ team, defaultExpanded = false }: { team: TeamData; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const emails = team.members.map((m) => m.email).filter(Boolean);
  const leader = team.members.find((m) => m.isLeader);

  return (
    <div className="rounded-xl border border-brand-border/50 bg-white overflow-hidden shadow-sm">
      <button
        className="flex items-center justify-between w-full px-4 py-3 hover:bg-slate-50/80 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors',
            expanded ? 'bg-brand-primary text-white' : 'bg-brand-primary/10 text-brand-primary'
          )}>
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-brand-text-primary">{team.name}</span>
            <span className="text-xs text-brand-text-muted ml-2">
              {team.members.length}{' '}
              {team.members.length === 1 ? '\u010dlen' : team.members.length < 5 ? '\u010dlenov\u00e9' : '\u010dlen\u016f'}
            </span>
          </div>
          {leader && (
            <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-200 gap-1 hidden sm:flex">
              <Crown className="w-3 h-3" />
              {leader.firstName} {leader.lastName}
            </Badge>
          )}
        </div>
        {emails.length > 0 && (
          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            <CopyBtn text={emails.join('\n')} label={`${emails.length} email\u016f (${team.name})`} size="sm" />
            <span className="text-[10px] text-brand-text-muted hidden sm:inline">emaily</span>
          </div>
        )}
      </button>

      {expanded && (
        <div className="border-t border-brand-border/30">
          {team.members.length === 0 ? (
            <div className="px-4 py-6 text-sm text-brand-text-muted text-center italic">{'\u017d\u00e1dn\u00ed \u010dlenov\u00e9'}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-10 pl-4">#</TableHead>
                  <TableHead>{'Jm\u00e9no'}</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-20 text-center">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.members.map((m, idx) => (
                  <TableRow key={m.email || idx} className={cn('transition-colors', m.isLeader && 'bg-amber-50/40')}>
                    <TableCell className="text-brand-text-muted text-xs pl-4 tabular-nums">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0',
                          m.isLeader ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' : 'bg-slate-100 text-slate-500'
                        )}>
                          {(m.firstName?.[0] || m.email?.[0]?.toUpperCase() || '?')}{m.lastName?.[0] || ''}
                        </div>
                        <span className="font-medium text-brand-text-primary text-sm">{m.firstName} {m.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <EmailLink email={m.email} className="text-sm" />
                        {m.email && <CopyBtn text={m.email} label="email" size="xs" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {m.isLeader && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                          <Crown className="w-3 h-3" />
                          Leader
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   INFO ROW
   ════════════════════════════════════════════════════════════════════ */
function InfoRow({ icon: Icon, label, children }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-medium text-brand-text-muted uppercase tracking-wide">{label}</div>
        <div className="text-sm text-brand-text-primary mt-0.5">{children}</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPANY DETAIL VIEW
   ════════════════════════════════════════════════════════════════════ */
function CompanyDetail({ company, onBack }: { company: CompanyData; onBack: () => void }) {
  const allEmails = company.teams.flatMap((t) => t.members.map((m) => m.email)).filter(Boolean);
  const uniqueEmails = [...new Set(allEmails)];
  const members = countMembers(company);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-brand-text-muted hover:text-brand-primary mb-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {`Zp\u011bt na seznam`}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center shadow-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-brand-text-primary leading-tight">
                {company.companyName || `Bez n\u00e1zvu`}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-brand-text-muted flex-wrap">
                {company.ico && (
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {`I\u010cO ${company.ico}`}
                  </span>
                )}
                <span>{'\u00b7'}</span>
                <StatusBadge status={company.status} />
                <span>{'\u00b7'}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo(company.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => {
              const membersCsv = company.teams.flatMap((t) =>
                t.members.map((m) => `${m.firstName} ${m.lastName};${m.email};${t.name};${m.isLeader ? 'Leader' : '\u010clen'}`)
              );
              const csv = [`Jm\u00e9no;Email;T\u00fdm;Role`, ...membersCsv].join('\n');
              const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${company.companyName.replace(/\s+/g, '-')}-members.csv`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success(`CSV t\u00fdm\u016f exportov\u00e1no`);
            }}
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs"
            disabled={uniqueEmails.length === 0}
            onClick={() => copyText(uniqueEmails.join('\n'), `${uniqueEmails.length} email\u016f`)}
          >
            <Mail className="w-3.5 h-3.5" />
            {`Kop\u00edrovat ${uniqueEmails.length} email\u016f`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Users} label={`T\u00fdm\u016f`} value={company.teams.length} />
        <StatCard icon={UserCircle} label={`\u010clen\u016f celkem`} value={members} />
        <StatCard icon={Building2} label={`Zam\u011bstnanc\u016f (uv\u00e1d\u011bno)`} value={company.employeeCount || '\u2013'} />
        <StatCard
          icon={TrendingUp}
          label={company.billingInterval === 'yearly' ? `Ro\u010dn\u00ed pl\u00e1n` : `M\u011bs\u00ed\u010dn\u00ed pl\u00e1n`}
          value={company.totalPrice ? `${company.totalPrice.toLocaleString('cs-CZ')} K\u010d` : '\u2013'}
        />
      </div>

      <Card className="border-brand-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-brand-text-primary uppercase tracking-wide">
            {`Kontaktn\u00ed \u00fadaje`}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 divide-y sm:divide-y-0">
            <InfoRow icon={UserCircle} label={`Z\u00e1stupce firmy`}>
              <div className="font-medium">{company.repName || '\u2013'}</div>
              <EmailLink email={company.repEmail} className="text-xs" />
            </InfoRow>
            <InfoRow icon={Shield} label="Admin platformy">
              <div className="font-medium">{company.adminName || '\u2013'}</div>
              <EmailLink email={company.adminEmail} className="text-xs" />
            </InfoRow>
            <InfoRow icon={Receipt} label={`Faktura\u010dn\u00ed email`}>
              <EmailLink email={company.billingEmail} className="text-sm" />
            </InfoRow>
            {company.oauthProvider && (
              <InfoRow icon={ExternalLink} label={`P\u0159ipojen\u00ed`}>
                <Badge variant="secondary" className="text-xs capitalize">{company.oauthProvider}</Badge>
              </InfoRow>
            )}
            <InfoRow icon={Calendar} label={`Odesl\u00e1no`}>
              {formatDateTime(company.createdAt)}
            </InfoRow>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-brand-text-primary">
            {`T\u00fdmy`}
            <span className="text-sm font-normal text-brand-text-muted ml-2">({company.teams.length})</span>
          </h2>
        </div>
        {company.teams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-border/50 p-8 text-center text-brand-text-muted">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            {`\u017d\u00e1dn\u00e9 t\u00fdmy`}
          </div>
        ) : (
          <div className="space-y-3">
            {company.teams.map((team, idx) => (
              <TeamCard key={team.id} team={team} defaultExpanded={idx === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPANY LIST VIEW
   ════════════════════════════════════════════════════════════════════ */
function CompanyList({
  companies,
  onSelect,
  onRefresh,
}: {
  companies: CompanyData[];
  onSelect: (c: CompanyData) => void;
  onRefresh: () => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'members'>('date');

  const filtered = useMemo(() => {
    let list = companies;
    if (statusFilter !== 'all') {
      list = list.filter((c) => c.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.ico.includes(q) ||
        c.repEmail.toLowerCase().includes(q) ||
        c.adminEmail.toLowerCase().includes(q) ||
        c.repName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [companies, search, statusFilter]);

  const deduped = useMemo(() => {
    const unique = new Map<string, CompanyData>();
    for (const c of filtered) {
      const key = `${c.companyName}__${c.ico}`;
      if (!unique.has(key) || new Date(c.createdAt) > new Date(unique.get(key)!.createdAt)) {
        unique.set(key, c);
      }
    }
    const list = [...unique.values()];
    if (sortBy === 'name') list.sort((a, b) => a.companyName.localeCompare(b.companyName, 'cs'));
    else if (sortBy === 'members') list.sort((a, b) => countMembers(b) - countMembers(a));
    else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [filtered, sortBy]);

  const stats = useMemo(() => ({
    total: companies.length,
    unique: new Set(companies.map((c) => `${c.companyName}__${c.ico}`)).size,
    members: companies.reduce((s, c) => s + countMembers(c), 0),
    newCount: companies.filter((c) => c.status === 'new').length,
  }), [companies]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: companies.length };
    for (const c of companies) {
      counts[c.status] = (counts[c.status] || 0) + 1;
    }
    return counts;
  }, [companies]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Onboardings</h1>
          <p className="text-sm text-brand-text-muted mt-0.5">
            {`P\u0159ehled v\u0161ech registrac\u00ed a onboarding proces\u016f`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onRefresh}>
            <RefreshCw className="w-3.5 h-3.5" />
            Obnovit
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => exportCSV(companies)}>
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Building2} label="Firem celkem" value={stats.unique} />
        <StatCard icon={Hash} label={`Odesl\u00e1n\u00ed`} value={stats.total} />
        <StatCard icon={Users} label={`\u010clen\u016f celkem`} value={stats.members} />
        <StatCard
          icon={AlertCircle}
          label={`Nov\u00fdch (\u010dek\u00e1 na kontakt)`}
          value={stats.newCount}
          accent={stats.newCount > 0 ? 'bg-blue-500' : undefined}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100/80 overflow-x-auto">
          {['all', 'new', 'contacted', 'onboarding', 'active', 'rejected'].map((s) => {
            const count = statusCounts[s] || 0;
            if (s !== 'all' && count === 0) return null;
            const label = s === 'all' ? `V\u0161e` : statusConfig[s]?.label || s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap',
                  statusFilter === s
                    ? 'bg-white text-brand-text-primary shadow-sm'
                    : 'text-brand-text-muted hover:text-brand-text-primary'
                )}
              >
                {label}
                <span className="ml-1 text-[10px] opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 w-full sm:max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
          <Input
            placeholder={`Hledat firmu, I\u010cO, jm\u00e9no\u2026`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9 bg-white border-brand-border/60 text-sm"
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-brand-text-muted shrink-0">
          {`\u0158adit:`}
          {([['date', 'Datum'], ['name', `N\u00e1zev`], ['members', `\u010clenov\u00e9`]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={cn(
                'px-2 py-1 rounded-md transition-colors',
                sortBy === key ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'hover:bg-slate-100'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {deduped.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-border/50 p-12 text-center">
          <Search className="w-8 h-8 mx-auto mb-3 text-brand-text-muted/30" />
          <p className="text-brand-text-muted">
            {search || statusFilter !== 'all' ? `\u017d\u00e1dn\u00e9 v\u00fdsledky pro aktu\u00e1ln\u00ed filtr` : `Zat\u00edm \u017e\u00e1dn\u00e1 data`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {deduped.map((c) => {
            const members = countMembers(c);
            const isRecent = Date.now() - new Date(c.createdAt).getTime() < 86400000;
            return (
              <div
                key={c.id}
                className={cn(
                  'group relative flex items-center gap-4 p-4 rounded-xl bg-white border transition-all duration-200 cursor-pointer',
                  'hover:shadow-md hover:border-brand-primary/30 hover:-translate-y-px',
                  isRecent ? 'border-blue-200 bg-blue-50/30' : 'border-brand-border/50'
                )}
                onClick={() => onSelect(c)}
              >
                {isRecent && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-brand-text-primary truncate">
                      {c.companyName || `Bez n\u00e1zvu`}
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-brand-text-muted flex-wrap">
                    {c.ico && <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{`I\u010cO ${c.ico}`}</span>}
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {`${c.teams.length} t\u00fdm\u016f \u00b7 ${members} \u010dlen\u016f`}
                    </span>
                    {c.repName && <span className="hidden sm:flex items-center gap-1"><UserCircle className="w-3 h-3" />{c.repName}</span>}
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-right">
                  <span className="text-xs text-brand-text-muted">{timeAgo(c.createdAt)}</span>
                  {c.totalPrice > 0 && (
                    <span className="text-xs font-semibold text-brand-text-primary">
                      {`${c.totalPrice.toLocaleString('cs-CZ')} K\u010d/m\u011bs`}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-brand-text-muted/40 group-hover:text-brand-primary shrink-0 transition-colors" />
              </div>
            );
          })}
        </div>
      )}

      {deduped.length < filtered.length && (
        <details className="mt-2">
          <summary className="text-xs text-brand-text-muted cursor-pointer hover:text-brand-primary transition-colors">
            {`Zobrazit v\u0161echna odesl\u00e1n\u00ed (${filtered.length} celkem, ${filtered.length - deduped.length} duplicitn\u00edch)`}
          </summary>
          <div className="mt-3 rounded-xl border border-brand-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Firma</TableHead>
                  <TableHead>{`Z\u00e1stupce`}</TableHead>
                  <TableHead>{`T\u00fdm\u016f`}</TableHead>
                  <TableHead>{`\u010clen\u016f`}</TableHead>
                  <TableHead>Datum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => onSelect(c)}>
                    <TableCell className="font-medium">{c.companyName}</TableCell>
                    <TableCell className="text-brand-text-muted">{c.repName}</TableCell>
                    <TableCell>{c.teams.length}</TableCell>
                    <TableCell>{countMembers(c)}</TableCell>
                    <TableCell className="text-brand-text-muted text-xs">{formatDateTime(c.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </details>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════════ */
export function OnboardingsPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<CompanyData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let token = '';
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        token = data.session?.access_token || '';
      }
      if (!token) {
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
      setError(err instanceof Error ? err.message : `Na\u010d\u00edt\u00e1n\u00ed selhalo`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-brand-primary/20" />
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin absolute inset-0" />
        </div>
        <span className="text-sm text-brand-text-muted">{`Na\u010d\u00edt\u00e1m onboardings\u2026`}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <div className="text-center">
          <p className="font-medium text-brand-text-primary">{`Nepoda\u0159ilo se na\u010d\u00edst data`}</p>
          <p className="text-sm text-red-500 mt-1 max-w-md">{error}</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          Zkusit znovu
        </Button>
      </div>
    );
  }

  if (selected) {
    return <CompanyDetail company={selected} onBack={() => setSelected(null)} />;
  }

  return <CompanyList companies={companies} onSelect={setSelected} onRefresh={fetchData} />;
}
