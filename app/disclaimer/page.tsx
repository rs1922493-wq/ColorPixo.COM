import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal-page-layout';

export const metadata: Metadata = {
  title: 'Disclaimer & Mathematical Notice',
  description:
    'ColorPixo.Com disclaimers regarding display hardware gamuts, color accuracy verification, and WCAG advisory contrast calculations.',
  alternates: {
    canonical: 'https://colorpixo.com/disclaimer',
  },
  openGraph: {
    title: 'Disclaimer & Mathematical Notice | ColorPixo',
    description: 'Notice regarding mathematical color transformations, monitor gamut variance, and production proofing.',
    url: 'https://colorpixo.com/disclaimer',
  },
};

export default function DisclaimerPage() {
  return <LegalPageLayout docKey="disclaimer" />;
}
