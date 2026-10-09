'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRightLeft,
  Wand2,
  ChevronDown,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { useActiveColor } from './active-color-context';
import { useTheme } from './theme-provider';
import {
  getContrastRatio,
  checkContrast,
  suggestPassingColor,
  parseHex,
  rgbToHex,
} from '@/lib/color/math';

export function ContrastVisualizer() {
  const { activeColor, setActiveColor } = useActiveColor();
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [targetBgType, setTargetBgType] = useState<'theme' | 'white' | 'dark' | 'custom'>('theme');
  const [customBg, setCustomBg] = useState('#FFFFFF');
  const [isSwapped, setIsSwapped] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Determine effective background based on selection
  const effectiveBg = useMemo(() => {
    if (targetBgType === 'white') return '#FFFFFF';
    if (targetBgType === 'dark') return '#0B0F19';
    if (targetBgType === 'custom') return customBg;
    // Theme-aware
    return resolvedTheme === 'dark' ? '#0B0F19' : '#FFFFFF';
  }, [targetBgType, customBg, resolvedTheme]);

  // Foreground & Background assignments based on swap toggle
  const fg = isSwapped ? effectiveBg : activeColor;
  const bg = isSwapped ? activeColor : effectiveBg;

  // Real-time calculation
  const contrastData = useMemo(() => {
    return checkContrast(fg, bg) || {
      ratio: 1,
      normalTextAA: false,
      normalTextAAA: false,
      largeTextAA: false,
      largeTextAAA: false,
      uiComponentsAA: false,
      textColor: fg,
      bgColor: bg,
    };
  }, [fg, bg]);

  // Header quick ratio against current theme background
  const themeBg = resolvedTheme === 'dark' ? '#0B0F19' : '#FFFFFF';
  const quickRatio = useMemo(() => {
    return getContrastRatio(activeColor, themeBg);
  }, [activeColor, themeBg]);

  // Close on Escape or click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleAutoFix = (targetRatio: 4.5 | 7.0) => {
    if (isSwapped) {
      const fixedBg = suggestPassingColor(bg, fg, targetRatio);
      setActiveColor(fixedBg);
    } else {
      const fixedFg = suggestPassingColor(fg, bg, targetRatio);
      setActiveColor(fixedFg);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Status badge config
  const getBadgeConfig = (ratio: number) => {
    if (ratio >= 7.0) {
      return { label: 'AAA Pass', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30' };
    }
    if (ratio >= 4.5) {
      return { label: 'AA Pass', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30' };
    }
    if (ratio >= 3.0) {
      return { label: 'AA Large', color: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30' };
    }
    return { label: 'Fail', color: 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/30' };
  };

  const quickBadge = getBadgeConfig(quickRatio);

  return (
    <div className="relative">
      {/* Header Compact Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all shadow-2xs group"
        aria-label="Real-time WCAG Contrast Visualizer"
        title="Open Real-Time WCAG Contrast Inspector"
      >
        {/* Active Color Swatch Dot */}
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-2xs group-hover:scale-110 transition-transform"
          style={{ backgroundColor: activeColor }}
        />

        {/* Live Ratio & Compliance Badge */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-semibold text-[11px] text-slate-900 dark:text-slate-100">
            {quickRatio.toFixed(2)}:1
          </span>
          <span
            className={`hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${quickBadge.color}`}
          >
            {quickBadge.label}
          </span>
        </div>

        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Contrast Inspector Popover Panel */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-0 sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4"
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-black/10 dark:border-white/20 shadow-xs"
                style={{ backgroundColor: activeColor }}
              />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Real-Time Contrast Visualizer.
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant WCAG 2.1 AA / AAA contrast ratio audit
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Color & Target Controls */}
          <div className="space-y-3">
            {/* Active Color Input Row */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <input
                  type="color"
                  value={activeColor.length === 7 ? activeColor : '#3B82F6'}
                  onChange={(e) => setActiveColor(e.target.value.toUpperCase())}
                  className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent shrink-0"
                  title="Pick active color"
                />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                    Active Color
                  </div>
                  <input
                    type="text"
                    value={activeColor}
                    onChange={(e) => setActiveColor(e.target.value)}
                    className="w-24 font-mono text-xs font-bold bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                    maxLength={9}
                  />
                </div>
              </div>

              {/* Swap Foreground/Background */}
              <button
                onClick={() => setIsSwapped(!isSwapped)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
                title="Swap foreground & background colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Target Background Switcher */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Evaluate Against Surface:</span>
                <span className="font-mono text-[10px] text-slate-400">{effectiveBg}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setTargetBgType('theme')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                    targetBgType === 'theme'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Theme
                </button>
                <button
                  onClick={() => setTargetBgType('white')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                    targetBgType === 'white'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  White
                </button>
                <button
                  onClick={() => setTargetBgType('dark')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                    targetBgType === 'dark'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTargetBgType('custom')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
                    targetBgType === 'custom'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>Custom</span>
                </button>
              </div>

              {/* Custom background hex input if selected */}
              {targetBgType === 'custom' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="color"
                    value={customBg.length === 7 ? customBg : '#FFFFFF'}
                    onChange={(e) => setCustomBg(e.target.value.toUpperCase())}
                    className="w-6 h-6 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={customBg}
                    onChange={(e) => setCustomBg(e.target.value)}
                    placeholder="#FFFFFF"
                    className="flex-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                    maxLength={9}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Big Ratio Display */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Calculated Contrast Ratio
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {contrastData.ratio.toFixed(2)} : 1
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getBadgeConfig(
                  contrastData.ratio
                ).color}`}
              >
                {getBadgeConfig(contrastData.ratio).label}
              </span>
              <span className="text-[10px] text-slate-400">
                {contrastData.normalTextAA ? 'Standard Compliant' : 'Low Contrast'}
              </span>
            </div>
          </div>

          {/* WCAG Criteria Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* AA Normal */}
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                contrastData.normalTextAA
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div>
                <div className="font-bold text-[11px]">Normal Text AA</div>
                <div className="text-[10px] opacity-75">Min 4.5:1</div>
              </div>
              {contrastData.normalTextAA ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
            </div>

            {/* AAA Normal */}
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                contrastData.normalTextAAA
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div>
                <div className="font-bold text-[11px]">Normal Text AAA</div>
                <div className="text-[10px] opacity-75">Min 7.0:1</div>
              </div>
              {contrastData.normalTextAAA ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
            </div>

            {/* AA Large */}
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                contrastData.largeTextAA
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div>
                <div className="font-bold text-[11px]">Large Text AA</div>
                <div className="text-[10px] opacity-75">Min 3.0:1 (≥18pt)</div>
              </div>
              {contrastData.largeTextAA ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
            </div>

            {/* UI Components */}
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                contrastData.uiComponentsAA
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div>
                <div className="font-bold text-[11px]">UI & Graphics</div>
                <div className="text-[10px] opacity-75">Min 3.0:1 (Borders)</div>
              </div>
              {contrastData.uiComponentsAA ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
            </div>
          </div>

          {/* Live Visual Sandbox Preview Box */}
          <div
            className="p-4 rounded-xl border border-black/10 dark:border-white/10 transition-colors shadow-inner space-y-2.5"
            style={{ backgroundColor: bg, color: fg }}
          >
            <div className="text-xs font-black uppercase tracking-wider opacity-80">
              Live Text Preview
            </div>
            <div className="text-base font-extrabold leading-tight">
              Sample Heading Text
            </div>
            <p className="text-xs leading-relaxed opacity-90 line-clamp-2">
              The quick brown fox jumps over the lazy dog. Check readability under real lighting conditions.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                className="px-2.5 py-1 rounded text-[11px] font-bold shadow-xs transition-opacity hover:opacity-90"
                style={{ backgroundColor: fg, color: bg }}
              >
                Button Sample
              </button>
              <span
                className="text-[10px] px-2 py-0.5 rounded border"
                style={{ borderColor: fg }}
              >
                Outline Tag
              </span>
            </div>
          </div>

          {/* Quick Auto-Fix Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleAutoFix(4.5)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors shadow-2xs"
              title="Automatically adjust active color to reach 4.5:1 ratio"
            >
              <Wand2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Auto-Fix AA (4.5:1)</span>
            </button>

            <button
              onClick={() => handleAutoFix(7.0)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors shadow-2xs"
              title="Automatically adjust active color to reach 7.0:1 ratio"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Auto-Fix AAA (7.0:1)</span>
            </button>
          </div>

          {/* Bottom Footer Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => handleCopy(activeColor)}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-1 font-mono transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-sans">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy {activeColor}</span>
                </>
              )}
            </button>

            <Link
              href="/contrast-checker"
              onClick={() => setIsOpen(false)}
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <span>Full Studio</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
