'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Shuffle,
  Plus,
  Trash2,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import { exportGradientPng, downloadText } from '@/lib/export/export';
import { getRandomColor } from '@/lib/color/math';

interface GradientStop {
  id: string;
  color: string;
  offset: number; // 0 - 100
}

const PRESET_GRADIENTS = [
  {
    name: 'ColorPixo Brand',
    type: 'linear' as const,
    angle: 135,
    stops: [
      { id: '1', color: '#7C3AED', offset: 0 },
      { id: '2', color: '#EC4899', offset: 50 },
      { id: '3', color: '#06B6D4', offset: 100 },
    ],
  },
  {
    name: 'Ibiza Sunset',
    type: 'linear' as const,
    angle: 45,
    stops: [
      { id: '1', color: '#EE0979', offset: 0 },
      { id: '2', color: '#FF6A00', offset: 100 },
    ],
  },
  {
    name: 'Cyberpunk Aurora',
    type: 'linear' as const,
    angle: 90,
    stops: [
      { id: '1', color: '#00F2FE', offset: 0 },
      { id: '2', color: '#4FACFE', offset: 100 },
    ],
  },
  {
    name: 'Hyper Sunrise',
    type: 'linear' as const,
    angle: 135,
    stops: [
      { id: '1', color: '#FF512F', offset: 0 },
      { id: '2', color: '#DD2476', offset: 100 },
    ],
  },
  {
    name: 'Radial Sunbeam',
    type: 'radial' as const,
    angle: 0,
    stops: [
      { id: '1', color: '#FFD200', offset: 0 },
      { id: '2', color: '#F7971E', offset: 100 },
    ],
  },
  {
    name: 'Deep Oceanic',
    type: 'linear' as const,
    angle: 135,
    stops: [
      { id: '1', color: '#2E3192', offset: 0 },
      { id: '2', color: '#1BFFFF', offset: 100 },
    ],
  },
  {
    name: 'Conic Rainbow Flow',
    type: 'conic' as const,
    angle: 45,
    stops: [
      { id: '1', color: '#00F2FE', offset: 0 },
      { id: '2', color: '#4FACFE', offset: 50 },
      { id: '3', color: '#00F2FE', offset: 100 },
    ],
  },
];

export default function GradientGeneratorPage() {
  const { showToast } = useToast();
  const [type, setType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<GradientStop[]>([
    { id: '1', color: '#FF512F', offset: 0 },
    { id: '2', color: '#DD2476', offset: 100 },
  ]);
  const [isCopied, setIsCopied] = useState(false);

  // Compute CSS gradient string
  const sortedStops = [...stops].sort((a, b) => a.offset - b.offset);
  const stopsCss = sortedStops.map((s) => `${s.color} ${s.offset}%`).join(', ');

  let cssValue = '';
  if (type === 'linear') {
    cssValue = `linear-gradient(${angle}deg, ${stopsCss})`;
  } else if (type === 'radial') {
    cssValue = `radial-gradient(circle at center, ${stopsCss})`;
  } else {
    cssValue = `conic-gradient(from ${angle}deg at 50% 50%, ${stopsCss})`;
  }

  const handleCopyCss = () => {
    const fullCss = `background: ${cssValue};`;
    navigator.clipboard.writeText(fullCss);
    setIsCopied(true);
    showToast('Copied CSS gradient to clipboard!');
    setTimeout(() => setIsCopied(false), 1800);
  };

  const handleRandomize = () => {
    const c1 = getRandomColor('vibrant' as any);
    const c2 = getRandomColor('vibrant' as any);
    setStops([
      { id: '1', color: c1, offset: 0 },
      { id: '2', color: c2, offset: 100 },
    ]);
    setAngle(Math.floor(Math.random() * 360));
    showToast('Generated random gradient!');
  };

  const addStop = () => {
    if (stops.length >= 5) {
      showToast('Maximum 5 color stops supported for clean gradients.', 'info');
      return;
    }
    const newColor = getRandomColor('pastel');
    const newStop: GradientStop = {
      id: `${Date.now()}`,
      color: newColor,
      offset: 50,
    };
    setStops([...stops, newStop]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) {
      showToast('A gradient requires at least 2 color stops.', 'error');
      return;
    }
    setStops(stops.filter((s) => s.id !== id));
  };

  const updateStop = (id: string, updates: Partial<GradientStop>) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const loadPreset = (preset: typeof PRESET_GRADIENTS[0]) => {
    setType(preset.type);
    setAngle(preset.angle);
    setStops(preset.stops);
    showToast(`Loaded ${preset.name} preset`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Gradient Generator' },
        ]}
      />

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free CSS Gradient Generator.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Design multi-stop linear, radial, and conic gradients with live interactive canvas previews, angle compass control, and one-click CSS and PNG exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Shuffle className="w-3.5 h-3.5" /> Random
          </button>
          <button
            onClick={() => exportGradientPng(type, stops, angle)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export PNG
          </button>
          <button
            onClick={handleCopyCss}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {isCopied ? 'Copied' : 'Copy CSS'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Preview & CSS Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gradient Preview Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div
              className="w-full h-80 sm:h-96 rounded-xl shadow-inner border border-black/10 transition-all duration-200"
              style={{ background: cssValue }}
            />

            {/* Generated CSS Box */}
            <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs flex items-center justify-between gap-4 border border-slate-800">
              <span className="truncate select-all text-blue-300">
                background: {cssValue};
              </span>
              <button
                onClick={handleCopyCss}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0"
                title="Copy CSS snippet"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Preset Gallery */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Curated Designer Presets.
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_GRADIENTS.map((preset) => {
                const pStops = preset.stops.map((s) => `${s.color} ${s.offset}%`).join(', ');
                const pCss =
                  preset.type === 'linear'
                    ? `linear-gradient(${preset.angle}deg, ${pStops})`
                    : preset.type === 'radial'
                    ? `radial-gradient(circle, ${pStops})`
                    : `conic-gradient(from ${preset.angle}deg, ${pStops})`;

                return (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="group flex flex-col items-start p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all text-left"
                  >
                    <div
                      className="w-full h-16 rounded-lg mb-2 shadow-xs group-hover:scale-[1.02] transition-transform"
                      style={{ background: pCss }}
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{preset.type}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Stop Editor */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Gradient Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Gradient Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'conic'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                      type === t
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle Slider (for linear and conic) */}
            {type !== 'radial' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Angle Direction</span>
                  <span className="font-mono">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {/* Color Stops Manager */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Color Stops ({stops.length})
                </label>
                <button
                  onClick={addStop}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Stop
                </button>
              </div>

              <div className="space-y-3">
                {stops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-750 flex items-center gap-3"
                  >
                    {/* Native Color Input */}
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-black/10 shrink-0">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateStop(stop.id, { color: e.target.value.toUpperCase() })}
                        className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                      />
                    </div>

                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, { color: e.target.value.toUpperCase() })}
                      className="font-mono text-xs font-semibold bg-transparent text-slate-900 dark:text-white uppercase focus:outline-none w-20"
                    />

                    {/* Position Slider */}
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.offset}
                        onChange={(e) => updateStop(stop.id, { offset: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="font-mono text-xs text-slate-400 w-8 text-right">
                        {stop.offset}%
                      </span>
                    </div>

                    {/* Delete stop button */}
                    {stops.length > 2 && (
                      <button
                        onClick={() => removeStop(stop.id)}
                        className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove stop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
