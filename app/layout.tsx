import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/toast-context';
import { ActiveColorProvider } from '@/components/active-color-context';
import { KeyboardNavigationHandler } from '@/components/keyboard-navigation-handler';
import { ToolAdTransitionProvider } from '@/components/tool-ad-transition';
import { isValidAdSenseClient } from '@/lib/adsense';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GoogleTranslateManager } from '@/components/google-translate';
import { SITE_CONFIG, SITE_AUTHOR } from '@/lib/config/site';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0F19' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'ColorPixo — Free Color Picker, Palette Generator & Color Tools',
    template: '%s | ColorPixo',
  },
  description:
    'Free online color tools for web designers and developers: advanced visual color picker, harmonic palette generator, CSS gradient builder, color converter, and WCAG contrast checker.',
  keywords: [
    'color picker',
    'color palette generator',
    'image color picker',
    'color converter',
    'WCAG contrast checker',
    'gradient generator',
    'color shades',
    'hex to rgb',
    'web accessibility',
    'ColorPixo',
  ],
  authors: [{ name: SITE_AUTHOR.name, url: 'https://colorpixo.com/about' }],
  creator: SITE_AUTHOR.name,
  publisher: 'ColorPixo.Com',
  metadataBase: new URL('https://colorpixo.com'),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'ColorPixo — Free Color Picker, Palette Generator & Color Tools',
    description:
      'Free online color tools for designers and developers: visual color picker, palette generator, gradient creator, color converter, and WCAG contrast checks.',
    url: 'https://colorpixo.com',
    siteName: 'ColorPixo',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://colorpixo.com/og/colorpixo-default.png',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — Free Color Tools & Color Picker',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ColorPixo — Free Color Picker, Palette Generator & Color Tools',
    description:
      'Free online color tools for designers and developers: visual color picker, palette generator, gradient creator, color converter, and WCAG contrast checks.',
    images: ['https://colorpixo.com/og/colorpixo-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const rawAdsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const isAdSenseConfigured = isValidAdSenseClient(rawAdsenseClient);
  const adsenseClient = isAdSenseConfigured
    ? rawAdsenseClient!.startsWith('ca-pub-')
      ? rawAdsenseClient!
      : `ca-pub-${rawAdsenseClient!.replace(/^pub-/, '')}`
    : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://colorpixo.com/#website',
        name: 'ColorPixo',
        url: 'https://colorpixo.com',
        description:
          'Free online color tools: advanced color picker, palette generator, gradient creator, color converter, and WCAG accessibility contrast checker.',
      },
      {
        '@type': 'Organization',
        '@id': 'https://colorpixo.com/#organization',
        name: 'ColorPixo',
        url: 'https://colorpixo.com',
        logo: 'https://colorpixo.com/favicon.ico',
        founder: {
          '@type': 'Person',
          name: SITE_AUTHOR.name,
          url: 'https://colorpixo.com/about',
        },
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://colorpixo.com/#webapp',
        name: 'ColorPixo Suite',
        url: 'https://colorpixo.com',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'All',
        description:
          'Suite of 13 free browser-based color tools for designers and developers including color picker, palette generator, and WCAG contrast checker.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Google Consent Mode v2 & Google Privacy & Messaging Platform Integration */}
        {isAdSenseConfigured && (
          <script
            id="google-consent-mode-v2"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}var initialPersonalized=false;try{var savedConsent=localStorage.getItem('colorpixo.privacy_consent')||localStorage.getItem('ch.privacy_consent');if(savedConsent){var parsed=JSON.parse(savedConsent);initialPersonalized=!!parsed.personalization;}}catch(e){}gtag('consent','default',{'ad_storage':initialPersonalized?'granted':'denied','ad_user_data':initialPersonalized?'granted':'denied','ad_personalization':initialPersonalized?'granted':'denied','analytics_storage':initialPersonalized?'granted':'denied','wait_for_update':500});window.googlefc=window.googlefc||{};window.googlefc.callbackQueue=window.googlefc.callbackQueue||[];`,
            }}
          />
        )}
        {/* Real Google AdSense Official Script — Injected only when valid Publisher ID is provided */}
        {isAdSenseConfigured && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white font-sans relative">
        <ThemeProvider>
          <ToastProvider>
            <ToolAdTransitionProvider>
              <KeyboardNavigationHandler />
              <GoogleTranslateManager />
              <ActiveColorProvider>
                <Header />
                <main className="flex-1 w-full flex flex-col">{children}</main>
                <Footer />
              </ActiveColorProvider>
            </ToolAdTransitionProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
