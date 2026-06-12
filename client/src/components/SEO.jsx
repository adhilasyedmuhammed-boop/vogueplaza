import { useEffect } from 'react';

/**
 * Lightweight SEO component - sets document title and meta description/og tags.
 * No extra dependency needed.
 */
export default function SEO({ title, description, image, url }) {
  useEffect(() => {
    const siteName = 'Vogue Plaza';
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Luxury Fashion & Lifestyle Store`;
    document.title = fullTitle;

    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const desc = description || 'Shop premium luxury fashion brands — Gucci, Prada, Versace, Armani, Burberry & more at Vogue Plaza. Authentic designer clothing, shoes, bags, watches & accessories.';

    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'website');
    if (image) setMeta('property', 'og:image', image);
    if (url) setMeta('property', 'og:url', url);
    setMeta('property', 'og:site_name', siteName);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    if (image) setMeta('name', 'twitter:image', image);
  }, [title, description, image, url]);

  return null;
}
