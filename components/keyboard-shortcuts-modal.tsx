'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Keyboard,
  X,
  Pipette,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Palette,
  Eye,
  SlidersHorizontal,
  Search,
  Layers,
  Shuffle,
  Code,
  Wand2,
  Disc,
  Home,
  Bookmark,
  ArrowRight,
  Check,
} from 'lucide-react';
import { TOOLS } from '@/lib/config/site';
import { useToolAdTransition } from './tool-ad-transition';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
}

const TOOL_ICONS: Record<string, React.ElementType> = {
  'color-picker': Pipette,
  'gradient-generator': Sparkles,
  'color-converter': RefreshCw,
  'image-color-picker': ImageIcon,
  'palette-generator': Palette,
  'contrast-checker': Eye,
  'color-blindness-simulator': SlidersHorizontal,
  'color-name-finder': Search,
  'shades-tints': Layers,
  'random-color': Shuffle,
  'css-color-generator': Code,
  'ai-palette-generator': Wand2,
  'color-harmony': Disc,
};

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  isEnabled,
  onToggleEnabled,
}: KeyboardShortcutsModalProps) {
  const router = useRouter();
  const { launchTool } = useToolAdTransition();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const globalShortcuts = [
    { key: '?', label: 'Open Shortcuts Cheat Sheet', desc: 'Toggle this keyboard shortcuts dialog', icon: Keyboard },
    { key: 'H', label: 'Go to Home', desc: 'Navigate to the main ColorPixo landing page', icon: Home, path: '/' },
    { key: 'F', label: 'Saved Favorites', desc: 'Open your saved colors and palettes collection', icon: Bookmark, path: '/favorites' },
    { key: '⌘K', label: 'Global Search', desc: 'Search all 13 tools, curated colors, and guides', icon: Search },
    { key: 'Esc', label: 'Close Dialogs', desc: 'Dismiss any open modal, dropdown, or search', icon: X },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl max-h-[88vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-purple-50/50 via-slate-50 to-blue-50/50 dark:from-purple-950/20 dark:via-slate-900 dark:to-blue-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="shortcuts-dialog-title"
                    className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"
                  >
                    <span>Keyboard Navigation Shortcuts.</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Press single keys anywhere to instantly launch tools
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Enable / Disable Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleEnabled(!isEnabled)}
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isEnabled
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                  }`}
                  title={isEnabled ? 'Click to disable shortcuts' : 'Click to enable shortcuts'}
                >
                  <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span>{isEnabled ? 'Shortcuts Active' : 'Shortcuts Paused'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* Highlighted Banner for Primary Shortcuts */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-200/80 dark:border-purple-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">Pro Tip:</span>
                  <span>Press <kbd className="px-1.5 py-0.5 font-mono font-bold bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 shadow-2xs">P</kbd> for Picker, <kbd className="px-1.5 py-0.5 font-mono font-bold bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 shadow-2xs">G</kbd> for Gradient, <kbd className="px-1.5 py-0.5 font-mono font-bold bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 shadow-2xs">C</kbd> for Converter</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  (Paused while typing in input boxes)
                </span>
              </div>

              {/* Tool Navigation Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <span>Tool Shortcuts</span>
                  <span className="text-[10px] lowercase text-slate-400 font-normal">click to launch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TOOLS.map((tool) => {
                    const Icon = TOOL_ICONS[tool.id] || Pipette;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onClose();
                          launchTool(tool.path, tool.name, tool.description);
                        }}
                        className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all text-left"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-750 text-slate-700 dark:text-slate-200 group-hover:bg-purple-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                              {tool.name}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {tool.category}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <kbd className="px-2 py-0.5 text-xs font-mono font-bold uppercase bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 rounded-md border border-purple-200 dark:border-purple-800 shadow-2xs group-hover:border-purple-500 transition-colors">
                            {tool.shortcut || tool.slug[0]}
                          </kbd>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Global Shortcuts */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Global Actions
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {globalShortcuts.map((sc) => {
                    const Icon = sc.icon;
                    return (
                      <div
                        key={sc.key}
                        onClick={() => sc.path && handleNavigate(sc.path)}
                        className={`flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 ${
                          sc.path ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-750 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {sc.label}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {sc.desc}
                            </div>
                          </div>
                        </div>

                        <kbd className="px-2 py-0.5 text-xs font-mono font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 ml-2">
                          {sc.key}
                        </kbd>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Shortcuts operate instantly across all pages</span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:bg-purple-600 dark:hover:bg-white transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
