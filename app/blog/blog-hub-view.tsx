'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Wand2,
  Eye,
  Pipette,
  Palette,
  RefreshCw,
  Code,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { TOOL_BLOGS, BlogArticle } from '@/data/tool-blogs';
import { TOOLS } from '@/lib/config/site';
import { useToolAdTransition } from '@/components/tool-ad-transition';

const CATEGORIES = [
  { id: 'all', label: 'All 13 Tool Guides' },
  { id: 'picker', label: 'Pickers & Sampling' },
  { id: 'palette', label: 'Palettes & Harmonies' },
  { id: 'accessibility', label: 'Accessibility & WCAG' },
  { id: 'convert', label: 'Converters & Names' },
  { id: 'code', label: 'CSS & Code Tokens' },
  { id: 'ai', label: 'AI Generation' },
] as const;

export function BlogHubView() {
  const { launchTool } = useToolAdTransition();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArticles = useMemo(() => {
    return TOOL_BLOGS.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' || article.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.toolName.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Featured article: AI Palette Generator or Contrast Checker
  const featuredArticle = TOOL_BLOGS.find((a) => a.id === 'blog-ai-palette-generator') || TOOL_BLOGS[0];

  return (
    <div className="space-y-10">
      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tool name, color model, WCAG, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 self-end sm:self-center font-medium">
            Showing <strong className="text-slate-900 dark:text-slate-100">{filteredArticles.length}</strong> of {TOOL_BLOGS.length} guides
          </div>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Banner (Shown when no search query and 'all' or 'ai' category is selected) */}
      {!searchQuery && (selectedCategory === 'all' || selectedCategory === 'ai') && (
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-300">
              <span className="uppercase tracking-wider font-semibold text-[11px] text-blue-400">Featured Tool Guide</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span>{featuredArticle.categoryLabel}</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span>{featuredArticle.readTime}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              <Link href={`/blog/${featuredArticle.slug}`} className="hover:text-blue-300 transition-colors">
                {featuredArticle.title.endsWith('.') ? featuredArticle.title : `${featuredArticle.title}.`}
              </Link>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3">
              {featuredArticle.summary}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={featuredArticle.toolPath}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
              >
                <span>Launch {featuredArticle.toolName}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </Link>
            </div>
          </div>
          {/* Subtle background ambient glow */}
          <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        </section>
      )}

      {/* Main Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 shadow-xs hover:shadow-md p-6"
          >
            <div className="space-y-4">
              {/* Clean metadata without pill boxes */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase text-[10px]">
                  {article.categoryLabel}
                </span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span>{article.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.publishedDate}</span>
                </div>
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title.endsWith('.') ? article.title : `${article.title}.`}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>

              {/* Key Features List Preview */}
              <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                {article.keyFeatures.slice(0, 2).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <Link
                href={`/blog/${article.slug}`}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href={article.toolPath}
                className="font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
                title={`Open ${article.toolName}`}
              >
                <span>Try Tool</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No tool guides found.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;. Try another term or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Direct Quick Tools Directory */}
      <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Launch Any Tool Directly.
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All 13 tools run locally in your browser with zero data tracking.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Browse Directory &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              onClick={(e) => {
                e.preventDefault();
                launchTool(tool.path, tool.name, tool.description);
              }}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                {tool.name}
              </div>
              <div className="text-[10px] text-slate-400 capitalize mt-1">
                {tool.category}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
