import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Support',
  description:
    'Get in touch with the ColorPixo team for tool feedback, accessibility inquiries, mathematical verification, or feature suggestions.',
  alternates: {
    canonical: 'https://colorpixo.com/contact',
  },
  openGraph: {
    title: 'Contact Us & Support | ColorPixo',
    description: 'Get in touch with ColorPixo team for support, feedback, and accessibility inquiries.',
    url: 'https://colorpixo.com/contact',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=Contact%20Us%20%26%20Support&subtitle=Tool%20Feedback%2C%20Accessibility%20Inquiries%20%26%20Suggestions&badge=Support',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Contact Us & Support',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us & Support | ColorPixo',
    description: 'Get in touch with ColorPixo team for support, feedback, and accessibility inquiries.',
    images: [
      'https://colorpixo.com/og?title=Contact%20Us%20%26%20Support&subtitle=Tool%20Feedback%2C%20Accessibility%20Inquiries%20%26%20Suggestions&badge=Support',
    ],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
