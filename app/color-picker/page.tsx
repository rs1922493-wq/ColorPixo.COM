import type { Metadata } from 'next';
import ColorPickerPage from '@/app/tools/color-picker/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free Online Color Picker — HEX, RGB & HSL Visual Picker',
  description:
    'Free visual 2D color picker with precision hue and opacity sliders. Live conversion between HEX, RGB, HSL, HSV, and CMYK with real-time WCAG contrast audits.',
  alternates: {
    canonical: 'https://colorpixo.com/color-picker',
  },
  openGraph: {
    title: 'Free Online Color Picker — HEX, RGB & HSL Visual Picker | ColorPixo',
    description:
      'Interactive visual color picking with real-time WCAG contrast feedback and instant copyable color codes.',
    url: 'https://colorpixo.com/color-picker',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20Online%20Color%20Picker&subtitle=Interactive%202D%20Visual%20Picker%20%26%20Multi-Format%20Converter&badge=Color%20Picker',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Online Color Picker',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Color Picker — HEX, RGB & HSL Visual Picker | ColorPixo',
    description:
      'Interactive visual color picking with real-time WCAG contrast feedback and instant copyable color codes.',
    images: [
      'https://colorpixo.com/og?title=Free%20Online%20Color%20Picker&subtitle=Interactive%202D%20Visual%20Picker%20%26%20Multi-Format%20Converter&badge=Color%20Picker',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <ColorPickerPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="color-picker" />
      </div>
    </div>
  );
}
