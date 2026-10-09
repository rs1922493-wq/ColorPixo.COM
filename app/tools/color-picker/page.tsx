'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Heart, Shuffle, Download, Sparkles, Sliders, RotateCcw } from 'lucide-react';
import { ColorPickerCanvas } from '@/components/tools/color-picker-canvas';
import {
  parseHex,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToCmyk,
  clamp,
  getContrastRatio,
  getRandomColor,
  HSV,
  RGB,
  HSL,
} from '@/lib/color/math';
import { useToast } from '@/components/toast-context';
import { useTheme } from '@/components/theme-provider';
import { addHistoryColor, toggleFavoriteColor, isColorFavorite } from '@/lib/storage/store';
import { broadcastActiveColor } from '@/components/active-color-context';
import { exportSwatchPng } from '@/lib/export/export';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ColorInputContrastVisualizer } from '@/components/tools/color-input-contrast-visualizer';

export default function ColorPickerPage() {
  const { showToast } = useToast();
  const { resolvedTheme } = useTheme();
  const [hsv, setHsv] = useState<HSV>({ h: 217, s: 91, v: 96, a: 1 });
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [isFav, setIsFav] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Neutral background based on theme (Slate 50 / Slate 900)
  const neutralBgHex = resolvedTheme === 'dark' ? '#0F172A' : '#F8FAFC';

  // Derived color models
  const rgb = hsvToRgb(hsv);
  const hex = rgbToHex(rgb, (hsv.a || 1) < 1);
  const hsl = rgbToHsl(rgb);
  const cmyk = rgbToCmyk(rgb);

  // Real-time contrast against neutral background
  const contrastAgainstNeutral = getContrastRatio(rgb, neutralBgHex);

  // Sync state
  useEffect(() => {
    setIsFav(isColorFavorite(hex));
    addHistoryColor(hex);
    broadcastActiveColor(hex);
  }, [hex]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleHexInputChange = (val: string) => {
    setHexInput(val);
    const parsed = parseHex(val);
    if (parsed) {
      const newHsv = rgbToHsv(parsed);
      setHsv({ ...newHsv, a: parsed.a !== undefined ? parsed.a : hsv.a });
    }
  };

  const handleRandom = () => {
    const rHex = getRandomColor('random');
    const parsed = parseHex(rHex);
    if (parsed) {
      const newHsv = rgbToHsv(parsed);
      setHsv(newHsv);
      setHexInput(rHex);
      showToast(`Generated random color ${rHex}`);
    }
  };

  const handleReset = () => {
    const defaultHex = '#7C3AED';
    const parsed = parseHex(defaultHex);
    if (parsed) {
      const newHsv = rgbToHsv(parsed);
      setHsv({ ...newHsv, a: 1 });
      setHexInput(defaultHex);
      showToast('Reset color to default (#7C3AED)');
    }
  };

  const handleToggleFav = () => {
    const updated = toggleFavoriteColor(hex);
    setIsFav(updated);
    showToast(updated ? `Saved ${hex} to favorites` : `Removed ${hex} from favorites`);
  };

  // Contrast against black and white
  const contrastAgainstWhite = getContrastRatio(rgb, { r: 255, g: 255, b: 255 });
  const contrastAgainstBlack = getContrastRatio(rgb, { r: 0, g: 0, b: 0 });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Color Picker' },
        ]}
      />

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free Online Color Picker.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Interactive 2D saturation-value picker with precision hue and opacity sliders. Live conversion between HEX, RGB, HSL, HSV, and CMYK.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
            title="Reset to default color"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset
          </button>
          <button
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
          >
            <Shuffle className="w-3.5 h-3.5" /> Random
          </button>
          <button
            onClick={handleToggleFav}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors shadow-sm ${
              isFav
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            {isFav ? 'Favorited' : 'Favorite'}
          </button>
          <button
            onClick={() => exportSwatchPng(hex)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export Swatch
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Canvas & Sliders */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* 2D Canvas */}
            <ColorPickerCanvas hsv={hsv} onChange={(newHsv) => {
              setHsv(newHsv);
              const newRgb = hsvToRgb(newHsv);
              setHexInput(rgbToHex(newRgb, (newHsv.a || 1) < 1));
            }} />

            {/* Sliders */}
            <div className="space-y-4 pt-2">
              {/* Hue Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Hue</span>
                  <span className="font-mono">{hsv.h}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsv.h}
                  onChange={(e) => {
                    const h = parseInt(e.target.value);
                    const updated = { ...hsv, h };
                    setHsv(updated);
                    setHexInput(rgbToHex(hsvToRgb(updated), (updated.a || 1) < 1));
                  }}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                  }}
                />
              </div>

              {/* Opacity / Alpha Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Opacity (Alpha)</span>
                  <span className="font-mono">{Math.round((hsv.a !== undefined ? hsv.a : 1) * 100)}%</span>
                </div>
                <div className="relative rounded-lg overflow-hidden h-3 checkerboard">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round((hsv.a !== undefined ? hsv.a : 1) * 100)}
                    onChange={(e) => {
                      const a = parseInt(e.target.value) / 100;
                      const updated = { ...hsv, a };
                      setHsv(updated);
                      setHexInput(rgbToHex(hsvToRgb(updated), a < 1));
                    }}
                    className="absolute inset-0 w-full h-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, transparent, ${rgbToHex(rgb)})`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Swatch Preview with Checkerboard */}
            <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-inner checkerboard shrink-0 border border-slate-200 dark:border-slate-700">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${hsv.a !== undefined ? hsv.a : 1})`,
                  }}
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Color
                </div>
                <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {hex}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  rgba({rgb.r}, {rgb.g}, {rgb.b}, {hsv.a !== undefined ? hsv.a : 1})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Synchronized Readouts & Contrast Badges */}
        <div className="lg:col-span-6 space-y-6">
          {/* Readout Panels */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Color Formats & Copy.
            </h2>

            {/* HEX Input with Real-Time Contrast Visualizer against Neutral Background */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750 gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-12">HEX</span>
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  className="font-mono text-sm font-semibold bg-transparent text-slate-900 dark:text-white focus:outline-none w-28"
                />
              </div>

              {/* Real-Time Neutral Contrast Indicator for Color Input */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-[11px] shadow-2xs"
                  title={`WCAG contrast ratio against neutral canvas (${neutralBgHex}): ${contrastAgainstNeutral.toFixed(2)}:1`}
                >
                  <span className="text-[10px] uppercase font-bold text-slate-400">vs Neutral:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {contrastAgainstNeutral.toFixed(1)}:1
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase ${
                      contrastAgainstNeutral >= 7.0
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : contrastAgainstNeutral >= 4.5
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : contrastAgainstNeutral >= 3.0
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {contrastAgainstNeutral >= 7.0
                      ? 'AAA Pass'
                      : contrastAgainstNeutral >= 4.5
                      ? 'AA Pass'
                      : contrastAgainstNeutral >= 3.0
                      ? 'AA Large'
                      : 'Fail'}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(hex, 'hex')}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                  title="Copy HEX"
                >
                  {copiedKey === 'hex' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* RGB */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-12">RGB</span>
                <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </span>
              </div>
              <button
                onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                title="Copy RGB"
              >
                {copiedKey === 'rgb' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* HSL */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-12">HSL</span>
                <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                  hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                </span>
              </div>
              <button
                onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                title="Copy HSL"
              >
                {copiedKey === 'hsl' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* HSV */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-12">HSV</span>
                <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                  hsv({hsv.h}, {hsv.s}%, {hsv.v}%)
                </span>
              </div>
              <button
                onClick={() => handleCopy(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`, 'hsv')}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                title="Copy HSV"
              >
                {copiedKey === 'hsv' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* CMYK */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-12">CMYK</span>
                <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                  cmyk({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)
                </span>
              </div>
              <button
                onClick={() => handleCopy(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'cmyk')}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                title="Copy CMYK"
              >
                {copiedKey === 'cmyk' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Real-Time Neutral Contrast & WCAG Evaluation Visualizer */}
          <ColorInputContrastVisualizer
            color={hex}
            onColorChange={(newHex) => handleHexInputChange(newHex)}
          />
        </div>
      </div>
    </div>
  );
}
