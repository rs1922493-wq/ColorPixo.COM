import type { Metadata } from 'next';
import { HomeClient } from './home-client';

export const metadata: Metadata = {
  title: {
    absolute: 'ColorPixo — Free Color Picker, Palette Generator & Color Tools',
  },
  description:
    'Free online color tools for web designers and developers: visual 2D color picker, harmonic palette generator, CSS gradient builder, color converter, and WCAG contrast checker.',
  alternates: {
    canonical: 'https://colorpixo.com',
  },
  openGraph: {
    title: 'ColorPixo — Free Color Picker, Palette Generator & Color Tools',
    description:
      'Free online color tools for designers and developers: visual color picker, palette generator, gradient creator, color converter, and WCAG contrast checks.',
    url: 'https://colorpixo.com',
    siteName: 'ColorPixo',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://colorpixo.com/og/colorpixo-default.png',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Color Tools & Color Picker',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ColorPixo — Free Color Picker, Palette Generator & Color Tools',
    description:
      'Free online color tools for designers and developers: visual color picker, palette generator, gradient creator, color converter, and WCAG contrast checks.',
    images: ['https://colorpixo.com/og/colorpixo-default.png'],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
