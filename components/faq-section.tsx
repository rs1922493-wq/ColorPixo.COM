'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  Search,
  X,
  ArrowRight,
  ShieldCheck,
  Palette,
  Sparkles,
  Eye,
  Download,
  Share2,
  Check,
} from 'lucide-react';
import { FAQ_ITEMS, FAQ_CATEGORIES, FAQItem } from '@/data/faq-data';

interface FAQSectionProps {
  previewLimit?: number;
  showViewAll?: boolean;
  initialCategory?: string;
  className?: string;
}

export function FAQSection({
  previewLimit,
  showViewAll = false,
  initialCategory = 'all',
  className = '',
}: FAQSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Set<string>>(
    // Open the first item by default
    new Set([FAQ_ITEMS[0]?.id || ''])
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setOpenIds(new Set(filteredItems.map((item) => item.id)));
  };

  const handleCollapseAll = () => {
    setOpenIds(new Set());
  };

  const copyQuestionLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/faq#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filter items based on category, search query, and preview limit
  let filteredItems = FAQ_ITEMS;

  if (selectedCategory !== 'all') {
    filteredItems = filteredItems.filter((item) => item.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredItems = filteredItems.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }

  if (previewLimit && previewLimit > 0) {
    filteredItems = filteredItems.slice(0, previewLimit);
  }

  const getCategoryBadge = (category: FAQItem['category']) => {
    switch (category) {
      case 'privacy':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3 h-3" /> Privacy
          </span>
        );
      case 'wcag':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
            <Eye className="w-3 h-3" /> WCAG
          </span>
        );
      case 'export':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
            <Download className="w-3 h-3" /> Code & Tokens
          </span>
        );
      case 'tools':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <Palette className="w-3 h-3" /> Color Tools
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <Sparkles className="w-3 h-3" /> General
          </span>
        );
    }
  };

  return (
    <section className={`space-y-6 ${className}`} aria-labelledby="faq-heading">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Frequently Asked Questions.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Everything you need to know about ColorPixo tools, mathematical precision, zero-upload privacy, and export tokens.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <button
            type="button"
            onClick={handleExpandAll}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-colors"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. privacy, contrast, tailwind, formats)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3" role="region" aria-label="FAQ Accordion">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isOpen = openIds.has(item.id);
            return (
              <div
                key={item.id}
                id={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-slate-900 border-purple-500/40 dark:border-purple-500/30 shadow-md ring-1 ring-purple-500/10'
                    : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                {/* Accordion Question Header */}
                <div className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-colors select-none group">
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer focus:outline-none rounded-lg"
                  >
                    <span className="shrink-0">{getCategoryBadge(item.category)}</span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.question}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Share / Copy link button */}
                    <button
                      type="button"
                      onClick={(e) => copyQuestionLink(item.id, e)}
                      title="Copy link to this answer"
                      aria-label="Copy link to this answer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Chevron expand/collapse toggle */}
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-label={isOpen ? 'Collapse answer' : 'Expand answer'}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 cursor-pointer ${
                        isOpen
                          ? 'rotate-180 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Accordion Answer Content */}
                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in slide-in-from-top-1 duration-150 space-y-3"
                  >
                    <p>{item.answer}</p>

                    {item.relatedToolPath && (
                      <div className="pt-2 flex items-center justify-start">
                        <Link
                          href={item.relatedToolPath}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          <span>Try {item.relatedToolName || 'related tool'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              No matching questions found
            </p>
            <p className="text-xs text-slate-500">
              Try searching with another keyword or select &ldquo;All Questions&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* View All Button if previewLimit */}
      {showViewAll && (
        <div className="pt-2 flex items-center justify-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <span>Explore All Frequently Asked Questions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
