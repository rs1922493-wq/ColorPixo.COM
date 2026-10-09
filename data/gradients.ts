export interface CuratedGradient {
  id: string;
  name: string;
  type: 'linear' | 'radial' | 'conic';
  angle: number;
  stops: { color: string; offset: number }[];
  css: string;
  category: 'Vibrant' | 'Sunset' | 'Cool' | 'Pastel' | 'Dark';
}

export const CURATED_GRADIENTS: CuratedGradient[] = [
  // Vibrant
  {
    id: 'hyper-hyper',
    name: 'Hyper Sunrise',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#FF512F', offset: 0 },
      { color: '#DD2476', offset: 100 },
    ],
    css: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
    category: 'Vibrant',
  },
  {
    id: 'cyber-glow',
    name: 'Cyberpunk Aurora',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#00F2FE', offset: 0 },
      { color: '#4FACFE', offset: 100 },
    ],
    css: 'linear-gradient(90deg, #00F2FE 0%, #4FACFE 100%)',
    category: 'Vibrant',
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#7F00FF', offset: 0 },
      { color: '#E100FF', offset: 100 },
    ],
    css: 'linear-gradient(120deg, #7F00FF 0%, #E100FF 100%)',
    category: 'Vibrant',
  },
  {
    id: 'citrus-punch',
    name: 'Citrus Punch',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#FEE140', offset: 0 },
      { color: '#FA709A', offset: 100 },
    ],
    css: 'linear-gradient(45deg, #FEE140 0%, #FA709A 100%)',
    category: 'Vibrant',
  },
  {
    id: 'neon-mesh',
    name: 'Triad Prism',
    type: 'linear',
    angle: 160,
    stops: [
      { color: '#08AEEA', offset: 0 },
      { color: '#2AF598', offset: 100 },
    ],
    css: 'linear-gradient(160deg, #08AEEA 0%, #2AF598 100%)',
    category: 'Vibrant',
  },

  // Sunset
  {
    id: 'california-dusk',
    name: 'California Dusk',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#FA8BFF', offset: 0 },
      { color: '#2BD2FF', offset: 52 },
      { color: '#2BFF88', offset: 90 },
    ],
    css: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
    category: 'Sunset',
  },
  {
    id: 'ibiza-sunset',
    name: 'Ibiza Sunset',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#EE0979', offset: 0 },
      { color: '#FF6A00', offset: 100 },
    ],
    css: 'linear-gradient(45deg, #EE0979 0%, #FF6A00 100%)',
    category: 'Sunset',
  },
  {
    id: 'miami-twilight',
    name: 'Miami Twilight',
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#FBAB7E', offset: 0 },
      { color: '#F7CE68', offset: 100 },
    ],
    css: 'linear-gradient(180deg, #FBAB7E 0%, #F7CE68 100%)',
    category: 'Sunset',
  },
  {
    id: 'warm-ember',
    name: 'Warm Ember',
    type: 'linear',
    angle: 60,
    stops: [
      { color: '#F857A6', offset: 0 },
      { color: '#FF5858', offset: 100 },
    ],
    css: 'linear-gradient(60deg, #F857A6 0%, #FF5858 100%)',
    category: 'Sunset',
  },
  {
    id: 'radial-sunbeam',
    name: 'Radial Sunbeam',
    type: 'radial',
    angle: 0,
    stops: [
      { color: '#FFD200', offset: 0 },
      { color: '#F7971E', offset: 100 },
    ],
    css: 'radial-gradient(circle, #FFD200 0%, #F7971E 100%)',
    category: 'Sunset',
  },

  // Cool
  {
    id: 'deep-ocean',
    name: 'Deep Oceanic',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#2E3192', offset: 0 },
      { color: '#1BFFFF', offset: 100 },
    ],
    css: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)',
    category: 'Cool',
  },
  {
    id: 'boreal-aurora',
    name: 'Boreal Aurora',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#00C9FF', offset: 0 },
      { color: '#92FE9D', offset: 100 },
    ],
    css: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
    category: 'Cool',
  },
  {
    id: 'arctic-frost',
    name: 'Arctic Frost',
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#E0C3FC', offset: 0 },
      { color: '#8EC5FC', offset: 100 },
    ],
    css: 'linear-gradient(180deg, #E0C3FC 0%, #8EC5FC 100%)',
    category: 'Cool',
  },
  {
    id: 'emerald-mint',
    name: 'Emerald Mint',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#11998E', offset: 0 },
      { color: '#38EF7D', offset: 100 },
    ],
    css: 'linear-gradient(45deg, #11998E 0%, #38EF7D 100%)',
    category: 'Cool',
  },
  {
    id: 'conic-spectrum',
    name: 'Conic Prism Flow',
    type: 'conic',
    angle: 45,
    stops: [
      { color: '#00F2FE', offset: 0 },
      { color: '#4FACFE', offset: 50 },
      { color: '#00F2FE', offset: 100 },
    ],
    css: 'conic-gradient(from 45deg, #00F2FE 0%, #4FACFE 50%, #00F2FE 100%)',
    category: 'Cool',
  },

  // Pastel
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#A1C4FD', offset: 0 },
      { color: '#C2E9FB', offset: 100 },
    ],
    css: 'linear-gradient(120deg, #A1C4FD 0%, #C2E9FB 100%)',
    category: 'Pastel',
  },
  {
    id: 'peach-blossom',
    name: 'Peach Blossom',
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#FFECD2', offset: 0 },
      { color: '#FCB69F', offset: 100 },
    ],
    css: 'linear-gradient(45deg, #FFECD2 0%, #FCB69F 100%)',
    category: 'Pastel',
  },
  {
    id: 'lavender-mist-grad',
    name: 'Lavender Mist',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#E0C3FC', offset: 0 },
      { color: '#9795F0', offset: 100 },
    ],
    css: 'linear-gradient(135deg, #E0C3FC 0%, #9795F0 100%)',
    category: 'Pastel',
  },
  {
    id: 'matcha-foam',
    name: 'Matcha Foam',
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#D4FC79', offset: 0 },
      { color: '#96E6A1', offset: 100 },
    ],
    css: 'linear-gradient(180deg, #D4FC79 0%, #96E6A1 100%)',
    category: 'Pastel',
  },

  // Dark
  {
    id: 'obsidian-noir',
    name: 'Obsidian Noir',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#0F2027', offset: 0 },
      { color: '#203A43', offset: 50 },
      { color: '#2C5364', offset: 100 },
    ],
    css: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
    category: 'Dark',
  },
  {
    id: 'amethyst-night',
    name: 'Amethyst Night',
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#141E30', offset: 0 },
      { color: '#243B55', offset: 100 },
    ],
    css: 'linear-gradient(180deg, #141E30 0%, #243B55 100%)',
    category: 'Dark',
  },
  {
    id: 'blood-moon',
    name: 'Crimson Eclipse',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#4B1248', offset: 0 },
      { color: '#F0C27B', offset: 100 },
    ],
    css: 'linear-gradient(90deg, #4B1248 0%, #F0C27B 100%)',
    category: 'Dark',
  },
  {
    id: 'cosmic-void',
    name: 'Cosmic Void',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#000428', offset: 0 },
      { color: '#004E92', offset: 100 },
    ],
    css: 'linear-gradient(135deg, #000428 0%, #004E92 100%)',
    category: 'Dark',
  },
];
