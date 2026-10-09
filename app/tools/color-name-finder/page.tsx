'use client';

import React, { useState } from 'react';
import { Search, Shuffle, Copy, Check, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import { findClosestColorName, COLOR_NAMES_DATABASE } from '@/lib/color/names';
import { parseHex, rgbToHex, getRandomColor } from '@/lib/color/math';

export default function ColorNameFinderPage() {
  const { showToast } = useToast();
  const [hexInput, setHexInput] = useState('#2563EB');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parsed = parseHex(hexInput) || { r: 37, g: 99, b: 235 };
  const currentHex = rgbToHex(parsed);
  const matchResult = findClosestColorName(currentHex);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleRandom = () => {
    const rHex = getRandomColor('random');
    setHexInput(rHex);
    showToast(`Inspecting random color ${rHex}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Color Name Finder' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free Color Name Finder &amp; Hex Identifier.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Match any hexadecimal or RGB color against 250+ standard color names using CIELAB perceptual distance ($\Delta E$).
          </p>
        </div>

        <button
          onClick={handleRandom}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm self-start md:self-auto"
        >
          <Shuffle className="w-3.5 h-3.5" /> Random Color
        </button>
      </div>

      {/* Main Matcher Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input and Closest Match Result */}
        <div className="lg:col-span-5 space-y-6">
          {/* Input Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Enter Color Code
            </label>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-black/10 shadow-sm shrink-0">
                <input
                  type="color"
                  value={currentHex}
                  onChange={(e) => setHexInput(e.target.value.toUpperCase())}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value.toUpperCase())}
                placeholder="#2563EB"
                className="w-full px-4 py-2.5 rounded-xl font-mono text-base font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Perceptual Nearest Match
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl shadow-inner border border-black/10 shrink-0"
                style={{ backgroundColor: matchResult.hex }}
              />
              <div className="min-w-0 space-y-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white truncate">
                  {matchResult.name.endsWith('.') ? matchResult.name : `${matchResult.name}.`}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {matchResult.hex}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {matchResult.similarityLabel}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {matchResult.similarityLabel} (ΔE = {matchResult.deltaE})
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Exact Match: {matchResult.isExact ? 'Yes (0.00)' : 'No (Approximation)'}
              </span>
              <button
                onClick={() => handleCopy(matchResult.name, 'name')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                {copiedKey === 'name' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Name
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Browse Named Colors Library */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Browse Color Lexicon ({COLOR_NAMES_DATABASE.length} Names).
              </h2>
              <span className="text-xs text-slate-400">Click any swatch to inspect</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
              {COLOR_NAMES_DATABASE.map((item) => (
                <button
                  key={`${item.name}-${item.hex}`}
                  onClick={() => {
                    setHexInput(item.hex);
                    showToast(`Selected ${item.name}`);
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group"
                >
                  <div
                    className="w-7 h-7 rounded-lg border border-black/10 shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: item.hex }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">{item.hex}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
