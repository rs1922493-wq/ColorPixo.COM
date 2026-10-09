import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  transpilePackages: ['motion'],
  async redirects() {
    return [
      { source: '/palette', destination: '/palettes', permanent: true },
      { source: '/pallets', destination: '/palettes', permanent: true },
      { source: '/gradient', destination: '/gradients', permanent: true },
      { source: '/gradeant', destination: '/gradients', permanent: true },
      { source: '/gradeants', destination: '/gradients', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/advertising', destination: '/advertising-policy', permanent: true },
      { source: '/terms', destination: '/terms-and-conditions', permanent: true },
      { source: '/accessibility', destination: '/accessibility-statement', permanent: true },
      { source: '/sitemap', destination: '/html-sitemap', permanent: true },
      { source: '/blogs', destination: '/blog', permanent: true },
      // Consolidated canonical guide redirects (preventing content overlap)
      { source: '/guides/how-to-choose-website-palette', destination: '/guides/how-to-choose-website-colors', permanent: true },
      { source: '/guides/wcag-contrast-explained', destination: '/guides/understanding-color-contrast', permanent: true },
      { source: '/guides/understanding-hex-rgb-hsl-cmyk', destination: '/guides/hex-vs-rgb-vs-hsl', permanent: true },
      { source: '/guides/color-psychology-branding', destination: '/guides/color-psychology-basics', permanent: true },
      // Clean canonical tool redirects
      { source: '/tools/color-picker', destination: '/color-picker', permanent: true },
      { source: '/tools/image-color-picker', destination: '/image-color-picker', permanent: true },
      { source: '/tools/palette-generator', destination: '/palette-generator', permanent: true },
      { source: '/tools/gradient-generator', destination: '/gradient-generator', permanent: true },
      { source: '/tools/color-converter', destination: '/color-converter', permanent: true },
      { source: '/tools/contrast-checker', destination: '/contrast-checker', permanent: true },
      { source: '/tools/color-blindness-simulator', destination: '/color-blindness-simulator', permanent: true },
      { source: '/tools/color-name-finder', destination: '/color-name-finder', permanent: true },
      { source: '/tools/shades-tints', destination: '/color-shades', permanent: true },
      { source: '/tools/color-shades', destination: '/color-shades', permanent: true },
      { source: '/tools/random-color', destination: '/random-color', permanent: true },
      { source: '/tools/css-color-generator', destination: '/css-color-generator', permanent: true },
      { source: '/tools/ai-palette-generator', destination: '/ai-palette-generator', permanent: true },
      { source: '/tools/color-harmony', destination: '/color-harmony', permanent: true },
      { source: '/tools/palette', destination: '/palette-generator', permanent: true },
      { source: '/tools/gradient', destination: '/gradient-generator', permanent: true },
    ];
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
