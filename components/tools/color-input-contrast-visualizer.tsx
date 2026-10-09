'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Wand2,
  ArrowRightLeft,
  ExternalLink,
  ShieldCheck,
  Eye,
  Info,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import {
  getContrastRatio,
  checkContrast,
  suggestPassingColor,
  parseHex,
  rgbToHex,
} from '@/lib/color/math';

export interface NeutralBackgroundOption {
  id: string;
  name: string;
  hex: string;
  description: string;
}

export const NEUTRAL_BACKGROUNDS: NeutralBackgroundOption[] = [
  {
    id: 'neutral-light',
    name: 'Light Canvas',
    hex: '#F8FAFC',
    description: 'Standard off-white neutral canvas (Slate 50)',
  },
  {
    id: 'neutral-surface',
    name: 'Card Surface',
    hex: '#F1F5F9',
    description: 'Subtle gray neutral surface (Slate 100)',
  },
  {
    id: 'neutral-border',
    name: 'Muted Border',
    hex: '#E2E8F0',
    description: 'Divider neutral border background (Slate 200)',
  },
  {
    id: 'neutral-mid',
    name: 'Mid Gray',
    hex: '#94A3B8',
    description: 'Medium balanced neutral tone (Slate 400)',
  },
  {
    id: 'neutral-dark',
    name: 'Dark Canvas',
    hex: '#0F172A',
    description: 'Deep neutral obsidian canvas (Slate 900)',
  },
  {
    id: 'neutral-charcoal',
    name: 'Charcoal',
    hex: '#1E293B',
    description: 'Dark mode card surface (Slate 800)',
  },
];

interface ColorInputContrastVisualizerProps {
  color: string;
  onColorChange?: (newColor: string) => void;
  className?: string;
  title?: string;
}

