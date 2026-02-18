import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CmsService } from '@/lib/cms-service';
import { BlogPost } from '@/lib/types';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Plus, Pencil, Trash2, Eye, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';

export function PostList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await CmsService.getAllPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredPosts(
        posts.filter(p => 
            p.title.toLowerCase().includes(lowerQuery) || 
            p.author.name.toLowerCase().includes(lowerQuery)
        )
    );
  }, [searchQuery, posts]);

  const handleDelete = async (id: string) => {
      if(!confirm("Are you sure you want to delete this post?")) return;
      try {
          await CmsService.deletePost(id);
          toast.success("Post deleted");
          loadPosts();
      } catch {
          toast.error("Failed to delete");
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand-text-primary">Blog Posts</h1>
            <p className="text-brand-text-secondary">Manage your articles and insights.</p>
        </div>
        <Button asChild className="bg-brand-primary hover:bg-brand-primary-hover shadow-md">
          <Link to="/admin/posts/new">
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
                    placeholder="Search posts..." 
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
                <TableHead className="font-semibold text-brand-text-secondary">Title</TableHead>
                <TableHead className="font-semibold text-brand-text-secondary">Author</TableHead>
                <TableHead className="font-semibold text-brand-text-secondary">Status</TableHead>
                <TableHead className="font-semibold text-brand-text-secondary">Published</TableHead>
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
                        Loading content...
                    </TableCell>
                </TableRow>
                ) : filteredPosts.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-brand-text-muted">
                        No posts found matching your criteria.
                    </TableCell>
                </TableRow>
                ) : (
                filteredPosts.map((post) => (
                    <TableRow key={post.id} className="border-brand-border/40 hover:bg-brand-background-secondary/20 transition-colors group">
                    <TableCell className="font-medium text-brand-text-primary">
                        <div className="line-clamp-1">{post.title}</div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            {post.author.avatar && (
                                <img src={post.author.avatar} alt="" className="w-6 h-6 rounded-full" />
                            )}
                            <span className="text-brand-text-secondary text-sm">{post.author.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary" className={`
                            ${post.status === 'published' 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}
                            font-medium border-0
                        `}>
                        {post.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-brand-text-muted text-sm">
                        {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/10" asChild>
                                <Link to={`/blog/${post.slug}`} target="_blank" title="View Live">
                                    <Eye className="w-4 h-4" />
                                </Link>
                            </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/10" asChild>
                            <Link to={`/admin/posts/edit/${post.id}`} title="Edit">
                            <Pencil className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-text-muted hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(post.id)} title="Delete">
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
}
