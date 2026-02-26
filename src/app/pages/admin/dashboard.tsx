import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { CmsService } from '@/lib/cms-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { FileText, Briefcase, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

export function Dashboard() {
  const [postsCount, setPostsCount] = useState(0);
  const [caseStudiesCount, setCaseStudiesCount] = useState(0);
  const [postsThisMonth, setPostsThisMonth] = useState(0);
  const [caseStudiesThisMonth, setCaseStudiesThisMonth] = useState(0);
  const [recentItems, setRecentItems] = useState<Array<{ label: string; title: string; date: string; href: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      CmsService.getAllPosts(),
      CmsService.getAllCaseStudies(),
    ]).then(([posts, studies]) => {
      setPostsCount(posts.length);
      setCaseStudiesCount(studies.length);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      setPostsThisMonth(posts.filter((p) => new Date(p.publishedAt) >= monthStart).length);
      setCaseStudiesThisMonth(studies.filter((s) => new Date(s.publishedAt) >= monthStart).length);

      const combined = [
        ...posts.map((p) => ({
          label: 'Článek',
          title: p.title,
          date: p.publishedAt,
          href: `/admin/posts/edit/${p.id}`,
        })),
        ...studies.map((s) => ({
          label: 'Případová studie',
          title: s.clientName,
          date: s.publishedAt,
          href: `/admin/case-studies/edit/${s.id}`,
        })),
      ]
        .filter((item) => item.date)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentItems(combined);
      setLoading(false);
    });
  }, []);

  type StatCardProps = {
    title: string;
    value: number | string;
    icon: ComponentType<{ className?: string }>;
    to: string;
    colorClass: string;
    monthCount: number;
  };

  const StatCard = ({ title, value, icon: Icon, to, colorClass, monthCount }: StatCardProps) => (
    <Card className="card-hover border-brand-border/60 shadow-sm relative overflow-hidden group">
      <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500", colorClass)} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-semibold text-brand-text-secondary uppercase tracking-wider">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg bg-opacity-10", colorClass.replace('bg-', 'bg-opacity-10 text-'))}>
          <Icon className={cn("h-4 w-4", colorClass.replace('bg-', 'text-'))} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        {loading ? (
          <div className="h-8 w-16 bg-brand-background-secondary animate-pulse rounded" />
        ) : (
          <div className="text-3xl font-bold text-brand-text-primary mb-1">{value}</div>
        )}
        <div className="text-xs text-brand-text-muted flex items-center gap-1">
          <span className="text-brand-text-secondary">Tento měsíc:</span>
          <span className="text-brand-text-primary font-medium">{monthCount}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-brand-border/30">
          <Button variant="ghost" size="sm" className="w-full justify-between text-xs hover:bg-brand-background-secondary group-hover:text-brand-primary p-0 h-auto" asChild>
            <Link to={to}>
              Spravovat <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const formattedRecent = useMemo(() => {
    return recentItems.map((item) => ({
      ...item,
      dateLabel: new Date(item.date).toLocaleDateString('cs-CZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    }));
  }, [recentItems]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-brand-text-primary">Přehled</h1>
        <p className="text-brand-text-secondary">Přehled obsahu a stavu administrace.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <StatCard
          title="Články"
          value={postsCount}
          icon={FileText}
          to="/admin/posts"
          colorClass="bg-blue-500"
          monthCount={postsThisMonth}
        />
        <StatCard
          title="Případové studie"
          value={caseStudiesCount}
          icon={Briefcase}
          to="/admin/case-studies"
          colorClass="bg-brand-primary"
          monthCount={caseStudiesThisMonth}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-brand-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Poslední aktivita</CardTitle>
            <CardDescription>Poslední změny obsahu.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-brand-background-secondary/50 rounded" />
                ))}
              </div>
            ) : formattedRecent.length === 0 ? (
              <div className="text-sm text-brand-text-muted">Zatím žádná aktivita.</div>
            ) : (
              <div className="space-y-4">
                {formattedRecent.map((item) => (
                  <div key={`${item.label}-${item.title}`} className="flex items-center gap-4 pb-4 border-b border-brand-border/30 last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-brand-primary/40" />
                    <div className="flex-1">
                      <Link to={item.href} className="text-sm font-medium text-brand-text-primary hover:text-brand-primary transition-colors">
                        {item.label}: {item.title}
                      </Link>
                      <div className="text-xs text-brand-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.dateLabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-brand-border/60 shadow-sm bg-brand-primary/5 border-none">
          <CardHeader>
            <CardTitle className="text-lg text-brand-primary">Rychlé akce</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-white text-brand-primary hover:bg-white/80 border border-brand-primary/10" asChild>
              <Link to="/admin/posts/new">
                <FileText className="w-4 h-4 mr-2" /> Napsat článek
              </Link>
            </Button>
            <Button className="w-full justify-start bg-white text-brand-primary hover:bg-white/80 border border-brand-primary/10" asChild>
              <Link to="/admin/case-studies/new">
                <Briefcase className="w-4 h-4 mr-2" /> Přidat případovou studii
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
