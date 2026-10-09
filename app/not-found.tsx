import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, Pipette, Palette, Eye, Sparkles, Map } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Page Not Found | ColorPixo',
  description: 'The requested page or color tool does not exist on ColorPixo.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="space-y-3">
        <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
          404 — Page Not Found
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Color Code or Page Not Found.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          The page or color specification you requested could not be located. It may have been moved, renamed, or temporarily unavailable.
        </p>
      </div>

      {/* Main Home CTA */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
        <Link
          href="/html-sitemap"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 active:scale-95 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 transition-all"
        >
          <Map className="w-4 h-4 text-purple-500" />
          <span>Explore HTML Sitemap</span>
        </Link>
      </div>

      {/* Popular Tools Fast Track */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 max-w-2xl mx-auto space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Popular Free Color Tools.
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <Link
            href="/color-picker"
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-xs group"
          >
            <Pipette className="w-4 h-4 text-blue-500 mb-1.5" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
              Color Picker.
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              2D visual picker
            </p>
          </Link>

          <Link
            href="/palette-generator"
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-xs group"
          >
            <Palette className="w-4 h-4 text-purple-500 mb-1.5" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
              Palette Generator.
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              Harmonies & export
            </p>
          </Link>

          <Link
            href="/contrast-checker"
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-xs group"
          >
            <Eye className="w-4 h-4 text-cyan-500 mb-1.5" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
              Contrast Checker.
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              WCAG 2.1 AA/AAA
            </p>
          </Link>

          <Link
            href="/gradient-generator"
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-xs group"
          >
            <Sparkles className="w-4 h-4 text-amber-500 mb-1.5" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
              Gradients.
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              CSS gradient maker
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
