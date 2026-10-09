import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All 13 Color Tools — Pick, Convert, Palettes & Contrast',
  description:
    'Directory of 13 free browser-local color tools: 2D color picker, multi-space converter, palette generator, gradient maker, shade scale, and WCAG contrast checker.',
  alternates: {
    canonical: 'https://colorpixo.com/tools',
  },
  openGraph: {
    title: 'All 13 Color Tools — Pick, Convert, Palettes & Contrast | ColorPixo',
    description: 'Explore 13 free precision color tools for web designers, developers, and creators.',
    url: 'https://colorpixo.com/tools',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=All%2013%20Color%20Tools&subtitle=Pick%2C%20Convert%2C%20Palettes%20%26%20WCAG%20Contrast%20Checker&badge=Tools%20Directory',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — All 13 Color Tools',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All 13 Color Tools — Pick, Convert, Palettes & Contrast | ColorPixo',
    description: 'Explore 13 free precision color tools for web designers, developers, and creators.',
    images: [
      'https://colorpixo.com/og?title=All%2013%20Color%20Tools&subtitle=Pick%2C%20Convert%2C%20Palettes%20%26%20WCAG%20Contrast%20Checker&badge=Tools%20Directory',
    ],
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
