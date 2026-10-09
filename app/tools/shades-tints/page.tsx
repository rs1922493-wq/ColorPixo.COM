'use client';

import React, { useState } from 'react';
import { Copy, Check, Download, Shuffle, Bookmark } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import {
  generateTints,
  generateShades,
  generateTones,
  parseHex,
  rgbToHex,
  getRandomColor,
} from '@/lib/color/math';
import { downloadText, exportPalettePng } from '@/lib/export/export';
import { saveFavoritePalette, addHistoryColor } from '@/lib/storage/store';

export default function ShadesTintsPage() {
  const { showToast } = useToast();
  const [baseHex, setBaseHex] = useState('#3B82F6');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const tints = generateTints(baseHex, 10);
  const shades = generateShades(baseHex, 10);
  const tones = generateTones(baseHex, 10);

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
    showToast(`Generated random base color ${rHex}`);
  };

  const handleCopyAllCss = () => {
    let css = `:root {\n  /* Base */\n  --color-base: ${baseHex};\n\n  /* Tints (Blend to White) */\n`;
    tints.forEach((t, i) => {
      css += `  --tint-${(i + 1) * 10}: ${t};\n`;
    });
    css += `\n  /* Shades (Blend to Black) */\n`;
    shades.forEach((s, i) => {
      css += `  --shade-${(i + 1) * 10}: ${s};\n`;
    });
    css += `\n  /* Tones (Blend to Gray) */\n`;
    tones.forEach((tn, i) => {
      css += `  --tone-${(i + 1) * 10}: ${tn};\n`;
    });
    css += `}`;

    navigator.clipboard.writeText(css);
    showToast('Copied full CSS variables scale to clipboard!');
  };

  const handleExportJson = () => {
    const data = {
      base: baseHex,
      tints,
      shades,
      tones,
      generatedAt: new Date().toISOString(),
    };
    downloadText(JSON.stringify(data, null, 2), `shades-tints-${Date.now()}.json`, 'application/json');
    showToast('Downloaded scales JSON file!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Shades & Tints' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free Color Shades &amp; Tints Generator.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Produce a systematic 10-step scale of tints (added white), shades (added black), and tones (added neutral gray) for consistent UI design tokens.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Shuffle className="w-3.5 h-3.5" /> Random
          </button>
          <button
            onClick={handleCopyAllCss}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" /> Copy All CSS
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>
      </div>

      {/* Base Color Picker Bar */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-md">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-black/10 shadow-sm shrink-0">
          <input
            type="color"
            value={baseHex}
            onChange={(e) => setBaseHex(e.target.value.toUpperCase())}
            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
          />
        </div>
        <div className="space-y-0.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Anchor Base Color
          </div>
          <input
            type="text"
            value={baseHex}
            onChange={(e) => {
              setBaseHex(e.target.value);
              const p = parseHex(e.target.value);
              if (p) setBaseHex(rgbToHex(p));
            }}
            className="font-mono text-base font-bold bg-transparent text-slate-900 dark:text-white uppercase focus:outline-none w-28"
          />
        </div>
      </div>

      {/* Tints Section (Blend to White) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Tints (Lightened with White).
            </h2>
            <p className="text-xs text-slate-500">Ideal for background fills, subtle highlights, and hover states</p>
          </div>
          <span className="text-xs font-mono text-slate-400">10 Steps &rarr; White</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {tints.map((hex, i) => (
            <button
              key={`tint-${hex}-${i}`}
              onClick={() => handleCopy(hex)}
              className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform text-left"
            >
              <div className="h-20 w-full" style={{ backgroundColor: hex }} />
              <div className="p-2 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                  {hex}
                </span>
                {copiedHex === hex ? (
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Shades Section (Blend to Black) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Shades (Darkened with Black).
            </h2>
            <p className="text-xs text-slate-500">Ideal for high-contrast typography, shadows, borders, and active states</p>
          </div>
          <span className="text-xs font-mono text-slate-400">10 Steps &rarr; Black</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {shades.map((hex, i) => (
            <button
              key={`shade-${hex}-${i}`}
              onClick={() => handleCopy(hex)}
              className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform text-left"
            >
              <div className="h-20 w-full" style={{ backgroundColor: hex }} />
              <div className="p-2 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                  {hex}
                </span>
                {copiedHex === hex ? (
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tones Section (Blend to Gray) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Tones (Desaturated with Mid-Gray #808080).
            </h2>
            <p className="text-xs text-slate-500">Muted, sophisticated neutrals that retain the original hue&apos;s character</p>
          </div>
          <span className="text-xs font-mono text-slate-400">10 Steps &rarr; Gray</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {tones.map((hex, i) => (
            <button
              key={`tone-${hex}-${i}`}
              onClick={() => handleCopy(hex)}
              className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform text-left"
            >
              <div className="h-20 w-full" style={{ backgroundColor: hex }} />
              <div className="p-2 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                  {hex}
                </span>
                {copiedHex === hex ? (
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
