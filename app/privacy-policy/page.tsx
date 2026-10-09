import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal-page-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy — Data Protection & Privacy',
  description:
    'ColorPixo.Com privacy policy: zero-server image uploads, client-side only processing, and localStorage data minimization practices.',
  alternates: {
    canonical: 'https://colorpixo.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy — Data Protection & Privacy | ColorPixo',
    description: 'Privacy-first color toolkit architecture and data protection guidelines.',
    url: 'https://colorpixo.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return <LegalPageLayout docKey="privacy" />;
}
