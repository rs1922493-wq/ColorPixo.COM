'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Download,
  Pipette,
  Layers,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Bookmark,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useToast } from '@/components/toast-context';
import {
  createScaledCanvas,
  pickPixelColor,
  extractTopColors,
  ExtractedColor,
  PixelPickResult,
} from '@/lib/image/extract';
import { exportPalettePng, downloadText } from '@/lib/export/export';
import { addHistoryColor, saveFavoritePalette } from '@/lib/storage/store';

export default function ImageColorPickerPage() {
  const { showToast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('sample-scene.png');
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [colorCount, setColorCount] = useState<5 | 10 | 20>(5);
  const [pickedPixel, setPickedPixel] = useState<PixelPickResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 500,
  });

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate procedural sample canvas if user has not uploaded one
  const renderSampleScene = useCallback((sceneType: 'botanical' | 'architecture' | 'sunset') => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    if (sceneType === 'botanical') {
      // Lush botanical scene
      const grad = ctx.createLinearGradient(0, 0, 900, 600);
      grad.addColorStop(0, '#064E3B');
      grad.addColorStop(0.5, '#059669');
      grad.addColorStop(1, '#10B981');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 900, 600);

      // Flower petals
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(320, 260, 110, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(320, 260, 45, 0, Math.PI * 2);
      ctx.fill();

      // Royal blue hydrangea bloom
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(620, 340, 130, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#93C5FD';
      ctx.beginPath();
      ctx.arc(650, 320, 60, 0, Math.PI * 2);
      ctx.fill();

      // Golden sunlight flare
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(140, 120, 75, 0, Math.PI * 2);
      ctx.fill();
    } else if (sceneType === 'architecture') {
      // Modern geometric color blocks
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 900, 600);

      ctx.fillStyle = '#C2410C';
      ctx.fillRect(80, 80, 340, 440);

      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(450, 80, 360, 240);

      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(450, 350, 360, 170);

      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(200, 220, 180, 180);
    } else {
      // Sunset twilight
      const grad = ctx.createLinearGradient(0, 0, 0, 600);
      grad.addColorStop(0, '#1E1B4B');
      grad.addColorStop(0.3, '#701A75');
      grad.addColorStop(0.65, '#EA580C');
      grad.addColorStop(0.9, '#FBBF24');
      grad.addColorStop(1, '#FEF08A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 900, 600);

      // Silhouette mountain
      ctx.fillStyle = '#09090B';
      ctx.beginPath();
      ctx.moveTo(0, 600);
      ctx.lineTo(250, 380);
      ctx.lineTo(500, 480);
      ctx.lineTo(750, 340);
      ctx.lineTo(900, 450);
      ctx.lineTo(900, 600);
      ctx.closePath();
      ctx.fill();
    }

    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    setFileName(`sample-${sceneType}.png`);
  }, []);

  // Initial load with botanical preset
  useEffect(() => {
    renderSampleScene('botanical');
  }, [renderSampleScene]);

  // When imageSrc changes, scale and extract
  useEffect(() => {
    if (!imageSrc) return;

    setIsProcessing(true);
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      const { canvas, ctx, width, height } = createScaledCanvas(img, 1000);
      offscreenCanvasRef.current = canvas;
      offscreenCtxRef.current = ctx;
      setCanvasDimensions({ width, height });

      // Draw onto visible preview canvas
      const previewCanvas = previewCanvasRef.current;
      if (previewCanvas) {
        previewCanvas.width = width;
        previewCanvas.height = height;
        const pCtx = previewCanvas.getContext('2d');
        if (pCtx) {
          pCtx.drawImage(canvas, 0, 0, width, height);
        }
      }

      // Extract colors
      const extracted = extractTopColors(ctx, width, height, colorCount);
      setExtractedColors(extracted);
      if (extracted.length > 0) {
        setPickedPixel({
          x: Math.round(width / 2),
          y: Math.round(height / 2),
          hex: extracted[0].hex,
          rgb: extracted[0].rgb,
          hsl: extracted[0].hsl,
        });
        addHistoryColor(extracted[0].hex);
      }
      setIsProcessing(false);
    };
  }, [imageSrc, colorCount]);

  // Handle file upload
  const processFile = useCallback(
    (file: File) => {
      if (!file) return;

      // Check size limit: 15MB
      if (file.size > 15 * 1024 * 1024) {
        showToast('File size exceeds the 15MB limit. Please choose a smaller image.', 'error');
        return;
      }

      if (!file.type.match(/^image\/(jpeg|png|webp|gif|svg\+xml)/i)) {
        showToast('Unsupported format. Please upload JPG, PNG, WEBP, or SVG.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImageSrc(e.target.result);
          setFileName(file.name);
          showToast(`Loaded ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    },
    [showToast]
  );

  // Drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            showToast('Pasted image from clipboard!');
          }
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile, showToast]);

  // Pixel picker handler on canvas
  const handleCanvasInteraction = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = previewCanvasRef.current;
    const offscreenCtx = offscreenCtxRef.current;
    if (!canvas || !offscreenCtx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const res = pickPixelColor(offscreenCtx, x, y, canvas.width, canvas.height);
    if (res) {
      setPickedPixel(res);
      addHistoryColor(res.hex);
    }
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleCopyAll = () => {
    const text = extractedColors.map((c) => c.hex).join(', ');
    navigator.clipboard.writeText(text);
    showToast(`Copied all ${extractedColors.length} colors to clipboard!`);
  };

  const handleExportJson = () => {
    const data = {
      paletteName: fileName.replace(/\.[^/.]+$/, ''),
      generatedAt: new Date().toISOString(),
      colors: extractedColors.map((c) => ({
        hex: c.hex,
        rgb: c.rgb,
        hsl: c.hsl,
        percentage: `${c.percentage}%`,
      })),
    };
    downloadText(JSON.stringify(data, null, 2), `palette-${Date.now()}.json`, 'application/json');
    showToast('Downloaded palette JSON!');
  };

  const handleSavePalette = () => {
    const name = `Image: ${fileName.slice(0, 18)}`;
    saveFavoritePalette(
      name,
      extractedColors.map((c) => c.hex)
    );
    showToast(`Saved palette "${name}" to favorites!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Image Color Picker' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Free Image Color Picker &amp; Palette Extractor.
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              Browser-Local
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Upload any photo or artwork to extract top color palettes using CIELAB perceptual quantization, or click anywhere on the canvas to inspect exact pixel values.
          </p>
        </div>

        {/* Preset Sample Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Try samples:</span>
          <button
            onClick={() => renderSampleScene('botanical')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
          >
            Botanical
          </button>
          <button
            onClick={() => renderSampleScene('architecture')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100"
          >
            Architecture
          </button>
          <button
            onClick={() => renderSampleScene('sunset')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
          >
            Sunset
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Canvas & Upload Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Click to upload, drag and drop, or paste from clipboard (Ctrl+V)
              </div>
              <div className="text-xs text-slate-400">
                JPG, PNG, WEBP, or SVG • Max 15MB • Processed 100% locally
              </div>
            </div>
          </div>

          {/* Interactive Canvas Viewer */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Pipette className="w-3.5 h-3.5 text-blue-500" /> Click or drag across the image to pick exact pixels
              </span>
              <span className="font-mono">
                {canvasDimensions.width} × {canvasDimensions.height} px
              </span>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center cursor-crosshair">
              <canvas
                ref={previewCanvasRef}
                onPointerDown={handleCanvasInteraction}
                onPointerMove={(e) => e.buttons === 1 && handleCanvasInteraction(e)}
                className="max-h-[520px] w-full object-contain select-none touch-none"
              />
            </div>
          </div>

          {/* Local Processing Privacy Notice */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <strong>Client-Side Processing:</strong> Your photograph stays on your device. All pixel calculations and palette extractions are processed locally inside your browser&apos;s client memory.
            </div>
          </div>
        </div>

        {/* Right Column: Picked Pixel & Extracted Palette */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Picked Pixel Card */}
          {pickedPixel && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Selected Pixel Inspector
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl border border-black/10 shadow-inner shrink-0"
                  style={{ backgroundColor: pickedPixel.hex }}
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                    {pickedPixel.hex}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    rgb({pickedPixel.rgb.r}, {pickedPixel.rgb.g}, {pickedPixel.rgb.b})
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Coord: X={pickedPixel.x}, Y={pickedPixel.y}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(pickedPixel.hex)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300"
                  title="Copy Hex"
                >
                  {copiedHex === pickedPixel.hex ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Extracted Top Palette */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Top Extracted Colors
              </div>
              {/* Color Count Selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                {([5, 10, 20] as const).map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setColorCount(cnt)}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      colorCount === cnt
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            {/* Swatch List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {extractedColors.map((color, index) => (
                <div
                  key={`${color.hex}-${index}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg border border-black/10 shadow-sm shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {color.hex}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {color.percentage}%
                    </span>
                    <button
                      onClick={() => handleCopy(color.hex)}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400"
                      title="Copy HEX"
                    >
                      {copiedHex === color.hex ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Export and Action Buttons */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={handleCopyAll}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Copy All {extractedColors.length} Colors
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    exportPalettePng(
                      extractedColors.map((c) => c.hex),
                      `Palette: ${fileName}`
                    )
                  }
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export PNG
                </button>
                <button
                  onClick={handleExportJson}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Export JSON
                </button>
              </div>
              <button
                onClick={handleSavePalette}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200/60 dark:border-rose-900/60 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" /> Save to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
