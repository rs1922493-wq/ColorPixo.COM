import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'ColorPixo — Free Color Tools';
    const subtitle =
      searchParams.get('subtitle') ||
      'Interactive 2D Picker, Harmonizer, Gradient Builder, & WCAG Contrast Checker';
    const badge = searchParams.get('badge') || 'ColorPixo.Com';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0B0F19',
            padding: '60px 80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top Brand Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #3B82F6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                }}
              >
                ColorPixo
              </span>
            </div>

            <div
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#A855F7',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                padding: '8px 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
              }}
            >
              {badge}
            </div>
          </div>

          {/* Center Title Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              maxWidth: '1000px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 55 ? '48px' : '58px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              {title.endsWith('.') ? title : `${title}.`}
            </h1>
            <p
              style={{
                fontSize: '24px',
                color: '#94A3B8',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Footer Highlights */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '28px',
              width: '100%',
            }}
          >
            <span style={{ fontSize: '18px', color: '#64748B', fontWeight: 500 }}>
              Free Online Toolkit • 100% Client-Side Privacy
            </span>
            <span style={{ fontSize: '18px', color: '#CBD5E1', fontWeight: 600 }}>
              colorpixo.com
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    // If any failure occurs, return the default static image
    return new Response(null, {
      status: 302,
      headers: { Location: '/og/colorpixo-default.png' },
    });
  }
}
