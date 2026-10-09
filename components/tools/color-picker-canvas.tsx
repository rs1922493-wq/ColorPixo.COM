'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { clamp, HSV, hsvToRgb, rgbToHsv, rgbToHex, RGB } from '@/lib/color/math';

interface ColorPickerCanvasProps {
  hsv: HSV;
  onChange: (hsv: HSV) => void;
  className?: string;
}

export function ColorPickerCanvas({ hsv, onChange, className = '' }: ColorPickerCanvasProps) {
  const satValRef = useRef<HTMLCanvasElement>(null);
  const isDraggingSatVal = useRef(false);

  // Draw 2D Saturation-Value box
  const drawSatVal = useCallback(() => {
    const canvas = satValRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Pure hue color at top-right
    const pureHueRgb = hsvToRgb({ h: hsv.h, s: 100, v: 100 });
    const hueHex = rgbToHex(pureHueRgb);

    // Horizontal gradient: white to pure hue
    const gradH = ctx.createLinearGradient(0, 0, width, 0);
    gradH.addColorStop(0, '#FFFFFF');
    gradH.addColorStop(1, hueHex);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, width, height);

    // Vertical gradient: transparent to black
    const gradV = ctx.createLinearGradient(0, 0, 0, height);
    gradV.addColorStop(0, 'rgba(0,0,0,0)');
    gradV.addColorStop(1, '#000000');
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, width, height);

    // Draw selector ring
    const markerX = (hsv.s / 100) * width;
    const markerY = (1 - hsv.v / 100) * height;

    ctx.beginPath();
    ctx.arc(markerX, markerY, 7, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(markerX, markerY, 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [hsv]);

  useEffect(() => {
    drawSatVal();
  }, [drawSatVal]);

  const updateFromCoords = (clientX: number, clientY: number) => {
    const canvas = satValRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);

    const s = Math.round((x / rect.width) * 100);
    const v = Math.round((1 - y / rect.height) * 100);

    onChange({ ...hsv, s, v });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingSatVal.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromCoords(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSatVal.current) return;
    updateFromCoords(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingSatVal.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div className={`relative select-none touch-none ${className}`}>
      <canvas
        ref={satValRef}
        width={320}
        height={220}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-52 rounded-xl cursor-crosshair shadow-inner border border-slate-200/80 dark:border-slate-800"
      />
    </div>
  );
}
