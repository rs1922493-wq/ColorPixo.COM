import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, User, ArrowLeft, ArrowRight, Share2, Bookmark } from 'lucide-react';
import { GUIDES } from '@/data/guides';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_AUTHOR, TOOLS } from '@/lib/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: 'Guide Not Found | ColorPixo.Com' };

  const pageUrl = `https://colorpixo.com/guides/${guide.slug}`;
  const ogImageUrl = `https://colorpixo.com/og?title=${encodeURIComponent(guide.title)}&badge=${encodeURIComponent('Color Guide')}`;

  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: pageUrl,
      type: 'article',
      publishedTime: guide.publishedDate,
      modifiedTime: guide.lastUpdated,
      authors: [SITE_AUTHOR.name],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `ColorPixo Guide — ${guide.title}`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const pageUrl = `https://colorpixo.com/guides/${guide.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: guide.title,
    description: guide.excerpt,
    url: pageUrl,
    datePublished: guide.publishedDate,
    dateModified: guide.lastUpdated,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      jobTitle: SITE_AUTHOR.role,
      url: SITE_AUTHOR.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ColorPixo.Com',
      url: 'https://colorpixo.com',
    },
  };

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Guides', href: '/guides' },
          { label: guide.title },
        ]}
      />

      {/* Article Header */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 w-fit inline-block">
          {guide.category}
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {guide.title.endsWith('.') ? guide.title : `${guide.title}.`}
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {guide.excerpt}
        </p>

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-500" />
            <span>By {guide.author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Published {guide.publishedDate}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Last updated {guide.lastUpdated}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{guide.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8 text-slate-800 dark:text-slate-200 leading-relaxed">
        {guide.sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {section.heading.endsWith('.') ? section.heading : `${section.heading}.`}
            </h2>
            <div className="text-sm sm:text-base leading-relaxed space-y-4 text-slate-700 dark:text-slate-300">
              {section.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            {section.callout && (
              <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600 text-xs sm:text-sm text-blue-950 dark:text-blue-100 font-medium">
                {section.callout}
              </div>
            )}

            {section.codeExample && (
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                <pre>{section.codeExample}</pre>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Related Interactive Color Tools */}
      {guide.relatedToolSlugs && guide.relatedToolSlugs.length > 0 && (
        <section className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Try the Color Tools Mentioned in This Guide.
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Put this knowledge into practice with our free, browser-based utilities.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TOOLS.filter((t) => guide.relatedToolSlugs?.includes(t.slug))
              .slice(0, 3)
              .map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name.endsWith('.') ? tool.name : `${tool.name}.`}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 inline-flex items-center gap-1">
                    Open Tool &rarr;
                  </span>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Link
          href="/guides"
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Guides Directory
        </Link>
        <Link
          href="/tools"
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Explore All Interactive Tools <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
