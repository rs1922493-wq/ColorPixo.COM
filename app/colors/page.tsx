import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';
import { POPULAR_COLORS } from '@/data/popular-colors';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Popular Colors Directory — Meanings, Codes & Palettes',
  description:
    'Explore curated popular colors: Navy, Crimson, Emerald, Amber, Royal Blue, Teal, and more. Complete hex codes, color psychology, and UI pairings.',
  alternates: {
    canonical: 'https://colorpixo.com/colors',
  },
  openGraph: {
    title: 'Popular Colors Directory — Meanings, Codes & Palettes | ColorPixo',
    description: 'Explore curated popular colors, hex codes, color psychology, and UI pairings.',
    url: 'https://colorpixo.com/colors',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Popular%20Colors%20Directory&subtitle=Meanings%2C%20Hex%20Codes%2C%20Color%20Psychology%20%26%20Palettes&badge=Colors',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Popular Colors Directory',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Popular Colors Directory — Meanings, Codes & Palettes | ColorPixo',
    description: 'Explore curated popular colors, hex codes, color psychology, and UI pairings.',
    images: [
      'https://colorpixo.com/og?title=Popular%20Colors%20Directory&subtitle=Meanings%2C%20Hex%20Codes%2C%20Color%20Psychology%20%26%20Palettes&badge=Colors',
    ],
  },
};

export default function ColorsIndexPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Colors' }]} />

      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Popular Colors & Visual Psychology.
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Deep-dive guides for the most influential digital design colors. Discover historical origins, emotional resonance, accessibility contrast scores, and harmonized pairings.
        </p>
      </div>

      {/* Popular Colors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_COLORS.map((color) => (
          <Link
            key={color.slug}
            href={`/colors/${color.slug}`}
            className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
          >
            {/* Color Swatch Header */}
            <div
              className="h-36 w-full relative p-4 flex flex-col justify-between"
              style={{ backgroundColor: color.hex }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-xs">
                  {color.family || 'Popular Hue'}
                </span>
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-black/30 text-white backdrop-blur-xs">
                  {color.hex}
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {color.name.endsWith('.') ? color.name : `${color.name}.`}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                  {color.meaning}
                </p>
              </div>

              {/* Sample Pairing Chips */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {(color.pairings || []).slice(0, 3).map((p, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: p.hex }}
                      title={`${p.name} (${p.hex})`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  View guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
