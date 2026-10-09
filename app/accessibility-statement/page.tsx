import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal-page-layout';

export const metadata: Metadata = {
  title: 'Accessibility Statement — WCAG 2.1 Conformance',
  description:
    'ColorPixo.Com WCAG 2.1 AA accessibility commitment, keyboard operability standards, and feedback reporting channel.',
  alternates: {
    canonical: 'https://colorpixo.com/accessibility-statement',
  },
  openGraph: {
    title: 'Accessibility Statement — WCAG 2.1 Conformance | ColorPixo',
    description: 'Learn about our commitment to digital accessibility and WCAG 2.1 Level AA conformance.',
    url: 'https://colorpixo.com/accessibility-statement',
  },
};

export default function AccessibilityStatementPage() {
  return <LegalPageLayout docKey="accessibility-statement" />;
}
