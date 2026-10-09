import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Favorites',
  description: 'Manage your locally bookmarked color favorites, swatches, and palettes on ColorPixo.Com.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://colorpixo.com/favorites',
  },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
