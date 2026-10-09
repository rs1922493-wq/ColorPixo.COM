export interface RGB {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
  a?: number; // 0 - 1
}

export interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
  a?: number; // 0 - 1
}

export interface HSV {
  h: number; // 0 - 360
  s: number; // 0 - 100
  v: number; // 0 - 100
  a?: number; // 0 - 1
}

export interface CMYK {
  c: number; // 0 - 100
  m: number; // 0 - 100
  y: number; // 0 - 100
  k: number; // 0 - 100
}

export interface LAB {
  l: number; // 0 - 100
  a: number; // -128 - 127
  b: number; // -128 - 127
}

export interface ContrastResult {
  ratio: number;
  normalTextAA: boolean; // >= 4.5
  normalTextAAA: boolean; // >= 7.0
  largeTextAA: boolean; // >= 3.0
  largeTextAAA: boolean; // >= 4.5
  uiComponentsAA: boolean; // >= 3.0
  textColor: string;
  bgColor: string;
}

// Clamp helper
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

// Parse hex string (supports 3, 4, 6, 8 digits, with or without leading #)
export function parseHex(hex: string): RGB | null {
  if (!hex) return null;
  let clean = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]+$/.test(clean)) return null;

  let r = 0, g = 0, b = 0, a = 1;

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 4) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
    a = Math.round((parseInt(clean[3] + clean[3], 16) / 255) * 100) / 100;
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  } else if (clean.length === 8) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
    a = Math.round((parseInt(clean.substring(6, 8), 16) / 255) * 100) / 100;
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;
  return { r, g, b, a };
}

// Convert RGB to standard 6 or 8-digit HEX
export function rgbToHex(rgb: RGB, includeAlpha = false): string {
  const r = clamp(Math.round(rgb.r), 0, 255).toString(16).padStart(2, '0');
  const g = clamp(Math.round(rgb.g), 0, 255).toString(16).padStart(2, '0');
  const b = clamp(Math.round(rgb.b), 0, 255).toString(16).padStart(2, '0');
  let hex = `#${r}${g}${b}`.toUpperCase();

  if (includeAlpha && typeof rgb.a === 'number' && rgb.a < 1) {
    const a = clamp(Math.round(rgb.a * 255), 0, 255).toString(16).padStart(2, '0');
    hex += a.toUpperCase();
  }
  return hex;
}

// RGB to HSL
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: rgb.a !== undefined ? rgb.a : 1,
  };
}

