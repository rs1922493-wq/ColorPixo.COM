'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Pipette, Palette, Sparkles, BookOpen, Layers, ArrowRight, Newspaper } from 'lucide-react';
import { TOOLS } from '@/lib/config/site';
import { COLOR_NAMES_DATABASE } from '@/lib/color/names';
import { POPULAR_COLORS } from '@/data/popular-colors';
import { GUIDES_DATABASE } from '@/data/guides';
import { TOOL_BLOGS } from '@/data/tool-blogs';
import { useToolAdTransition } from './tool-ad-transition';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const { launchTool } = useToolAdTransition();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const isHexSearch = /^#?[0-9a-fA-F]{3,8}$/.test(query.trim());
  const cleanHex = isHexSearch ? query.trim().replace(/^#/, '').toUpperCase() : '';

  // Filter tools
  const matchingTools = TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );

  // Filter popular colors
  const matchingPopular = POPULAR_COLORS.filter(
    (c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q)
  );

  // Filter named colors (up to 8)
  const matchingNamed = q
    ? COLOR_NAMES_DATABASE.filter(
        (c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q)
      ).slice(0, 8)
    : [];

  // Filter guides
  const matchingGuides = GUIDES_DATABASE.filter(
    (g) => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
  );

  // Filter tool blogs
  const matchingBlogs = TOOL_BLOGS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.summary.toLowerCase().includes(q) ||
      b.toolName.toLowerCase().includes(q) ||
      b.tags.some((tag) => tag.toLowerCase().includes(q))
  );

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, colors (e.g. Navy, Crimson, #3B82F6), or guides..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4">
          {/* Direct Hex Jump */}
          {cleanHex && (
            <div className="p-2">
              <button
                onClick={() => handleSelect(`/color/${cleanHex}`)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800/50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg shadow-inner border border-black/10 shrink-0"
                    style={{ backgroundColor: `#${cleanHex}` }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      Inspect Color #{cleanHex}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      View full conversions, contrast ratios, shades, and tints
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          )}

          {/* Tools */}
          {matchingTools.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Tools ({matchingTools.length})
              </div>
              <div className="mt-1 space-y-1">
                {matchingTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onClose();
                      launchTool(tool.path, tool.name, tool.description);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                        <Pipette className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {tool.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {tool.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {tool.shortcut && (
                        <kbd className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-slate-700 uppercase">
                          {tool.shortcut}
                        </kbd>
                      )}
                      {tool.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Colors & Named Swatches */}
          {(matchingPopular.length > 0 || matchingNamed.length > 0) && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Colors
              </div>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {matchingPopular.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => handleSelect(`/colors/${c.slug}`)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div
                      className="w-7 h-7 rounded-lg shrink-0 border border-black/10 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {c.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{c.hex}</div>
                    </div>
                  </button>
                ))}
                {matchingNamed.map((c) => (
                  <button
                    key={`${c.name}-${c.hex}`}
                    onClick={() => handleSelect(`/color/${c.hex.replace('#', '')}`)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div
                      className="w-7 h-7 rounded-lg shrink-0 border border-black/10 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {c.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{c.hex}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tool Blogs */}
          {matchingBlogs.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Tool Blogs & Guides
              </div>
              <div className="mt-1 space-y-1">
                {matchingBlogs.map((blog) => (
                  <button
                    key={blog.slug}
                    onClick={() => handleSelect(`/blog/${blog.slug}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Newspaper className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {blog.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {blog.toolName} • {blog.readTime}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guides */}
          {matchingGuides.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Guides & Articles
              </div>
              <div className="mt-1 space-y-1">
                {matchingGuides.map((guide) => (
                  <button
                    key={guide.slug}
                    onClick={() => handleSelect(`/guides/${guide.slug}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {guide.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {guide.category} • {guide.readTime}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {q &&
            matchingTools.length === 0 &&
            matchingPopular.length === 0 &&
            matchingNamed.length === 0 &&
            matchingGuides.length === 0 &&
            matchingBlogs.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-500">
                No direct matches found for &quot;{query}&quot;. Try searching for &quot;picker&quot;, &quot;contrast&quot;, &quot;emerald&quot;, or enter a hex code like #FF5733.
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
