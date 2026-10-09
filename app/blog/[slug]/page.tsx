import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { TOOL_BLOGS, BlogArticle } from '@/data/tool-blogs';
import { TOOLS } from '@/lib/config/site';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_CONFIG } from '@/lib/config/site';
import { ArticleActions, CodeBlock, BlogToolLauncher } from './blog-article-client';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOL_BLOGS.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = TOOL_BLOGS.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Article Not Found — ColorPixo.Com',
    };
  }

  const pageUrl = `${SITE_CONFIG.url}/blog/${article.slug}`;

  const cleanTitle = article.metaTitle.replace(/\s*\|\s*ColorPixo(\.Com)?$/i, '');
  const ogImageUrl = `https://colorpixo.com/og?title=${encodeURIComponent(article.title)}&badge=${encodeURIComponent('Blog & Tutorial')}`;

  return {
    title: cleanTitle,
    description: article.metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      type: 'article',
      publishedTime: article.publishedDate,
      modifiedTime: article.lastUpdated,
      authors: [article.author],
      tags: article.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `ColorPixo — ${article.title}`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = TOOL_BLOGS.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const associatedTool = TOOLS.find((t) => t.id === article.toolId) || {
    id: article.toolId,
    name: article.toolName,
    path: article.toolPath,
    description: article.summary,
  };

  const relatedTools = TOOLS.filter((t) =>
    article.relatedToolSlugs.includes(t.slug)
  );

  const relatedArticles = TOOL_BLOGS.filter(
    (b) => b.slug !== article.slug && (b.category === article.category || article.relatedToolSlugs.includes(b.toolSlug))
  ).slice(0, 3);

  const pageUrl = `${SITE_CONFIG.url}/blog/${article.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.metaDescription,
    url: pageUrl,
    datePublished: article.publishedDate,
    dateModified: article.lastUpdated,
    author: {
      '@type': 'Person',
      name: article.author,
      jobTitle: article.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    keywords: article.tags.join(', '),
    about: {
      '@type': 'SoftwareApplication',
      name: article.toolName,
      url: `${SITE_CONFIG.url}${article.toolPath}`,
      applicationCategory: 'DesignApplication',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: article.title },
          ]}
        />

        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Tool Guides</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          {/* Metadata Row: Zero Pill Discipline */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">
              {article.categoryLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published {article.publishedDate}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Last updated {article.lastUpdated}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{article.author} ({article.authorRole})</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {article.title.endsWith('.') ? article.title : `${article.title}.`}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {article.summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <ArticleActions title={article.title} url={pageUrl} />

            {/* Quick launch link */}
            <Link
              href={article.toolPath}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Jump straight to {article.toolName} tool &rarr;</span>
            </Link>
          </div>
        </header>

        {/* Interactive Tool Launcher Callout Banner */}
        <section className="p-5 sm:p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Interactive Utility
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Try the {article.toolName} in your browser.
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
              Execute all steps described in this article with real-time feedback and exportable CSS code. 100% free and client-side.
            </p>
          </div>
          <Link
            href={article.toolPath}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Launch {article.toolName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </section>

        {/* Article Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Key Features Overview */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Key Capabilities & Features.
              </h3>
              <ul className="grid grid-cols-1 gap-2 text-xs text-slate-600 dark:text-slate-300">
                {article.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deep-Dive Editorial Sections */}
            <div className="space-y-8">
              {article.sections.map((section, idx) => (
                <section key={idx} className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {section.heading.endsWith('.') ? section.heading : `${section.heading}.`}
                  </h2>
                  {section.subheading && (
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {section.subheading.endsWith('.') ? section.subheading : `${section.subheading}.`}
                    </h3>
                  )}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {section.body}
                  </p>

                  {/* Bullet points if present */}
                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {section.bulletPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="leading-relaxed">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Callout box if present */}
                  {section.callout && (
                    <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs space-y-1 my-3">
                      <div className="font-bold flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{section.callout.title}</span>
                      </div>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        {section.callout.text}
                      </p>
                    </div>
                  )}

                  {/* Code example if present */}
                  {section.codeExample && (
                    <CodeBlock
                      code={section.codeExample.code}
                      language={section.codeExample.language}
                    />
                  )}
                </section>
              ))}
            </div>

            {/* Step-by-Step How-To Walkthrough */}
            <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Step-by-Step: How to Use the {article.toolName}.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {article.howToSteps.map((s) => (
                  <div
                    key={s.step}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                        {s.step}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {s.title.endsWith('.') ? s.title : `${s.title}.`}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-7">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Real-World Use Cases */}
            <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Practical Production Use Cases.
              </h2>
              <div className="space-y-3">
                {article.useCases.map((uc, uIdx) => (
                  <div
                    key={uIdx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1"
                  >
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {uc.title.endsWith('.') ? uc.title : `${uc.title}.`}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {uc.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Frequently Asked Questions */}
            <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Frequently Asked Questions.
                </h2>
              </div>
              <div className="space-y-3">
                {article.faqs.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {faq.question.endsWith('.') ? faq.question : `${faq.question}.`}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Takeaways Card */}
            <section className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white space-y-3 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400">
                Key Takeaways.
              </h2>
              <ul className="space-y-2 text-xs text-slate-300">
                {article.keyTakeaways.map((takeaway, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Tool Launcher Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Associated Tool
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {article.toolName}.
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {associatedTool.description}
              </p>
              <BlogToolLauncher
                path={article.toolPath}
                name={article.toolName}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <span>Open {article.toolName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </BlogToolLauncher>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Related Color Tools
                </div>
                <div className="space-y-2">
                  {relatedTools.map((rt) => (
                    <BlogToolLauncher
                      key={rt.id}
                      path={rt.path}
                      name={rt.name}
                      className="w-full text-left block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors group cursor-pointer"
                    >
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                        <span>{rt.name}</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {rt.description}
                      </div>
                    </BlogToolLauncher>
                  ))}
                </div>
              </div>
            )}

            {/* Other Blog Articles */}
            {relatedArticles.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  More Tool Guides.
                </div>
                <div className="space-y-2.5">
                  {relatedArticles.map((ra) => (
                    <Link
                      key={ra.id}
                      href={`/blog/${ra.slug}`}
                      className="block p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                        {ra.categoryLabel}
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mt-0.5">
                        {ra.title.endsWith('.') ? ra.title : `${ra.title}.`}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {ra.readTime}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Hub Directory Link */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Explore all 13 comprehensive guides and color tutorials.
              </p>
              <Link
                href="/blog"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View Blog Index</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
