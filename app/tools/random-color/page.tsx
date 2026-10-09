'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shuffle,
  Copy,
  Check,
  Download,
  Bookmark,
  Sparkles,
  Lock,
  Unlock,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import {
  getRandomColor,
  parseHex,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  getContrastRatio,
  RGB,
} from '@/lib/color/math';
import { exportSwatchPng, exportPalettePng } from '@/lib/export/export';
import { addHistoryColor, saveFavoritePalette } from '@/lib/storage/store';

type RandomMode = 'random' | 'pastel' | 'neon' | 'dark' | 'light' | 'warm' | 'cool';

const MODES: { id: RandomMode; label: string }[] = [
  { id: 'random', label: 'All Spectrum' },
  { id: 'pastel', label: 'Pastel & Soft' },
  { id: 'neon', label: 'Neon & Cyber' },
  { id: 'dark', label: 'Deep & Dark' },
  { id: 'light', label: 'Clean & Light' },
  { id: 'warm', label: 'Warm Hues' },
  { id: 'cool', label: 'Cool Hues' },
];

export default function RandomColorPage() {
  const { showToast } = useToast();
  const [mode, setMode] = useState<RandomMode>('random');
  const [singleColor, setSingleColor] = useState('#3B82F6');
  const [paletteColors, setPaletteColors] = useState<{ hex: string; isLocked: boolean }[]>([
    { hex: '#3B82F6', isLocked: false },
    { hex: '#EC4899', isLocked: false },
    { hex: '#10B981', isLocked: false },
    { hex: '#F59E0B', isLocked: false },
    { hex: '#8B5CF6', isLocked: false },
  ]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const generateNewColors = useCallback(() => {
    // Generate new single color
    const newSingle = getRandomColor(mode);
    setSingleColor(newSingle);
    addHistoryColor(newSingle);

    // Update unlocked in palette
    setPaletteColors((prev) =>
      prev.map((c) => (c.isLocked ? c : { ...c, hex: getRandomColor(mode) }))
    );
  }, [mode]);

  // Spacebar hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        generateNewColors();
        showToast('Generated fresh colors!');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateNewColors, showToast]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const toggleLock = (index: number) => {
    setPaletteColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  const rgb = parseHex(singleColor) || { r: 59, g: 130, b: 246 };
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);
  const contrastWhite = getContrastRatio(rgb, { r: 255, g: 255, b: 255 });
  const contrastBlack = getContrastRatio(rgb, { r: 0, g: 0, b: 0 });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Random Color Generator' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free Random Color Generator.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Explore randomized colors by mood filter (Pastel, Neon, Dark, Warm, Cool). Press Space to randomize or lock cards you want to keep.
          </p>
        </div>

        <button
          onClick={() => {
            generateNewColors();
            showToast('Generated new random colors!');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors self-start md:self-auto"
        >
          <Shuffle className="w-3.5 h-3.5" /> Randomize Colors
          <kbd className="hidden sm:inline-block ml-1 text-[10px] bg-blue-700 px-1.5 py-0.2 rounded font-mono">
            SPACE
          </kbd>
        </button>
      </div>

      {/* Mood Filters Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              mode === m.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Hero Single Random Color Inspector */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Big Swatch */}
        <div className="lg:col-span-5">
          <div
            className="w-full h-64 rounded-2xl shadow-inner border border-black/10 flex flex-col justify-between p-4"
            style={{ backgroundColor: singleColor }}
          >
            <div className="flex justify-end">
              <button
                onClick={() => exportSwatchPng(singleColor)}
                className="p-2 rounded-xl bg-black/20 text-white hover:bg-black/40 backdrop-blur-xs transition-colors"
                title="Export PNG"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl backdrop-blur-md border border-white/20 flex items-center justify-between">
              <span className="font-mono text-xl font-black text-slate-900 dark:text-white">
                {singleColor}
              </span>
              <button
                onClick={() => handleCopy(singleColor, 'hero')}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
              >
                {copiedKey === 'hero' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Readout Panels */}
        <div className="lg:col-span-7 space-y-4">
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
              <span className="text-slate-400 font-bold block mb-1">HSV</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {hsv.h}°, {hsv.s}%, {hsv.v}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750">
              <span className="text-slate-400 font-bold block mb-1">CMYK</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}
              </span>
            </div>
          </div>

          {/* Legibility */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Contrast on White: <strong className="font-mono">{contrastWhite}:1</strong></span>
            <span>•</span>
            <span>Contrast on Black: <strong className="font-mono">{contrastBlack}:1</strong></span>
          </div>
        </div>
      </div>

      {/* 5-Color Random Palette Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            5-Color Random Palette.
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                saveFavoritePalette(
                  `Random Palette (${mode})`,
                  paletteColors.map((c) => c.hex)
                );
                showToast('Saved random palette to favorites!');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-rose-500" /> Save Palette
            </button>
            <button
              onClick={() =>
                exportPalettePng(
                  paletteColors.map((c) => c.hex),
                  `Random ${mode.toUpperCase()} Palette`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export PNG
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {paletteColors.map((card, idx) => (
            <div
              key={idx}
              className="h-44 rounded-xl flex flex-col justify-between p-3 border border-slate-200/50 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1"
              style={{ backgroundColor: card.hex }}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleLock(idx)}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/40 backdrop-blur-xs transition-colors"
                  title={card.isLocked ? 'Unlock color' : 'Lock color'}
                >
                  {card.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 opacity-70" />}
                </button>
                <button
                  onClick={() => handleCopy(card.hex, `palette-${idx}`)}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/40 backdrop-blur-xs transition-colors"
                  title="Copy HEX"
                >
                  {copiedKey === `palette-${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <div className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-lg backdrop-blur-md border border-white/20 font-mono text-xs font-bold text-center text-slate-900 dark:text-white">
                {card.hex}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
