import { BlogPost } from '@/lib/types';
import { useLanguage } from '@/app/LanguageContext';

/**
 * Returns a post with title / excerpt / content resolved
 * to the user's active language (CZ fields → Czech, default → English).
 */
export function useLocalizedPost(post: BlogPost | null) {
  const { language } = useLanguage();

  if (!post) return null;

  const isCz = language === 'cz';

  return {
    ...post,
    title: (isCz && post.title_cz) || post.title,
    excerpt: (isCz && post.excerpt_cz) || post.excerpt,
    content: (isCz && post.content_cz) || post.content,
  };
}

/** Localize an array of posts. */
export function useLocalizedPosts(posts: BlogPost[]) {
  const { language } = useLanguage();
  const isCz = language === 'cz';

  return posts.map((post) => ({
    ...post,
    title: (isCz && post.title_cz) || post.title,
    excerpt: (isCz && post.excerpt_cz) || post.excerpt,
    content: (isCz && post.content_cz) || post.content,
  }));
}
