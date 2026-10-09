'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  AlertTriangle,
  Sparkles,
  Sliders,
  Code,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import { getContrastRatio, parseHex } from '@/lib/color/math';
import { downloadText } from '@/lib/export/export';

interface ThemeColorRole {
  key: string;
  label: string;
  hex: string;
  description: string;
}

export default function CssColorGeneratorPage() {
  const { showToast } = useToast();
  const [format, setFormat] = useState<'css' | 'tailwind' | 'scss'>('css');
  const [copied, setCopied] = useState(false);

  const [roles, setRoles] = useState<ThemeColorRole[]>([
    { key: 'primary', label: 'Primary Brand', hex: '#2563EB', description: 'Hero CTAs and primary identity' },
    { key: 'secondary', label: 'Secondary Tone', hex: '#64748B', description: 'Secondary buttons and subtle fills' },
    { key: 'accent', label: 'Dynamic Accent', hex: '#F59E0B', description: 'Badges, conversion highlights, and alerts' },
    { key: 'background', label: 'Canvas Background', hex: '#0B0F19', description: 'Main screen canvas backdrop' },
    { key: 'surface', label: 'Card Surface', hex: '#1E293B', description: 'Elevated containers, cards, and modals' },
    { key: 'text', label: 'Primary Text', hex: '#F8FAFC', description: 'High-contrast headings and body copy' },
    { key: 'muted', label: 'Muted Text', hex: '#94A3B8', description: 'Subheadings and placeholder labels' },
    { key: 'border', label: 'Interface Border', hex: '#334155', description: 'Separators and card outlines' },
  ]);

  const updateRoleColor = (key: string, newHex: string) => {
    setRoles((prev) =>
      prev.map((r) => (r.key === key ? { ...r, hex: newHex.toUpperCase() } : r))
    );
  };

  // Contrast check
  const textRole = roles.find((r) => r.key === 'text')!;
  const bgRole = roles.find((r) => r.key === 'background')!;
  const contrastRatio = getContrastRatio(
    parseHex(textRole.hex) || { r: 255, g: 255, b: 255 },
    parseHex(bgRole.hex) || { r: 0, g: 0, b: 0 }
  );

  // Generate code string
  const getCodeSnippet = () => {
    if (format === 'css') {
      const vars = roles.map((r) => `  --color-${r.key}: ${r.hex};`).join('\n');
      return `:root {\n${vars}\n}`;
    }
    if (format === 'tailwind') {
      const colorsObj = roles
        .map((r) => `      '${r.key}': '${r.hex}',`)
        .join('\n');
      return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colorsObj}\n      },\n    },\n  },\n};`;
    }
    // scss
    return roles.map((r) => `$color-${r.key}: ${r.hex};`).join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    showToast(`Copied ${format.toUpperCase()} tokens to clipboard!`);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const ext = format === 'tailwind' ? 'js' : format;
    const mime = format === 'tailwind' ? 'application/javascript' : 'text/css';
    downloadText(getCodeSnippet(), `theme-tokens.${ext}`, mime);
    showToast(`Downloaded theme-tokens.${ext}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'CSS Color Generator' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free CSS Color Variable &amp; Palette Generator.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Configure semantic UI color roles with live contrast health checks. Export ready-to-use CSS Variables, Tailwind theme extensions, or SCSS variables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Download File
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Tokens'}
          </button>
        </div>
      </div>

      {/* Contrast Warning Banner if < 4.5:1 */}
      {contrastRatio < 4.5 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong>Contrast Warning:</strong> Text ({textRole.hex}) on Background ({bgRole.hex}) has a contrast ratio of{' '}
            <strong>{contrastRatio}:1</strong>, which is below the WCAG AA minimum of 4.5:1. Consider lightening or darkening your text color.
          </div>
        </div>
      )}

      {/* Main Grid: Role Editor vs Code Export */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Role List */}
        <div className="lg:col-span-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Semantic Color Roles.
          </h2>

          <div className="space-y-2.5">
            {roles.map((role) => (
              <div
                key={role.key}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-black/10 shadow-sm shrink-0">
                    <input
                      type="color"
                      value={role.hex}
                      onChange={(e) => updateRoleColor(role.key, e.target.value)}
                      className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {role.label}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {role.description}
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  value={role.hex}
                  onChange={(e) => updateRoleColor(role.key, e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg font-mono text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase focus:outline-none text-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Code Export Box */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Generated Code Output.
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
              {(['css', 'tailwind', 'scss'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`px-3 py-1 rounded-md transition-colors uppercase ${
                    format === fmt
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 overflow-x-auto text-xs font-mono text-blue-300 min-h-[360px]">
              <pre>{getCodeSnippet()}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
