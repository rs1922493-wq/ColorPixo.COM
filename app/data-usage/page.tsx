import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal-page-layout';

export const metadata: Metadata = {
  title: 'Data Usage & Local Processing Architecture',
  description:
    'Technical explanation of how ColorPixo.Com processes images and color calculations entirely inside the user browser memory.',
  alternates: {
    canonical: 'https://colorpixo.com/data-usage',
  },
  openGraph: {
    title: 'Data Usage & Local Processing Architecture | ColorPixo',
    description: 'Privacy architecture and zero-upload client-side processing details.',
    url: 'https://colorpixo.com/data-usage',
  },
};

export default function DataUsagePage() {
  return <LegalPageLayout docKey="data-usage" />;
}
