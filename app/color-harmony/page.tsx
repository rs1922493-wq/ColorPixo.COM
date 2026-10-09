import type { Metadata } from 'next';
import ColorHarmonyPage from '@/app/tools/color-harmony/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free Color Harmony Wheel — Complementary, Triadic & Analogous',
  description:
    'Explore classical color theory relationships on an interactive color wheel: complementary, analogous, triadic, tetradic, and split-complementary harmonies.',
  alternates: {
    canonical: 'https://colorpixo.com/color-harmony',
  },
  openGraph: {
    title: 'Free Color Harmony Wheel — Theory Schemes & Wheel | ColorPixo',
    description:
      'Interactive color wheel visualizing mathematical color relationships.',
    url: 'https://colorpixo.com/color-harmony',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20Color%20Harmony%20Wheel&subtitle=Complementary%2C%20Triadic%2C%20Analogous%20%26%20Tetradic%20Schemes&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Color Harmony Wheel',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Color Harmony Wheel — Theory Schemes & Wheel | ColorPixo',
    description:
      'Interactive color wheel visualizing mathematical color relationships.',
    images: [
      'https://colorpixo.com/og?title=Free%20Color%20Harmony%20Wheel&subtitle=Complementary%2C%20Triadic%2C%20Analogous%20%26%20Tetradic%20Schemes&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <ColorHarmonyPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="color-harmony" />
      </div>
    </div>
  );
}
