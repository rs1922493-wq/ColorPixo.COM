import { isValidAdSenseClient } from '@/lib/adsense';

export interface ToolInfo {
  id: string;
  name: string;
  slug: string;
  path: string;
  description: string;
  category: 'picker' | 'palette' | 'convert' | 'accessibility' | 'code' | 'ai';
  badge?: string;
  iconName: string;
  shortcut?: string;
}

export const SITE_AUTHOR = {
  name: 'Rajesh Kumar Singh',
  role: 'Founder & Lead Author',
  bio: 'Rajesh Kumar Singh is the founder of ColorPixo.Com, a free toolkit of browser-based color tools for designers, developers, and students. He writes and reviews the guides and keeps the tools updated.',
  url: 'https://colorpixo.com/about',
  avatar: '/founder.png',
};

export const SITE_CONFIG = {
  name: 'ColorPixo.Com',
  shortName: 'ColorPixo',
  tagline: 'Pick. Explore. Create.',
  description:
    'Explore, pick, convert, and generate beautiful color palettes, gradients, tints, and WCAG contrast ratio checks with ColorPixo.Com’s free toolkit.',
  url: 'https://colorpixo.com',
  domain: 'colorpixo.com',
  supportEmail: 'contact@colorpixo.com',
  author: SITE_AUTHOR.name,
  authorBio: SITE_AUTHOR.bio,
  version: '2.0.0',
  brandColors: {
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #06B6D4 100%)',
    primary: '#7C3AED',
    secondary: '#06B6D4',
    accent: '#EC4899',
    lightBg: '#F7F8FC',
    lightSurface: '#FFFFFF',
    darkBg: '#0B0F19',
    darkSurface: '#141A26',
  },
  featureFlags: {
    showAds: isValidAdSenseClient(process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
    enableAiBackend: true,
  },
  adsense: {
    // Official Google AdSense Publisher ID provided via environment variable
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '',
    slotId: process.env.NEXT_PUBLIC_ADSENSE_SLOT || '',
    homeSlot: process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT || '',
    palettesSlot: process.env.NEXT_PUBLIC_ADSENSE_PALETTES_SLOT || '',
    gradientsSlot: process.env.NEXT_PUBLIC_ADSENSE_GRADIENTS_SLOT || '',
  },
};

export const TOOLS: ToolInfo[] = [
  {
    id: 'color-picker',
    name: 'Color Picker',
    slug: 'color-picker',
    path: '/color-picker',
    description: 'Visual 2D saturation/value picker, hue and alpha sliders with instant HEX, RGB, HSL, HSV, and CMYK readouts.',
    category: 'picker',
    iconName: 'Pipette',
    shortcut: 'p',
  },
  {
    id: 'image-color-picker',
    name: 'Image Color Picker',
    slug: 'image-color-picker',
    path: '/image-color-picker',
    description: 'Extract top color palettes and pinpoint exact pixel hues from any uploaded image right in your browser.',
    category: 'picker',
    badge: 'Popular',
    iconName: 'Image',
    shortcut: 'i',
  },
  {
    id: 'palette-generator',
    name: 'Palette Generator',
    slug: 'palette-generator',
    path: '/palette-generator',
    description: 'Generate harmonious color schemes (monochromatic, complementary, triadic, pastel) with color locking and export.',
    category: 'palette',
    iconName: 'Palette',
    shortcut: 'l',
  },
  {
    id: 'gradient-generator',
    name: 'Gradient Generator',
    slug: 'gradient-generator',
    path: '/gradient-generator',
    description: 'Create multi-stop linear, radial, and conic CSS gradients with angle controls and ready-to-paste CSS.',
    category: 'palette',
    iconName: 'Sparkles',
    shortcut: 'g',
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    slug: 'color-converter',
    path: '/color-converter',
    description: 'Convert between HEX (with alpha), RGB, HSL, HSV, and CMYK with strict mathematical precision.',
    category: 'convert',
    iconName: 'RefreshCw',
    shortcut: 'c',
  },
  {
    id: 'contrast-checker',
    name: 'Contrast Checker',
    slug: 'contrast-checker',
    path: '/contrast-checker',
    description: 'Evaluate WCAG 2.1 / 2.2 AA & AAA contrast ratios for normal, large text and UI components with passing suggestions.',
    category: 'accessibility',
    badge: 'WCAG',
    iconName: 'Eye',
    shortcut: 'w',
  },
  {
    id: 'color-blindness-simulator',
    name: 'Color Blindness Simulator',
    slug: 'color-blindness-simulator',
    path: '/color-blindness-simulator',
    description: 'Simulate how images and palettes look with Protanopia, Deuteranopia, Tritanopia, and Achromatopsia.',
    category: 'accessibility',
    iconName: 'SlidersHorizontal',
    shortcut: 'b',
  },
  {
    id: 'color-name-finder',
    name: 'Color Name Finder',
    slug: 'color-name-finder',
    path: '/color-name-finder',
    description: 'Search hundreds of named colors by HEX or RGB using perceptual CIELAB ΔE color distance matching.',
    category: 'convert',
    iconName: 'Search',
    shortcut: 'n',
  },
  {
    id: 'shades-tints',
    name: 'Shade & Tint Generator',
    slug: 'shades-tints',
    path: '/color-shades',
    description: 'Generate 10 lighter tints and 10 darker shades from any base color with one-click CSS and JSON exports.',
    category: 'palette',
    iconName: 'Layers',
    shortcut: 's',
  },
  {
    id: 'random-color',
    name: 'Random Color Generator',
    slug: 'random-color',
    path: '/random-color',
    description: 'Discover inspiring random colors and palettes in neon, pastel, warm, cool, dark, and light modes.',
    category: 'palette',
    iconName: 'Shuffle',
    shortcut: 'r',
  },
  {
    id: 'css-color-generator',
    name: 'CSS Color Generator',
    slug: 'css-color-generator',
    path: '/css-color-generator',
    description: 'Generate clean CSS custom properties (:root variables) and Tailwind configuration code with contrast health checks.',
    category: 'code',
    iconName: 'Code',
    shortcut: 't',
  },
  {
    id: 'ai-palette-generator',
    name: 'AI Palette Generator',
    slug: 'ai-palette-generator',
    path: '/ai-palette-generator',
    description: 'Turn any creative brief, vibe, or brand description into a balanced 5-color palette with semantic roles.',
    category: 'ai',
    badge: 'Smart',
    iconName: 'Wand2',
    shortcut: 'a',
  },
  {
    id: 'color-harmony',
    name: 'Color Harmony Wheel',
    slug: 'color-harmony',
    path: '/color-harmony',
    description: 'Explore color theory relationships on an interactive wheel: complementary, analogous, triadic, and tetradic.',
    category: 'palette',
    iconName: 'Disc',
    shortcut: 'm',
  },
];
