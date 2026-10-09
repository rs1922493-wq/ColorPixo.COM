import type { Metadata } from 'next';
import ColorBlindnessSimulatorPage from '@/app/tools/color-blindness-simulator/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free Color Blindness Simulator — Protanopia, Deuteranopia & Tritanopia',
  description:
    'Simulate how color palettes and images appear with Protanopia, Deuteranopia, Tritanopia, and Achromatopsia for accessible inclusive design.',
  alternates: {
    canonical: 'https://colorpixo.com/color-blindness-simulator',
  },
  openGraph: {
    title: 'Free Color Blindness Simulator — Accessibility Testing | ColorPixo',
    description:
      'Test your color palettes against CVD vision profiles directly in your browser.',
    url: 'https://colorpixo.com/color-blindness-simulator',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20Color%20Blindness%20Simulator&subtitle=Simulate%20Protanopia%2C%20Deuteranopia%2C%20Tritanopia%20%26%20Achromatopsia&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Color Blindness Simulator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Color Blindness Simulator — Accessibility Testing | ColorPixo',
    description:
      'Test your color palettes against CVD vision profiles directly in your browser.',
    images: [
      'https://colorpixo.com/og?title=Free%20Color%20Blindness%20Simulator&subtitle=Simulate%20Protanopia%2C%20Deuteranopia%2C%20Tritanopia%20%26%20Achromatopsia&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <ColorBlindnessSimulatorPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="color-blindness-simulator" />
      </div>
    </div>
  );
}
