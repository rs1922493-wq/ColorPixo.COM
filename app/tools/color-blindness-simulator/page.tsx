'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Eye,
  Info,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import {
  VisionDeficiencyType,
  DEFICIENCY_INFO,
  simulateVisionDeficiency,
} from '@/lib/color/vision';
import { downloadText } from '@/lib/export/export';

export default function ColorBlindnessSimulatorPage() {
  const { showToast } = useToast();
  const [activeDeficiency, setActiveDeficiency] = useState<VisionDeficiencyType>('deuteranopia');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const simulatedCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate colorful test chart
  const renderTestChart = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 420;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 640, 420);

    // Color Swatches
    const colors = [
      { hex: '#EF4444', label: 'Crimson' },
      { hex: '#F97316', label: 'Orange' },
      { hex: '#FACC15', label: 'Yellow' },
      { hex: '#10B981', label: 'Emerald' },
      { hex: '#06B6D4', label: 'Cyan' },
      { hex: '#3B82F6', label: 'Blue' },
      { hex: '#8B5CF6', label: 'Violet' },
      { hex: '#EC4899', label: 'Pink' },
    ];

    colors.forEach((col, idx) => {
      const x = 40 + (idx % 4) * 145;
      const y = 40 + Math.floor(idx / 4) * 170;

      // Color card
      ctx.fillStyle = col.hex;
      ctx.beginPath();
      ctx.roundRect(x, y, 125, 110, 16);
      ctx.fill();

      // Label text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(col.label, x + 12, y + 138);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px monospace';
      ctx.fillText(col.hex, x + 12, y + 154);
    });

    const url = canvas.toDataURL('image/png');
    setImageSrc(url);
  }, []);

  useEffect(() => {
    renderTestChart();
  }, [renderTestChart]);

  // Apply matrix simulation to canvas
  useEffect(() => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      // 1. Draw original
      const origCanvas = originalCanvasRef.current;
      if (origCanvas) {
        origCanvas.width = img.width;
        origCanvas.height = img.height;
        const oCtx = origCanvas.getContext('2d');
        if (oCtx) {
          oCtx.drawImage(img, 0, 0);
        }
      }

      // 2. Draw simulated
      const simCanvas = simulatedCanvasRef.current;
      if (simCanvas) {
        simCanvas.width = img.width;
        simCanvas.height = img.height;
        const sCtx = simCanvas.getContext('2d');
        if (sCtx) {
          sCtx.drawImage(img, 0, 0);
          if (activeDeficiency !== 'normal') {
            const imgData = sCtx.getImageData(0, 0, simCanvas.width, simCanvas.height);
            const simulatedData = simulateVisionDeficiency(imgData, activeDeficiency);
            sCtx.putImageData(simulatedData, 0, 0);
          }
        }
      }
      setIsProcessing(false);
    };
  }, [imageSrc, activeDeficiency]);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      showToast('Image exceeds 15MB limit.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setImageSrc(e.target.result);
        showToast(`Loaded ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadSimulatedImage = () => {
    const canvas = simulatedCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `simulation-${activeDeficiency}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(`Downloaded ${activeDeficiency} simulated image!`);
  };

  const activeInfo = DEFICIENCY_INFO[activeDeficiency];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Color Blindness Simulator' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free Color Blindness Simulator.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Simulate how your designs, palettes, and images appear to people with Protanopia, Deuteranopia, Tritanopia, or Achromatopsia using accurate physiological color matrices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          <button
            onClick={downloadSimulatedImage}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Download Simulated Image
          </button>
        </div>
      </div>

      {/* Deficiency Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(DEFICIENCY_INFO) as VisionDeficiencyType[]).map((type) => {
          const info = DEFICIENCY_INFO[type];
          const isSelected = activeDeficiency === type;
          return (
            <button
              key={type}
              onClick={() => setActiveDeficiency(type)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {info.name}
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                {info.prevalence}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Mode Description Box */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <div className="font-semibold text-slate-900 dark:text-white">
            {activeInfo.name} — {activeInfo.description}
          </div>
          <p className="leading-relaxed">
            <strong>Prevalence:</strong> {activeInfo.prevalence}. To ensure accessibility, avoid using red and green as the sole distinguishing indicator for critical statuses (such as error and success states).
          </p>
        </div>
      </div>

      {/* Side-by-Side Canvas View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Normal Vision (Standard Trichromat)</span>
            <span className="text-emerald-500 font-semibold">100% Unfiltered</span>
          </div>
          <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center p-2 min-h-[320px]">
            <canvas ref={originalCanvasRef} className="max-h-[380px] w-full object-contain" />
          </div>
        </div>

        {/* Simulated */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Simulated View: {activeInfo.name}</span>
            <span className="text-blue-500 font-semibold">{activeInfo.prevalence}</span>
          </div>
          <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center p-2 min-h-[320px]">
            <canvas ref={simulatedCanvasRef} className="max-h-[380px] w-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
