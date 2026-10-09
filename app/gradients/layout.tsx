import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSS Gradients Gallery & Generator',
  description:
    'Explore curated linear, radial, and mesh CSS gradients. Copy ready-to-use CSS backgrounds and Tailwind gradient classes.',
  alternates: {
    canonical: 'https://colorpixo.com/gradients',
  },
  openGraph: {
    title: 'CSS Gradients Gallery & Generator | ColorPixo',
    description: 'Modern CSS gradient presets with instant code copying for web designers and developers.',
    url: 'https://colorpixo.com/gradients',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=CSS%20Gradients%20Gallery&subtitle=Curated%20Linear%2C%20Radial%20%26%20Mesh%20CSS%20Backgrounds&badge=Gradients',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — CSS Gradients Gallery',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSS Gradients Gallery & Generator | ColorPixo',
    description: 'Modern CSS gradient presets with instant code copying for web designers and developers.',
    images: [
      'https://colorpixo.com/og?title=CSS%20Gradients%20Gallery&subtitle=Curated%20Linear%2C%20Radial%20%26%20Mesh%20CSS%20Backgrounds&badge=Gradients',
    ],
  },
};

export default function GradientsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
