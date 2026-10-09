'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Trash2,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import {
  getFavoriteColors,
  removeFavoriteColor,
  getFavoritePalettes,
  removeFavoritePalette,
  FavoritePalette,
} from '@/lib/storage/store';
import { exportPalettePng, exportSwatchPng } from '@/lib/export/export';

export default function FavoritesPage() {
  const { showToast } = useToast();
  const [colors, setColors] = useState<string[]>([]);
  const [palettes, setPalettes] = useState<FavoritePalette[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setColors(getFavoriteColors());
    setPalettes(getFavoritePalettes());
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleRemoveColor = (hex: string) => {
    removeFavoriteColor(hex);
    setColors(getFavoriteColors());
    showToast(`Removed ${hex} from favorites`);
  };

  const handleRemovePalette = (id: string) => {
    removeFavoritePalette(id);
    setPalettes(getFavoritePalettes());
    showToast('Removed palette from favorites');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Favorites' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" /> Saved Favorites.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Colors and multi-step palettes you have bookmarked across tools. Stored securely and private in your browser local storage.
          </p>
        </div>
      </div>

      {/* Saved Palettes Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Saved Palettes ({palettes.length}).
        </h2>

        {palettes.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-sm text-slate-500">No favorite palettes saved yet.</p>
            <Link
              href="/palette-generator"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-block"
            >
              Explore Palette Generator &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {palettes.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.name.endsWith('.') ? item.name : `${item.name}.`}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => exportPalettePng(item.colors, item.name)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Export PNG"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemovePalette(item.id)}
                      className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Color Swatches Bar */}
                <div className="grid grid-cols-5 gap-1.5 h-16 rounded-xl overflow-hidden border border-black/10">
                  {item.colors.map((hex, i) => (
                    <button
                      key={i}
                      onClick={() => handleCopy(hex, `${item.id}-${i}`)}
                      className="h-full w-full relative group transition-transform hover:scale-105"
                      style={{ backgroundColor: hex }}
                      title={`Copy ${hex}`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-white bg-black/40 backdrop-blur-xs transition-opacity">
                        {copiedKey === `${item.id}-${i}` ? '✓' : hex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Individual Colors */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Saved Individual Colors ({colors.length}).
        </h2>

        {colors.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-sm text-slate-500">No individual colors favorited yet.</p>
            <Link
              href="/color-picker"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-block"
            >
              Pick Colors Now &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {colors.map((hex) => (
              <div
                key={hex}
                className="flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className="h-20 w-full" style={{ backgroundColor: hex }} />
                <div className="p-2.5 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-900 dark:text-white truncate">
                    {hex}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(hex, hex)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600"
                      title="Copy HEX"
                    >
                      {copiedKey === hex ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleRemoveColor(hex)}
                      className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded text-slate-400 hover:text-rose-600"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