// HSL to RGB
export function hslToRgb(hsl: HSL): RGB {
  const h = ((hsl.h % 360) + 360) % 360;
  const s = clamp(hsl.s, 0, 100) / 100;
  const l = clamp(hsl.l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r1 = 0, g1 = 0, b1 = 0;

  if (h >= 0 && h < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (h >= 60 && h < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (h >= 120 && h < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (h >= 180 && h < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (h >= 240 && h < 300) {
    r1 = x; g1 = 0; b1 = c;
  } else if (h >= 300 && h < 360) {
    r1 = c; g1 = 0; b1 = x;
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
    a: hsl.a !== undefined ? hsl.a : 1,
  };
}

// RGB to HSV
export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const v = max;
  const s = max === 0 ? 0 : delta / max;

  if (delta !== 0) {
    if (max === r) {
      h = (g - b) / delta + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
    a: rgb.a !== undefined ? rgb.a : 1,
  };
}

// HSV to RGB
export function hsvToRgb(hsv: HSV): RGB {
  const h = ((hsv.h % 360) + 360) % 360;
  const s = clamp(hsv.s, 0, 100) / 100;
  const v = clamp(hsv.v, 0, 100) / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r1 = 0, g1 = 0, b1 = 0;

  if (h >= 0 && h < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (h >= 60 && h < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (h >= 120 && h < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (h >= 180 && h < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (h >= 240 && h < 300) {
    r1 = x; g1 = 0; b1 = c;
  } else if (h >= 300 && h < 360) {
    r1 = c; g1 = 0; b1 = x;
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
    a: hsv.a !== undefined ? hsv.a : 1,
  };
}

// RGB to CMYK (Standard naive device-independent conversion)
export function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

// CMYK to RGB
export function cmykToRgb(cmyk: CMYK): RGB {
  const c = clamp(cmyk.c, 0, 100) / 100;
  const m = clamp(cmyk.m, 0, 100) / 100;
  const y = clamp(cmyk.y, 0, 100) / 100;
  const k = clamp(cmyk.k, 0, 100) / 100;

  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));

  return { r, g, b, a: 1 };
}

// RGB to CIELAB (D65 standard illuminant)
export function rgbToLab(rgb: RGB): LAB {
  // Convert sRGB to linear RGB
  const pivotRgb = (n: number) => {
    n = n / 255;
    return n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92;
  };

  const r = pivotRgb(rgb.r);
  const g = pivotRgb(rgb.g);
  const b = pivotRgb(rgb.b);

  // Observer = 2°, Illuminant = D65
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  const pivotXyz = (n: number) => {
    return n > 0.008856 ? Math.cbrt(n) : (7.787 * n) + (16 / 116);
  };

  const fx = pivotXyz(x);
  const fy = pivotXyz(y);
  const fz = pivotXyz(z);

  return {
    l: Math.round(((116 * fy) - 16) * 100) / 100,
    a: Math.round((500 * (fx - fy)) * 100) / 100,
    b: Math.round((200 * (fy - fz)) * 100) / 100,
  };
}

// CIE76 Color Distance (Euclidean in CIELAB)
export function deltaE76(lab1: LAB, lab2: LAB): number {
  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

// CIEDE2000 Color Distance (Industry standard perceptual delta)
export function deltaE2000(lab1: LAB, lab2: LAB): number {
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  const L1 = lab1.l, a1 = lab1.a, b1 = lab1.b;
  const L2 = lab2.l, a2 = lab2.a, b2 = lab2.b;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const C_bar = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(C_bar, 7) / (Math.pow(C_bar, 7) + Math.pow(25, 7))));

  const a1_prime = (1 + G) * a1;
  const a2_prime = (1 + G) * a2;

  const C1_prime = Math.sqrt(a1_prime * a1_prime + b1 * b1);
  const C2_prime = Math.sqrt(a2_prime * a2_prime + b2 * b2);

  const getHPrime = (a_p: number, b_p: number) => {
    if (a_p === 0 && b_p === 0) return 0;
    let h = Math.atan2(b_p, a_p) * rad2deg;
    if (h < 0) h += 360;
    return h;
  };

  const h1_prime = getHPrime(a1_prime, b1);
  const h2_prime = getHPrime(a2_prime, b2);

  const delta_L_prime = L2 - L1;
  const delta_C_prime = C2_prime - C1_prime;

  let delta_h_prime = 0;
  if (C1_prime * C2_prime !== 0) {
    const diff = h2_prime - h1_prime;
    if (Math.abs(diff) <= 180) {
      delta_h_prime = diff;
    } else if (diff > 180) {
      delta_h_prime = diff - 360;
    } else {
      delta_h_prime = diff + 360;
    }
  }

  const delta_H_prime = 2 * Math.sqrt(C1_prime * C2_prime) * Math.sin((delta_h_prime / 2) * deg2rad);

  const L_bar_prime = (L1 + L2) / 2;
  const C_bar_prime = (C1_prime + C2_prime) / 2;

  let H_bar_prime = 0;
  if (C1_prime * C2_prime !== 0) {
    const sum = h1_prime + h2_prime;
    if (Math.abs(h1_prime - h2_prime) <= 180) {
      H_bar_prime = sum / 2;
    } else if (sum < 360) {
      H_bar_prime = (sum + 360) / 2;
    } else {
      H_bar_prime = (sum - 360) / 2;
    }
  }

  const T = 1
    - 0.17 * Math.cos((H_bar_prime - 30) * deg2rad)
    + 0.24 * Math.cos((2 * H_bar_prime) * deg2rad)
    + 0.32 * Math.cos((3 * H_bar_prime + 6) * deg2rad)
    - 0.20 * Math.cos((4 * H_bar_prime - 63) * deg2rad);

  const delta_theta = 30 * Math.exp(-Math.pow((H_bar_prime - 275) / 25, 2));
  const R_C = 2 * Math.sqrt(Math.pow(C_bar_prime, 7) / (Math.pow(C_bar_prime, 7) + Math.pow(25, 7)));
  const S_L = 1 + (0.015 * Math.pow(L_bar_prime - 50, 2)) / Math.sqrt(20 + Math.pow(L_bar_prime - 50, 2));
  const S_C = 1 + 0.045 * C_bar_prime;
  const S_H = 1 + 0.015 * C_bar_prime * T;
  const R_T = -Math.sin(2 * delta_theta * deg2rad) * R_C;

  const dE = Math.sqrt(
    Math.pow(delta_L_prime / S_L, 2) +
    Math.pow(delta_C_prime / S_C, 2) +
    Math.pow(delta_H_prime / S_H, 2) +
    R_T * (delta_C_prime / S_C) * (delta_H_prime / S_H)
  );

  return Math.round(dE * 100) / 100;
}

// Relative Luminance formula per WCAG 2.1
export function getRelativeLuminance(rgb: RGB): number {
  const getChannel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = getChannel(rgb.r);
  const g = getChannel(rgb.g);
  const b = getChannel(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG Contrast Ratio
export function getContrastRatio(fg: RGB | string, bg: RGB | string): number {
  const fgRgb = typeof fg === 'string' ? parseHex(fg) || { r: 0, g: 0, b: 0 } : fg;
  const bgRgb = typeof bg === 'string' ? parseHex(bg) || { r: 255, g: 255, b: 255 } : bg;
  const l1 = getRelativeLuminance(fgRgb);
  const l2 = getRelativeLuminance(bgRgb);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

// Evaluate contrast against WCAG specifications
export function checkContrast(fgHex: string, bgHex: string): ContrastResult | null {
  const fgRgb = parseHex(fgHex);
  const bgRgb = parseHex(bgHex);
  if (!fgRgb || !bgRgb) return null;

  const ratio = getContrastRatio(fgRgb, bgRgb);
  return {
    ratio,
    normalTextAA: ratio >= 4.5,
    normalTextAAA: ratio >= 7.0,
    largeTextAA: ratio >= 3.0,
    largeTextAAA: ratio >= 4.5,
    uiComponentsAA: ratio >= 3.0,
    textColor: rgbToHex(fgRgb),
    bgColor: rgbToHex(bgRgb),
  };
}

// Suggest nearest passing color for text against background
export function suggestPassingColor(fgHex: string, bgHex: string, targetRatio = 4.5): string {
  const fgRgb = parseHex(fgHex);
  const bgRgb = parseHex(bgHex);
  if (!fgRgb || !bgRgb) return '#000000';

  const currentRatio = getContrastRatio(fgRgb, bgRgb);
  if (currentRatio >= targetRatio) return rgbToHex(fgRgb);

  const bgLum = getRelativeLuminance(bgRgb);
  const fgHsl = rgbToHsl(fgRgb);

  // If background is light, darken text; if background is dark, lighten text
  const step = bgLum > 0.5 ? -1 : 1;
  let newLightness = fgHsl.l;

  while (newLightness >= 0 && newLightness <= 100) {
    newLightness += step;
    const testRgb = hslToRgb({ ...fgHsl, l: clamp(newLightness, 0, 100) });
    if (getContrastRatio(testRgb, bgRgb) >= targetRatio) {
      return rgbToHex(testRgb);
    }
  }

  // Fallback to pure black or pure white
  return bgLum > 0.5 ? '#000000' : '#FFFFFF';
}

// Generate shades (darker toward black) and tints (lighter toward white)
export function getShadesAndTints(baseHex: string, steps = 10) {
  const rgb = parseHex(baseHex) || { r: 59, g: 130, b: 246 };

  const tints: { hex: string; percent: number; rgb: RGB }[] = [];
  const shades: { hex: string; percent: number; rgb: RGB }[] = [];
  const tones: { hex: string; percent: number; rgb: RGB }[] = [];

  // Tints: blend toward white (255, 255, 255)
  for (let i = 1; i <= steps; i++) {
    const factor = i / (steps + 1);
    const r = Math.round(rgb.r + (255 - rgb.r) * factor);
    const g = Math.round(rgb.g + (255 - rgb.g) * factor);
    const b = Math.round(rgb.b + (255 - rgb.b) * factor);
    const tRgb = { r, g, b };
    tints.push({
      hex: rgbToHex(tRgb),
      percent: Math.round(factor * 100),
      rgb: tRgb,
    });
  }

  // Shades: blend toward black (0, 0, 0)
  for (let i = 1; i <= steps; i++) {
    const factor = i / (steps + 1);
    const r = Math.round(rgb.r * (1 - factor));
    const g = Math.round(rgb.g * (1 - factor));
    const b = Math.round(rgb.b * (1 - factor));
    const sRgb = { r, g, b };
    shades.push({
      hex: rgbToHex(sRgb),
      percent: Math.round(factor * 100),
      rgb: sRgb,
    });
  }

  // Tones: blend toward middle gray (128, 128, 128)
  for (let i = 1; i <= steps; i++) {
    const factor = i / (steps + 1);
    const r = Math.round(rgb.r + (128 - rgb.r) * factor);
    const g = Math.round(rgb.g + (128 - rgb.g) * factor);
    const b = Math.round(rgb.b + (128 - rgb.b) * factor);
    const toneRgb = { r, g, b };
    tones.push({
      hex: rgbToHex(toneRgb),
      percent: Math.round(factor * 100),
      rgb: toneRgb,
    });
  }

  return { tints, shades, tones };
}

export function generateTints(baseHex: string, steps = 10): string[] {
  return getShadesAndTints(baseHex, steps).tints.map((t) => t.hex);
}

export function generateShades(baseHex: string, steps = 10): string[] {
  return getShadesAndTints(baseHex, steps).shades.map((s) => s.hex);
}

export function generateTones(baseHex: string, steps = 10): string[] {
  return getShadesAndTints(baseHex, steps).tones.map((t) => t.hex);
}

// Generate color schemes
export type SchemeType =
  | 'monochromatic'
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'neutral'
  | 'pastel'
  | 'vibrant';

export function generateScheme(baseHex: string, scheme: SchemeType): string[] {
  const rgb = parseHex(baseHex) || { r: 59, g: 130, b: 246 };
  const hsl = rgbToHsl(rgb);

  const rotate = (h: number, degrees: number) => ((h + degrees) % 360 + 360) % 360;

  switch (scheme) {
    case 'complementary': {
      const comp = rotate(hsl.h, 180);
      return [
        rgbToHex(hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l - 15, 10, 90) })),
        rgbToHex(hslToRgb(hsl)),
        rgbToHex(hslToRgb({ h: hsl.h, s: clamp(hsl.s - 20, 10, 90), l: clamp(hsl.l + 20, 10, 95) })),
        rgbToHex(hslToRgb({ h: comp, s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb({ h: comp, s: clamp(hsl.s + 10, 10, 100), l: clamp(hsl.l - 15, 10, 90) })),
      ];
    }
    case 'analogous': {
      return [
        rgbToHex(hslToRgb({ h: rotate(hsl.h, -40), s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, -20), s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb(hsl)),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, 20), s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, 40), s: hsl.s, l: hsl.l })),
      ];
    }
    case 'triadic': {
      const h2 = rotate(hsl.h, 120);
      const h3 = rotate(hsl.h, 240);
      return [
        rgbToHex(hslToRgb(hsl)),
        rgbToHex(hslToRgb({ h: hsl.h, s: clamp(hsl.s - 15, 10, 90), l: clamp(hsl.l + 15, 10, 90) })),
        rgbToHex(hslToRgb({ h: h2, s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb({ h: h3, s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb({ h: h3, s: clamp(hsl.s + 10, 10, 100), l: clamp(hsl.l - 15, 10, 90) })),
      ];
    }
    case 'split-complementary': {
      const h2 = rotate(hsl.h, 150);
      const h3 = rotate(hsl.h, 210);
      return [
        rgbToHex(hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l - 15, 10, 90) })),
        rgbToHex(hslToRgb(hsl)),
        rgbToHex(hslToRgb({ h: h2, s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb({ h: h3, s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb({ h: h3, s: clamp(hsl.s - 20, 10, 90), l: clamp(hsl.l + 20, 10, 95) })),
      ];
    }
    case 'tetradic': {
      const h2 = rotate(hsl.h, 90);
      const h3 = rotate(hsl.h, 180);
      const h4 = rotate(hsl.h, 270);
      return [
        rgbToHex(hslToRgb(hsl)),
        rgbToHex(hslToRgb({ h: h2, s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb({ h: h3, s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb({ h: h4, s: hsl.s, l: hsl.l })),
        rgbToHex(hslToRgb({ h: h3, s: clamp(hsl.s - 25, 10, 80), l: clamp(hsl.l + 25, 15, 95) })),
      ];
    }
    case 'monochromatic': {
      return [
        rgbToHex(hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l - 30, 10, 90) })),
        rgbToHex(hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l - 15, 10, 90) })),
        rgbToHex(hslToRgb(hsl)),
        rgbToHex(hslToRgb({ h: hsl.h, s: clamp(hsl.s - 15, 10, 90), l: clamp(hsl.l + 15, 10, 95) })),
        rgbToHex(hslToRgb({ h: hsl.h, s: clamp(hsl.s - 30, 10, 90), l: clamp(hsl.l + 30, 10, 95) })),
      ];
    }
    case 'neutral': {
      return [
        rgbToHex(hslToRgb({ h: hsl.h, s: 12, l: 95 })),
        rgbToHex(hslToRgb({ h: hsl.h, s: 15, l: 80 })),
        rgbToHex(hslToRgb({ h: hsl.h, s: 20, l: 55 })),
        rgbToHex(hslToRgb({ h: hsl.h, s: 25, l: 30 })),
        rgbToHex(hslToRgb({ h: hsl.h, s: 30, l: 15 })),
      ];
    }
    case 'pastel': {
      return [
        rgbToHex(hslToRgb({ h: hsl.h, s: 55, l: 84 })),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, 45), s: 55, l: 85 })),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, 90), s: 50, l: 82 })),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, 180), s: 55, l: 85 })),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, 240), s: 50, l: 84 })),
      ];
    }
    case 'vibrant': {
      return [
        rgbToHex(hslToRgb({ h: hsl.h, s: 95, l: 52 })),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, 30), s: 90, l: 55 })),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, 150), s: 95, l: 48 })),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, 210), s: 90, l: 50 })),
        rgbToHex(hslToRgb({ h: rotate(hsl.h, 280), s: 95, l: 52 })),
      ];
    }
    default:
      return [rgbToHex(hslToRgb(hsl))];
  }
}

