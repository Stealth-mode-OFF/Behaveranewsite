import React, { useEffect, useState } from 'react';
import { CmsService } from '@/lib/cms-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { FileText, Briefcase, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

export const Dashboard = () => {
  const [stats, setStats] = useState({ posts: 0, caseStudies: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      CmsService.getPosts(),
      CmsService.getCaseStudies()
    ]).then(([posts, studies]) => {
      setStats({
        posts: posts.length,
        caseStudies: studies.length
      });
      setLoading(false);
    });
  }, []);

  type StatCardProps = {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    to: string;
    colorClass: string;
  };

  const StatCard = ({ title, value, icon: Icon, to, colorClass }: StatCardProps) => (
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
            <span className="text-brand-success font-medium flex items-center">
                +2 <ArrowUpRight className="w-3 h-3" />
            </span>
            <span>this month</span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-brand-border/30">
            <Button variant="ghost" size="sm" className="w-full justify-between text-xs hover:bg-brand-background-secondary group-hover:text-brand-primary p-0 h-auto" asChild>
                <Link to={to}>
                    Manage Content <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-brand-text-primary">Dashboard</h1>
        <p className="text-brand-text-secondary">Overview of your content performance and status.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Total Posts" 
            value={stats.posts} 
            icon={FileText} 
            to="/admin/posts"
            colorClass="bg-blue-500"
        />
        <StatCard 
            title="Case Studies" 
            value={stats.caseStudies} 
            icon={Briefcase} 
            to="/admin/case-studies"
            colorClass="bg-brand-primary"
        />
        {/* Mock Stats for visual balance */}
        <StatCard 
            title="Total Views" 
            value="12.5k" 
            icon={TrendingUp} 
            to="#"
            colorClass="bg-brand-accent"
        />
        <StatCard 
            title="Active Authors" 
            value="4" 
            icon={Users} 
            to="#"
            colorClass="bg-green-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="border-brand-border/60 shadow-sm">
             <CardHeader>
                 <CardTitle className="text-lg">Recent Activity</CardTitle>
                 <CardDescription>Latest updates to your content.</CardDescription>
             </CardHeader>
             <CardContent>
                 <div className="space-y-4">
                     {[1,2,3].map((i) => (
                         <div key={i} className="flex items-center gap-4 pb-4 border-b border-brand-border/30 last:border-0 last:pb-0">
                             <div className="w-2 h-2 rounded-full bg-brand-primary/40" />
                             <div className="flex-1">
                                 <div className="text-sm font-medium text-brand-text-primary">Updated "The Future of Work"</div>
                                 <div className="text-xs text-brand-text-muted">2 hours ago • Sarah Connor</div>
                             </div>
                         </div>
                     ))}
                 </div>
             </CardContent>
         </Card>
         
         <Card className="border-brand-border/60 shadow-sm bg-brand-primary/5 border-none">
             <CardHeader>
                 <CardTitle className="text-lg text-brand-primary">Quick Actions</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
                 <Button className="w-full justify-start bg-white text-brand-primary hover:bg-white/80 border border-brand-primary/10" asChild>
                     <Link to="/admin/posts/new">
                        <FileText className="w-4 h-4 mr-2" /> Write New Article
                     </Link>
                 </Button>
                 <Button className="w-full justify-start bg-white text-brand-primary hover:bg-white/80 border border-brand-primary/10" asChild>
                     <Link to="/admin/case-studies/new">
                        <Briefcase className="w-4 h-4 mr-2" /> Add Case Study
                     </Link>
                 </Button>
             </CardContent>
         </Card>
      </div>
    </div>
  );
};
