import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal-page-layout';

export const metadata: Metadata = {
  title: 'Cookie Policy — Local Storage & Cookies',
  description:
    'ColorPixo.Com cookie policy detailing essential local browser storage usage, Google AdSense cookies, and user consent controls.',
  alternates: {
    canonical: 'https://colorpixo.com/cookie-policy',
  },
  openGraph: {
    title: 'Cookie Policy — Local Storage & Cookies | ColorPixo',
    description: 'Learn how cookies and HTML5 local storage are utilized on ColorPixo.Com.',
    url: 'https://colorpixo.com/cookie-policy',
  },
};

export default function CookiePolicyPage() {
  return <LegalPageLayout docKey="cookie-policy" />;
}
