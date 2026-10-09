import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  parseHex,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  getContrastRatio,
  generateScheme,
  generateTints,
  generateShades,
  RGB,
} from '@/lib/color/math';
import { findClosestColorName } from '@/lib/color/names';
import { POPULAR_COLORS } from '@/data/popular-colors';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ColorDetailClient } from './color-detail-client';

interface PageProps {
  params: Promise<{ hex: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hex } = await params;
  const cleanHex = hex.replace(/^#/, '').toUpperCase();
  const parsed = parseHex(cleanHex);

  if (!parsed) {
    return { title: 'Color Not Found | ColorPixo.Com' };
  }

  const hexCode = `#${cleanHex}`;
  const rgb = parsed;
  const closest = findClosestColorName(hexCode);

  const title = `${hexCode} (${closest.name}) Color Code — Conversions & WCAG Contrast`;
  const description = `Inspect color ${hexCode} (${closest.name}): RGB(${rgb.r}, ${rgb.g}, ${rgb.b}), HSL, CMYK, accessibility contrast ratios, shades, tints, and harmonic palettes.`;
  const pageUrl = `https://colorpixo.com/color/${cleanHex}`;
  const ogImageUrl = `https://colorpixo.com/og?title=${encodeURIComponent(`${closest.name} (${hexCode})`)}&subtitle=${encodeURIComponent(`RGB(${rgb.r}, ${rgb.g}, ${rgb.b}) • Conversions & WCAG Contrast`)}&badge=${encodeURIComponent('Color Detail')}`;

  const isPopular = POPULAR_COLORS.some(
    (c) => c.hex.replace(/^#/, '').toUpperCase() === cleanHex
  );

  return {
    title,
    description,
    robots: {
      index: isPopular,
      follow: true,
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${hexCode} (${closest.name}) — Color Information | ColorPixo`,
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

export default async function ColorDetailPage({ params }: PageProps) {
  const { hex } = await params;
  const cleanHex = hex.replace(/^#/, '').toUpperCase();
  const parsed = parseHex(cleanHex);

  if (!parsed) {
    notFound();
  }

  const hexCode = `#${cleanHex}`;
  const rgb = parsed;
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);

  const closest = findClosestColorName(hexCode);
  const contrastWhite = getContrastRatio(rgb, { r: 255, g: 255, b: 255 });
  const contrastBlack = getContrastRatio(rgb, { r: 0, g: 0, b: 0 });

  const complementary = generateScheme(hexCode, 'complementary');
  const analogous = generateScheme(hexCode, 'analogous');
  const triadic = generateScheme(hexCode, 'triadic');

  const tints = generateTints(hexCode, 10);
  const shades = generateShades(hexCode, 10);

  // 4 related popular colors
  const relatedPopular = POPULAR_COLORS.filter(
    (c) => c.hex.toLowerCase() !== hexCode.toLowerCase()
  ).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: `${closest.name} (${hexCode})`,
    termCode: hexCode,
    description: `Hex color code ${hexCode} with RGB(${rgb.r}, ${rgb.g}, ${rgb.b}) and HSL(${hsl.h}, ${hsl.s}%, ${hsl.l}%).`,
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
          { label: `${hexCode} (${closest.name})` },
        ]}
      />

      <ColorDetailClient
        hexCode={hexCode}
        rgb={rgb}
        hsl={hsl}
        hsv={hsv}
        cmyk={cmyk}
        closest={closest}
        contrastWhite={contrastWhite}
        contrastBlack={contrastBlack}
        complementary={complementary}
        analogous={analogous}
        triadic={triadic}
        tints={tints}
        shades={shades}
        relatedPopular={relatedPopular}
      />
    </div>
  );
}
