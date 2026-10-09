import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal-page-layout';

export const metadata: Metadata = {
  title: 'Advertising Policy & Disclosures',
  description:
    'ColorPixo.Com advertising policy: programmatic partner standards, Google AdSense policy alignment, and user experience commitments.',
  alternates: {
    canonical: 'https://colorpixo.com/advertising-policy',
  },
  openGraph: {
    title: 'Advertising Policy & Disclosures | ColorPixo',
    description: 'Learn how advertising is responsibly implemented on ColorPixo.Com without compromising tool usability.',
    url: 'https://colorpixo.com/advertising-policy',
  },
};

export default function AdvertisingPolicyPage() {
  return <LegalPageLayout docKey="advertising" />;
}
