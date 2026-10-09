import type { Metadata } from 'next';
import AiPaletteGeneratorPage from '@/app/tools/ai-palette-generator/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free AI Color Palette Generator — Prompts & Themes to Palettes',
  description:
    'Generate balanced 5-color palettes from creative descriptive prompts, brand themes, and aesthetics with semantic roles and design token export.',
  alternates: {
    canonical: 'https://colorpixo.com/ai-palette-generator',
  },
  openGraph: {
    title: 'Free AI Color Palette Generator — Prompts to Color Schemes | ColorPixo',
    description:
      'Transform creative mood prompts into harmonious 5-swatch color schemes.',
    url: 'https://colorpixo.com/ai-palette-generator',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20AI%20Color%20Palette%20Generator&subtitle=Natural%20Language%20Prompts%20to%20Harmonious%20Design%20Palettes&badge=AI%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free AI Color Palette Generator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Color Palette Generator — Prompts to Color Schemes | ColorPixo',
    description:
      'Transform creative mood prompts into harmonious 5-swatch color schemes.',
    images: [
      'https://colorpixo.com/og?title=Free%20AI%20Color%20Palette%20Generator&subtitle=Natural%20Language%20Prompts%20to%20Harmonious%20Design%20Palettes&badge=AI%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <AiPaletteGeneratorPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="ai-palette-generator" />
      </div>
    </div>
  );
}
