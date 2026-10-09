'use client';

import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Shuffle, ArrowRightLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import { useTheme } from '@/components/theme-provider';
import {
  parseHex,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToCmyk,
  cmykToRgb,
  clamp,
  getRandomColor,
  getContrastRatio,
  RGB,
  HSL,
  HSV,
  CMYK,
} from '@/lib/color/math';
import { addHistoryColor } from '@/lib/storage/store';
import { broadcastActiveColor } from '@/components/active-color-context';
import { ColorInputContrastVisualizer } from '@/components/tools/color-input-contrast-visualizer';

export default function ColorConverterPage() {
  const { showToast } = useToast();
  const { resolvedTheme } = useTheme();

  const [hexInput, setHexInput] = useState('#3B82F6');
  const [rgbState, setRgbState] = useState<RGB>({ r: 59, g: 130, b: 246, a: 1 });
  const [hexError, setHexError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Neutral background per theme
  const neutralBgHex = resolvedTheme === 'dark' ? '#0F172A' : '#F8FAFC';
  const contrastNeutral = getContrastRatio(rgbState, neutralBgHex);

  // Derived formats
  const hex = rgbToHex(rgbState, (rgbState.a || 1) < 1);
  const hsl = rgbToHsl(rgbState);
  const hsv = rgbToHsv(rgbState);
  const cmyk = rgbToCmyk(rgbState);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text} to clipboard!`);
    addHistoryColor(hex);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    const parsed = parseHex(val);
    if (parsed) {
      setRgbState(parsed);
      setHexError(null);
    } else {
      setHexError('Invalid HEX. Enter 3, 4, 6, or 8 hex characters (e.g. #3B82F6 or #3B82F680).');
    }
  };

  const handleRgbChannel = (channel: keyof RGB, val: number) => {
    const updated = { ...rgbState, [channel]: clamp(val, 0, channel === 'a' ? 1 : 255) };
    setRgbState(updated);
    setHexInput(rgbToHex(updated, (updated.a || 1) < 1));
    setHexError(null);
  };

  const handleHslChannel = (channel: keyof HSL, val: number) => {
    const updatedHsl = { ...hsl, [channel]: val };
    const newRgb = hslToRgb(updatedHsl);
    setRgbState({ ...newRgb, a: rgbState.a });
    setHexInput(rgbToHex(newRgb, (rgbState.a || 1) < 1));
    setHexError(null);
  };

  const handleCmykChannel = (channel: keyof CMYK, val: number) => {
    const updatedCmyk = { ...cmyk, [channel]: clamp(val, 0, 100) };
    const newRgb = cmykToRgb(updatedCmyk);
    setRgbState({ ...newRgb, a: rgbState.a });
    setHexInput(rgbToHex(newRgb, (rgbState.a || 1) < 1));
    setHexError(null);
  };

  const handleRandom = () => {
    const rHex = getRandomColor('random');
    handleHexChange(rHex);
    showToast(`Loaded random color ${rHex}`);
  };

  const contrastWhite = getContrastRatio(rgbState, { r: 255, g: 255, b: 255 });
  const contrastBlack = getContrastRatio(rgbState, { r: 0, g: 0, b: 0 });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Color Converter' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free Online Color Converter (HEX, RGB, HSL, CMYK).
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time two-way mathematical conversions between HEX, RGB, HSL, HSV, and CMYK color spaces.
          </p>
        </div>
        <button
          onClick={handleRandom}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm self-start md:self-auto"
        >
          <Shuffle className="w-3.5 h-3.5" /> Random Color
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Swatch & Contrast Check */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-inner checkerboard border border-black/10">
              <div
                className="w-full h-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: `rgba(${rgbState.r}, ${rgbState.g}, ${rgbState.b}, ${rgbState.a || 1})`,
                }}
              >
                <span
                  className="font-mono text-2xl font-black px-4 py-2 rounded-xl backdrop-blur-md bg-black/20 text-white shadow-lg"
                >
                  {hex}
                </span>
              </div>
            </div>

            {/* Real-time Neutral Contrast Visualizer */}
            <ColorInputContrastVisualizer
              color={hex}
              onColorChange={(newHex) => handleHexChange(newHex)}
            />
          </div>
        </div>

        {/* Right Column: Two-way Input Rows */}
        <div className="lg:col-span-8 space-y-4">
          {/* HEX Input */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                HEX (Hexadecimal)
              </label>
              <button
                onClick={() => handleCopy(hex, 'hex')}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copiedKey === 'hex' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy HEX
              </button>
            </div>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl font-mono text-base font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#3B82F6"
            />
            {hexError && <p className="text-xs text-rose-500 pt-1">{hexError}</p>}

            {/* Real-Time Contrast Visualizer on Neutral Background for Color Input */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-2xs shrink-0"
                  style={{ backgroundColor: neutralBgHex }}
                />
                <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">
                  Neutral Canvas ({neutralBgHex})
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono self-end sm:self-auto">
                <span className="font-bold text-slate-900 dark:text-white">
                  {contrastNeutral.toFixed(2)} : 1
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    contrastNeutral >= 7.0
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/30'
                      : contrastNeutral >= 4.5
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/30'
                      : contrastNeutral >= 3.0
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-500/30'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {contrastNeutral >= 7.0
                    ? 'AAA Passed'
                    : contrastNeutral >= 4.5
                    ? 'AA Passed'
                    : contrastNeutral >= 3.0
                    ? 'AA Large'
                    : 'Fail'}
                </span>
              </div>
            </div>
          </div>

          {/* RGB Inputs */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                RGB (Red, Green, Blue)
              </label>
              <button
                onClick={() => handleCopy(`rgb(${rgbState.r}, ${rgbState.g}, ${rgbState.b})`, 'rgb')}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copiedKey === 'rgb' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy RGB
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['r', 'g', 'b'] as const).map((channel) => (
                <div key={channel} className="space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    {channel === 'r' ? 'Red' : channel === 'g' ? 'Green' : 'Blue'} (0-255)
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbState[channel]}
                    onChange={(e) => handleRgbChannel(channel, parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl font-mono text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* HSL Inputs */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                HSL (Hue, Saturation, Lightness)
              </label>
              <button
                onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copiedKey === 'hsl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy HSL
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase text-slate-400">Hue (0-360°)</div>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => handleHslChannel('h', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl font-mono text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase text-slate-400">Saturation (%)</div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => handleHslChannel('s', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl font-mono text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase text-slate-400">Lightness (%)</div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => handleHslChannel('l', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl font-mono text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* CMYK Inputs */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                CMYK (Cyan, Magenta, Yellow, Key/Black)
              </label>
              <button
                onClick={() => handleCopy(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'cmyk')}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copiedKey === 'cmyk' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy CMYK
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {(['c', 'm', 'y', 'k'] as const).map((ch) => (
                <div key={ch} className="space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    {ch === 'c' ? 'C' : ch === 'm' ? 'M' : ch === 'y' ? 'Y' : 'K'} (%)
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={cmyk[ch]}
                    onChange={(e) => handleCmykChannel(ch, parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl font-mono text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
