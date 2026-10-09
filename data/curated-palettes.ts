export interface CuratedPalette {
  id: string;
  name: string;
  category: 'Modern & Clean' | 'Warm & Earthy' | 'Ocean & Cold' | 'Vibrant & Neon' | 'Pastel & Soft' | 'Dark & Moody';
  colors: string[];
}

export const CURATED_PALETTES: CuratedPalette[] = [
  // Modern & Clean
  {
    id: 'nordic-minimal',
    name: 'Nordic Minimal',
    category: 'Modern & Clean',
    colors: ['#0F172A', '#334155', '#64748B', '#CBD5E1', '#F8FAFC'],
  },
  {
    id: 'swiss-editorial',
    name: 'Swiss Editorial',
    category: 'Modern & Clean',
    colors: ['#E11D48', '#18181B', '#3F3F46', '#A1A1AA', '#FAFAFA'],
  },
  {
    id: 'slate-and-indigo',
    name: 'Slate & Indigo',
    category: 'Modern & Clean',
    colors: ['#4F46E5', '#6366F1', '#1E293B', '#475569', '#F1F5F9'],
  },
  {
    id: 'tokyo-metro',
    name: 'Tokyo Metro',
    category: 'Modern & Clean',
    colors: ['#0284C7', '#0D9488', '#27272A', '#71717A', '#F4F4F5'],
  },
  {
    id: 'monochrome-steel',
    name: 'Monochrome Steel',
    category: 'Modern & Clean',
    colors: ['#111827', '#374151', '#6B7280', '#D1D5DB', '#FFFFFF'],
  },

  // Warm & Earthy
  {
    id: 'tuscan-terracotta',
    name: 'Tuscan Terracotta',
    category: 'Warm & Earthy',
    colors: ['#C2410C', '#EA580C', '#D97706', '#78350F', '#FEF3C7'],
  },
  {
    id: 'desert-dune',
    name: 'Desert Dune',
    category: 'Warm & Earthy',
    colors: ['#9A3412', '#D97706', '#F59E0B', '#FDE68A', '#FFFBEB'],
  },
  {
    id: 'autumn-maple',
    name: 'Autumn Maple',
    category: 'Warm & Earthy',
    colors: ['#991B1B', '#C2410C', '#B45309', '#FBBF24', '#FEF08A'],
  },
  {
    id: 'warm-sandstone',
    name: 'Warm Sandstone',
    category: 'Warm & Earthy',
    colors: ['#451A03', '#78350F', '#92400E', '#D97706', '#FDF8F6'],
  },
  {
    id: 'vintage-cafe',
    name: 'Vintage Espresso',
    category: 'Warm & Earthy',
    colors: ['#291811', '#543224', '#8C5A41', '#C69C7E', '#F6EFE9'],
  },

  // Ocean & Cold
  {
    id: 'pacific-depths',
    name: 'Pacific Depths',
    category: 'Ocean & Cold',
    colors: ['#0C4A6E', '#0284C7', '#38BDF8', '#7DD3FC', '#F0F9FF'],
  },
  {
    id: 'emerald-fjord',
    name: 'Emerald Fjord',
    category: 'Ocean & Cold',
    colors: ['#064E3B', '#059669', '#10B981', '#6EE7B7', '#ECFDF5'],
  },
  {
    id: 'deep-maritime',
    name: 'Deep Maritime',
    category: 'Ocean & Cold',
    colors: ['#172554', '#1E40AF', '#3B82F6', '#60A5FA', '#EFF6FF'],
  },
  {
    id: 'glacier-ice',
    name: 'Glacier Ice',
    category: 'Ocean & Cold',
    colors: ['#164E63', '#0891B2', '#06B6D4', '#67E8F9', '#CFFAFE'],
  },
  {
    id: 'arctic-midnight',
    name: 'Arctic Midnight',
    category: 'Ocean & Cold',
    colors: ['#030712', '#0F172A', '#1E3A8A', '#38BDF8', '#E0F2FE'],
  },

  // Vibrant & Neon
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    category: 'Vibrant & Neon',
    colors: ['#06B6D4', '#EC4899', '#A855F7', '#FACC15', '#111827'],
  },
  {
    id: 'sunset-blaze',
    name: 'Sunset Blaze',
    category: 'Vibrant & Neon',
    colors: ['#FF007A', '#FF5400', '#FFBD00', '#7209B7', '#3F37C9'],
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    category: 'Vibrant & Neon',
    colors: ['#7C3AED', '#A855F7', '#EC4899', '#F43F5E', '#18181B'],
  },
  {
    id: 'hyper-lime',
    name: 'Hyper Lime',
    category: 'Vibrant & Neon',
    colors: ['#84CC16', '#22C55E', '#06B6D4', '#3B82F6', '#09090B'],
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    category: 'Vibrant & Neon',
    colors: ['#EF4444', '#F97316', '#FBBF24', '#A855F7', '#0F172A'],
  },

  // Pastel & Soft
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    category: 'Pastel & Soft',
    colors: ['#DDD6FE', '#E9D5FF', '#F5D0FE', '#FBCFE8', '#FDF4FF'],
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'Pastel & Soft',
    colors: ['#86EFAC', '#BBF7D0', '#DCFCE7', '#E2E8F0', '#F8FAFC'],
  },
  {
    id: 'apricot-sorbet',
    name: 'Apricot Sorbet',
    category: 'Pastel & Soft',
    colors: ['#FED7AA', '#FDE68A', '#FECDD3', '#FCE7F3', '#FFF7ED'],
  },
  {
    id: 'baby-blue-dream',
    name: 'Soft Horizon',
    category: 'Pastel & Soft',
    colors: ['#BAE6FD', '#E0F2FE', '#F1F5F9', '#CBD5E1', '#64748B'],
  },
  {
    id: 'rose-petal',
    name: 'Rose Petal',
    category: 'Pastel & Soft',
    colors: ['#FDA4AF', '#FECDD3', '#FFE4E6', '#FFF1F2', '#4C0519'],
  },

  // Dark & Moody
  {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    category: 'Dark & Moody',
    colors: ['#0A0A0A', '#1A1A1A', '#262626', '#D97706', '#F59E0B'],
  },
  {
    id: 'midnight-emerald',
    name: 'Midnight Emerald',
    category: 'Dark & Moody',
    colors: ['#022C22', '#064E3B', '#065F46', '#10B981', '#34D399'],
  },
  {
    id: 'crimson-noir',
    name: 'Crimson Noir',
    category: 'Dark & Moody',
    colors: ['#18181B', '#27272A', '#881337', '#BE123C', '#F43F5E'],
  },
  {
    id: 'stealth-radar',
    name: 'Stealth Radar',
    category: 'Dark & Moody',
    colors: ['#030712', '#111827', '#1F2937', '#10B981', '#6EE7B7'],
  },
  {
    id: 'deep-amethyst',
    name: 'Deep Amethyst',
    category: 'Dark & Moody',
    colors: ['#0F0F1A', '#2E1065', '#581C87', '#9333EA', '#C084FC'],
  },
];
