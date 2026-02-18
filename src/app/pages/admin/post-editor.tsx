import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CmsService } from '@/lib/cms-service';
import { BlogPostFormData } from '@/lib/types';
import { createSlug } from '@/lib/slug';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, Image as ImageIcon, Globe } from 'lucide-react';

type LangTab = 'en' | 'cz';

export function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [langTab, setLangTab] = useState<LangTab>('en');
  const isEditing = !!id;

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogPostFormData>({
    defaultValues: {
      status: 'draft',
      content: '',
      content_cz: '',
      tags: []
    }
  });

  const title = watch('title');

  useEffect(() => {
    if (title && !isEditing) {
      setValue('slug', createSlug(title));
    }
  }, [title, isEditing, setValue]);

  useEffect(() => {
    if (isEditing && id) {
      CmsService.getPostById(id).then(post => {
        if (post) {
            setValue('title', post.title);
            setValue('slug', post.slug);
            setValue('excerpt', post.excerpt);
            setValue('content', post.content);
            setValue('coverImage', post.coverImage || '');
            setValue('tags', post.tags || []);
            setValue('status', post.status);
            setValue('title_cz', post.title_cz || '');
            setValue('excerpt_cz', post.excerpt_cz || '');
            setValue('content_cz', post.content_cz || '');
        }
      });
    }
  }, [id, isEditing, setValue]);

  const onSubmit = async (data: BlogPostFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && id) {
        await CmsService.updatePost(id, data);
        toast.success('Post updated successfully');
      } else {
        await CmsService.createPost(data);
        toast.success('Post created successfully');
      }
      navigate('/admin/posts');
    } catch {
      toast.error('Failed to save post');
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/posts')} className="hover:bg-brand-background-secondary text-brand-text-secondary">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
              <h1 className="text-xl font-bold tracking-tight text-brand-text-primary">
                {isEditing ? 'Edit Post' : 'New Post'}
              </h1>
              <p className="text-xs text-brand-text-muted">
                  {isEditing ? 'Make changes to your article' : 'Drafting a new insight'}
              </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex" disabled>
                <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={isLoading} className="bg-brand-primary hover:bg-brand-primary-hover shadow-md min-w-[120px]">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Post'}
            </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        {/* Main Content Column */}
        <div className="space-y-6">
            <Card className="border-brand-border/60 shadow-sm overflow-hidden">
                <CardHeader className="bg-brand-background-secondary/10 border-b border-brand-border/40 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base font-semibold text-brand-text-secondary">Article Content</CardTitle>
                    <LangTabs />
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {langTab === 'en' ? (
                      <>
                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Title (EN)</Label>
                            <Input 
                                {...register('title', { required: true })} 
                                placeholder="Enter a catchy title..." 
                                className="text-lg font-medium border-brand-border/60 focus:ring-brand-primary/20 h-12"
                            />
                            {errors.title && <span className="text-brand-error text-xs">Title is required</span>}
                        </div>
                    
                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Body Content (EN)</Label>
                            <div className="prose-editor min-h-[500px] border border-brand-border/60 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                                <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill 
                                        theme="snow" 
                                        value={field.value} 
                                        onChange={field.onChange} 
                                        className="h-[450px] mb-12"
                                        placeholder="Write your story here..."
                                    />
                                )}
                                />
                            </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Název (CZ)</Label>
                            <Input 
                                {...register('title_cz')} 
                                placeholder="Zadejte český název článku..." 
                                className="text-lg font-medium border-brand-border/60 focus:ring-brand-primary/20 h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-brand-text-secondary">Obsah (CZ)</Label>
                            <div className="prose-editor min-h-[500px] border border-brand-border/60 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                                <Controller
                                name="content_cz"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill 
                                        theme="snow" 
                                        value={field.value || ''} 
                                        onChange={field.onChange} 
                                        className="h-[450px] mb-12"
                                        placeholder="Napište český obsah článku..."
                                    />
                                )}
                                />
                            </div>
                        </div>
                      </>
                    )}
                </CardContent>
            </Card>

            <Card className="border-brand-border/60 shadow-sm">
                 <CardHeader className="bg-brand-background-secondary/10 border-b border-brand-border/40 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base font-semibold text-brand-text-secondary">SEO & Excerpt</CardTitle>
                    <LangTabs />
                </CardHeader>
                <CardContent className="p-6">
                    {langTab === 'en' ? (
                      <div className="space-y-2">
                        <Label className="text-brand-text-secondary">Excerpt (EN)</Label>
                        <Textarea 
                            {...register('excerpt')} 
                            placeholder="Short summary for list views and SEO..." 
                            className="min-h-[100px] border-brand-border/60 focus:ring-brand-primary/20 resize-none" 
                        />
                        <p className="text-xs text-brand-text-muted text-right">Recommended: 150-160 characters</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label className="text-brand-text-secondary">Výtah (CZ)</Label>
                        <Textarea 
                            {...register('excerpt_cz')} 
                            placeholder="Krátké shrnutí článku pro výpis a SEO..." 
                            className="min-h-[100px] border-brand-border/60 focus:ring-brand-primary/20 resize-none" 
                        />
                        <p className="text-xs text-brand-text-muted text-right">Doporučeno: 150-160 znaků</p>
                      </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Sidebar Column */}
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
            </CardContent>
          </Card>

          <Card className="border-brand-border/60 shadow-sm">
            <CardHeader className="bg-brand-background-secondary/10 border-b border-brand-border/40 py-4">
                <CardTitle className="text-sm font-semibold text-brand-text-secondary uppercase tracking-wider">Media</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <Label className="text-brand-text-secondary text-sm">Cover Image</Label>
                <div className="border-2 border-dashed border-brand-border hover:border-brand-primary/40 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-brand-background-secondary/20">
                    <ImageIcon className="w-8 h-8 text-brand-text-muted mb-2" />
                    <span className="text-xs text-brand-text-secondary font-medium">Click to upload</span>
                    <span className="text-[10px] text-brand-text-muted mt-1">or drag and drop</span>
                </div>
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
                <p className="text-[10px] text-brand-text-muted leading-tight">
                    Paste an image URL or configure Supabase Storage to enable direct uploads.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
