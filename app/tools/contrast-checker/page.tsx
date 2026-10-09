'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  Wand2,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import { broadcastActiveColor } from '@/components/active-color-context';
import {
  parseHex,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getContrastRatio,
  suggestPassingColor,
  RGB,
} from '@/lib/color/math';

export default function ContrastCheckerPage() {
  const { showToast } = useToast();
  const [textColor, setTextColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#F8FAFC');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    broadcastActiveColor(textColor);
  }, [textColor]);

  const textRgb = parseHex(textColor) || { r: 15, g: 23, b: 42 };
  const bgRgb = parseHex(bgColor) || { r: 248, g: 250, b: 252 };

  const ratio = getContrastRatio(textRgb, bgRgb);

  // WCAG Compliance evaluation
  const normalAa = ratio >= 4.5;
  const normalAaa = ratio >= 7.0;
  const largeAa = ratio >= 3.0;
  const largeAaa = ratio >= 4.5;
  const uiAa = ratio >= 3.0;

  const handleSwap = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
    showToast('Swapped text and background colors');
  };

  const handleSuggestPassing = (targetRatio: 4.5 | 7.0) => {
    const suggested = suggestPassingColor(textColor, bgColor, targetRatio);
    setTextColor(suggested);
    showToast(`Adjusted text color to ${suggested} for ${targetRatio}:1 contrast!`);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const applyPreset = (fg: string, bg: string) => {
    setTextColor(fg);
    setBgColor(bg);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Contrast Checker' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free WCAG Color Contrast Checker.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Audit color pairs against WCAG 2.1 Level AA and AAA standards. Test live UI components and automatically generate passing color tints with one click.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 hidden sm:inline">Presets:</span>
          <button
            onClick={() => applyPreset('#0F172A', '#FFFFFF')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
          >
            Light Editorial
          </button>
          <button
            onClick={() => applyPreset('#F8FAFC', '#0B0F19')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
          >
            Dark Mode
          </button>
          <button
            onClick={() => applyPreset('#1E40AF', '#EFF6FF')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
          >
            Brand Navy
          </button>
        </div>
      </div>

      {/* Two Color Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Foreground / Text Color */}
        <div className="md:col-span-5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-black/10 shadow-sm shrink-0">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value.toUpperCase())}
                className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
              />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Text / Foreground
              </div>
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value.toUpperCase())}
                className="font-mono text-sm font-semibold bg-transparent text-slate-900 dark:text-white uppercase focus:outline-none w-24"
              />
            </div>
          </div>
          <button
            onClick={() => handleCopy(textColor, 'fg')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
            title="Copy Text Hex"
          >
            {copiedKey === 'fg' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 shadow-sm transition-transform hover:rotate-180 duration-200"
            title="Swap Colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Background Color */}
        <div className="md:col-span-5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-black/10 shadow-sm shrink-0">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
              />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Background Canvas
              </div>
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                className="font-mono text-sm font-semibold bg-transparent text-slate-900 dark:text-white uppercase focus:outline-none w-24"
              />
            </div>
          </div>
          <button
            onClick={() => handleCopy(bgColor, 'bg')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
            title="Copy Background Hex"
          >
            {copiedKey === 'bg' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Scoreboard & Live UI Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Contrast Ratio Scoreboard & Fixer */}
        <div className="lg:col-span-5 space-y-6">
          {/* Big Ratio Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contrast Ratio
            </div>
            <div className="text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {ratio}:1
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold">
              {normalAaa ? (
                <span className="text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full">
                  Superb Contrast (WCAG AAA)
                </span>
              ) : normalAa ? (
                <span className="text-blue-700 bg-blue-100 dark:bg-blue-950 dark:text-blue-300 px-3 py-1 rounded-full">
                  Compliant (WCAG AA)
                </span>
              ) : largeAa ? (
                <span className="text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-3 py-1 rounded-full">
                  Large Text Only (3.0:1)
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300 px-3 py-1 rounded-full">
                  Fails WCAG 2.1 Standards
                </span>
              )}
            </div>

            {/* Smart Fix Button */}
            {!normalAa && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-xs text-slate-500">
                  Contrast does not meet the minimum 4.5:1 ratio for regular body text.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleSuggestPassing(4.5)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> Fix to 4.5:1 (AA)
                  </button>
                  <button
                    onClick={() => handleSuggestPassing(7.0)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
                  >
                    Fix to 7.0:1 (AAA)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Criteria Checklist */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              WCAG 2.1 Criteria Breakdown.
            </h2>

            <div className="space-y-3">
              {/* Normal Text AA */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Normal Text (Under 18pt / 24px)
                  </div>
                  <div className="text-[11px] text-slate-400">Requires minimum 4.5:1 ratio</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  {normalAa ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> AA Pass
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <XCircle className="w-4 h-4" /> Fail
                    </span>
                  )}
                </div>
              </div>

              {/* Normal Text AAA */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Normal Text Enhanced (AAA)
                  </div>
                  <div className="text-[11px] text-slate-400">Requires minimum 7.0:1 ratio</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  {normalAaa ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> AAA Pass
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-400">
                      <XCircle className="w-4 h-4" /> Fail
                    </span>
                  )}
                </div>
              </div>

              {/* Large Text AA */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Large Text (18pt+ or 14pt bold)
                  </div>
                  <div className="text-[11px] text-slate-400">Requires minimum 3.0:1 ratio</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  {largeAa ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Pass
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <XCircle className="w-4 h-4" /> Fail
                    </span>
                  )}
                </div>
              </div>

              {/* UI Components & Graphics */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    UI Components & Graphic Elements
                  </div>
                  <div className="text-[11px] text-slate-400">Requires minimum 3.0:1 ratio</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  {uiAa ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Pass
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <XCircle className="w-4 h-4" /> Fail
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live UI Component Mockup */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Interface Mockup Preview.
            </h2>

            {/* The interactive simulated screen */}
            <div
              className="p-8 rounded-2xl border transition-colors shadow-inner space-y-6"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: `${textColor}33`,
              }}
            >
              {/* Heading */}
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight" style={{ color: textColor }}>
                  Designing Accessible Digital Products.
                </h3>
                <p className="text-sm opacity-85 leading-relaxed" style={{ color: textColor }}>
                  Ensuring adequate luminance contrast allows users with low vision, color vision deficiencies, and varying ambient lighting conditions to read information effortlessly.
                </p>
              </div>

              {/* Interactive buttons & cards preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Button Mockup */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between gap-3"
                  style={{
                    borderColor: `${textColor}40`,
                    backgroundColor: `${textColor}10`,
                  }}
                >
                  <span className="text-xs font-bold">Button & Action State</span>
                  <button
                    className="py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95"
                    style={{
                      backgroundColor: textColor,
                      color: bgColor,
                    }}
                  >
                    Primary Action Button
                  </button>
                </div>

                {/* Form Input Mockup */}
                <div
                  className="p-4 rounded-xl border flex flex-col justify-between gap-2"
                  style={{
                    borderColor: `${textColor}40`,
                    backgroundColor: `${textColor}10`,
                  }}
                >
                  <label className="text-xs font-bold">Input Element</label>
                  <div
                    className="p-2.5 rounded-lg border text-xs font-medium"
                    style={{
                      borderColor: `${textColor}50`,
                      backgroundColor: bgColor,
                      color: textColor,
                    }}
                  >
                    sample.user@company.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
