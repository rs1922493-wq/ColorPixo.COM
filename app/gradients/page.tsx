'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Shuffle,
  ArrowRight,
  Search,
  Code,
  Sliders,
  Maximize2,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import { CURATED_GRADIENTS, CuratedGradient } from '@/data/gradients';
import { exportGradientPng } from '@/lib/export/export';
import { getRandomColor } from '@/lib/color/math';
import { AdSlot } from '@/components/ad-slot';
import { SITE_CONFIG } from '@/lib/config/site';

const GRADIENT_CATEGORIES = ['All', 'Vibrant', 'Sunset', 'Cool', 'Pastel', 'Dark'] as const;

export default function GradientsPage() {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live Random Gradient Playground Hero
  const [heroGradient, setHeroGradient] = useState<{
    color1: string;
    color2: string;
    angle: number;
  }>({
    color1: '#4FACFE',
    color2: '#00F2FE',
    angle: 90,
  });

  const rollHeroGradient = useCallback(() => {
    const c1 = getRandomColor();
    const c2 = getRandomColor();
    const angles = [45, 90, 135, 180, 225];
    const ang = angles[Math.floor(Math.random() * angles.length)];
    setHeroGradient({ color1: c1, color2: c2, angle: ang });
    showToast('Generated fresh random CSS gradient!');
  }, [showToast]);

  const filteredGradients = useMemo(() => {
    return CURATED_GRADIENTS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.stops.some((s) => s.color.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyCss = (css: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`background: ${css};`);
    setCopiedId(id);
    showToast(`Copied CSS gradient declaration!`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyTailwind = (css: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const tailwindClass = `bg-[${css.replace(/\s+/g, '_')}]`;
    navigator.clipboard.writeText(tailwindClass);
    showToast('Copied Tailwind arbitrary CSS class!');
  };

  const handleExportPng = (gradient: CuratedGradient, e: React.MouseEvent) => {
    e.stopPropagation();
    exportGradientPng(gradient.type, gradient.stops, gradient.angle);
    showToast(`Exported "${gradient.name}" as PNG image!`);
  };

  const heroCss = `linear-gradient(${heroGradient.angle}deg, ${heroGradient.color1} 0%, ${heroGradient.color2} 100%)`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      <Breadcrumbs items={[{ label: 'Gradients', href: '/gradients' }]} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Modern CSS Gradients • Linear, Radial & Multi-Stop</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            CSS Gradients Collection.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Curated high-contrast, harmonious CSS gradients for hero headers, UI cards, background meshes, and buttons. Copy clean CSS declarations or open in the Gradient Generator to customize angles and color stops.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/gradient-generator"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Gradient Generator Tool</span>
          </Link>
        </div>
      </div>

      {/* Hero Live Gradient Interactive Generator */}
      <div
        className="relative p-6 sm:p-8 rounded-3xl overflow-hidden shadow-xl border border-black/10 transition-all duration-300 flex flex-col justify-between min-h-[220px]"
        style={{ background: heroCss }}
      >
        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/40 text-white backdrop-blur-md">
            Interactive Generator
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={rollHeroGradient}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/50 hover:bg-black/70 active:scale-95 text-white text-xs font-bold backdrop-blur-md transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Roll Random</span>
            </button>
            <button
              onClick={(e) => handleCopyCss(heroCss, 'hero', e)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 active:scale-95 text-xs font-bold shadow-md transition-all"
            >
              {copiedId === 'hero' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy CSS</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="z-10 mt-6 sm:mt-10 max-w-xl">
          <div className="font-mono text-xs sm:text-sm font-bold text-white bg-black/40 px-3 py-2 rounded-xl backdrop-blur-md inline-block break-all border border-white/10">
            background: {heroCss};
          </div>
          <div className="mt-2 text-xs text-white/80 font-medium drop-shadow-xs">
            Angle: {heroGradient.angle}° • Color 1: {heroGradient.color1.toUpperCase()} • Color 2:{' '}
            {heroGradient.color2.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Categories Pill Nav */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {GRADIENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gradients or #hex..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredGradients.length}</strong> gradients
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </span>
          <span className="text-[11px]">Click &ldquo;Copy CSS&rdquo; for instant background rules</span>
        </div>
      </div>

      {/* Gradients Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGradients.map((gradient) => {
          const isCopied = copiedId === gradient.id;
          return (
            <div
              key={gradient.id}
              className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all"
            >
              {/* Visual Gradient Preview */}
              <div
                className="h-44 w-full relative flex items-end justify-between p-3.5 transition-transform duration-300"
                style={{ background: gradient.css }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-xs">
                    {gradient.type.toUpperCase()} • {gradient.angle}°
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleCopyCss(gradient.css, gradient.id, e)}
                    className="p-2 rounded-xl bg-black/50 hover:bg-black/70 active:scale-95 text-white backdrop-blur-md transition-all"
                    title="Copy CSS Background"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => handleExportPng(gradient, e)}
                    className="p-2 rounded-xl bg-black/50 hover:bg-black/70 active:scale-95 text-white backdrop-blur-md transition-all"
                    title="Export High-Res PNG"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Gradient Details & Controls */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {gradient.name.endsWith('.') ? gradient.name : `${gradient.name}.`}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {gradient.category}
                    </span>
                  </div>

                  {/* Stops Preview Dots */}
                  <div className="flex items-center -space-x-1.5">
                    {gradient.stops.map((stop, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-xs"
                        style={{ backgroundColor: stop.color }}
                        title={`${stop.color} at ${stop.offset}%`}
                      />
                    ))}
                  </div>
                </div>

                {/* CSS Code Snippet */}
                <div
                  onClick={(e) => handleCopyCss(gradient.css, gradient.id, e)}
                  className="cursor-pointer font-mono text-[11px] text-slate-600 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 truncate hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  title="Click to copy CSS"
                >
                  {gradient.css}
                </div>

                {/* Action Links */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={(e) => handleCopyTailwind(gradient.css, e)}
                    className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium flex items-center gap-1"
                    title="Copy Tailwind class"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Tailwind Class</span>
                  </button>

                  <Link
                    href="/gradient-generator"
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Customize in Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGradients.length === 0 && (
        <div className="text-center py-16 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Layers className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No gradients found matching &ldquo;{searchQuery}&rdquo;.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try searching for terms like &ldquo;sunset&rdquo;, &ldquo;neon&rdquo;, &ldquo;violet&rdquo;, or reset the active filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Ad slot (Optional - Production Safe) */}
      <AdSlot slotId={SITE_CONFIG.adsense.gradientsSlot} format="leaderboard" />

      {/* Gradient Educational Section */}
      <section className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            How Modern CSS Gradients Work.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Linear, Radial, and Conic CSS3 background functions explained
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Linear Gradients.
            </h3>
            <p>
              Linear gradients interpolate colors along an angled vector axis. Common angles include <code>90deg</code> (left to right), <code>180deg</code> (top to bottom), and <code>135deg</code> (diagonal top-left to bottom-right).
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Radial Gradients.
            </h3>
            <p>
              Radial gradients radiate outward from a central focal point. Great for button glows, spotlight highlights, and spherical atmospheric effects.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Color Stops & Offsets.
            </h3>
            <p>
              Stops specify where transition thresholds occur (e.g. <code>#FF512F 0%, #DD2476 100%</code>). You can add 3, 4, or 5 stops to create complex mesh-like sunset and aurora transitions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
