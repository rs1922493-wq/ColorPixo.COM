import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curated Color Palettes — Modern Web UI Schemes',
  description:
    'Discover curated color palettes for websites, apps, and brands. Filter by aesthetic, export Tailwind tokens, CSS variables, and Figma swatches.',
  alternates: {
    canonical: 'https://colorpixo.com/palettes',
  },
  openGraph: {
    title: 'Curated Color Palettes — Modern Web UI Schemes | ColorPixo',
    description: 'Explore trending color palettes with one-click CSS and Tailwind exports.',
    url: 'https://colorpixo.com/palettes',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Curated%20Color%20Palettes&subtitle=Modern%20UI%20Schemes%2C%20Tailwind%20Tokens%20%26%20CSS%20Variables&badge=Palettes',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Curated Color Palettes',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curated Color Palettes — Modern Web UI Schemes | ColorPixo',
    description: 'Explore trending color palettes with one-click CSS and Tailwind exports.',
    images: [
      'https://colorpixo.com/og?title=Curated%20Color%20Palettes&subtitle=Modern%20UI%20Schemes%2C%20Tailwind%20Tokens%20%26%20CSS%20Variables&badge=Palettes',
    ],
  },
};

export default function PalettesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