export function ColorInputContrastVisualizer({
  color,
  onColorChange,
  className = '',
  title = 'Real-Time Neutral Contrast & WCAG Evaluation',
}: ColorInputContrastVisualizerProps) {
  const { resolvedTheme } = useTheme();
  const [selectedNeutralId, setSelectedNeutralId] = useState<string>('auto');
  const [isSwapped, setIsSwapped] = useState<boolean>(false);

  // Auto theme neutral selection
  const autoNeutralHex = useMemo(() => {
    return resolvedTheme === 'dark' ? '#0F172A' : '#F8FAFC';
  }, [resolvedTheme]);

  // Active neutral background hex
  const activeNeutralHex = useMemo(() => {
    if (selectedNeutralId === 'auto') return autoNeutralHex;
    const found = NEUTRAL_BACKGROUNDS.find((n) => n.id === selectedNeutralId);
    return found ? found.hex : autoNeutralHex;
  }, [selectedNeutralId, autoNeutralHex]);

  // Effective foreground and background
  const fg = isSwapped ? activeNeutralHex : color;
  const bg = isSwapped ? color : activeNeutralHex;

  // Real-time calculation
  const contrastData = useMemo(() => {
    return (
      checkContrast(fg, bg) || {
        ratio: 1,
        normalTextAA: false,
        normalTextAAA: false,
        largeTextAA: false,
        largeTextAAA: false,
        uiComponentsAA: false,
        textColor: fg,
        bgColor: bg,
      }
    );
  }, [fg, bg]);

  // Compliance rating and styling
  const compliance = useMemo(() => {
    const ratio = contrastData.ratio;
    if (ratio >= 7.0) {
      return {
        rating: 'AAA Enhanced',
        scoreText: 'Enhanced Contrast (AAA)',
        textColor: 'text-emerald-700 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        badgeColor: 'bg-emerald-600 text-white',
        status: 'Passes both AA and AAA standards for all body text, large headers, and UI components.',
      };
    }
    if (ratio >= 4.5) {
      return {
        rating: 'AA Pass',
        scoreText: 'Standard Contrast (AA)',
        textColor: 'text-emerald-700 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        badgeColor: 'bg-emerald-600 text-white',
        status: 'Passes standard AA for body text and AAA for large text (≥18pt or ≥14pt bold).',
      };
    }
    if (ratio >= 3.0) {
      return {
        rating: 'AA Large Only',
        scoreText: 'Large Text & UI Only (AA Large)',
        textColor: 'text-amber-700 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        badgeColor: 'bg-amber-600 text-white',
        status: 'Insufficient contrast for small body text (<18pt). Suitable only for large headings or icons.',
      };
    }
    return {
      rating: 'Fail (Low Contrast)',
      scoreText: 'Fails WCAG 2.1 Criteria',
      textColor: 'text-rose-700 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
      badgeColor: 'bg-rose-600 text-white',
      status: 'Contrast is below 3.0:1. Text will be difficult to read for people with moderate visual impairments.',
    };
  }, [contrastData.ratio]);

  const handleAutoFix = (targetRatio: 4.5 | 7.0) => {
    if (!onColorChange) return;
    if (isSwapped) {
      const fixedBg = suggestPassingColor(bg, fg, targetRatio);
      onColorChange(fixedBg);
    } else {
      const fixedFg = suggestPassingColor(fg, bg, targetRatio);
      onColorChange(fixedFg);
    }
  };

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 ${className}`}
    >
      {/* Header with Title and Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {title.endsWith('.') ? title : `${title}.`}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluates the input color against neutral UI backgrounds per WCAG 2.1 specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Swap Button */}
          <button
            onClick={() => setIsSwapped(!isSwapped)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-medium transition-colors"
            title="Swap text and background colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swap Colors</span>
          </button>

          <Link
            href="/contrast-checker"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span>Full Tool</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Neutral Background Switcher */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold">Test Against Neutral Background:</span>
          <span className="font-mono text-[11px] text-slate-500">{activeNeutralHex}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
          {/* Auto Neutral Pill */}
          <button
            onClick={() => setSelectedNeutralId('auto')}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
              selectedNeutralId === 'auto'
                ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-700 dark:text-blue-300 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-2xs"
              style={{ backgroundColor: autoNeutralHex }}
            />
            <span className="truncate">Auto Theme</span>
          </button>

          {/* Preset Neutral Backgrounds */}
          {NEUTRAL_BACKGROUNDS.map((neutral) => {
            const isSelected = selectedNeutralId === neutral.id;
            return (
              <button
                key={neutral.id}
                onClick={() => setSelectedNeutralId(neutral.id)}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-700 dark:text-blue-300 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
                title={`${neutral.name}: ${neutral.description}`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-2xs"
                  style={{ backgroundColor: neutral.hex }}
                />
                <span className="truncate">{neutral.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Ratio & Score Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${compliance.bgColor}`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-2xs ${compliance.badgeColor}`}
            >
              {compliance.rating}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {compliance.scoreText}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            {compliance.status}
          </p>
        </div>

        {/* Big Contrast Ratio Number */}
        <div className="flex items-baseline gap-2 self-start md:self-auto shrink-0 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-black/5 dark:border-white/10 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ratio</span>
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {contrastData.ratio.toFixed(2)} : 1
          </span>
        </div>
      </div>

      {/* WCAG Contrast Criteria Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {/* Normal Text AA */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-colors ${
            contrastData.normalTextAA
              ? 'bg-emerald-500/5 border-emerald-500/30'
              : 'bg-rose-500/5 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Body Text AA
            </span>
            {contrastData.normalTextAA ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Min 4.5:1 • {contrastData.normalTextAA ? 'Passed' : 'Failed'}
          </div>
        </div>

        {/* Normal Text AAA */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-colors ${
            contrastData.normalTextAAA
              ? 'bg-emerald-500/5 border-emerald-500/30'
              : 'bg-rose-500/5 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Body Text AAA
            </span>
            {contrastData.normalTextAAA ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Min 7.0:1 • {contrastData.normalTextAAA ? 'Passed' : 'Failed'}
          </div>
        </div>

        {/* Large Text AA */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-colors ${
            contrastData.largeTextAA
              ? 'bg-emerald-500/5 border-emerald-500/30'
              : 'bg-rose-500/5 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Large Text AA
            </span>
            {contrastData.largeTextAA ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Min 3.0:1 (≥18pt) • {contrastData.largeTextAA ? 'Passed' : 'Failed'}
          </div>
        </div>

        {/* UI & Graphical Components */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-colors ${
            contrastData.uiComponentsAA
              ? 'bg-emerald-500/5 border-emerald-500/30'
              : 'bg-rose-500/5 border-rose-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              UI Controls & Icons
            </span>
            {contrastData.uiComponentsAA ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Min 3.0:1 • {contrastData.uiComponentsAA ? 'Passed' : 'Failed'}
          </div>
        </div>
      </div>

      {/* Live Visual Sandbox Preview */}
      <div
        className="p-4 sm:p-5 rounded-xl border border-black/10 dark:border-white/10 shadow-xs transition-colors space-y-3"
        style={{ backgroundColor: bg, color: fg }}
      >
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-75">
          <span>Real-World UI Preview on Neutral Surface</span>
          <span className="font-mono text-[11px] lowercase opacity-75">
            {isSwapped ? 'swapped: neutral on color' : 'color on neutral'}
          </span>
        </div>

        <div className="text-lg sm:text-xl font-black tracking-tight leading-snug">
          The quick brown fox jumps over the lazy dog.
        </div>

        <p className="text-xs sm:text-sm leading-relaxed opacity-90 max-w-2xl">
          Visual contrast ensures typography remains legible for readers with low vision, color deficiencies, or viewing under direct sunlight.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-opacity hover:opacity-90"
            style={{ backgroundColor: fg, color: bg }}
          >
            Solid Action Button
          </button>

          <span
            className="px-3 py-1 rounded-lg text-xs font-semibold border"
            style={{ borderColor: fg }}
          >
            Outlined Component
          </span>

          <span className="text-xs font-mono font-medium underline underline-offset-4 ml-1">
            Accessible Hyperlink
          </span>
        </div>
      </div>

      {/* Smart Auto-Fix Buttons (only shown when onColorChange is provided) */}
      {onColorChange && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Need accessible colors? Use one-click auto-tuner:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleAutoFix(4.5)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors shadow-2xs"
              title="Adjust color to reach minimum 4.5:1 ratio for WCAG AA"
            >
              <Wand2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Auto-Tune AA (4.5:1)</span>
            </button>

            <button
              onClick={() => handleAutoFix(7.0)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors shadow-2xs"
              title="Adjust color to reach minimum 7.0:1 ratio for WCAG AAA"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Auto-Tune AAA (7.0:1)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
