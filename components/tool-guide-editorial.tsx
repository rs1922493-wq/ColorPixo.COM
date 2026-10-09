import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Code2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { TOOL_BLOGS } from '@/data/tool-blogs';
import { GUIDES_DATABASE } from '@/data/guides';
import { TOOLS } from '@/lib/config/site';

interface ToolGuideEditorialProps {
  toolSlug: string;
}

export function ToolGuideEditorial({ toolSlug }: ToolGuideEditorialProps) {
  const article = TOOL_BLOGS.find(
    (b) => b.toolSlug === toolSlug || b.toolId === toolSlug || b.slug.startsWith(toolSlug)
  );

  if (!article) return null;

  const relatedTools = TOOLS.filter(
    (t) => article.relatedToolSlugs?.includes(t.slug) || (t.slug !== article.toolSlug && t.category === article.category)
  ).slice(0, 4);

  const relatedGuides = GUIDES_DATABASE.filter(
    (g) => g.relatedToolSlugs.includes(toolSlug) || g.relatedToolSlugs.includes(article.toolSlug)
  ).slice(0, 3);

  const toolJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `https://colorpixo.com/${article.toolSlug}#webapp`,
        name: `${article.toolName} — ColorPixo`,
        url: `https://colorpixo.com/${article.toolSlug}`,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'All',
        description: article.summary,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      ...(article.faqs && article.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              '@id': `https://colorpixo.com/${article.toolSlug}#faq`,
              mainEntity: article.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article className="w-full mt-12 pt-10 border-t border-slate-200 dark:border-slate-800 space-y-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      {/* Editorial Overview Section */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Comprehensive Tool Guide & Reference</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What Is the {article.toolName} & How Does It Work?
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {article.summary}
        </p>

        {article.keyFeatures && article.keyFeatures.length > 0 && (
          <div className="mt-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Core Capabilities & Technical Highlights.
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 dark:text-slate-200">
              {article.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Structured Sections */}
      {article.sections && article.sections.length > 0 && (
        <section className="space-y-8">
          {article.sections.map((section, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
            >
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {section.heading.endsWith('.') ? section.heading : `${section.heading}.`}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {section.body}
              </p>

              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {section.bulletPoints.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-2" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.callout && (
                <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40 text-xs sm:text-sm space-y-1">
                  <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{section.callout.title}</span>
                  </div>
                  <p className="text-purple-800 dark:text-purple-300 leading-relaxed">
                    {section.callout.text}
                  </p>
                </div>
              )}

              {section.codeExample && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Example Code ({section.codeExample.language.toUpperCase()})</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                    <code>{section.codeExample.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Step-by-Step How To Use */}
      {article.howToSteps && article.howToSteps.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            How to Use the {article.toolName} (Step-by-Step).
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {article.howToSteps.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {step.step}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {step.title.endsWith('.') ? step.title : `${step.title}.`}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Practical Use Cases */}
      {article.useCases && article.useCases.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Practical Use Cases in Digital Product Design.
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {article.useCases.map((uc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {uc.title.endsWith('.') ? uc.title : `${uc.title}.`}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {uc.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      {article.faqs && article.faqs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions About {article.toolName}.
            </h3>
          </div>
          <div className="space-y-3">
            {article.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all [&_summary::-webkit-details-marker]:hidden cursor-pointer"
              >
                <summary className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white select-none">
                  <span>{faq.question.endsWith('.') || faq.question.endsWith('?') ? faq.question : `${faq.question}.`}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    ↓
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools & Educational Links */}
      <section className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Related Color Tools in Studio.</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Combine this tool with our other free utilities to streamline your digital design workflow.
            </p>
          </div>
          <Link
            href={`/blog/${article.slug}`}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>Read full standalone article</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {relatedTools.map((rt) => (
            <Link
              key={rt.id}
              href={rt.path}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-xs group"
            >
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                {rt.name.endsWith('.') ? rt.name : `${rt.name}.`}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {rt.description}
              </p>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-2 inline-flex items-center gap-1">
                Open &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Related Educational Guides */}
      {relatedGuides.length > 0 && (
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Related In-Depth Color Guides.</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore foundational color theory, accessibility standards, and practical CSS tutorials.
              </p>
            </div>
            <Link
              href="/guides"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View all guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500 transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {guide.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-1 line-clamp-2">
                    {guide.title.endsWith('.') ? guide.title : `${guide.title}.`}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {guide.excerpt}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{guide.readTime}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Read &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
