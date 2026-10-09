import type { Metadata } from 'next';
import PaletteGeneratorPage from '@/app/tools/palette-generator/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free Color Palette Generator — Harmonic Schemes & Export',
  description:
    'Generate balanced color palettes using color harmony rules: complementary, analogous, triadic, and monochromatic schemes. Lock hues and export to CSS or JSON.',
  alternates: {
    canonical: 'https://colorpixo.com/palette-generator',
  },
  openGraph: {
    title: 'Free Color Palette Generator — Harmonic Schemes & Export | ColorPixo',
    description:
      'Generate stunning, mathematically harmonious color palettes. Lock favorite shades and export to CSS, JSON, or PNG.',
    url: 'https://colorpixo.com/palette-generator',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20Color%20Palette%20Generator&subtitle=Harmonic%20Color%20Schemes%2C%20Theory%20Presets%20%26%20CSS%20Export&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Color Palette Generator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Color Palette Generator — Harmonic Schemes & Export | ColorPixo',
    description:
      'Generate stunning, mathematically harmonious color palettes. Lock favorite shades and export to CSS, JSON, or PNG.',
    images: [
      'https://colorpixo.com/og?title=Free%20Color%20Palette%20Generator&subtitle=Harmonic%20Color%20Schemes%2C%20Theory%20Presets%20%26%20CSS%20Export&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <PaletteGeneratorPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="palette-generator" />
      </div>
    </div>
  );
}
