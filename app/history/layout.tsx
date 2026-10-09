import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recent Color History',
  description: 'View and manage your locally saved recent color inspection history and swatches on ColorPixo.Com.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://colorpixo.com/history',
  },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
