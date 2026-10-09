import { RGB, clamp } from './math';

export type VisionDeficiencyType =
  | 'normal'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

export interface DeficiencyInfo {
  type: VisionDeficiencyType;
  name: string;
  description: string;
  prevalence: string;
}

export const VISION_DEFICIENCIES: Record<VisionDeficiencyType, DeficiencyInfo> = {
  normal: {
    type: 'normal',
    name: 'Normal Vision',
    description: 'Standard trichromatic color perception across all three cone types (L, M, and S).',
    prevalence: '~92% of males, ~99.5% of females',
  },
  protanopia: {
    type: 'protanopia',
    name: 'Protanopia (Red-Blind)',
    description: 'Complete absence of L-cones (long-wavelength / red photoreceptors). Reds appear dark brownish or olive.',
    prevalence: '~1% of males',
  },
  deuteranopia: {
    type: 'deuteranopia',
    name: 'Deuteranopia (Green-Blind)',
    description: 'Complete absence of M-cones (medium-wavelength / green photoreceptors). Greens and reds are confused.',
    prevalence: '~1% of males (most common dichromacy)',
  },
  tritanopia: {
    type: 'tritanopia',
    name: 'Tritanopia (Blue-Blind)',
    description: 'Absence of S-cones (short-wavelength / blue photoreceptors). Blues appear greenish, yellows appear violet/gray.',
    prevalence: '< 0.01% (rare, equal in both sexes)',
  },
  achromatopsia: {
    type: 'achromatopsia',
    name: 'Achromatopsia (Monochromacy)',
    description: 'Total color blindness. Vision is perceived solely in shades of gray, lightness, and relative luminance.',
    prevalence: '< 0.003% (very rare)',
  },
};

export const DEFICIENCY_INFO = VISION_DEFICIENCIES;

// Gamma linearization (sRGB -> linear)
function toLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

// Gamma encoding (linear -> sRGB)
function toSrgb(v: number): number {
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return clamp(Math.round(c * 255), 0, 255);
}

// Published Machado / Brettel physiological simulation matrices
const SIMULATION_MATRICES = {
  protanopia: [
    [0.56667, 0.43333, 0.0],
    [0.55833, 0.44167, 0.0],
    [0.0, 0.24167, 0.75833],
  ],
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.700, 0.300, 0.0],
    [0.0, 0.300, 0.700],
  ],
  tritanopia: [
    [0.95000, 0.05000, 0.0],
    [0.0, 0.43333, 0.56667],
    [0.0, 0.47500, 0.52500],
  ],
};

export function simulateColor(rgb: RGB, type: VisionDeficiencyType): RGB {
  if (type === 'normal') {
    return { ...rgb };
  }

  const rLin = toLinear(rgb.r);
  const gLin = toLinear(rgb.g);
  const bLin = toLinear(rgb.b);

  if (type === 'achromatopsia') {
    // Relative luminance in linear space
    const yLin = 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
    const gray = toSrgb(yLin);
    return { r: gray, g: gray, b: gray, a: rgb.a };
  }

  const mat = SIMULATION_MATRICES[type];
  const rSimLin = mat[0][0] * rLin + mat[0][1] * gLin + mat[0][2] * bLin;
  const gSimLin = mat[1][0] * rLin + mat[1][1] * gLin + mat[1][2] * bLin;
  const bSimLin = mat[2][0] * rLin + mat[2][1] * gLin + mat[2][2] * bLin;

  return {
    r: toSrgb(rSimLin),
    g: toSrgb(gSimLin),
    b: toSrgb(bSimLin),
    a: rgb.a,
  };
}

// Transform ImageData on a canvas buffer in-place
export function simulateImageData(imageData: ImageData, type: VisionDeficiencyType): ImageData {
  if (type === 'normal') return imageData;

  const data = imageData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const sim = simulateColor({ r, g, b }, type);
    data[i] = sim.r;
    data[i + 1] = sim.g;
    data[i + 2] = sim.b;
  }

  return imageData;
}

export const simulateVisionDeficiency = simulateImageData;
