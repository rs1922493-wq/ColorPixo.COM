'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Pipette,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Sliders,
  Eye,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  Copy,
  Layers,
  Heart,
  Bookmark,
  Shuffle,
  RefreshCw,
  Star,
  ExternalLink,
} from 'lucide-react';
import { AdSlot } from '@/components/ad-slot';
import { useToast } from '@/components/toast-context';
import { useToolAdTransition } from '@/components/tool-ad-transition';
import { POPULAR_COLORS } from '@/data/popular-colors';
import { GUIDES } from '@/data/guides';
import { TOOLS, SITE_CONFIG } from '@/lib/config/site';
import { LearnAboutColors } from '@/components/learn-about-colors';
import { FAQSection } from '@/components/faq-section';
import { HomeWatermark } from '@/components/home-watermark';

const BRAND_HERO_PALETTE = ['#7C3AED', '#EC4899', '#06B6D4', '#10B981', '#F59E0B'];

export function HomeClient() {
  const { showToast } = useToast();
  const { launchTool } = useToolAdTransition();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const primaryTools = [
    {
      id: 'color-picker',
      name: 'Advanced Color Picker',
      description: '2D saturation/brightness canvas, hue slider, and two-way HEX, RGB, HSL, HSV, CMYK conversions.',
      path: '/color-picker',
      icon: Pipette,
      color: 'from-purple-500 to-indigo-600',
      shortcut: 'P',
    },
    {
      id: 'color-converter',
      name: 'Color Converter',
      description: 'Mathematically precise live conversion between HEX, RGB, HSL, HSV, and CMYK models.',
      path: '/color-converter',
      icon: RefreshCw,
      color: 'from-blue-500 to-cyan-500',
      shortcut: 'C',
    },
    {
      id: 'palette-generator',
      name: 'Palette Generator',
      description: 'Generate monochromatic, complementary, analogous, triadic, split-complementary, and tetradic schemes.',
      path: '/palette-generator',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      shortcut: 'L',
    },
    {
      id: 'gradient-generator',
      name: 'Gradient Generator',
      description: 'Create multi-stop linear and radial gradients with custom angles and copyable CSS syntax.',
      path: '/gradient-generator',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      shortcut: 'G',
    },
    {
      id: 'color-shades',
      name: 'Color Shades & Tints',
      description: 'Generate 10 lighter tints, 10 darker shades, and 10 desaturated tones with full CSS variables.',
      path: '/color-shades',
      icon: Layers,
      color: 'from-teal-500 to-emerald-600',
      shortcut: 'S',
    },
    {
      id: 'contrast-checker',
      name: 'Contrast Checker',
      description: 'Real-time WCAG 2.1 AA/AAA contrast evaluation with relative luminance calculation and auto-tuner.',
      path: '/contrast-checker',
      icon: Eye,
      color: 'from-violet-500 to-purple-600',
      badge: 'WCAG 2.1',
      shortcut: 'W',
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Icon Watermark Layer */}
      <HomeWatermark />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16">
        {/* Hero Section */}
        <section className="relative pt-6 pb-8 sm:pt-12 sm:pb-12 text-center space-y-6">
          {/* Quality Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Modern Online Color Toolkit • Privacy-First • WCAG 2.1 Contrast Testing</span>
          </div>

          {/* Brand Name & Tagline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Free Online Color Tools, Color Picker &amp; Palette Generator.
            </h1>

            {/* Trustpilot Review Rating Pill matching exact user design */}
            <div className="flex items-center justify-center pt-1">
              <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-4 md:gap-5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 border-purple-200 dark:border-purple-700/80 bg-white/95 dark:bg-slate-900/90 shadow-xs backdrop-blur-xs">
                {/* 5 Yellow Stars + Question */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-amber-400 text-amber-400 shrink-0"
                      />
                    ))}
                  </div>
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Do you like colorpixo.com?
                  </span>
                </div>

                {/* Trustpilot Action Button / Link */}
                <a
                  href="https://www.trustpilot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Trustpilot - Give our service 5 stars"
                  className="group inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-purple-200/90 dark:border-purple-700/80 bg-white dark:bg-slate-800 hover:bg-purple-50/80 dark:hover:bg-slate-750 hover:border-purple-400 dark:hover:border-purple-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer text-xs sm:text-sm"
                >
                  {/* Trustpilot Star (#00B67A) */}
                  <svg
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="#00B67A"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="font-bold text-slate-900 dark:text-white tracking-tight">
                    Trustpilot
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Give our service 5 stars.
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors shrink-0" />
                </a>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The modern online color toolkit for web developers, UI designers, and creators. Advanced color picking, conversion, harmonic palettes, multi-stop gradients, tints & shades, and accessible WCAG contrast checks.
          </p>

          {/* Hero Interactive Brand Palette Row */}
          <div className="max-w-md mx-auto pt-2">
            <div className="grid grid-cols-5 gap-1.5 h-14 rounded-2xl overflow-hidden shadow-lg border border-black/10 dark:border-white/10">
              {BRAND_HERO_PALETTE.map((hex) => (
                <button
                  key={hex}
                  onClick={() => handleCopy(hex)}
                  className="h-full w-full relative group transition-transform hover:scale-105"
                  style={{ backgroundColor: hex }}
                  title={`Copy ${hex}`}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-white bg-black/40 backdrop-blur-xs transition-opacity">
                    {copiedHex === hex ? '✓' : hex}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
              Click any swatch to copy HEX code
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => launchTool('/color-picker', 'Color Picker')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-95 active:scale-95 text-white text-sm font-bold shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
            >
              <Pipette className="w-4 h-4" />
              <span>Launch Color Picker</span>
            </button>

            <button
              type="button"
              onClick={() => launchTool('/palette-generator', 'Palette Generator')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-755 active:scale-95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Palette Generator</span>
            </button>

            <button
              type="button"
              onClick={() => launchTool('/contrast-checker', 'Contrast Checker')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-755 active:scale-95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-cyan-500" />
              <span>Contrast Checker</span>
            </button>
          </div>
        </section>

        {/* CORE COLOR TOOLS SHOWCASE */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Essential Color Utilities.
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Production-grade color tools engineered for precision, speed, and privacy.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-keyboard-shortcuts'))}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                title="Click or press '?' to view all keyboard navigation shortcuts"
              >
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Shortcuts:</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400">P</kbd>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400">G</kbd>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400">C</kbd>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400">?</kbd>
              </button>
              <Link
                href="/tools"
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                Explore all utilities <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {primaryTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  onClick={(e) => {
                    e.preventDefault();
                    launchTool(tool.path, tool.name);
                  }}
                  className="group p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/80 dark:hover:border-purple-500/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {tool.shortcut && (
                          <kbd
                            title={`Press '${tool.shortcut}' to launch instantly`}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80 uppercase shadow-2xs"
                          >
                            {tool.shortcut}
                          </kbd>
                        )}
                        {tool.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {tool.name.endsWith('.') ? tool.name : `${tool.name}.`}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SEPARATED ADVERTISEMENT UNIT (OPTIONAL - PRODUCTION SAFE) */}
        <AdSlot slotId={SITE_CONFIG.adsense.homeSlot} format="leaderboard" />

        {/* EDUCATIONAL SECTION: LEARN ABOUT COLORS */}
        <LearnAboutColors />

        {/* WHY ColorPixo.Com VALUE PROPOSITIONS */}
        <section className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-8 relative overflow-hidden shadow-xl border border-slate-800">
          <div className="max-w-xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Engineered for Digital Product Creators
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Why Professionals Choose ColorPixo.Com.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Eliminating sluggish server calls, intrusive trackers, and inaccurate conversions with instant client-side mathematics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2.5 p-5 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">In-Browser Local Processing.</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Image and pixel analysis tools process files locally in your browser. No uploaded images are ever transmitted to or stored on ColorPixo servers.
              </p>
            </div>

            <div className="space-y-2.5 p-5 rounded-2xl bg-white/5 border border-white/10">
              <Zap className="w-6 h-6 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Mathematical Accuracy.</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standardized CIE-L*a*b* algorithms, CIEDE2000 color distances, and WCAG 2.1 relative luminance math ensure true cross-platform fidelity.
              </p>
            </div>

            <div className="space-y-2.5 p-5 rounded-2xl bg-white/5 border border-white/10">
              <Layers className="w-6 h-6 text-pink-400" />
              <h3 className="text-sm font-bold text-white">Instant Code Token Exports.</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export straight to CSS custom properties, Tailwind CSS configuration, JSON tokens, SCSS maps, or PNG swatches for immediate design system handoff.
              </p>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <FAQSection previewLimit={6} showViewAll />

        {/* POPULAR COLOR SWATCHES SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Trending Design Swatches.
              </h2>
              <p className="text-xs text-slate-500">Popular curated hues for web interfaces and branding</p>
            </div>
            <Link href="/colors" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
              View All 40+ Swatches &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {POPULAR_COLORS.slice(0, 6).map((color) => (
              <Link
                key={color.hex}
                href={`/color/${color.hex.replace('#', '')}`}
                className="group rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-xs hover:shadow-md hover:border-purple-500 transition-all"
              >
                <div className="h-20 w-full transition-transform group-hover:scale-105" style={{ backgroundColor: color.hex }} />
                <div className="p-3">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {color.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">{color.hex}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
