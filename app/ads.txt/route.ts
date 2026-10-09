import { NextResponse } from 'next/server';
import { isValidAdSenseClient } from '@/lib/adsense';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rawClient = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '').trim();

  // Validate that NEXT_PUBLIC_ADSENSE_CLIENT follows the exact Google AdSense publisher format
  if (isValidAdSenseClient(rawClient)) {
    const match = rawClient.match(/(?:ca-)?pub-(\d+)/);
    const publisherNumber = match ? match[1] : '';

    if (publisherNumber) {
      const activeLine = `google.com, pub-${publisherNumber}, DIRECT, f08c47fec0942fa0\n`;
      return new NextResponse(activeLine, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      });
    }
  }

  // Fallback instructions if NEXT_PUBLIC_ADSENSE_CLIENT is not yet configured with a real ID
  const fallback = [
    '# Google AdSense Authorized Digital Sellers (ads.txt) for ColorPixo.Com',
    '# Official Reference: https://support.google.com/adsense/answer/12619259',
    '#',
    '# When your real Publisher ID is provided via NEXT_PUBLIC_ADSENSE_CLIENT,',
    '# this file serves the active entry:',
    '# google.com, pub-REAL_PUBLISHER_ID, DIRECT, f08c47fec0942fa0',
  ].join('\n') + '\n';

  return new NextResponse(fallback, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
