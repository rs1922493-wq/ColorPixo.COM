import type { Metadata } from 'next';
import ContrastCheckerPage from '@/app/tools/contrast-checker/page';
import { ToolGuideEditorial } from '@/components/tool-guide-editorial';

export const metadata: Metadata = {
  title: 'Free WCAG Color Contrast Checker — AA & AAA Compliance',
  description:
    'Evaluate text and background contrast ratios against WCAG 2.1 AA and AAA thresholds with relative luminance calculations and a 1-click contrast tuner.',
  alternates: {
    canonical: 'https://colorpixo.com/contrast-checker',
  },
  openGraph: {
    title: 'Free WCAG Color Contrast Checker — AA & AAA Compliance | ColorPixo',
    description:
      'Evaluate accessibility contrast ratios for web interfaces against WCAG 2.1 AA/AAA thresholds.',
    url: 'https://colorpixo.com/contrast-checker',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Free%20WCAG%20Color%20Contrast%20Checker&subtitle=Audit%20Level%20AA%20%26%20AAA%20Accessibility%20Compliance&badge=Color%20Tool',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free WCAG Color Contrast Checker',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free WCAG Color Contrast Checker — AA & AAA Compliance | ColorPixo',
    description:
      'Evaluate accessibility contrast ratios for web interfaces against WCAG 2.1 AA/AAA thresholds.',
    images: [
      'https://colorpixo.com/og?title=Free%20WCAG%20Color%20Contrast%20Checker&subtitle=Audit%20Level%20AA%20%26%20AAA%20Accessibility%20Compliance&badge=Color%20Tool',
    ],
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <ContrastCheckerPage />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <ToolGuideEditorial toolSlug="contrast-checker" />
      </div>
    </div>
  );
}
