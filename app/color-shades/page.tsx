import type { Metadata } from 'next';
import ShadesTintsPage from '@/app/tools/shades-tints/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free Color Shades & Tints Generator — 10 Tints, Shades & Tones',
  description:
    'Generate 10 lighter tints (+white), 10 darker shades (+black), and 10 balanced tones (+gray) from any base color with one-click CSS variables and design tokens.',
  alternates: {
    canonical: 'https://colorpixo.com/color-shades',
  },
  openGraph: {
    title: 'Free Color Shades & Tints Generator — 10 Tints, Shades & Tones | ColorPixo',
    description:
      'Instantly generate accessible UI color scales, tints, shades, and tones with complete CSS custom properties.',
    url: 'https://colorpixo.com/color-shades',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20Color%20Shades%20%26%20Tints%20Generator&subtitle=Systematic%2010-Step%20Scales%20for%20UI%20Design%20Tokens&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Color Shades & Tints Generator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Color Shades & Tints Generator — 10 Tints, Shades & Tones | ColorPixo',
    description:
      'Instantly generate accessible UI color scales, tints, shades, and tones with complete CSS custom properties.',
    images: [
      'https://colorpixo.com/og?title=Free%20Color%20Shades%20%26%20Tints%20Generator&subtitle=Systematic%2010-Step%20Scales%20for%20UI%20Design%20Tokens&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <ShadesTintsPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="shades-tints" />
      </div>
    </div>
  );
}
