'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Shuffle,
  Copy,
  Check,
  Download,
  Bookmark,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import {
  generateScheme,
  SchemeType,
  parseHex,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getRandomColor,
} from '@/lib/color/math';
import { exportPalettePng } from '@/lib/export/export';
import { saveFavoritePalette, addHistoryColor } from '@/lib/storage/store';

const HARMONY_MODES: { type: SchemeType; label: string; desc: string }[] = [
  { type: 'complementary', label: 'Complementary', desc: 'Direct opposite hues (180°) delivering intense contrast' },
  { type: 'analogous', label: 'Analogous', desc: 'Adjacent spectral hues (±30°) creating serene cohesion' },
  { type: 'triadic', label: 'Triadic', desc: 'Equidistant triad (120° apart) balancing vibrant energy' },
  { type: 'split-complementary', label: 'Split-Complementary', desc: 'Base hue plus two tones flanking its complement (150°, 210°)' },
  { type: 'tetradic', label: 'Tetradic (Rectangle)', desc: 'Two complementary pairs (90° intervals) offering rich variety' },
];

export default function ColorHarmonyPage() {
  const { showToast } = useToast();
  const [baseHex, setBaseHex] = useState('#3B82F6');
  const [activeMode, setActiveMode] = useState<SchemeType>('complementary');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const schemeColors = generateScheme(baseHex, activeMode);

  // Draw 360° Color Wheel on canvas with node markers
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 20;

    ctx.clearRect(0, 0, size, size);

    // Draw chromatic hue circle
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = ((angle - 1) * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      const rgb = hslToRgb({ h: angle, s: 90, l: 55 });
      ctx.fillStyle = rgbToHex(rgb);
      ctx.fill();
    }

    // Cut out inner circle for donut wheel
    ctx.beginPath();
    ctx.arc(center, center, radius * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();

    // Plot nodes for current scheme colors
    schemeColors.forEach((hex, idx) => {
      const p = parseHex(hex);
      if (!p) return;
      const hsl = rgbToHsl(p);
      const rad = (hsl.h * Math.PI) / 180;
      const nodeDist = radius * 0.78;
      const x = center + Math.cos(rad) * nodeDist;
      const y = center + Math.sin(rad) * nodeDist;

      // Draw connecting line from center
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Outer ring
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner color circle
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = hex;
      ctx.fill();
    });
  }, [schemeColors]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`);
    addHistoryColor(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleRandom = () => {
    const rHex = getRandomColor('random');
    setBaseHex(rHex);
    showToast(`Generated random anchor ${rHex}`);
  };

  const handleExportPng = () => {
    exportPalettePng(schemeColors, `${activeMode.toUpperCase()} Harmony`);
    showToast('Exported harmony palette PNG!');
  };

  const handleSavePalette = () => {
    saveFavoritePalette(`Harmony: ${activeMode} (${baseHex})`, schemeColors);
    showToast('Saved harmony palette to favorites!');
  };

  const currentModeInfo = HARMONY_MODES.find((m) => m.type === activeMode)!;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Color Harmony' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free Color Harmony Wheel &amp; Schemes.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Visualize geometric color relationships on an interactive 360° chromatic wheel using established color theory principles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Shuffle className="w-3.5 h-3.5" /> Random
          </button>
          <button
            onClick={handleSavePalette}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Bookmark className="w-3.5 h-3.5 text-rose-500" /> Save
          </button>
          <button
            onClick={handleExportPng}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export PNG
          </button>
        </div>
      </div>

      {/* Harmony Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {HARMONY_MODES.map((mode) => (
          <button
            key={mode.type}
            onClick={() => setActiveMode(mode.type)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeMode === mode.type
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {mode.label}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {mode.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive 360° Color Wheel Canvas */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="w-72 h-72 sm:w-80 sm:h-80 rounded-full shadow-lg"
          />
          <div className="text-xs text-slate-400 font-medium text-center">
            Geometric markers reflect active angle coordinates for {currentModeInfo.label}
          </div>
        </div>

        {/* Right Column: Base Color Input & Swatch Cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Base Color Picker */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-black/10 shadow-sm shrink-0">
                <input
                  type="color"
                  value={baseHex}
                  onChange={(e) => setBaseHex(e.target.value.toUpperCase())}
                  className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
                />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Anchor Color
                </div>
                <input
                  type="text"
                  value={baseHex}
                  onChange={(e) => setBaseHex(e.target.value.toUpperCase())}
                  className="font-mono text-sm font-semibold bg-transparent text-slate-900 dark:text-white uppercase focus:outline-none w-24"
                />
              </div>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {schemeColors.length} harmonic nodes
            </div>
          </div>

          {/* Swatch Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {schemeColors.map((hex, idx) => {
              const p = parseHex(hex) || { r: 0, g: 0, b: 0 };
              const hsl = rgbToHsl(p);
              return (
                <div
                  key={`${hex}-${idx}`}
                  className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <div className="h-28 w-full" style={{ backgroundColor: hex }} />
                  <div className="p-3 space-y-1 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {hex}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {hsl.h}° hue • {hsl.s}% sat
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(hex)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Copy HEX"
                    >
                      {copiedHex === hex ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
