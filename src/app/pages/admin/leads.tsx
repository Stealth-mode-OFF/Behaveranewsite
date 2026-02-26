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
  Mail,
  Copy,
  Check,
  Search,
  Loader2,
  Download,
  RefreshCw,
  ExternalLink,
  Building2,
  Phone,
  Calendar,
  Users,
  Target,
  QrCode,
  Globe,
  Filter,
  TrendingUp,
  AlertCircle,
  Heart,
  CheckSquare,
  Square,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { toast } from 'sonner';

/* ─── Types ─── */
interface Lead {
  id: string;
  email: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  company: string | null;
  company_size: string | null;
  role: string | null;
  source: string;
  created_at: string;
  processed: boolean;
}

interface EventLead {
  id: string;
  email: string;
  company: string;
  phone: string | null;
  contact_name: string | null;
  employees_bucket: string;
  feedback_frequency: string;
  decision_role: string;
  consent_contact: boolean;
  consent_marketing: boolean;
  source_page: string | null;
  source_src: string | null;
  source_rep: string | null;
  source_booth: string | null;
  source_event: string | null;
  created_at: string;
  processed: boolean;
}

type TabFilter = 'all' | 'website' | 'event';
type ProcessedFilter = 'all' | 'unprocessed' | 'processed';

/* ─── Helpers ─── */
function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('cs-CZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatDateShort(iso: string): string {
  try {
    return new Intl.DateTimeFormat('cs-CZ', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const unicodeEscapePattern = /\\u[0-9a-fA-F]{4}/;

function decodeUnicodeEscapes(value: string): string {
  if (!unicodeEscapePattern.test(value)) return value;
  return value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

function normalizeText<T extends string | null | undefined>(value: T): T {
  if (typeof value !== 'string') return value;
  return decodeUnicodeEscapes(value) as T;
}

/* ─── Tiny components ─── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="text-brand-text-muted hover:text-brand-primary transition-colors ml-1.5 inline-flex">
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function EmailLink({ email }: { email: string }) {
  return (
    <span className="inline-flex items-center gap-1 group">
      <a href={`mailto:${email}`} className="text-brand-primary hover:underline text-sm">
        {email}
      </a>
      <CopyBtn text={email} />
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    decision_maker: { label: 'Rozhoduje', cls: 'bg-green-100 text-green-800 border-green-200' },
    co_decision_maker: { label: 'Spolurozhoduje', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
    connector: { label: 'Propojovatel', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  };
  const info = map[role] || { label: role, cls: 'bg-gray-100 text-gray-700 border-gray-200' };
  return <Badge variant="outline" className={cn('text-xs font-medium border', info.cls)}>{info.label}</Badge>;
}

function FrequencyBadge({ freq }: { freq: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    no: { label: 'Nedělá pulzy', cls: 'bg-red-50 text-red-700 border-red-200' },
    ad_hoc: { label: 'Ad hoc', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    quarterly: { label: 'Čtvrtletně', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    monthly_plus: { label: 'Měsíčně+', cls: 'bg-green-50 text-green-700 border-green-200' },
  };
  const info = map[freq] || { label: freq, cls: 'bg-gray-100 text-gray-700 border-gray-200' };
  return <Badge variant="outline" className={cn('text-xs font-medium border', info.cls)}>{info.label}</Badge>;
}

function SourceBadge({ source }: { source: string }) {
  if (!source) return <span className="text-xs text-brand-text-muted">—</span>;
  const isQR = source.toLowerCase().includes('qr') || source.toLowerCase().includes('scan') || source.toLowerCase().includes('event');
  const isNonprofit = source.toLowerCase().includes('neziskov');
  const bg = isNonprofit ? 'bg-green-50 text-green-700 border-green-200'
    : isQR ? 'bg-purple-50 text-purple-700 border-purple-200'
    : 'bg-sky-50 text-sky-700 border-sky-200';
  const Icon = isNonprofit ? Heart : isQR ? QrCode : Globe;
  return (
    <Badge variant="outline" className={cn('text-xs font-medium border', bg)}>
      <Icon className="w-3 h-3 mr-1" />
      {source}
    </Badge>
  );
}

function StatCard({ icon: Icon, label, value, sub, className }: { icon: typeof Users; label: string; value: string | number; sub?: string; className?: string }) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-brand-primary" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold text-brand-text-primary">{value}</div>
          <div className="text-xs text-brand-text-muted">{label}</div>
          {sub && <div className="text-xs text-brand-text-muted/60 mt-0.5">{sub}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Main Component ─── */
export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [eventLeads, setEventLeads] = useState<EventLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<TabFilter>('all');
  const [processedFilter, setProcessedFilter] = useState<ProcessedFilter>('all');

  /* ── Toggle processed ── */
  const toggleProcessed = useCallback(async (id: string, table: 'leads' | 'event_leads', current: boolean) => {
    const newVal = !current;
    // Optimistic update
    if (table === 'leads') {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, processed: newVal } : l));
    } else {
      setEventLeads(prev => prev.map(l => l.id === id ? { ...l, processed: newVal } : l));
    }
    try {
      let token = 'local-admin';
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || 'local-admin';
      }
      const res = await fetch('/api/admin-leads', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, table, processed: newVal }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(newVal ? 'Označeno jako zpracované' : 'Označeno jako nezpracované');
    } catch {
      // Revert on error
      if (table === 'leads') {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, processed: current } : l));
      } else {
        setEventLeads(prev => prev.map(l => l.id === id ? { ...l, processed: current } : l));
      }
      toast.error('Nepodařilo se změnit stav');
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let token = 'local-admin';
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || 'local-admin';
      }
      const res = await fetch('/api/admin-leads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();

      const normalizedLeads = (data.leads || []).map((lead: Lead): Lead => ({
        ...lead,
        email: normalizeText(lead.email) || '',
        name: normalizeText(lead.name),
        first_name: normalizeText(lead.first_name),
        last_name: normalizeText(lead.last_name),
        phone: normalizeText(lead.phone),
        company: normalizeText(lead.company),
        company_size: normalizeText(lead.company_size),
        role: normalizeText(lead.role),
        source: normalizeText(lead.source) || '',
      }));

      const normalizedEventLeads = (data.eventLeads || []).map((lead: EventLead): EventLead => ({
        ...lead,
        email: normalizeText(lead.email) || '',
        company: normalizeText(lead.company) || '',
        phone: normalizeText(lead.phone),
        contact_name: normalizeText(lead.contact_name),
        employees_bucket: normalizeText(lead.employees_bucket) || '',
        feedback_frequency: normalizeText(lead.feedback_frequency) || '',
        decision_role: normalizeText(lead.decision_role) || '',
        source_page: normalizeText(lead.source_page),
        source_src: normalizeText(lead.source_src),
        source_rep: normalizeText(lead.source_rep),
        source_booth: normalizeText(lead.source_booth),
        source_event: normalizeText(lead.source_event),
      }));

      setLeads(normalizedLeads);
      setEventLeads(normalizedEventLeads);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      toast.error('Chyba při načítání leadů: ' + msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  /* ── Derived data ── */
  const today = new Date().toDateString();
  const todayLeads = leads.filter(l => new Date(l.created_at).toDateString() === today).length;
  const todayEvents = eventLeads.filter(l => new Date(l.created_at).toDateString() === today).length;
  const nonprofitLeads = leads.filter(l => l.source?.toLowerCase().includes('neziskov'));
  const nonprofitCount = nonprofitLeads.length;

  const q = search.toLowerCase().trim();

  const filteredLeads = useMemo(() => {
    if (tab === 'event') return [];
    return leads.filter(l => {
      if (processedFilter === 'processed' && !l.processed) return false;
      if (processedFilter === 'unprocessed' && l.processed) return false;
      if (!q) return true;
      return [l.email, l.name, l.first_name, l.last_name, l.company, l.source, l.phone].some(
        v => v && v.toLowerCase().includes(q)
      );
    });
  }, [leads, q, tab, processedFilter]);

  const filteredEventLeads = useMemo(() => {
    if (tab === 'website') return [];
    return eventLeads.filter(l => {
      if (processedFilter === 'processed' && !l.processed) return false;
      if (processedFilter === 'unprocessed' && l.processed) return false;
      if (!q) return true;
      return [l.email, l.company, l.contact_name, l.source_event, l.source_rep, l.phone].some(
        v => v && v.toLowerCase().includes(q)
      );
    });
  }, [eventLeads, q, tab, processedFilter]);

  const totalFiltered = filteredLeads.length + filteredEventLeads.length;

  /* ── CSV export ── */
  const exportCSV = useCallback(() => {
    const rows: string[][] = [];
    rows.push(['Typ', 'Email', 'Jméno', 'Firma', 'Telefon', 'Zdroj', 'Role', 'Velikost', 'Frekvence pulzů', 'Dátum']);

    filteredLeads.forEach(l => {
      const name = [l.first_name, l.last_name].filter(Boolean).join(' ') || l.name || '';
      rows.push(['Web', l.email, name, l.company || '', l.phone || '', l.source || '', l.role || '', l.company_size || '', '', formatDate(l.created_at)]);
    });

    filteredEventLeads.forEach(l => {
      rows.push(['Event', l.email, l.contact_name || '', l.company, l.phone || '', [l.source_event, l.source_src].filter(Boolean).join('/'), l.decision_role, l.employees_bucket, l.feedback_frequency, formatDate(l.created_at)]);
    });

    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `behavera-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exportováno');
  }, [filteredLeads, filteredEventLeads]);

  /* ── Loading / Error states ── */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <p className="text-sm text-brand-text-muted">Načítám leady…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-brand-error" />
        <p className="text-brand-error font-medium">{error}</p>
        <Button onClick={fetchLeads} variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Zkusit znovu</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary tracking-tight">Leady</h1>
          <p className="text-sm text-brand-text-muted mt-1">
            Všechny kontakty z webu i eventů • celkem {leads.length + eventLeads.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchLeads} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />Obnovit
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
            <Download className="w-3.5 h-3.5" />CSV
          </Button>
          <a href="/scan-qr" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-1.5 bg-brand-primary hover:bg-brand-primary/90">
              <QrCode className="w-3.5 h-3.5" />QR Signup
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Button>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard icon={Target} label="Web leady" value={leads.length} sub={todayLeads > 0 ? `+${todayLeads} dnes` : undefined} />
        <StatCard icon={Heart} label="Neziskovky" value={nonprofitCount} sub={nonprofitCount > 0 ? `${Math.round(nonprofitCount / Math.max(leads.length, 1) * 100)}%` : undefined} />
        <StatCard icon={QrCode} label="Event leady (QR)" value={eventLeads.length} sub={todayEvents > 0 ? `+${todayEvents} dnes` : undefined} />
        <StatCard icon={TrendingUp} label="Celkem" value={leads.length + eventLeads.length} />
        <StatCard icon={Calendar} label="Poslední lead" value={
          leads.length + eventLeads.length > 0
            ? formatDateShort(
                [...leads, ...eventLeads]
                  .map(l => l.created_at)
                  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
              )
            : '—'
        } />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Hledej email, firmu, jméno…"
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-1 bg-brand-background-secondary rounded-lg p-0.5">
          {([
            ['all', 'Vše', null] as const,
            ['website', 'Web', Globe] as const,
            ['event', 'Event', QrCode] as const,
          ]).map(([key, label, Icn]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5',
                tab === key
                  ? 'bg-white shadow-sm text-brand-primary'
                  : 'text-brand-text-muted hover:text-brand-text-primary'
              )}
            >
              {Icn && <Icn className="w-3 h-3" />}
              {label}
              <span className={cn(
                'ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full',
                tab === key ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-background-secondary text-brand-text-muted'
              )}>
                {key === 'all' ? leads.length + eventLeads.length : key === 'website' ? leads.length : eventLeads.length}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-brand-background-secondary rounded-lg p-0.5">
          {([
            ['all', 'Nezpracované', null, leads.filter(l => !l.processed).length + eventLeads.filter(l => !l.processed).length] as const,
            ['unprocessed', '⏳ Čeká', null, leads.filter(l => !l.processed).length + eventLeads.filter(l => !l.processed).length] as const,
            ['processed', '✅ Hotovo', null, leads.filter(l => l.processed).length + eventLeads.filter(l => l.processed).length] as const,
          ]).map(([key, label, , count]) => (
            <button
              key={key}
              onClick={() => setProcessedFilter(key as ProcessedFilter)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5',
                processedFilter === key
                  ? 'bg-white shadow-sm text-brand-primary'
                  : 'text-brand-text-muted hover:text-brand-text-primary'
              )}
            >
              {label}
              {key !== 'all' && (
                <span className={cn(
                  'ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full',
                  processedFilter === key ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-background-secondary text-brand-text-muted'
                )}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
        {q && (
          <span className="text-xs text-brand-text-muted">{totalFiltered} výsledků</span>
        )}
      </div>

      {/* Event Leads Table */}
      {(tab === 'all' || tab === 'event') && filteredEventLeads.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-600" />
              Event leady (QR)
              <Badge variant="outline" className="ml-auto text-xs">{filteredEventLeads.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-background-secondary/50">
                    <TableHead className="text-xs font-semibold w-10">✓</TableHead>
                    <TableHead className="text-xs font-semibold">Kontakt</TableHead>
                    <TableHead className="text-xs font-semibold">Firma</TableHead>
                    <TableHead className="text-xs font-semibold hidden md:table-cell">Velikost</TableHead>
                    <TableHead className="text-xs font-semibold hidden lg:table-cell">Role</TableHead>
                    <TableHead className="text-xs font-semibold hidden lg:table-cell">Pulzy</TableHead>
                    <TableHead className="text-xs font-semibold hidden xl:table-cell">Event / Zdroj</TableHead>
                    <TableHead className="text-xs font-semibold hidden md:table-cell">Souhlas</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Dátum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEventLeads.map(l => (
                    <TableRow key={l.id} className={cn('hover:bg-brand-background-secondary/30 transition-colors', l.processed && 'bg-green-50/60')}>
                      <TableCell>
                        <button
                          onClick={() => toggleProcessed(l.id, 'event_leads', l.processed)}
                          className="text-brand-text-muted hover:text-brand-primary transition-colors"
                          title={l.processed ? 'Označit jako nezpracované' : 'Označit jako zpracované'}
                        >
                          {l.processed ? <CheckSquare className="w-4 h-4 text-green-600" /> : <Square className="w-4 h-4" />}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          {l.contact_name && <div className="text-sm font-medium text-brand-text-primary">{l.contact_name}</div>}
                          <EmailLink email={l.email} />
                          {l.phone && (
                            <div className="flex items-center gap-1 text-xs text-brand-text-muted">
                              <Phone className="w-3 h-3" />{l.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-brand-text-muted shrink-0" />
                          <span className="text-sm font-medium">{l.company}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">{l.employees_bucket}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <RoleBadge role={l.decision_role} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <FrequencyBadge freq={l.feedback_frequency} />
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="space-y-0.5 text-xs text-brand-text-muted">
                          {l.source_event && <div>{l.source_event}</div>}
                          {l.source_rep && <div className="opacity-70">Rep: {l.source_rep}</div>}
                          {l.source_booth && <div className="opacity-70">Booth: {l.source_booth}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex gap-1">
                          {l.consent_contact && <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">Kontakt</Badge>}
                          {l.consent_marketing && <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">Marketing</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-xs text-brand-text-muted whitespace-nowrap">{formatDate(l.created_at)}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Website Leads Table */}
      {(tab === 'all' || tab === 'website') && filteredLeads.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-600" />
              Web leady
              <Badge variant="outline" className="ml-auto text-xs">{filteredLeads.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-brand-background-secondary/50">
                    <TableHead className="text-xs font-semibold w-10">✓</TableHead>
                    <TableHead className="text-xs font-semibold">Kontakt</TableHead>
                    <TableHead className="text-xs font-semibold">Firma</TableHead>
                    <TableHead className="text-xs font-semibold hidden md:table-cell">Velikost</TableHead>
                    <TableHead className="text-xs font-semibold hidden lg:table-cell">Role</TableHead>
                    <TableHead className="text-xs font-semibold hidden lg:table-cell">Zdroj</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Dátum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map(l => {
                    const name = [l.first_name, l.last_name].filter(Boolean).join(' ') || l.name || '';
                    return (
                      <TableRow key={l.id} className={cn('hover:bg-brand-background-secondary/30 transition-colors', l.processed && 'bg-green-50/60')}>
                        <TableCell>
                          <button
                            onClick={() => toggleProcessed(l.id, 'leads', l.processed)}
                            className="text-brand-text-muted hover:text-brand-primary transition-colors"
                            title={l.processed ? 'Označit jako nezpracované' : 'Označit jako zpracované'}
                          >
                            {l.processed ? <CheckSquare className="w-4 h-4 text-green-600" /> : <Square className="w-4 h-4" />}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            {name && <div className="text-sm font-medium text-brand-text-primary">{name}</div>}
                            <EmailLink email={l.email} />
                            {l.phone && (
                              <div className="flex items-center gap-1 text-xs text-brand-text-muted">
                                <Phone className="w-3 h-3" />{l.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {l.company ? (
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-brand-text-muted shrink-0" />
                              <span className="text-sm">{l.company}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-brand-text-muted">—</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {l.company_size ? (
                            <Badge variant="outline" className="text-xs">{l.company_size}</Badge>
                          ) : (
                            <span className="text-xs text-brand-text-muted">—</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm text-brand-text-secondary">{l.role || '—'}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <SourceBadge source={l.source} />
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-xs text-brand-text-muted whitespace-nowrap">{formatDate(l.created_at)}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {totalFiltered === 0 && !loading && (
        <Card>
          <CardContent className="py-16 text-center">
            <Filter className="w-10 h-10 text-brand-text-muted/40 mx-auto mb-3" />
            <p className="font-medium text-brand-text-secondary">Žádné leady</p>
            <p className="text-sm text-brand-text-muted mt-1">
              {q ? `Nic neodpovídá hledání "${q}"` : 'Zatím tu nic není.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* QR Code link section */}
      <Card className="border-dashed border-2 border-purple-200 bg-purple-50/30">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brand-text-primary">QR Signup stránka</h3>
            <p className="text-sm text-brand-text-muted mt-0.5">
              Použij tyhle odkazy pro zítřejší event. Můžeš přidat parametry <code className="text-xs bg-white px-1 py-0.5 rounded">?event=HR-Summit&amp;rep=Josef&amp;booth=A12</code>
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <a href="/scan-qr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-purple-700 bg-white px-3 py-1.5 rounded-md border border-purple-200 hover:bg-purple-50 transition-colors">
                <Globe className="w-3.5 h-3.5" />Mobilní verze
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
              <a href="/scan-qr?mode=kiosk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-purple-700 bg-white px-3 py-1.5 rounded-md border border-purple-200 hover:bg-purple-50 transition-colors">
                <QrCode className="w-3.5 h-3.5" />Kiosk mód
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/scan-qr');
                  toast.success('URL zkopírována');
                }}
                className="inline-flex items-center gap-1.5 text-sm text-brand-text-muted bg-white px-3 py-1.5 rounded-md border border-brand-border hover:bg-brand-background-secondary transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />Kopírovat URL
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
