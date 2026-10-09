import type { Metadata } from 'next';
import CssColorGeneratorPage from '@/app/tools/css-color-generator/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free CSS Color Generator — Variables & Tailwind Theme Config',
  description:
    'Generate clean CSS custom properties (:root variables), HSL/RGB/HEX tokens, and Tailwind theme configuration with built-in contrast audits.',
  alternates: {
    canonical: 'https://colorpixo.com/css-color-generator',
  },
  openGraph: {
    title: 'Free CSS Color Generator — Variables & Tailwind Config | ColorPixo',
    description:
      'Generate CSS custom properties and Tailwind themes with live contrast feedback.',
    url: 'https://colorpixo.com/css-color-generator',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20CSS%20Color%20Variable%20Generator&subtitle=Design%20System%20Tokens%2C%20Tailwind%20%26%20CSS%20Variables&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free CSS Color Generator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free CSS Color Generator — Variables & Tailwind Config | ColorPixo',
    description:
      'Generate CSS custom properties and Tailwind themes with live contrast feedback.',
    images: [
      'https://colorpixo.com/og?title=Free%20CSS%20Color%20Variable%20Generator&subtitle=Design%20System%20Tokens%2C%20Tailwind%20%26%20CSS%20Variables&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <CssColorGeneratorPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="css-color-generator" />
      </div>
    </div>
  );
}
