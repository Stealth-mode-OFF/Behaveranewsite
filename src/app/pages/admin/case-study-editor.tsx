import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CmsService } from '@/lib/cms-service';
import { CaseStudyFormData } from '@/lib/types';
import { createSlug } from '@/lib/slug';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, Trash, Image as ImageIcon, Briefcase, Globe } from 'lucide-react';

type LangTab = 'en' | 'cz';

export function CaseStudyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [langTab, setLangTab] = useState<LangTab>('en');
  const isEditing = !!id;

  const { register, control, handleSubmit, setValue, watch } = useForm<CaseStudyFormData>({
    defaultValues: {
      status: 'draft',
      content: '',
      results: [{ label: '', value: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "results"
  });

  const title = watch('title');

  useEffect(() => {
    if (title && !isEditing) {
      setValue('slug', createSlug(title));
    }
  }, [title, isEditing, setValue]);

  useEffect(() => {
    if (isEditing && id) {
      CmsService.getCaseStudyById(id).then(study => {
        if (study) {
            setValue('clientName', study.clientName);
            setValue('industry', study.industry);
            setValue('title', study.title);
            setValue('slug', study.slug);
            setValue('challenge', study.challenge);
            setValue('solution', study.solution);
            setValue('content', study.content);
            setValue('coverImage', study.coverImage || '');
            setValue('results', study.results && study.results.length > 0 ? study.results : [{ label: '', value: '' }]);
            setValue('status', study.status);
            // CZ fields
            setValue('title_cz', study.title_cz || '');
            setValue('challenge_cz', study.challenge_cz || '');
            setValue('solution_cz', study.solution_cz || '');
            setValue('content_cz', study.content_cz || '');
            setValue('industry_cz', study.industry_cz || '');
            setValue('cardSummary', study.cardSummary || '');
            setValue('cardSummary_cz', study.cardSummary_cz || '');
        } else {
            toast.error('Case study not found');
            navigate('/admin/case-studies');
        }
      });
    }
  }, [id, isEditing, setValue, navigate]);

  const onSubmit = async (data: CaseStudyFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && id) {
        await CmsService.updateCaseStudy(id, data);
        toast.success('Case Study updated');
      } else {
        await CmsService.createCaseStudy(data);
        toast.success('Case Study created');
      }
      navigate('/admin/case-studies');
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const LangTabs = () => (
    <div className="flex gap-1 bg-brand-background-secondary/50 p-1 rounded-lg">
      {(['en', 'cz'] as const).map(lang => (
        <button
          key={lang}
          type="button"
          onClick={() => setLangTab(lang)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            langTab === lang
              ? 'bg-white text-brand-primary shadow-sm'
              : 'text-brand-text-muted hover:text-brand-text-secondary'
          }`}
        >
          <Globe className="w-3 h-3" />
          {lang === 'en' ? 'English' : 'Čeština'}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between sticky top-4 z-30 bg-white/80 backdrop-blur-md p-4 -mx-4 rounded-xl border border-brand-border/40 shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/case-studies')} className="hover:bg-brand-background-secondary text-brand-text-secondary">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
              <h1 className="text-xl font-bold tracking-tight text-brand-text-primary">
                {isEditing ? 'Edit Case Study' : 'New Case Study'}
              </h1>
              <p className="text-xs text-brand-text-muted">
                  Share a client success story
              </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Button onClick={handleSubmit(onSubmit)} disabled={isLoading} className="bg-brand-primary hover:bg-brand-primary-hover shadow-md min-w-[120px]">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Study'}
            </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        {/* Main Content */}
        <div className="space-y-6">
            <Card className="border-brand-border/60 shadow-sm">
                <CardHeader className="bg-brand-background-secondary/10 border-b border-brand-border/40 pb-4">
                    <CardTitle className="text-base font-semibold text-brand-text-secondary flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Client & Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Client Name</Label>
                            <Input {...register('clientName', { required: true })} placeholder="Acme Corp" className="border-brand-border/60 focus:ring-brand-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Industry (EN)</Label>
                            <Input {...register('industry')} placeholder="Tech, Health, etc." className="border-brand-border/60 focus:ring-brand-primary/20" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Case Study Title (EN)</Label>
                            <Input {...register('title', { required: true })} placeholder="How we saved..." className="border-brand-border/60 focus:ring-brand-primary/20 font-medium text-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Název (CZ)</Label>
                            <Input {...register('title_cz')} placeholder="Český název..." className="border-brand-border/60 focus:ring-brand-primary/20 font-medium text-lg" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-brand-text-secondary">Odvětví / Industry (CZ)</Label>
                        <Input {...register('industry_cz')} placeholder="Technologie, Zdravotnictví, atd." className="border-brand-border/60 focus:ring-brand-primary/20" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-brand-border/60 shadow-sm">
                <CardHeader className="bg-brand-background-secondary/10 border-b border-brand-border/40 pb-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base font-semibold text-brand-text-secondary">The Story</CardTitle>
                    <LangTabs />
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {langTab === 'en' ? (
                      <>
                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">The Challenge (EN)</Label>
                            <Textarea 
                                {...register('challenge')} 
                                placeholder="Describe the problem the client faced..." 
                                className="min-h-[100px] border-brand-border/60 focus:ring-brand-primary/20" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">The Solution (EN)</Label>
                            <Textarea 
                                {...register('solution')} 
                                placeholder="How did Echo Pulse solve it?" 
                                className="min-h-[100px] border-brand-border/60 focus:ring-brand-primary/20" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Card Summary (EN)</Label>
                            <Textarea 
                                {...register('cardSummary')} 
                                placeholder="Short summary for the card back..." 
                                className="min-h-[80px] border-brand-border/60 focus:ring-brand-primary/20" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Full Detailed Content (EN)</Label>
                            <div className="prose-editor min-h-[300px] border border-brand-border/60 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                                <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill 
                                        theme="snow" 
                                        value={field.value} 
                                        onChange={field.onChange} 
                                        className="h-[250px] mb-12"
                                        placeholder="Tell the full story..."
                                    />
                                )}
                                />
                            </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Výzva (CZ)</Label>
                            <Textarea 
                                {...register('challenge_cz')} 
                                placeholder="Popište problém, kterému klient čelil..." 
                                className="min-h-[100px] border-brand-border/60 focus:ring-brand-primary/20" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Řešení (CZ)</Label>
                            <Textarea 
                                {...register('solution_cz')} 
                                placeholder="Jak Echo Pulse problém vyřešil?" 
                                className="min-h-[100px] border-brand-border/60 focus:ring-brand-primary/20" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Shrnutí na kartě (CZ)</Label>
                            <Textarea 
                                {...register('cardSummary_cz')} 
                                placeholder="Krátké shrnutí pro zadní stranu karty..." 
                                className="min-h-[80px] border-brand-border/60 focus:ring-brand-primary/20" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Kompletní obsah (CZ)</Label>
                            <div className="prose-editor min-h-[300px] border border-brand-border/60 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                                <Controller
                                name="content_cz"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill 
                                        theme="snow" 
                                        value={field.value || ''} 
                                        onChange={field.onChange} 
                                        className="h-[250px] mb-12"
                                        placeholder="Napište celý příběh česky..."
                                    />
                                )}
                                />
                            </div>
                        </div>
                      </>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            <Card className="border-brand-border/60 shadow-sm">
                <CardHeader className="bg-brand-background-secondary/10 border-b border-brand-border/40 py-4">
                    <CardTitle className="text-sm font-semibold text-brand-text-secondary uppercase tracking-wider">Publishing</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                    <Label className="text-brand-text-secondary text-sm">Status</Label>
                    <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="border-brand-border/60 focus:ring-brand-primary/20">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                        </Select>
                    )}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-brand-text-secondary text-sm">URL Slug</Label>
                    <Input 
                        {...register('slug')} 
                        placeholder="url-friendly-slug" 
                        className="border-brand-border/60 focus:ring-brand-primary/20 font-mono text-xs"
                    />
                </div>

                <div className="space-y-3 pt-4 border-t border-brand-border/40">
                     <Label className="text-brand-text-secondary text-sm">Cover Image</Label>
                     <div className="relative">
                        <Input 
                            {...register('coverImage')} 
                            placeholder="https://..." 
                            className="pl-8 border-brand-border/60 focus:ring-brand-primary/20 text-xs"
                        />
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-text-muted">
                            <ImageIcon className="w-3 h-3" />
                        </div>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card className="border-brand-border/60 shadow-sm bg-brand-primary/5 border-brand-primary/20">
                <CardHeader className="py-4 border-b border-brand-primary/10 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-bold text-brand-primary uppercase tracking-wider">Key Results</CardTitle>
                    <Button type="button" variant="ghost" size="sm" onClick={() => append({ label: '', value: '' })} className="h-6 w-6 p-0 rounded-full hover:bg-brand-primary/20 text-brand-primary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {fields.length === 0 && (
                        <p className="text-xs text-brand-text-muted text-center italic py-2">Add metrics to highlight success</p>
                    )}
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start animate-in slide-in-from-right-2 duration-300">
                            <div className="flex-1 space-y-1">
                                <Input 
                                    {...register(`results.${index}.value` as const)} 
                                    placeholder="Value (e.g. 30%)" 
                                    className="h-8 text-sm font-bold text-brand-primary border-brand-primary/20 focus:border-brand-primary bg-white" 
                                />
                                <Input 
                                    {...register(`results.${index}.label` as const)} 
                                    placeholder="Label (e.g. ROI)" 
                                    className="h-7 text-xs border-brand-border/60 bg-white/50" 
                                />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 text-brand-error/60 hover:text-brand-error hover:bg-brand-error/10 mt-1">
                                <Trash className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
