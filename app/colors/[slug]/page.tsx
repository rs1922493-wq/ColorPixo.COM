import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POPULAR_COLORS } from '@/data/popular-colors';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
  parseHex,
  rgbToHsl,
  rgbToCmyk,
  generateTints,
  generateShades,
  getContrastRatio,
} from '@/lib/color/math';
import { ArrowRight, Pipette, Sliders, ShieldCheck, Download, Heart } from 'lucide-react';
import { PopularColorDetailClient } from './popular-color-detail-client';
import { SITE_AUTHOR } from '@/lib/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return POPULAR_COLORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const color = POPULAR_COLORS.find((c) => c.slug === slug);
  if (!color) return { title: 'Color Not Found | ColorPixo.Com' };

  const title = `${color.name} Color Code (${color.hex}): Meaning, Palettes & History`;
  const description = `${color.meaning.slice(0, 155)}... Complete HEX, RGB, HSL specifications, color psychology, and pairings.`;
  const pageUrl = `https://colorpixo.com/colors/${color.slug}`;
  const ogImageUrl = `https://colorpixo.com/og?title=${encodeURIComponent(`${color.name} Color (${color.hex})`)}&subtitle=${encodeURIComponent('Meaning, Codes, Palettes & History')}&badge=${encodeURIComponent('Color Library')}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${color.name} — Color Information | ColorPixo`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PopularColorPage({ params }: PageProps) {
  const { slug } = await params;
  const color = POPULAR_COLORS.find((c) => c.slug === slug);

  if (!color) {
    notFound();
  }

  const rgb = parseHex(color.hex) || { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb);
  const cmyk = rgbToCmyk(rgb);
  const tints = generateTints(color.hex, 10);
  const shades = generateShades(color.hex, 10);

  const contrastWhite = getContrastRatio(rgb, { r: 255, g: 255, b: 255 });
  const contrastBlack = getContrastRatio(rgb, { r: 0, g: 0, b: 0 });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${color.name} Color Meaning, Code & Harmonious Palettes`,
    description: color.meaning,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://colorpixo.com/colors/${color.slug}`,
    },
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ColorPixo.Com',
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Colors', href: '/colors' },
          { label: color.name },
        ]}
      />

      <PopularColorDetailClient
        color={color}
        rgb={rgb}
        hsl={hsl}
        cmyk={cmyk}
        tints={tints}
        shades={shades}
        contrastWhite={contrastWhite}
        contrastBlack={contrastBlack}
      />
    </div>
  );
}
