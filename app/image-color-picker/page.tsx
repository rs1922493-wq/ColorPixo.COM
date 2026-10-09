import type { Metadata } from 'next';
import ImageColorPickerPage from '@/app/tools/image-color-picker/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free Image Color Picker — Extract Palettes & Pixel Colors',
  description:
    'Extract dominant color palettes and pinpoint exact pixel hues from any image directly inside your browser with 100% client-side privacy.',
  alternates: {
    canonical: 'https://colorpixo.com/image-color-picker',
  },
  openGraph: {
    title: 'Free Image Color Picker — Extract Palettes & Pixel Colors | ColorPixo',
    description:
      'Client-side image color extraction and pixel picker. Zero server uploads, instant palette generation.',
    url: 'https://colorpixo.com/image-color-picker',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20Image%20Color%20Picker%20%26%20Palette%20Extractor&subtitle=Client-Side%20Pixel%20Sampling%20%26%20Dominant%20Palettes&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Image Color Picker',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Color Picker — Extract Palettes & Pixel Colors | ColorPixo',
    description:
      'Client-side image color extraction and pixel picker. Zero server uploads, instant palette generation.',
    images: [
      'https://colorpixo.com/og?title=Free%20Image%20Color%20Picker%20%26%20Palette%20Extractor&subtitle=Client-Side%20Pixel%20Sampling%20%26%20Dominant%20Palettes&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <ImageColorPickerPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="image-color-picker" />
      </div>
    </div>
  );
}
