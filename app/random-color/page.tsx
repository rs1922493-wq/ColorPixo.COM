import type { Metadata } from 'next';
import RandomColorPage from '@/app/tools/random-color/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free Random Color Generator — Discover Inspiring Palettes',
  description:
    'Discover inspiring random colors and palettes generated across aesthetic moods including pastel, neon, warm, cool, dark, and light styles.',
  alternates: {
    canonical: 'https://colorpixo.com/random-color',
  },
  openGraph: {
    title: 'Free Random Color Generator — Discover Inspiring Palettes | ColorPixo',
    description:
      'Generate random colors and palettes curated by aesthetic style.',
    url: 'https://colorpixo.com/random-color',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20Random%20Color%20Generator&subtitle=Mood-Filtered%20Colors%20and%20Palettes&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Random Color Generator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Random Color Generator — Discover Inspiring Palettes | ColorPixo',
    description:
      'Generate random colors and palettes curated by aesthetic style.',
    images: [
      'https://colorpixo.com/og?title=Free%20Random%20Color%20Generator&subtitle=Mood-Filtered%20Colors%20and%20Palettes&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <RandomColorPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="random-color" />
      </div>
    </div>
  );
}
