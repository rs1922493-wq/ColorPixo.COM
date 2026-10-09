import { SITE_AUTHOR } from '@/lib/config/site';
import { EXPANDED_EXISTING_GUIDES, GuideArticle } from './guides-data-existing';
import { NEW_ORIGINAL_GUIDES } from './guides-data-new';

export type { GuideArticle };

export const GUIDES_DATABASE: GuideArticle[] = [
  ...EXPANDED_EXISTING_GUIDES,
  ...NEW_ORIGINAL_GUIDES,
];

export const GUIDES = GUIDES_DATABASE.map((g) => ({
  slug: g.slug,
  title: g.title,
  excerpt: g.excerpt,
  readTime: g.readTime,
  category: g.category,
  author: SITE_AUTHOR.name,
  publishedDate: '2026-09-20',
  lastUpdated: g.lastUpdated,
  relatedToolSlugs: g.relatedToolSlugs,
  sections: g.content.map((c) => ({
    heading: c.heading,
    content: c.body,
    callout: c.callout,
    codeExample: c.codeExample,
  })),
}));
