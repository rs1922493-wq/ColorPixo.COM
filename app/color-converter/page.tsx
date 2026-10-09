import type { Metadata } from 'next';
import ColorConverterPage from '@/app/tools/color-converter/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free Color Converter — HEX, RGB, HSL, HSV & CMYK',
  description:
    'Convert colors between HEX, RGB, HSL, HSV, and CMYK formats with mathematical precision, alpha transparency support, and live WCAG contrast checking.',
  alternates: {
    canonical: 'https://colorpixo.com/color-converter',
  },
  openGraph: {
    title: 'Free Color Converter — HEX, RGB, HSL, HSV & CMYK | ColorPixo',
    description:
      'Live mathematical color converter supporting all digital formats and instant clipboard copy.',
    url: 'https://colorpixo.com/color-converter',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20Online%20Color%20Converter&subtitle=Two-Way%20HEX%2C%20RGB%2C%20HSL%2C%20HSV%20%26%20CMYK%20Conversions&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Online Color Converter',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Color Converter — HEX, RGB, HSL, HSV & CMYK | ColorPixo',
    description:
      'Live mathematical color converter supporting all digital formats and instant clipboard copy.',
    images: [
      'https://colorpixo.com/og?title=Free%20Online%20Color%20Converter&subtitle=Two-Way%20HEX%2C%20RGB%2C%20HSL%2C%20HSV%20%26%20CMYK%20Conversions&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <ColorConverterPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="color-converter" />
      </div>
    </div>
  );
}
