'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shuffle,
  Lock,
  Unlock,
  Copy,
  Check,
  Download,
  Bookmark,
  Share2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import {
  generateScheme,
  SchemeType,
  getRandomColor,
  parseHex,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getContrastRatio,
  clamp,
} from '@/lib/color/math';
import { exportPalettePng, downloadText, shareOrCopy } from '@/lib/export/export';
import { saveFavoritePalette, addHistoryColor } from '@/lib/storage/store';

interface PaletteCard {
  id: string;
  hex: string;
  isLocked: boolean;
}

const SCHEMES: { type: SchemeType; label: string }[] = [
  { type: 'complementary', label: 'Complementary' },
  { type: 'analogous', label: 'Analogous' },
  { type: 'triadic', label: 'Triadic' },
  { type: 'split-complementary', label: 'Split-Complementary' },
  { type: 'tetradic', label: 'Tetradic' },
  { type: 'monochromatic', label: 'Monochromatic' },
  { type: 'neutral', label: 'Neutral Minimal' },
  { type: 'pastel', label: 'Soft Pastel' },
  { type: 'vibrant', label: 'Vibrant Pop' },
];

export default function PaletteGeneratorPage() {
  const { showToast } = useToast();
  const [baseHex, setBaseHex] = useState('#3B82F6');
  const [activeScheme, setActiveScheme] = useState<SchemeType>('analogous');
  const [cards, setCards] = useState<PaletteCard[]>([
    { id: '1', hex: '#3B82F6', isLocked: false },
    { id: '2', hex: '#60A5FA', isLocked: false },
    { id: '3', hex: '#93C5FD', isLocked: false },
    { id: '4', hex: '#2563EB', isLocked: false },
    { id: '5', hex: '#1D4ED8', isLocked: false },
  ]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Apply scheme based on baseHex
  const applyScheme = useCallback(
    (hex: string, scheme: SchemeType) => {
      const generated = generateScheme(hex, scheme);
      setCards((prev) =>
        generated.slice(0, 5).map((newCol, idx) => {
          if (prev[idx]?.isLocked) {
            return prev[idx];
          }
          return {
            id: prev[idx]?.id || String(idx + 1),
            hex: newCol,
            isLocked: false,
          };
        })
      );
    },
    []
  );

  // Initial load & scheme synchronization
  useEffect(() => {
    applyScheme(baseHex, activeScheme);
  }, [applyScheme, baseHex, activeScheme]);

  // Regenerate / Randomize unlocked colors
  const handleRandomize = useCallback(() => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.isLocked) return card;
        const rand = getRandomColor('random');
        return { ...card, hex: rand };
      })
    );
    showToast('Generated new palette (unlocked colors updated)');
  }, [showToast]);

  // Spacebar hotkey to regenerate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        handleRandomize();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRandomize]);

  const toggleLock = (index: number) => {
    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  const updateCardHex = (index: number, newHex: string) => {
    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, hex: newHex } : c))
    );
  };

  const handleCopy = (hex: string, key: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedKey(key);
    showToast(`Copied ${hex} to clipboard!`);
    addHistoryColor(hex);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleExportPng = () => {
    exportPalettePng(
      cards.map((c) => c.hex),
      `${activeScheme.toUpperCase()} Palette`
    );
    showToast('Exported palette PNG card!');
  };

  const handleExportCss = () => {
    const lines = cards
      .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
      .join('\n');
    const css = `:root {\n${lines}\n}`;
    downloadText(css, `palette-${Date.now()}.css`, 'text/css');
    showToast('Downloaded CSS variables stylesheet!');
  };

  const handleExportJson = () => {
    const json = JSON.stringify(
      {
        scheme: activeScheme,
        createdAt: new Date().toISOString(),
        colors: cards.map((c, i) => ({ step: i + 1, hex: c.hex })),
      },
      null,
      2
    );
    downloadText(json, `palette-${Date.now()}.json`, 'application/json');
    showToast('Downloaded JSON palette file!');
  };

  const handleSaveToFavorites = () => {
    saveFavoritePalette(
      `${activeScheme} (${baseHex})`,
      cards.map((c) => c.hex)
    );
    showToast('Saved palette to favorites!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Palette Generator' },
        ]}
      />

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free Color Palette Generator.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Create cohesive color harmonies based on color theory. Lock specific cards, press Space to randomize unlocked colors, and export to CSS, JSON, or PNG.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" /> Randomize
            <kbd className="hidden sm:inline-block ml-1 text-[10px] bg-blue-700 px-1.5 py-0.2 rounded font-mono">
              SPACE
            </kbd>
          </button>
          <button
            onClick={handleSaveToFavorites}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Bookmark className="w-3.5 h-3.5 text-rose-500" /> Save
          </button>
          <button
            onClick={handleExportPng}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> PNG
          </button>
          <button
            onClick={handleExportCss}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            CSS
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            JSON
          </button>
        </div>
      </div>

      {/* Scheme & Base Color Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Base Color Picker */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-black/10 shadow-sm shrink-0">
            <input
              type="color"
              value={baseHex}
              onChange={(e) => {
                const hex = e.target.value;
                setBaseHex(hex);
                applyScheme(hex, activeScheme);
              }}
              className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
            />
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Anchor Color
            </div>
            <input
              type="text"
              value={baseHex}
              onChange={(e) => {
                setBaseHex(e.target.value);
                const p = parseHex(e.target.value);
                if (p) applyScheme(rgbToHex(p), activeScheme);
              }}
              className="font-mono text-xs font-semibold bg-transparent text-slate-900 dark:text-white uppercase focus:outline-none w-20"
            />
          </div>
        </div>

        {/* Scheme Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {SCHEMES.map((scheme) => (
            <button
              key={scheme.type}
              onClick={() => {
                setActiveScheme(scheme.type);
                applyScheme(baseHex, scheme.type);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeScheme === scheme.type
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
              }`}
            >
              {scheme.label}
            </button>
          ))}
        </div>
      </div>

      {/* The 5 Interactive Color Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card, index) => {
          const rgb = parseHex(card.hex) || { r: 0, g: 0, b: 0 };
          const contrastWhite = getContrastRatio(rgb, { r: 255, g: 255, b: 255 });
          const textColor = contrastWhite >= 4.5 ? '#FFFFFF' : '#0F172A';

          return (
            <div
              key={card.id}
              className="group relative flex flex-col justify-between h-96 sm:h-[420px] rounded-2xl overflow-hidden shadow-md border border-slate-200/50 dark:border-slate-800 transition-transform hover:-translate-y-1"
              style={{ backgroundColor: card.hex }}
            >
              {/* Top Controls: Lock & Copy */}
              <div className="flex items-center justify-between p-3.5 bg-black/10 backdrop-blur-xs">
                <button
                  onClick={() => toggleLock(index)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/40 transition-colors text-white shadow-sm"
                  title={card.isLocked ? 'Unlock color' : 'Lock color'}
                >
                  {card.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4 opacity-70" />}
                </button>
                <button
                  onClick={() => handleCopy(card.hex, `card-${index}`)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/40 transition-colors text-white shadow-sm"
                  title="Copy HEX"
                >
                  {copiedKey === `card-${index}` ? (
                    <Check className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Bottom Information Card */}
              <div
                className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md m-3 rounded-xl border border-white/20 dark:border-slate-800 space-y-2"
                style={{ color: undefined }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white uppercase">
                    {card.hex}
                  </span>
                  <div className="relative w-6 h-6 rounded-md overflow-hidden border border-black/10">
                    <input
                      type="color"
                      value={card.hex}
                      onChange={(e) => updateCardHex(index, e.target.value.toUpperCase())}
                      className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </div>

                {/* Quick Lightness Adjust Buttons */}
                <div className="flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      const hsl = rgbToHsl(rgb);
                      const lighter = rgbToHex(hslToRgb({ ...hsl, l: clamp(hsl.l + 8, 0, 100) }));
                      updateCardHex(index, lighter);
                    }}
                    className="flex-1 py-1 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                    title="Lighten"
                  >
                    + Light
                  </button>
                  <button
                    onClick={() => {
                      const hsl = rgbToHsl(rgb);
                      const darker = rgbToHex(hslToRgb({ ...hsl, l: clamp(hsl.l - 8, 0, 100) }));
                      updateCardHex(index, darker);
                    }}
                    className="flex-1 py-1 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                    title="Darken"
                  >
                    - Dark
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
