import type { Metadata } from 'next';
import ColorNameFinderPage from '@/app/tools/color-name-finder/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free Color Name Finder — Identify Colors by HEX or RGB',
  description:
    'Identify and match color names for any HEX or RGB code using perceptual CIELAB ΔE mathematical distance algorithms with hundreds of named shades.',
  alternates: {
    canonical: 'https://colorpixo.com/color-name-finder',
  },
  openGraph: {
    title: 'Free Color Name Finder — Identify Colors by HEX or RGB | ColorPixo',
    description:
      'Search and identify hundreds of standard named colors by HEX or RGB.',
    url: 'https://colorpixo.com/color-name-finder',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20Color%20Name%20Finder&subtitle=CIELAB%20Perceptual%20Matching%20for%20Hex%20Codes&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Color Name Finder',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Color Name Finder — Identify Colors by HEX or RGB | ColorPixo',
    description:
      'Search and identify hundreds of standard named colors by HEX or RGB.',
    images: [
      'https://colorpixo.com/og?title=Free%20Color%20Name%20Finder&subtitle=CIELAB%20Perceptual%20Matching%20for%20Hex%20Codes&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <ColorNameFinderPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="color-name-finder" />
      </div>
    </div>
  );
}
