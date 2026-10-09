import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { TOOLS } from '@/lib/config/site';
import { POPULAR_COLORS } from '@/data/popular-colors';
import { GUIDES } from '@/data/guides';
import { TOOL_BLOGS } from '@/data/tool-blogs';

export const metadata: Metadata = {
  title: 'HTML Sitemap — Complete Directory',
  description: 'Complete index of all COLORPIXO.COM tools, color profiles, tool blog articles, color theory guides, and legal pages.',
  alternates: {
    canonical: 'https://colorpixo.com/html-sitemap',
  },
  openGraph: {
    title: 'HTML Sitemap — Complete Directory | ColorPixo',
    description: 'Complete index of all ColorPixo tools, color profiles, tool blog articles, color theory guides, and legal pages.',
    url: 'https://colorpixo.com/html-sitemap',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=HTML%20Sitemap&subtitle=Complete%20Directory%20of%20All%20Tools%2C%20Guides%2C%20Colors%20%26%20Articles&badge=Directory',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — HTML Sitemap',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML Sitemap — Complete Directory | ColorPixo',
    description: 'Complete index of all ColorPixo tools, color profiles, tool blog articles, color theory guides, and legal pages.',
    images: [
      'https://colorpixo.com/og?title=HTML%20Sitemap&subtitle=Complete%20Directory%20of%20All%20Tools%2C%20Guides%2C%20Colors%20%26%20Articles&badge=Directory',
    ],
  },
};

export default function HtmlSitemapPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'HTML Sitemap' }]} />

      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          COLORPIXO.COM HTML Sitemap & Complete Index.
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Comprehensive directory of every tool, tool blog article, color code reference, educational guide, and legal document on COLORPIXO.COM.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Tools Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Interactive Tools (13).
          </h2>
          <ul className="space-y-2 text-xs">
            {TOOLS.map((t) => (
              <li key={t.id}>
                <Link
                  href={t.path}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tool Blogs Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Tool Blogs & Tutorials ({TOOL_BLOGS.length}).
          </h2>
          <ul className="space-y-2 text-xs">
            <li>
              <Link
                href="/blog"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                All 13 Tool Guides Hub &rarr;
              </Link>
            </li>
            {TOOL_BLOGS.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/blog/${b.slug}`}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline line-clamp-1"
                >
                  {b.toolName} Guide
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Colors Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Popular Colors ({POPULAR_COLORS.length}).
          </h2>
          <ul className="space-y-2 text-xs">
            {POPULAR_COLORS.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/colors/${c.slug}`}
                  className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.hex }} />
                  <span>{c.name} ({c.hex})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Guides & Legal Section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Color Theory Guides ({GUIDES.length}).
            </h2>
            <ul className="space-y-2 text-xs">
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:underline"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Trust & Legal.
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:underline">
                  About ColorPixo.Com
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 dark:text-slate-300 hover:underline">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-slate-600 dark:text-slate-300 hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-slate-600 dark:text-slate-300 hover:underline">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-slate-600 dark:text-slate-300 hover:underline">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-slate-600 dark:text-slate-300 hover:underline">
                  Disclaimer & Mathematical Notice
                </Link>
              </li>
              <li>
                <Link href="/advertising-policy" className="text-slate-600 dark:text-slate-300 hover:underline">
                  Advertising Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility-statement" className="text-slate-600 dark:text-slate-300 hover:underline">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link href="/data-usage" className="text-slate-600 dark:text-slate-300 hover:underline">
                  Data Usage & Architecture
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-600 dark:text-slate-300 hover:underline">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