// Simple seedable pseudo-random number generator (Mulberry32)
export function createRng(seed: number) {
  let s = Math.floor(seed);
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Random color by mode
export type RandomColorMode = 'random' | 'pastel' | 'neon' | 'dark' | 'light' | 'warm' | 'cool';

export function getRandomColor(mode: RandomColorMode = 'random', rng = Math.random): string {
  let h = Math.floor(rng() * 360);
  let s = 70;
  let l = 50;

  switch (mode) {
    case 'pastel':
      s = Math.floor(40 + rng() * 30);
      l = Math.floor(78 + rng() * 14);
      break;
    case 'neon':
      s = Math.floor(92 + rng() * 8);
      l = Math.floor(50 + rng() * 10);
      break;
    case 'dark':
      s = Math.floor(35 + rng() * 50);
      l = Math.floor(12 + rng() * 20);
      break;
    case 'light':
      s = Math.floor(25 + rng() * 50);
      l = Math.floor(82 + rng() * 14);
      break;
    case 'warm':
      // Red, Orange, Yellow, warm magenta: 330° - 60°
      h = Math.floor(rng() < 0.25 ? 330 + rng() * 30 : rng() * 60);
      s = Math.floor(65 + rng() * 30);
      l = Math.floor(45 + rng() * 25);
      break;
    case 'cool':
      // Green, Teal, Cyan, Blue, Violet: 120° - 270°
      h = Math.floor(120 + rng() * 150);
      s = Math.floor(65 + rng() * 30);
      l = Math.floor(45 + rng() * 25);
      break;
    default:
      s = Math.floor(50 + rng() * 45);
      l = Math.floor(30 + rng() * 45);
      break;
  }

  return rgbToHex(hslToRgb({ h, s, l }));
}
