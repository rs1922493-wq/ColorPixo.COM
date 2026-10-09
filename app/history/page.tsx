'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Trash2, Copy, Check, ExternalLink, ArrowRight, X } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import { getHistoryColors, clearHistoryColors, removeHistoryColor } from '@/lib/storage/store';

export default function HistoryPage() {
  const { showToast } = useToast();
  const [history, setHistory] = useState<string[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistoryColors());
  }, []);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleDeleteItem = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    removeHistoryColor(hex);
    setHistory((prev) => prev.filter((c) => c.toUpperCase() !== hex.toUpperCase()));
    showToast(`Removed ${hex} from history`);
  };

  const handleClear = () => {
    clearHistoryColors();
    setHistory([]);
    showToast('Cleared all history colors');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'History' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-purple-600 dark:text-purple-400" /> Color History.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Recent colors you have inspected, sampled, or copied across ColorPixo.Com tools. Saved locally in your browser.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors shadow-sm self-start md:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <p className="text-sm text-slate-500">Your recent color history is empty.</p>
          <Link
            href="/color-picker"
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-block"
          >
            Launch Color Picker &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {history.map((hex, idx) => (
            <div
              key={`${hex}-${idx}`}
              className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-purple-500 transition-all"
            >
              {/* Individual Delete Button */}
              <button
                onClick={(e) => handleDeleteItem(hex, e)}
                className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                title={`Delete ${hex} from history`}
                aria-label={`Delete ${hex}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <Link
                href={`/color/${hex.replace('#', '')}`}
                className="h-20 w-full block transition-transform group-hover:scale-105"
                style={{ backgroundColor: hex }}
              />

              <div className="p-2.5 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-900 dark:text-white truncate">
                  {hex}
                </span>
                <button
                  onClick={() => handleCopy(hex)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-purple-600"
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
          ))}
        </div>
      )}
    </div>
  );
}
