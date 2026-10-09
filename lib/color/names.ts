import { parseHex, rgbToHex, rgbToHsl, rgbToLab, deltaE2000, RGB, HSL } from './math';

export interface ColorEntry {
  name: string;
  hex: string;
}

export interface ColorMatch {
  name: string;
  hex: string;
  rgb: RGB;
  hsl: HSL;
  deltaE: number;
  similarityLabel: string;
  isExact: boolean;
}

export const COLOR_NAMES_DATABASE: ColorEntry[] = [
  // Required core names
  { name: 'Red', hex: '#FF0000' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Scarlet', hex: '#FF2400' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Lime', hex: '#00FF00' },
  { name: 'Green', hex: '#008000' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Violet', hex: '#EE82EE' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },

  // Curated named & CSS colors
  { name: 'Indian Red', hex: '#CD5C5C' },
  { name: 'Light Coral', hex: '#F08080' },
  { name: 'Salmon', hex: '#FA8072' },
  { name: 'Dark Salmon', hex: '#E9967A' },
  { name: 'Light Salmon', hex: '#FFA07A' },
  { name: 'Firebrick', hex: '#B22222' },
  { name: 'Dark Red', hex: '#8B0000' },
  { name: 'Deep Pink', hex: '#FF1493' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Light Pink', hex: '#FFB6C1' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Tomato', hex: '#FF6347' },
  { name: 'Orange Red', hex: '#FF4500' },
  { name: 'Dark Orange', hex: '#FF8C00' },
  { name: 'Peach Puff', hex: '#FFDAB9' },
  { name: 'Papaya Whip', hex: '#FFEFD5' },
  { name: 'Moccasin', hex: '#FFE4B5' },
  { name: 'Khaki', hex: '#F0E68C' },
  { name: 'Dark Khaki', hex: '#BDB76B' },
  { name: 'Plum', hex: '#DDA0DD' },
  { name: 'Orchid', hex: '#DA70D6' },
  { name: 'Medium Orchid', hex: '#BA55D3' },
  { name: 'Dark Orchid', hex: '#9932CC' },
  { name: 'Dark Violet', hex: '#9400D3' },
  { name: 'Blue Violet', hex: '#8A2BE2' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Dark Slate Blue', hex: '#483D8B' },
  { name: 'Slate Blue', hex: '#6A5ACD' },
  { name: 'Medium Slate Blue', hex: '#7B68EE' },
  { name: 'Chartreuse', hex: '#7FFF00' },
  { name: 'Lawn Green', hex: '#7CFC00' },
  { name: 'Lime Green', hex: '#32CD32' },
  { name: 'Pale Green', hex: '#98FB98' },
  { name: 'Light Green', hex: '#90EE90' },
  { name: 'Medium Spring Green', hex: '#00FA9A' },
  { name: 'Spring Green', hex: '#00FF7F' },
  { name: 'Sea Green', hex: '#2E8B57' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Dark Green', hex: '#006400' },
  { name: 'Olive Drab', hex: '#6B8E23' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Dark Olive Green', hex: '#556B2F' },
  { name: 'Medium Aquamarine', hex: '#66CDAA' },
  { name: 'Dark Sea Green', hex: '#8FBC8F' },
  { name: 'Light Sea Green', hex: '#20B2AA' },
  { name: 'Dark Cyan', hex: '#008B8B' },
  { name: 'Aqua', hex: '#00FFFF' },
  { name: 'Light Cyan', hex: '#E0FFFF' },
  { name: 'Pale Turquoise', hex: '#AFEEEE' },
  { name: 'Aquamarine', hex: '#7FFFD4' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Medium Turquoise', hex: '#48D1CC' },
  { name: 'Dark Turquoise', hex: '#00CED1' },
  { name: 'Cadet Blue', hex: '#5F9EA0' },
  { name: 'Steel Blue', hex: '#4682B4' },
  { name: 'Light Steel Blue', hex: '#B0C4DE' },
  { name: 'Powder Blue', hex: '#B0E0E6' },
  { name: 'Light Blue', hex: '#ADD8E6' },
  { name: 'Deep Sky Blue', hex: '#00BFFF' },
  { name: 'Dodger Blue', hex: '#1E90FF' },
  { name: 'Cornflower Blue', hex: '#6495ED' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Medium Blue', hex: '#0000CD' },
  { name: 'Dark Blue', hex: '#00008B' },
  { name: 'Midnight Blue', hex: '#191970' },
  { name: 'Cornsilk', hex: '#FFF8DC' },
  { name: 'Blanched Almond', hex: '#FFEBCD' },
  { name: 'Bisque', hex: '#FFE4C4' },
  { name: 'Navajo White', hex: '#FFDEAD' },
  { name: 'Wheat', hex: '#F5DEB3' },
  { name: 'Burly Wood', hex: '#DEB887' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Rosy Brown', hex: '#BC8F8F' },
  { name: 'Sandy Brown', hex: '#F4A460' },
  { name: 'Goldenrod', hex: '#DAA520' },
  { name: 'Dark Goldenrod', hex: '#B8860B' },
  { name: 'Peru', hex: '#CD853F' },
  { name: 'Chocolate', hex: '#D2691E' },
  { name: 'Saddle Brown', hex: '#8B4513' },
  { name: 'Sienna', hex: '#A0522D' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Snow', hex: '#FFFAFA' },
  { name: 'Honeydew', hex: '#F0FFF0' },
  { name: 'Mint Cream', hex: '#F5FFFA' },
  { name: 'Azure', hex: '#F0FFFF' },
  { name: 'Alice Blue', hex: '#F0F8FF' },
  { name: 'Ghost White', hex: '#F8F8FF' },
  { name: 'White Smoke', hex: '#F5F5F5' },
  { name: 'Seashell', hex: '#FFF5EE' },
  { name: 'Floral White', hex: '#FFFAF0' },
  { name: 'Old Lace', hex: '#FDF5E6' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Antique White', hex: '#FAEBD7' },
  { name: 'Linen', hex: '#FAF0E6' },
  { name: 'Lavender Blush', hex: '#FFF0F5' },
  { name: 'Misty Rose', hex: '#FFE4E1' },
  { name: 'Gainsboro', hex: '#DCDCDC' },
  { name: 'Light Gray', hex: '#D3D3D3' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Dark Gray', hex: '#A9A9A9' },
  { name: 'Dim Gray', hex: '#696969' },
  { name: 'Light Slate Gray', hex: '#778899' },
  { name: 'Slate Gray', hex: '#708090' },
  { name: 'Dark Slate Gray', hex: '#2F4F4F' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Emerald', hex: '#50C878' },
  { name: 'Ruby', hex: '#E0115F' },
  { name: 'Sapphire', hex: '#0F52BA' },
  { name: 'Amber', hex: '#FFBF00' },
  { name: 'Amethyst', hex: '#9966CC' },
  { name: 'Cobalt Blue', hex: '#0047AB' },
  { name: 'Cerulean', hex: '#007BA7' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Mauve', hex: '#E0B0FF' },
  { name: 'Ochre', hex: '#CC7722' },
  { name: 'Terracotta', hex: '#E2725B' },
  { name: 'Sage', hex: '#BCB88A' },
  { name: 'Taupe', hex: '#483C32' },
  { name: 'Vermilion', hex: '#E34234' },
  { name: 'Periwinkle', hex: '#CCCCFF' },
  { name: 'Mint', hex: '#3EB489' },
  { name: 'Lavender', hex: '#E6E6FA' },
];

export function findClosestColorName(inputHex: string): ColorMatch {
  const targetRgb = parseHex(inputHex) || { r: 0, g: 0, b: 0 };
  const targetLab = rgbToLab(targetRgb);
  const normalizedTargetHex = rgbToHex(targetRgb).toUpperCase();

  // Check exact match first
  for (const item of COLOR_NAMES_DATABASE) {
    if (item.hex.toUpperCase() === normalizedTargetHex) {
      const matchRgb = parseHex(item.hex)!;
      return {
        name: item.name,
        hex: item.hex.toUpperCase(),
        rgb: matchRgb,
        hsl: rgbToHsl(matchRgb),
        deltaE: 0,
        similarityLabel: 'Exact match',
        isExact: true,
      };
    }
  }

  let minDelta = Infinity;
  let bestMatch = COLOR_NAMES_DATABASE[0];

  for (const item of COLOR_NAMES_DATABASE) {
    const itemRgb = parseHex(item.hex);
    if (!itemRgb) continue;
    const itemLab = rgbToLab(itemRgb);
    const dE = deltaE2000(targetLab, itemLab);
    if (dE < minDelta) {
      minDelta = dE;
      bestMatch = item;
    }
  }

  let similarityLabel = 'Noticeable difference';
  if (minDelta < 1.0) {
    similarityLabel = 'Imperceptible difference';
  } else if (minDelta < 2.5) {
    similarityLabel = 'Perceptually very close';
  } else if (minDelta < 5.0) {
    similarityLabel = 'Close match';
  } else if (minDelta < 10.0) {
    similarityLabel = 'Similar shade';
  }

  const bestRgb = parseHex(bestMatch.hex)!;
  return {
    name: bestMatch.name,
    hex: bestMatch.hex.toUpperCase(),
    rgb: bestRgb,
    hsl: rgbToHsl(bestRgb),
    deltaE: minDelta,
    similarityLabel,
    isExact: minDelta === 0,
  };
}
