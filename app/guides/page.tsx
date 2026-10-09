import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { GUIDES } from '@/data/guides';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Color Theory & Accessibility Guides',
  description:
    'Comprehensive educational articles on color models, WCAG 2.1 accessibility, color vision deficiency design, and UI token systems.',
  alternates: {
    canonical: 'https://colorpixo.com/guides',
  },
  openGraph: {
    title: 'Color Theory & Accessibility Guides | ColorPixo',
    description: 'Educational articles on color models, WCAG 2.1 accessibility, and UI token systems.',
    url: 'https://colorpixo.com/guides',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Color%20Theory%20%26%20Accessibility%20Guides&subtitle=Color%20Models%2C%20WCAG%202.1%2C%20CVD%20Design%20%26%20UI%20Tokens&badge=Guides',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Color Theory & Accessibility Guides',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Theory & Accessibility Guides | ColorPixo',
    description: 'Educational articles on color models, WCAG 2.1 accessibility, and UI token systems.',
    images: [
      'https://colorpixo.com/og?title=Color%20Theory%20%26%20Accessibility%20Guides&subtitle=Color%20Models%2C%20WCAG%202.1%2C%20CVD%20Design%20%26%20UI%20Tokens&badge=Guides',
    ],
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Guides' }]} />

      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Color Theory, Design Systems & Accessibility Guides.
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Comprehensive, mathematically grounded articles written for frontend developers, UI designers, and digital accessibility specialists.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50">
                  {guide.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {guide.readTime}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {guide.title.endsWith('.') ? guide.title : `${guide.title}.`}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {guide.excerpt}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span className="text-slate-400 font-normal">By {guide.author}</span>
              <span className="flex items-center gap-1">
                Read guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
