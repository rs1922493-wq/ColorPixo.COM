'use client';

import React from 'react';

/**
 * Scalable SVG representation of the official ColorPixo 4-color swatch brand icon
 */
export function ColorPixoIconWatermark({
  className = '',
  size = 100,
}: {
  className?: string;
  size?: number | string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={`shrink-0 pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cpIconWatermarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Outer rounded border frame */}
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="26"
        stroke="url(#cpIconWatermarkGrad)"
        strokeWidth="6"
      />

      {/* 4 Brand Color Swatches */}
      {/* Top Left: Purple */}
      <rect x="15" y="15" width="32" height="32" rx="8" fill="#7C3AED" />
      {/* Top Right: Pink */}
      <rect x="53" y="15" width="32" height="32" rx="8" fill="#EC4899" />
      {/* Bottom Left: Cyan */}
      <rect x="15" y="53" width="32" height="32" rx="8" fill="#06B6D4" />
      {/* Bottom Right: Emerald */}
      <rect x="53" y="53" width="32" height="32" rx="8" fill="#10B981" />
    </svg>
  );
}

/**
 * Pure Brand Icon Watermark for the Home Page Background
 * Replaces text watermarks with sleek, subtle, high-aesthetic icon watermarks
 */
export function HomeWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0"
    >
      {/* 1. Primary Giant Hero Icon Watermark (Centered in upper hero background) */}
      <div className="absolute top-12 sm:top-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.06] dark:opacity-[0.085] transition-opacity">
        <div className="transform -rotate-12 hover:rotate-0 transition-transform duration-700">
          <ColorPixoIconWatermark
            className="w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] md:w-[620px] md:h-[620px] filter drop-shadow-2xl"
          />
        </div>
      </div>

      {/* 2. Mid-page Accent Icon Watermark (Right-aligned, behind Tools section) */}
      <div className="absolute top-[36%] -right-16 sm:-right-8 md:right-4 pointer-events-none opacity-[0.045] dark:opacity-[0.07]">
        <div className="transform rotate-12">
          <ColorPixoIconWatermark
            className="w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] md:w-[440px] md:h-[440px]"
          />
        </div>
      </div>

      {/* 3. Lower-page Accent Icon Watermark (Left-aligned, behind Color Knowledge section) */}
      <div className="absolute top-[68%] -left-16 sm:-left-8 md:left-4 pointer-events-none opacity-[0.04] dark:opacity-[0.065]">
        <div className="transform -rotate-15">
          <ColorPixoIconWatermark
            className="w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px]"
          />
        </div>
      </div>

      {/* 4. Bottom-page Accent Icon Watermark (Near FAQ/Bottom section) */}
      <div className="absolute bottom-12 right-1/4 pointer-events-none opacity-[0.035] dark:opacity-[0.055]">
        <div className="transform rotate-6">
          <ColorPixoIconWatermark
            className="w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px]"
          />
        </div>
      </div>
    </div>
  );
}
