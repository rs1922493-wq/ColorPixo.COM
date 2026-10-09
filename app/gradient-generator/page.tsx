import type { Metadata } from 'next';
import GradientGeneratorPage from '@/app/tools/gradient-generator/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free CSS Gradient Generator — Linear, Radial & Multi-Stop',
  description:
    'Design multi-stop linear and radial CSS gradients with live canvas previews, angle controls, and ready-to-paste CSS code and Tailwind classes.',
  alternates: {
    canonical: 'https://colorpixo.com/gradient-generator',
  },
  openGraph: {
    title: 'Free CSS Gradient Generator — Linear, Radial & Multi-Stop | ColorPixo',
    description:
      'Create smooth linear and radial CSS gradients with multi-stop control and ready-to-paste code.',
    url: 'https://colorpixo.com/gradient-generator',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20CSS%20Gradient%20Generator&subtitle=Linear%2C%20Radial%20%26%20Conic%20Gradients%20with%20CSS%20Code&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free CSS Gradient Generator',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free CSS Gradient Generator — Linear, Radial & Multi-Stop | ColorPixo',
    description:
      'Create smooth linear and radial CSS gradients with multi-stop control and ready-to-paste code.',
    images: [
      'https://colorpixo.com/og?title=Free%20CSS%20Gradient%20Generator&subtitle=Linear%2C%20Radial%20%26%20Conic%20Gradients%20with%20CSS%20Code&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <GradientGeneratorPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="gradient-generator" />
      </div>
    </div>
  );
}
