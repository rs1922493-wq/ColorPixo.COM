import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  HelpCircle,
  Mail,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FAQSection } from '@/components/faq-section';
import { FAQ_ITEMS } from '@/data/faq-data';
import { SITE_CONFIG } from '@/lib/config/site';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) — Color Tools & Privacy',
  description:
    'Find answers to common questions about ColorPixo tools, client-side image privacy, color spaces (HEX, RGB, HSL, CMYK), WCAG contrast calculations, and design token exports.',
  alternates: {
    canonical: 'https://colorpixo.com/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions (FAQ) | ColorPixo',
    description:
      'Answers to common questions about ColorPixo color tools, client-side privacy, color models, WCAG 2.1 accessibility, and export tokens.',
    url: 'https://colorpixo.com/faq',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Frequently%20Asked%20Questions&subtitle=Color%20Tools%2C%20Client-Side%20Privacy%20%26%20WCAG%20Calculations&badge=FAQ',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Frequently Asked Questions',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions (FAQ) | ColorPixo',
    description:
      'Answers to common questions about ColorPixo color tools, client-side privacy, color models, WCAG 2.1 accessibility, and export tokens.',
    images: [
      'https://colorpixo.com/og?title=Frequently%20Asked%20Questions&subtitle=Color%20Tools%2C%20Client-Side%20Privacy%20%26%20WCAG%20Calculations&badge=FAQ',
    ],
  },
};

export default function FAQPage() {
  // Generate FAQPage JSON-LD schema for Rich Snippets in Google Search
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Schema.org FAQ Structured Data for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'FAQ' }]} />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base & Support</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Quick answers to common questions about our color algorithms, client-side privacy architecture, WCAG contrast standards, and design token integration.
        </p>

        {/* Highlight Pills */}
        <div className="pt-2 flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> In-Browser Local Image Processing
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Free for Personal & Commercial Use
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-500" /> WCAG 2.1 AA/AAA Verified
          </span>
        </div>
      </div>

      {/* Main FAQ Section Accordion Component */}
      <FAQSection className="pt-2" />

      {/* Still Have Questions? Support Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-900 via-slate-900 to-slate-950 text-white border border-purple-800/40 shadow-xl space-y-6 relative overflow-hidden">
        <div className="max-w-xl space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Have a Specific Question?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Didn&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our engineering team is always eager to help. Whether you spotted a math discrepancy in color spaces or want to request a brand new color tool, send us a direct message.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span>Contact Support Desk</span>
          </Link>
          <a
            href="mailto:contact@colorpixo.com"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-colors"
          >
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Email contact@colorpixo.com</span>
          </a>
        </div>
      </div>

      {/* Related Explorations */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <Link
          href="/guides"
          className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 bg-white dark:bg-slate-900 transition-all group"
        >
          <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Color Theory Guides</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Deep dive into color wheels, harmonies, and psychology.
          </p>
        </Link>

        <Link
          href="/blog"
          className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 bg-white dark:bg-slate-900 transition-all group"
        >
          <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Engineering Articles</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Technical breakdowns of hex conversions and WCAG math.
          </p>
        </Link>

        <Link
          href="/tools"
          className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 bg-white dark:bg-slate-900 transition-all group"
        >
          <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Explore All 13+ Tools</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Palette generator, image picker, contrast auditor, and more.
          </p>
        </Link>
      </div>
    </div>
  );
}
