import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
}

export const useSEO = ({
  title,
  description,
  keywords,
  ogImage = '/og-image.png',
  ogType = 'website',
  canonicalUrl,
}: SEOProps) => {
  useEffect(() => {
    // Update title
    document.title = `${title} | Behavera Echo Pulse`;

    // Helper to set/update meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic meta tags
    setMeta('description', description);
    if (keywords) {
      setMeta('keywords', keywords);
    }

    // Open Graph tags
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:image', ogImage, true);
    
    if (canonicalUrl) {
      setMeta('og:url', canonicalUrl, true);
      
      // Canonical link
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // Cleanup - restore default title on unmount
    return () => {
      document.title = 'Behavera - AI-Powered People Analytics';
    };
  }, [title, description, keywords, ogImage, ogType, canonicalUrl]);
};
