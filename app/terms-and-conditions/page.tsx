import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal-page-layout';

export const metadata: Metadata = {
  title: 'Terms and Conditions — User Agreement',
  description:
    'Terms and conditions for utilizing ColorPixo.Com online color toolkit, color conversion algorithms, and export utilities.',
  alternates: {
    canonical: 'https://colorpixo.com/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms and Conditions — User Agreement | ColorPixo',
    description: 'Usage terms for ColorPixo.Com utilities and design token exports.',
    url: 'https://colorpixo.com/terms-and-conditions',
  },
};

export default function TermsAndConditionsPage() {
  return <LegalPageLayout docKey="terms" />;
}
