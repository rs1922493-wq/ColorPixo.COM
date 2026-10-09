'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Pipette,
  Layers,
  Palette,
  Sparkles,
  Eye,
  Sliders,
  Code,
  Wand2,
  Search,
  ArrowRight,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { TOOLS } from '@/lib/config/site';
import { useToolAdTransition } from '@/components/tool-ad-transition';

const CATEGORIES = [
  { id: 'all', label: 'All 13 Tools' },
  { id: 'picking', label: 'Picking & Extraction' },
  { id: 'palettes', label: 'Palettes & Harmonies' },
  { id: 'accessibility', label: 'Accessibility & Vision' },
  { id: 'code', label: 'Design Tokens & Code' },
  { id: 'smart', label: 'Smart AI' },
];

export default function ToolsIndexPage() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [query, setQuery] = useState('');
  const { launchTool } = useToolAdTransition();

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = selectedCat === 'all' || tool.category === selectedCat;
    const matchesQuery =
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Tools' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Color Toolkit Directory.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Explore 13 free, browser-local color utilities for web developers, UI/UX designers, accessibility engineers, and students.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter tools..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCat === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            onClick={(e) => {
              e.preventDefault();
              launchTool(tool.path, tool.name, tool.description);
            }}
            className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 cursor-pointer text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Pipette className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  {tool.shortcut && (
                    <kbd
                      title={`Press '${tool.shortcut.toUpperCase()}' to quickly launch`}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80 uppercase shadow-2xs"
                    >
                      {tool.shortcut}
                    </kbd>
                  )}
                  {tool.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {tool.badge}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name.endsWith('.') ? tool.name : `${tool.name}.`}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Launch tool</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 text-slate-400 text-sm">
          No tools found matching &quot;{query}&quot;.
        </div>
      )}
    </div>
  );
}
