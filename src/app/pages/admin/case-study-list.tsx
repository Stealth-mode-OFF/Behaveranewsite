import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { CaseStudy } from '@/lib/types';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Plus, Pencil, Trash2, Eye, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';

export const CaseStudyList = () => {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [filteredStudies, setFilteredStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadStudies = async () => {
    setIsLoading(true);
    try {
      const data = await CmsService.getCaseStudies();
      setStudies(data);
      setFilteredStudies(data);
    } catch (error) {
      toast.error('Failed to load case studies');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudies();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredStudies(
        studies.filter(s => 
            s.title.toLowerCase().includes(lowerQuery) || 
            s.clientName.toLowerCase().includes(lowerQuery)
        )
    );
  }, [searchQuery, studies]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand-text-primary">Case Studies</h1>
            <p className="text-brand-text-secondary">Showcase your success stories and client results.</p>
        </div>
        <Button asChild className="bg-brand-primary hover:bg-brand-primary-hover shadow-md">
          <Link to="/admin/case-studies/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Link>
        </Button>
      </div>

      <Card className="border-brand-border/60 shadow-sm">
        <div className="p-4 border-b border-brand-border/40 bg-brand-background-secondary/10 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <Input 
                    placeholder="Search clients or titles..." 
                    className="pl-9 border-brand-border/60 focus:ring-brand-primary/20 bg-white" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 text-brand-text-secondary border-brand-border/60">
                <Filter className="w-4 h-4" />
            </Button>
        </div>
        <div className="rounded-md">
            <Table>
            <TableHeader className="bg-brand-background-secondary/30">
                <TableRow className="border-brand-border/40 hover:bg-transparent">
                <TableHead className="font-semibold text-brand-text-secondary">Client</TableHead>
                <TableHead className="font-semibold text-brand-text-secondary">Title</TableHead>
                <TableHead className="font-semibold text-brand-text-secondary">Industry</TableHead>
                <TableHead className="font-semibold text-brand-text-secondary">Status</TableHead>
                <TableHead className="text-right font-semibold text-brand-text-secondary">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-brand-text-muted">
                        <div className="flex justify-center mb-2">
                             <div className="w-6 h-6 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                        </div>
                        Loading case studies...
                    </TableCell>
                </TableRow>
                ) : filteredStudies.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-brand-text-muted">
                        No case studies found.
                    </TableCell>
                </TableRow>
                ) : (
                filteredStudies.map((study) => (
                    <TableRow key={study.id} className="border-brand-border/40 hover:bg-brand-background-secondary/20 transition-colors group">
                    <TableCell className="font-bold text-brand-text-primary">
                        {study.clientName}
                    </TableCell>
                    <TableCell className="text-brand-text-secondary font-medium">
                        <div className="line-clamp-1">{study.title}</div>
                    </TableCell>
                    <TableCell className="text-brand-text-muted text-sm">
                        {study.industry}
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary" className={`
                            ${study.status === 'published' 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}
                            font-medium border-0
                        `}>
                        {study.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/10" asChild>
                                <Link to={`/case-studies/${study.slug}`} target="_blank" title="View Live">
                                    <Eye className="w-4 h-4" />
                                </Link>
                            </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/10" asChild>
                            <Link to={`/admin/case-studies/edit/${study.id}`} title="Edit">
                            <Pencil className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-text-muted hover:text-red-600 hover:bg-red-50" onClick={() => toast.info('Delete functionality placeholder')} title="Delete">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        </div>
                    </TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
            </Table>
        </div>
      </Card>
    </div>
  );
};
