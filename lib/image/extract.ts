import { parseHex, rgbToHex, rgbToHsl, rgbToLab, deltaE2000, RGB, HSL } from '../color/math';

export interface ExtractedColor {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  percentage: number; // e.g. 34.2%
  pixelCount: number;
}

export interface PixelPickResult {
  x: number;
  y: number;
  hex: string;
  rgb: RGB;
  hsl: HSL;
}

// Downscale an image to max 1000px longest side
export function createScaledCanvas(
  img: HTMLImageElement,
  maxDimension = 1000
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; width: number; height: number } {
  const canvas = document.createElement('canvas');
  let { naturalWidth: width, naturalHeight: height } = img;

  if (width === 0 || height === 0) {
    width = img.width || 800;
    height = img.height || 600;
  }

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, width, height);
  return { canvas, ctx, width, height };
}

// Pick exact pixel from scaled canvas
export function pickPixelColor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
): PixelPickResult | null {
  const clampedX = Math.min(Math.max(0, Math.floor(x)), maxWidth - 1);
  const clampedY = Math.min(Math.max(0, Math.floor(y)), maxHeight - 1);

  try {
    const pixel = ctx.getImageData(clampedX, clampedY, 1, 1).data;
    const rgb: RGB = { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] / 255 };
    const hex = rgbToHex(rgb);
    const hsl = rgbToHsl(rgb);
    return { x: clampedX, y: clampedY, hex, rgb, hsl };
  } catch {
    return null;
  }
}

interface ColorBucket {
  rSum: number;
  gSum: number;
  bSum: number;
  count: number;
}

// Extract top colors using spatial quantization and CIELAB perceptual deduplication
export function extractTopColors(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  topCount: 5 | 10 | 20 = 5
): ExtractedColor[] {
  const imgData = ctx.getImageData(0, 0, width, height).data;
  const totalPixels = width * height;

  // Step sampling for fast performance (max ~40,000 samples)
  const step = Math.max(1, Math.floor(Math.sqrt(totalPixels / 40000)));

  // Spatial color bucketing (5-bit quantization = 32 levels per channel)
  const buckets: Map<number, ColorBucket> = new Map();
  let sampledCount = 0;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const alpha = imgData[idx + 3];
      // Skip transparent or near-transparent pixels
      if (alpha < 64) continue;

      const r = imgData[idx];
      const g = imgData[idx + 1];
      const b = imgData[idx + 2];

      const rKey = r >> 3;
      const gKey = g >> 3;
      const bKey = b >> 3;
      const key = (rKey << 10) | (gKey << 5) | bKey;

      const existing = buckets.get(key);
      if (existing) {
        existing.rSum += r;
        existing.gSum += g;
        existing.bSum += b;
        existing.count++;
      } else {
        buckets.set(key, { rSum: r, gSum: g, bSum: b, count: 1 });
      }
      sampledCount++;
    }
  }

  if (sampledCount === 0) return [];

  // Convert buckets to average RGB clusters
  const clusters: { rgb: RGB; count: number }[] = [];
  buckets.forEach((b) => {
    clusters.push({
      rgb: {
        r: Math.round(b.rSum / b.count),
        g: Math.round(b.gSum / b.count),
        b: Math.round(b.bSum / b.count),
        a: 1,
      },
      count: b.count,
    });
  });

  // Sort clusters descending by frequency
  clusters.sort((a, b) => b.count - a.count);

  // Perceptual clustering using CIELAB ΔE (CIE2000 threshold ~12-15 to merge near-duplicates)
  const merged: { rgb: RGB; count: number }[] = [];

  for (const cluster of clusters) {
    const clusterLab = rgbToLab(cluster.rgb);
    let matchedIndex = -1;

    for (let i = 0; i < merged.length; i++) {
      const mergedLab = rgbToLab(merged[i].rgb);
      const dE = deltaE2000(clusterLab, mergedLab);
      if (dE < 14) {
        matchedIndex = i;
        break;
      }
    }

    if (matchedIndex >= 0) {
      // Merge into existing group
      const existing = merged[matchedIndex];
      const totalWeight = existing.count + cluster.count;
      existing.rgb = {
        r: Math.round((existing.rgb.r * existing.count + cluster.rgb.r * cluster.count) / totalWeight),
        g: Math.round((existing.rgb.g * existing.count + cluster.rgb.g * cluster.count) / totalWeight),
        b: Math.round((existing.rgb.b * existing.count + cluster.rgb.b * cluster.count) / totalWeight),
        a: 1,
      };
      existing.count += cluster.count;
    } else {
      merged.push({ ...cluster });
    }
  }

  // Sort merged by count descending
  merged.sort((a, b) => b.count - a.count);

  // Take requested top colors
  const top = merged.slice(0, topCount);
  const totalTopCount = top.reduce((sum, item) => sum + item.count, 0) || 1;

  return top.map((item) => {
    const hex = rgbToHex(item.rgb);
    const hsl = rgbToHsl(item.rgb);
    const rawPct = (item.count / totalTopCount) * 100;
    const percentage = Math.round(rawPct * 10) / 10;
    return {
      hex,
      rgb: item.rgb,
      hsl,
      percentage,
      pixelCount: item.count,
    };
  });
}
