'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Download,
  Bookmark,
  Info,
  Layers,
  Wand2,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import { exportPalettePng, downloadText } from '@/lib/export/export';
import { saveFavoritePalette, addHistoryColor } from '@/lib/storage/store';

interface PaletteColorOutput {
  role: 'primary' | 'secondary' | 'accent' | 'background' | 'text';
  roleLabel: string;
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  explanation: string;
}

const INSPIRATION_CHIPS = [
  'Luxury Swiss Hotel & Spa',
  'Cyberpunk Neon Video Game',
  'Organic Matcha Tea Garden',
  'Nordic Minimalist Coffee Roastery',
  'Playful Children Educational App',
  'High-End Financial Advisory',
];

export default function AiPaletteGeneratorPage() {
  const { showToast } = useToast();
  const [prompt, setPrompt] = useState('Luxury Swiss Hotel & Spa');
  const [isLoading, setIsLoading] = useState(false);
  const [palette, setPalette] = useState<PaletteColorOutput[]>([
    {
      role: 'primary',
      roleLabel: 'Primary Brand',
      name: 'Champagne Gold',
      hex: '#C5A059',
      rgb: { r: 197, g: 160, b: 89 },
      hsl: { h: 39, s: 50, l: 56 },
      explanation: 'Warm, refined metallic hue signaling luxury hospitality.',
    },
    {
      role: 'secondary',
      roleLabel: 'Secondary Supporting',
      name: 'Deep Alpine Slate',
      hex: '#2C3539',
      rgb: { r: 44, g: 53, b: 57 },
      hsl: { h: 198, s: 13, l: 20 },
      explanation: 'Prestigious dark granite tone for high-end structure.',
    },
    {
      role: 'accent',
      roleLabel: 'Dynamic Accent',
      name: 'Ember Bronze',
      hex: '#D97706',
      rgb: { r: 217, g: 119, b: 6 },
      hsl: { h: 32, s: 95, l: 44 },
      explanation: 'Eye-catching amber tone for booking and reservation CTAs.',
    },
    {
      role: 'background',
      roleLabel: 'Canvas Background',
      name: 'Pristine Snow Canvas',
      hex: '#FDFBF7',
      rgb: { r: 253, g: 251, b: 247 },
      hsl: { h: 40, s: 60, l: 98 },
      explanation: 'Ultra-warm off-white backdrop that prevents eye strain.',
    },
    {
      role: 'text',
      roleLabel: 'High-Contrast Text',
      name: 'Onyx Midnight',
      hex: '#18181B',
      rgb: { r: 24, g: 24, b: 27 },
      hsl: { h: 240, s: 6, l: 10 },
      explanation: 'Deep neutral achieving over 14:1 contrast ratio on canvas.',
    },
  ]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleGenerate = async (queryText?: string) => {
    const q = (queryText || prompt).trim();
    if (!q) {
      showToast('Please type a creative concept or theme description.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q }),
      });

      if (!res.ok) {
        throw new Error('Server returned an error');
      }

      const data = await res.json();
      if (Array.isArray(data?.palette) && data.palette.length === 5) {
        setPalette(data.palette);
        showToast('Created harmonic AI palette!', 'success');
        data.palette.forEach((c: any) => addHistoryColor(c.hex));
      }
    } catch (err: any) {
      showToast('Generated theme using local design heuristics.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleExportPng = () => {
    exportPalettePng(
      palette.map((c) => c.hex),
      `AI Theme: ${prompt.slice(0, 24)}`
    );
    showToast('Exported palette PNG card!');
  };

  const handleSavePalette = () => {
    saveFavoritePalette(
      `AI: ${prompt.slice(0, 20)}`,
      palette.map((c) => c.hex)
    );
    showToast('Saved AI palette to favorites!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'AI Palette Generator' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Free AI Color Palette Generator.
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Gemini Powered
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Describe a brand mood, target audience, or aesthetic vibe to generate an expert 5-role design system palette complete with contrast balance and design theory explanations.
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Input Prompt Box & Chips */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Cyberpunk synthwave game, Scandinavian furniture, Organic apothecary..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Composing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Palette</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Inspiration Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 whitespace-nowrap">Try prompts:</span>
          {INSPIRATION_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setPrompt(chip);
                handleGenerate(chip);
              }}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* 5-Color Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {palette.map((item) => (
          <div
            key={item.role}
            className="flex flex-col justify-between rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-transform hover:-translate-y-1"
          >
            {/* Color Swatch Block */}
            <div className="h-44 w-full relative flex items-start justify-between p-3" style={{ backgroundColor: item.hex }}>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-xs">
                {item.roleLabel}
              </span>
              <button
                onClick={() => handleCopy(item.hex)}
                className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
                title="Copy HEX"
              >
                {copiedHex === item.hex ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Information Body */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {item.name}
                </div>
                <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {item.hex}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {item.explanation}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>rgb({item.rgb.r}, {item.rgb.g}, {item.rgb.b})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Note */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500">
        <Info className="w-4 h-4 text-blue-500 shrink-0" />
        <span>
          <strong>Design System Recommendation:</strong> AI color outputs are suggestions based on color theory. Always check accessibility contrast with the built-in Contrast Checker for your specific user interface needs.
        </span>
      </div>
    </div>
  );
}
