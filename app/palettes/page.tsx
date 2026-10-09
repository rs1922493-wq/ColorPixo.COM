'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Palette,
  Copy,
  Check,
  Download,
  Bookmark,
  Shuffle,
  Sparkles,
  ArrowRight,
  Search,
  Code,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import { CURATED_PALETTES, CuratedPalette } from '@/data/curated-palettes';
import { exportPalettePng, downloadText } from '@/lib/export/export';
import { saveFavoritePalette, getStoredFavorites, removeFavoritePalette } from '@/lib/storage/store';
import { getRandomColor, getContrastRatio } from '@/lib/color/math';
import { AdSlot } from '@/components/ad-slot';
import { SITE_CONFIG } from '@/lib/config/site';

const CATEGORIES = [
  'All',
  'Modern & Clean',
  'Warm & Earthy',
  'Ocean & Cold',
  'Vibrant & Neon',
  'Pastel & Soft',
  'Dark & Moody',
] as const;

export default function PalettesPage() {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [savedPaletteIds, setSavedPaletteIds] = useState<Set<string>>(new Set());

  // Quick Random Interactive Generator at top
  const [randomPalette, setRandomPalette] = useState<string[]>([
    '#3B82F6',
    '#60A5FA',
    '#93C5FD',
    '#2563EB',
    '#1D4ED8',
  ]);

  // Load saved favorites
  useEffect(() => {
    try {
      const favs = getStoredFavorites();
      const ids = new Set((favs.palettes || []).map((p) => p.id));
      setSavedPaletteIds(ids);
    } catch {
      // ignore in SSR / localstorage disabled
    }
  }, []);

  const generateRandomRoll = useCallback(() => {
    const newColors = Array.from({ length: 5 }, () => getRandomColor());
    setRandomPalette(newColors);
    showToast('Generated fresh 5-color palette!');
  }, [showToast]);

  // Keyboard shortcut: Spacebar to generate random palette when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        generateRandomRoll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateRandomRoll]);

  const filteredPalettes = useMemo(() => {
    return CURATED_PALETTES.filter((palette) => {
      const matchesCategory =
        selectedCategory === 'All' || palette.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        palette.name.toLowerCase().includes(q) ||
        palette.category.toLowerCase().includes(q) ||
        palette.colors.some((c) => c.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyColor = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopiedHex(hex);
    showToast(`Copied ${hex.toUpperCase()} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleCopyCssVars = (palette: CuratedPalette, e: React.MouseEvent) => {
    e.stopPropagation();
    const cssVars = `:root {\n${palette.colors
      .map((c, i) => `  --color-${palette.id}-${i + 1}: ${c};`)
      .join('\n')}\n}`;
    navigator.clipboard.writeText(cssVars);
    showToast(`Copied CSS Variables for "${palette.name}"!`);
  };

  const handleCopyTailwind = (palette: CuratedPalette, e: React.MouseEvent) => {
    e.stopPropagation();
    const tailwind = `// tailwind.config.js\ntheme: {\n  extend: {\n    colors: {\n      '${palette.id}': {\n${palette.colors
      .map((c, i) => `        ${(i + 1) * 100}: '${c}',`)
      .join('\n')}\n      },\n    },\n  },\n},`;
    navigator.clipboard.writeText(tailwind);
    showToast(`Copied Tailwind config for "${palette.name}"!`);
  };

  const toggleFavorite = (palette: CuratedPalette, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = savedPaletteIds.has(palette.id);
    if (isSaved) {
      removeFavoritePalette(palette.id);
      setSavedPaletteIds((prev) => {
        const next = new Set(prev);
        next.delete(palette.id);
        return next;
      });
      showToast(`Removed "${palette.name}" from favorites`);
    } else {
      saveFavoritePalette({
        id: palette.id,
        name: palette.name,
        colors: palette.colors,
      });
      setSavedPaletteIds((prev) => new Set(prev).add(palette.id));
      showToast(`Saved "${palette.name}" to favorites!`);
    }
  };

  const handleExportPng = (palette: CuratedPalette, e: React.MouseEvent) => {
    e.stopPropagation();
    exportPalettePng(palette.colors, palette.name);
    showToast(`Exported "${palette.name}" PNG image!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      <Breadcrumbs items={[{ label: 'Palettes', href: '/palettes' }]} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Curated Design Tokens • 100% Free & Open</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Color Palettes & Color Schemes.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Explore hundreds of handcrafted, harmonious color palettes for web apps, branding, graphic design, and UI kits. Export to CSS, Tailwind, or PNG swatches with one click.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/palette-generator"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Palette className="w-4 h-4" />
            <span>Open Custom Generator</span>
          </Link>
          <Link
            href="/ai-palette-generator"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Mood Themes</span>
          </Link>
        </div>
      </div>

      {/* Quick Interactive Spacebar Generator Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Instant Roll
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                Press <kbd className="font-mono text-white">Space</kbd> to shuffle
              </span>
            </div>
            <h2 className="text-lg font-bold">Quick Inspiration Generator.</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateRandomRoll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle (Space)</span>
            </button>
            <Link
              href={`/palette-generator?base=${encodeURIComponent(randomPalette[0])}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold transition-all"
            >
              <span>Fine-tune in Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Swatch Display */}
        <div className="grid grid-cols-5 gap-2 h-20 sm:h-24 rounded-2xl overflow-hidden shadow-inner">
          {randomPalette.map((hex, idx) => {
            const contrastWhite = getContrastRatio(hex, '#FFFFFF');
            const textColor = contrastWhite >= 4.5 ? '#FFFFFF' : '#000000';
            return (
              <button
                key={idx}
                onClick={(e) => handleCopyColor(hex, e)}
                className="h-full w-full relative group transition-transform hover:scale-[1.02] flex flex-col justify-end p-2 sm:p-3 text-left"
                style={{ backgroundColor: hex }}
                title={`Click to copy ${hex}`}
              >
                <div
                  className="font-mono text-[11px] sm:text-xs font-bold drop-shadow-xs truncate"
                  style={{ color: textColor }}
                >
                  {copiedHex === hex ? '✓ Copied' : hex.toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Categories Pill Nav */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {CATEGORIES.map((cat) => (
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
              placeholder="Search by name, vibe or #hex..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredPalettes.length}</strong> palettes
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </span>
          <span className="text-[11px]">Click any color bar to copy HEX</span>
        </div>
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPalettes.map((palette) => {
          const isSaved = savedPaletteIds.has(palette.id);
          return (
            <div
              key={palette.id}
              className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all"
            >
              {/* Interactive Color Bars */}
              <div className="grid grid-cols-5 h-28 w-full">
                {palette.colors.map((hex, i) => {
                  const isCopied = copiedHex === hex;
                  return (
                    <button
                      key={i}
                      onClick={(e) => handleCopyColor(hex, e)}
                      className="h-full w-full relative group/swatch transition-all hover:scale-105 hover:z-10 focus:outline-none"
                      style={{ backgroundColor: hex }}
                      title={`Copy ${hex}`}
                    >
                      <div className="opacity-0 group-hover/swatch:opacity-100 absolute inset-0 flex items-center justify-center bg-black/40 text-white font-mono text-[10px] font-bold backdrop-blur-xs transition-opacity p-1 text-center">
                        {isCopied ? '✓' : hex.toUpperCase()}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Palette Details & Controls */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {palette.name.endsWith('.') ? palette.name : `${palette.name}.`}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {palette.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => toggleFavorite(palette, e)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved
                          ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/60'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      onClick={(e) => handleExportPng(palette, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Export as PNG card"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hex values preview bar */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1 py-1 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
                  {palette.colors.map((c, i) => (
                    <span
                      key={i}
                      onClick={(e) => handleCopyColor(c, e)}
                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
                    >
                      {c.toUpperCase()}
                    </span>
                  ))}
                </div>

                {/* Bottom action row */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCopyCssVars(palette, e)}
                      className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium flex items-center gap-1"
                      title="Copy :root CSS custom properties"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>CSS</span>
                    </button>
                    <button
                      onClick={(e) => handleCopyTailwind(palette, e)}
                      className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium flex items-center gap-1"
                      title="Copy Tailwind extend colors object"
                    >
                      <span>Tailwind</span>
                    </button>
                  </div>

                  <Link
                    href={`/palette-generator?base=${encodeURIComponent(palette.colors[0])}`}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Edit in Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPalettes.length === 0 && (
        <div className="text-center py-16 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Palette className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No palettes found matching &ldquo;{searchQuery}&rdquo;.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try searching for other keywords like &ldquo;retro&rdquo;, &ldquo;ocean&rdquo;, &ldquo;slate&rdquo;, or reset the category filter.
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
      <AdSlot slotId={SITE_CONFIG.adsense.palettesSlot} format="leaderboard" />

      {/* Design Guide / FAQs */}
      <section className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Color Palette Theory & Best Practices.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            How to apply the 60-30-10 rule and accessibility guidelines to your UI projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              The 60-30-10 Rule.
            </h3>
            <p>
              In interior and UI design, use 60% dominant neutral color for backgrounds, 30% secondary color for cards and structural elements, and 10% accent color for interactive CTAs, badges, and focal highlights.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              WCAG 2.1 Contrast.
            </h3>
            <p>
              Always test text colors against their background. WCAG AA requires a 4.5:1 ratio for regular text and 3:1 for large text (18pt+) or UI controls. AAA demands 7:1 for maximum readability.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Tailwind Token Integration.
            </h3>
            <p>
              Click &ldquo;Tailwind&rdquo; on any palette above to copy a drop-in <code>theme.extend.colors</code> object. You can paste it directly into your <code>tailwind.config.js</code> or CSS theme.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
