'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Check,
  Copy,
  Sliders,
  TrendingUp,
  Search,
  Bell,
  Heart,
  Layers,
  ArrowRight,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useActiveColor } from '@/components/active-color-context';
import { useToast } from '@/components/toast-context';
import {
  parseHex,
  rgbToHex,
  getContrastRatio,
  getRelativeLuminance,
  generateScheme,
  RGB,
} from '@/lib/color/math';

const PRESET_ACCENTS = [
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Violet', hex: '#8B5CF6' },
];

export function AdaptiveThemePreview({ className = '' }: { className?: string }) {
  const { activeColor, setActiveColor } = useActiveColor();
  const { showToast } = useToast();
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [sliderVal, setSliderVal] = useState(72);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedHex = activeColor || '#7C3AED';
  const rgb = parseHex(selectedHex) || { r: 124, g: 58, b: 237 };

  // Calculate contrast against white and black for best text on button
  const luminance = getRelativeLuminance(rgb);
  const buttonTextColor = luminance > 0.4 ? '#0F172A' : '#FFFFFF';

  // Contrast against current preview background
  const previewBgHex = previewTheme === 'dark' ? '#141A26' : '#FFFFFF';
  const contrastRatio = getContrastRatio(rgb, previewBgHex);

  // Generate harmonized gradient pair
  const analogousScheme = useMemo(() => {
    return generateScheme(selectedHex, 'analogous');
  }, [selectedHex]);

  const gradientEnd = analogousScheme[1] || '#EC4899';
  const gradientThird = analogousScheme[2] || '#06B6D4';

  const handleCopyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    showToast(`Copied ${key} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div
      className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl overflow-hidden p-6 sm:p-8 space-y-8 ${className}`}
    >
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adaptive Theme Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Live UI Preview with Your Color.
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Select any hue below to see how buttons, cards, badges, borders, form controls, and gradients dynamically adapt in real time.
          </p>
        </div>

        {/* Preview Theme Canvas Switcher (Light / Dark) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Preview Mode:
          </span>
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setPreviewTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewTheme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setPreviewTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewTheme === 'dark'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-200 dark:text-slate-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Color Selector Palette */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Choose Accent Color:
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
              {selectedHex}
            </span>
            <span className="text-[11px] text-slate-400">
              ({contrastRatio.toFixed(1)}:1 contrast)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_ACCENTS.map((preset) => {
            const isSelected = selectedHex.toUpperCase() === preset.hex.toUpperCase();
            return (
              <button
                key={preset.hex}
                onClick={() => setActiveColor(preset.hex)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-black dark:border-white shadow-md scale-105 ring-2 ring-offset-2 ring-blue-500/40'
                    : 'border-slate-200 dark:border-slate-700 hover:scale-102 bg-white/80 dark:bg-slate-800/80'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-2xs"
                  style={{ backgroundColor: preset.hex }}
                />
                <span className="text-slate-800 dark:text-slate-200">{preset.name}</span>
              </button>
            );
          })}

          {/* Native Color Picker for custom hue */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80">
            <input
              type="color"
              value={selectedHex.length === 7 ? selectedHex : '#7C3AED'}
              onChange={(e) => setActiveColor(e.target.value.toUpperCase())}
              className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
              title="Pick any custom color"
            />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Custom</span>
          </div>
        </div>
      </div>

      {/* THE LIVE ADAPTIVE UI PREVIEW SANDBOX */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border transition-colors duration-300 shadow-inner space-y-6 ${
          previewTheme === 'dark'
            ? 'bg-[#141A26] border-[#273244] text-[#F9FAFB]'
            : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#111827]'
        }`}
      >
        {/* Top Mini Navigation Bar in Live Sandbox */}
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            previewTheme === 'dark' ? 'border-[#273244]' : 'border-[#E2E8F0]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-sm"
              style={{ backgroundColor: selectedHex, color: buttonTextColor }}
            >
              CP
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">Adaptive Dashboard</div>
              <div
                className="text-[11px] font-mono leading-none"
                style={{ color: selectedHex }}
              >
                Accent: {selectedHex}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-xl transition-colors relative"
              style={{
                backgroundColor: `${selectedHex}15`,
                color: selectedHex,
              }}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedHex }}
              />
            </button>
            <div
              className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${selectedHex}20`,
                color: selectedHex,
                border: `1px solid ${selectedHex}40`,
              }}
            >
              Pro Plan
            </div>
          </div>
        </div>

        {/* 1. BUTTONS & ACTIONS SECTION */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Adaptive Buttons & Interaction States
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Solid Button */}
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide shadow-md transition-transform active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: selectedHex,
                color: buttonTextColor,
                boxShadow: `0 4px 14px 0 ${selectedHex}40`,
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Solid Primary</span>
            </button>

            {/* Outlined Button */}
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide border-2 transition-all flex items-center gap-2"
              style={{
                borderColor: selectedHex,
                color: selectedHex,
                backgroundColor: `${selectedHex}0A`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Outlined Secondary</span>
            </button>

            {/* Soft Tinted Pill */}
            <button
              type="button"
              className="px-4 py-2 rounded-full font-bold text-xs tracking-wide transition-colors flex items-center gap-1.5"
              style={{
                backgroundColor: `${selectedHex}18`,
                color: selectedHex,
              }}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Soft Badge</span>
            </button>

            {/* Ghost Link */}
            <button
              type="button"
              className="px-3 py-2 rounded-lg font-bold text-xs tracking-wide transition-colors flex items-center gap-1 hover:underline"
              style={{ color: selectedHex }}
            >
              <span>Text Action &rarr;</span>
            </button>
          </div>
        </div>

        {/* 2. CARDS & METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Metric Highlight Card */}
          <div
            className={`p-5 rounded-2xl border transition-all space-y-3 relative overflow-hidden ${
              previewTheme === 'dark'
                ? 'bg-[#1a2232] border-[#273244]'
                : 'bg-white border-[#E2E8F0]'
            }`}
            style={{
              borderTop: `4px solid ${selectedHex}`,
            }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold opacity-75">Monthly Revenue</span>
              <span
                className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold"
                style={{
                  backgroundColor: `${selectedHex}15`,
                  color: selectedHex,
                }}
              >
                +24.8%
              </span>
            </div>
            <div className="text-2xl font-black font-mono tracking-tight">$84,920</div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: selectedHex }}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-semibold">Consistent Growth</span>
            </div>
          </div>

          {/* Card 2: Form Controls & Switch */}
          <div
            className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
              previewTheme === 'dark'
                ? 'bg-[#1a2232] border-[#273244]'
                : 'bg-white border-[#E2E8F0]'
            }`}
          >
            <div className="text-xs font-semibold opacity-75">Form Controls & Focus</div>

            {/* Input with Adaptive Focus Ring */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 opacity-40" />
              <input
                type="text"
                readOnly
                value="Search design assets..."
                className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl border outline-none font-medium ${
                  previewTheme === 'dark'
                    ? 'bg-[#141A26] border-[#273244] text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                style={{
                  boxShadow: `0 0 0 2px ${selectedHex}50`,
                  borderColor: selectedHex,
                }}
              />
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-medium">Auto-Sync Tokens</span>
              <button
                type="button"
                onClick={() => setIsSwitchOn(!isSwitchOn)}
                className="w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative"
                style={{
                  backgroundColor: isSwitchOn ? selectedHex : '#94A3B8',
                }}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                    isSwitchOn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Card 3: Multi-Stop Gradient Showcase */}
          <div
            className="p-5 rounded-2xl text-white space-y-3 relative overflow-hidden shadow-lg flex flex-col justify-between"
            style={{
              background: `linear-gradient(135deg, ${selectedHex} 0%, ${gradientEnd} 50%, ${gradientThird} 100%)`,
            }}
          >
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded w-fit">
                Harmonized Gradient
              </div>
              <div className="text-lg font-black leading-snug">Vibrant Hero Surface</div>
            </div>

            <p className="text-[11px] opacity-90 leading-relaxed">
              Derived harmoniously from {selectedHex} across analogous stops.
            </p>

            <button
              type="button"
              onClick={() =>
                handleCopyCode(
                  `linear-gradient(135deg, ${selectedHex} 0%, ${gradientEnd} 50%, ${gradientThird} 100%)`,
                  'gradient-css'
                )
              }
              className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 backdrop-blur-xs text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedKey === 'gradient-css' ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied CSS
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Gradient CSS
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. ADAPTIVE PROGRESS BAR & ALERT BANNER */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold opacity-75">Interactive Progress Indicator</span>
            <span className="font-mono font-bold" style={{ color: selectedHex }}>
              {sliderVal}% Completed
            </span>
          </div>

          {/* Progress Track */}
          <div
            className={`h-2.5 rounded-full overflow-hidden ${
              previewTheme === 'dark' ? 'bg-[#273244]' : 'bg-slate-200'
            }`}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${sliderVal}%`,
                backgroundColor: selectedHex,
              }}
            />
          </div>

          {/* Slider input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={(e) => setSliderVal(parseInt(e.target.value))}
            className="w-full h-1 appearance-none bg-transparent cursor-pointer"
            style={{ accentColor: selectedHex }}
          />
        </div>

        {/* Alert Notification Banner */}
        <div
          className="p-4 rounded-xl border flex items-start gap-3 text-xs"
          style={{
            backgroundColor: `${selectedHex}10`,
            borderColor: `${selectedHex}30`,
          }}
        >
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: selectedHex }} />
          <div className="space-y-0.5 flex-1">
            <div className="font-bold" style={{ color: selectedHex }}>
              Theme Variable In Sync
            </div>
            <div className="opacity-80">
              Active accent variable set to{' '}
              <code className="font-mono font-bold">{selectedHex}</code>. All buttons, borders,
              and interactive components inherit this color token.
            </div>
          </div>
        </div>
      </div>

      {/* Footer Quick CSS Variable Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
        <div className="font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <code>--color-accent: {selectedHex};</code>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopyCode(`--color-accent: ${selectedHex};`, 'var')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
          >
            {copiedKey === 'var' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied Variable!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy CSS Variable</span>
              </>
            )}
          </button>

          <Link
            href="/css-color-generator"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-semibold transition-colors border border-purple-200 dark:border-purple-800"
          >
            <span>Full Token Generator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
