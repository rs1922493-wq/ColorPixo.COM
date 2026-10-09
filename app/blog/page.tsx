import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BlogHubView } from './blog-hub-view';
import { SITE_CONFIG } from '@/lib/config/site';
import { TOOL_BLOGS } from '@/data/tool-blogs';

export const metadata: Metadata = {
  title: 'Blog & Tool Guides — In-Depth Color Tutorials',
  description:
    'Comprehensive guides and tutorials for all 13 ColorPixo color tools. Learn color theory, WCAG contrast calculations, CSS token architecture, and image palette extraction.',
  alternates: {
    canonical: 'https://colorpixo.com/blog',
  },
  openGraph: {
    title: 'Color Tools Blog & Tutorials | ColorPixo',
    description:
      'Master color pickers, palette generators, WCAG contrast checkers, and CSS tokens with in-depth engineering and design tutorials.',
    url: 'https://colorpixo.com/blog',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Color%20Tools%20Blog%20%26%20Tutorials&subtitle=In-Depth%20Design%20Engineering%20Guides%20for%20ColorPixo%20Tools&badge=Blog',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Color Tools Blog & Tutorials',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Tools Blog & Tutorials | ColorPixo',
    description:
      'Master color pickers, palette generators, WCAG contrast checkers, and CSS tokens with in-depth engineering and design tutorials.',
    images: [
      'https://colorpixo.com/og?title=Color%20Tools%20Blog%20%26%20Tutorials&subtitle=In-Depth%20Design%20Engineering%20Guides%20for%20ColorPixo%20Tools&badge=Blog',
    ],
  },
};

export default function BlogIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'ColorPixo.Com Tools Blog',
    description:
      'In-depth guides, mathematical tutorials, and accessibility best practices for modern web color tools.',
    url: 'https://colorpixo.com/blog',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    blogPost: TOOL_BLOGS.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.summary,
      url: `${SITE_CONFIG.url}/blog/${article.slug}`,
      datePublished: article.publishedDate,
      dateModified: article.lastUpdated,
      author: {
        '@type': 'Person',
        name: article.author,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Blog' }]} />

        {/* Page Header */}
        <header className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span>Knowledge Base & Documentation</span>
            <span aria-hidden="true">·</span>
            <span>All 13 Tools Covered</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            COLORPIXO.COM Blog & Complete Tool Guides.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            In-depth technical guides, color science tutorials, WCAG accessibility benchmarks, and design token workflows covering every single tool on COLORPIXO.COM.
          </p>
        </header>

        {/* Interactive Blog Hub View with Search & Filtering */}
        <BlogHubView />
      </main>
    </>
  );
}
