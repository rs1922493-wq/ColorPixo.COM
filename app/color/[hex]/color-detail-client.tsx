'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  Heart,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/toast-context';
import { exportSwatchPng, shareOrCopy } from '@/lib/export/export';
import { toggleFavoriteColor, isColorFavorite, addHistoryColor } from '@/lib/storage/store';
import { RGB, HSL, HSV, CMYK } from '@/lib/color/math';

interface Props {
  hexCode: string;
  rgb: RGB;
  hsl: HSL;
  hsv: HSV;
  cmyk: CMYK;
  closest: {
    name: string;
    hex?: string;
    deltaE?: number;
    similarityLabel?: string;
    tier?: string;
    closestNamedColor?: any;
  };
  contrastWhite: number;
  contrastBlack: number;
  complementary: string[];
  analogous: string[];
  triadic: string[];
  tints: string[];
  shades: string[];
  relatedPopular: any[];
}

export function ColorDetailClient({
  hexCode,
  rgb,
  hsl,
  hsv,
  cmyk,
  closest,
  contrastWhite,
  contrastBlack,
  complementary,
  analogous,
  triadic,
  tints,
  shades,
  relatedPopular,
}: Props) {
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(() => isColorFavorite(hexCode));

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text} to clipboard!`);
    addHistoryColor(hexCode);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleToggleFav = () => {
    const updated = toggleFavoriteColor(hexCode);
    setIsFav(updated);
    showToast(updated ? `Saved ${hexCode} to favorites!` : `Removed ${hexCode} from favorites`);
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {closest.name} ({hexCode}).
            </h1>
            <button
              onClick={handleToggleFav}
              className={`p-2 rounded-xl border transition-colors shadow-sm ${
                isFav
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
              }`}
              title={isFav ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Complete color profile for {hexCode}: conversions, WCAG accessibility metrics, harmonic combinations, and UI design scales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSwatchPng(hexCode)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Swatch PNG
          </button>
          <button
            onClick={() => shareOrCopy(window.location.href, `${closest.name} Color Code`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>

      {/* Main Grid: Hero Swatch & Conversions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Swatch Box & Accessibility */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="relative w-full h-64 rounded-2xl shadow-inner checkerboard border border-black/10 overflow-hidden flex items-end p-4">
              <div
                className="absolute inset-0"
                style={{ backgroundColor: hexCode }}
              />
              <div className="relative z-10 p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl backdrop-blur-md border border-white/20 flex items-center justify-between w-full">
                <span className="font-mono text-xl font-black text-slate-900 dark:text-white">
                  {hexCode}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  {closest.similarityLabel || closest.tier || 'Named Match'}
                </span>
              </div>
            </div>

            {/* Contrast Ratios */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                WCAG 2.1 Contrast Ratios
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white text-slate-900 border border-slate-200 flex flex-col justify-between">
                  <span className="text-slate-500 text-[11px]">On Pure White</span>
                  <div className="font-mono text-base font-bold my-1">{contrastWhite}:1</div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded w-fit ${
                      contrastWhite >= 4.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {contrastWhite >= 4.5 ? 'AA Pass (Normal)' : contrastWhite >= 3.0 ? 'Large Text' : 'Fails'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 text-white border border-slate-800 flex flex-col justify-between">
                  <span className="text-slate-400 text-[11px]">On Pure Black</span>
                  <div className="font-mono text-base font-bold my-1">{contrastBlack}:1</div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded w-fit ${
                      contrastBlack >= 4.5 ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                    }`}
                  >
                    {contrastBlack >= 4.5 ? 'AA Pass (Normal)' : contrastBlack >= 3.0 ? 'Large Text' : 'Fails'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Conversions Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Color Space Conversions.
            </h2>

            <div className="space-y-2">
              {/* HEX */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
                <span className="text-xs font-bold text-slate-400 w-16">HEX</span>
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  {hexCode}
                </span>
                <button
                  onClick={() => handleCopy(hexCode, 'hex')}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                >
                  {copiedKey === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* RGB */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
                <span className="text-xs font-bold text-slate-400 w-16">RGB</span>
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </span>
                <button
                  onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                >
                  {copiedKey === 'rgb' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* HSL */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
                <span className="text-xs font-bold text-slate-400 w-16">HSL</span>
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                </span>
                <button
                  onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                >
                  {copiedKey === 'hsl' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* HSV */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
                <span className="text-xs font-bold text-slate-400 w-16">HSV</span>
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  hsv({hsv.h}, {hsv.s}%, {hsv.v}%)
                </span>
                <button
                  onClick={() => handleCopy(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`, 'hsv')}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                >
                  {copiedKey === 'hsv' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* CMYK */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
                <span className="text-xs font-bold text-slate-400 w-16">CMYK</span>
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  cmyk({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)
                </span>
                <button
                  onClick={() => handleCopy(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'cmyk')}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                >
                  {copiedKey === 'cmyk' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* CSS Color String */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
                <span className="text-xs font-bold text-slate-400 w-16">CSS</span>
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
                  rgba({rgb.r}, {rgb.g}, {rgb.b}, 1)
                </span>
                <button
                  onClick={() => handleCopy(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`, 'css')}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 shrink-0"
                >
                  {copiedKey === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Harmonic Palettes */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Harmonic Color Combinations.
        </h2>

        <div className="space-y-5">
          {/* Complementary */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500">Complementary</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {complementary.map((h, i) => (
                <button
                  key={`comp-${i}`}
                  onClick={() => handleCopy(h, `comp-${i}`)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 text-left hover:scale-[1.02] transition-transform"
                >
                  <div className="w-6 h-6 rounded-md shrink-0 shadow-xs" style={{ backgroundColor: h }} />
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {h}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Triadic */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500">Triadic (120°)</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {triadic.map((h, i) => (
                <button
                  key={`tri-${i}`}
                  onClick={() => handleCopy(h, `tri-${i}`)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 text-left hover:scale-[1.02] transition-transform"
                >
                  <div className="w-6 h-6 rounded-md shrink-0 shadow-xs" style={{ backgroundColor: h }} />
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {h}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tints & Shades Scale */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Tints and Shades Scale.
        </h2>

        {/* Tints */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 font-semibold">Tints (&rarr; White)</span>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {tints.map((t, idx) => (
              <button
                key={`t-${idx}`}
                onClick={() => handleCopy(t, `t-${idx}`)}
                className="h-12 rounded-lg border border-black/5 hover:scale-105 transition-transform"
                style={{ backgroundColor: t }}
                title={`Copy ${t}`}
              />
            ))}
          </div>
        </div>

        {/* Shades */}
        <div className="space-y-1.5 pt-2">
          <span className="text-xs text-slate-400 font-semibold">Shades (&rarr; Black)</span>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {shades.map((s, idx) => (
              <button
                key={`s-${idx}`}
                onClick={() => handleCopy(s, `s-${idx}`)}
                className="h-12 rounded-lg border border-black/5 hover:scale-105 transition-transform"
                style={{ backgroundColor: s }}
                title={`Copy ${s}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Related Popular Colors */}
      {relatedPopular.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Explore Related Colors.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedPopular.map((color) => (
              <Link
                key={color.slug}
                href={`/colors/${color.slug}`}
                className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg shadow-sm border border-black/10 shrink-0 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {color.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">{color.hex}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
