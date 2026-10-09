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
  BookOpen,
  Pipette,
  Layers,
} from 'lucide-react';
import { useToast } from '@/components/toast-context';
import { exportSwatchPng, shareOrCopy } from '@/lib/export/export';
import { toggleFavoriteColor, isColorFavorite, addHistoryColor } from '@/lib/storage/store';
import { PopularColorItem } from '@/data/popular-colors';
import { RGB, HSL, CMYK } from '@/lib/color/math';

interface Props {
  color: PopularColorItem;
  rgb: RGB;
  hsl: HSL;
  cmyk: CMYK;
  tints: string[];
  shades: string[];
  contrastWhite: number;
  contrastBlack: number;
}

export function PopularColorDetailClient({
  color,
  rgb,
  hsl,
  cmyk,
  tints,
  shades,
  contrastWhite,
  contrastBlack,
}: Props) {
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(() => isColorFavorite(color.hex));

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text} to clipboard!`);
    addHistoryColor(color.hex);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleToggleFav = () => {
    const updated = toggleFavoriteColor(color.hex);
    setIsFav(updated);
    showToast(updated ? `Saved ${color.name} to favorites!` : `Removed ${color.name}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {color.name} ({color.hex}).
            </h1>
            <button
              onClick={handleToggleFav}
              className={`p-2 rounded-xl border transition-colors shadow-sm ${
                isFav
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {color.family} Color Family • Detailed color theory, cultural symbolism, and UI application guidance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSwatchPng(color.hex, `${color.name} Swatch`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export Swatch
          </button>
          <button
            onClick={() => shareOrCopy(window.location.href, `${color.name} Color Guide`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>

      {/* Main Grid: Swatch + Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Hero Swatch */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div
              className="w-full h-64 rounded-2xl shadow-inner border border-black/10 flex flex-col justify-between p-4"
              style={{ backgroundColor: color.hex }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-xs w-fit">
                {color.family}
              </span>
              <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl backdrop-blur-md border border-white/20 flex items-center justify-between">
                <span className="font-mono text-xl font-black text-slate-900 dark:text-white">
                  {color.hex}
                </span>
                <button
                  onClick={() => handleCopy(color.hex, 'hex')}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
                >
                  {copiedKey === 'hex' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Contrast Readouts */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white text-slate-900 border border-slate-200 flex flex-col justify-between">
                <span className="text-slate-500 text-[11px]">On Pure White</span>
                <span className="font-mono text-base font-bold my-1">{contrastWhite}:1</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded w-fit ${
                    contrastWhite >= 4.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {contrastWhite >= 4.5 ? 'AA Pass' : 'Fails Body'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 text-white border border-slate-800 flex flex-col justify-between">
                <span className="text-slate-400 text-[11px]">On Pure Black</span>
                <span className="font-mono text-base font-bold my-1">{contrastBlack}:1</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded w-fit ${
                    contrastBlack >= 4.5 ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                  }`}
                >
                  {contrastBlack >= 4.5 ? 'AA Pass' : 'Fails Body'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Specifications & Fast Tool Actions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Color Space Values.
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750">
                <span className="text-slate-400 font-bold block mb-1">RGB</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {rgb.r}, {rgb.g}, {rgb.b}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750">
                <span className="text-slate-400 font-bold block mb-1">HSL</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {hsl.h}°, {hsl.s}%, {hsl.l}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750">
                <span className="text-slate-400 font-bold block mb-1">CMYK</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750">
                <span className="text-slate-400 font-bold block mb-1">CSS Value</span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 truncate block">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </span>
              </div>
            </div>

            {/* Quick Tool Links */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
              <Link
                href={`/color/${color.hex.replace('#', '')}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Pipette className="w-3.5 h-3.5 text-blue-500" /> Inspect Color Code
              </Link>
              <Link
                href="/contrast-checker"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-500" /> Check Contrast
              </Link>
              <Link
                href="/color-shades"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                Generate Tones
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Content: Meaning & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meaning & Psychology */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Color Meaning & Visual Psychology.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {color.meaning}
          </p>
        </div>

        {/* History & Origins */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Design Application & Guidelines.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {color.history || color.designTips || color.commonUses}
          </p>
        </div>
      </div>

      {/* Recommended Pairings */}
      {color.pairings && color.pairings.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Harmonized Color Pairings.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {color.pairings.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg border border-black/10 shadow-sm shrink-0"
                    style={{ backgroundColor: p.hex }}
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {p.name}
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">{p.hex}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {p.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tints & Shades Scale */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          10-Step Tints & Shades.
        </h2>

        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 font-semibold">Tints</span>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {tints.map((t, idx) => (
              <button
                key={`tint-${idx}`}
                onClick={() => handleCopy(t, `tint-${idx}`)}
                className="h-12 rounded-lg border border-black/5 hover:scale-105 transition-transform"
                style={{ backgroundColor: t }}
                title={`Copy ${t}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <span className="text-xs text-slate-400 font-semibold">Shades</span>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {shades.map((s, idx) => (
              <button
                key={`shade-${idx}`}
                onClick={() => handleCopy(s, `shade-${idx}`)}
                className="h-12 rounded-lg border border-black/5 hover:scale-105 transition-transform"
                style={{ backgroundColor: s }}
                title={`Copy ${s}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
