import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  HeartHandshake,
  ArrowRight,
  Palette,
  Code,
  Users,
  Cpu,
  Mail,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FounderPhotoCard } from '@/components/founder-photo-card';
import { SITE_AUTHOR } from '@/lib/config/site';

export const metadata: Metadata = {
  title: 'About Us — Mission & Founder Rajesh Kumar Singh',
  description:
    'Learn about ColorPixo: our mission, 13 free browser-based color tools, client-side privacy architecture, accessibility commitment, and founder Rajesh Kumar Singh.',
  alternates: {
    canonical: 'https://colorpixo.com/about',
  },
  openGraph: {
    title: 'About Us — Mission & Founder Rajesh Kumar Singh | ColorPixo',
    description: 'The mission, architecture, and technology behind ColorPixo modern online color toolkit.',
    url: 'https://colorpixo.com/about',
    siteName: 'ColorPixo',
    type: 'website',
    images: [
      {
        url: 'https://colorpixo.com/og?title=About%20ColorPixo&subtitle=Mission%2C%20Architecture%20%26%20Founder%20Rajesh%20Kumar%20Singh&badge=About%20Us',
        width: 1200,
        height: 630,
        alt: 'ColorPixo — About Us & Mission',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — Mission & Founder Rajesh Kumar Singh | ColorPixo',
    description: 'The mission, architecture, and technology behind ColorPixo modern online color toolkit.',
    images: [
      'https://colorpixo.com/og?title=About%20ColorPixo&subtitle=Mission%2C%20Architecture%20%26%20Founder%20Rajesh%20Kumar%20Singh&badge=About%20Us',
    ],
  },
};

export default function AboutPage() {
  let founderPhoto = '/founder.png';
  try {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'DH.png'))) {
      founderPhoto = '/DH.png';
    }
  } catch {
    founderPhoto = '/founder.png';
  }

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About ColorPixo',
    description:
      'Learn about ColorPixo: our mission, 13 free browser-based color tools, client-side privacy architecture, accessibility commitment, and founder Rajesh Kumar Singh.',
    url: 'https://colorpixo.com/about',
    mainEntity: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      jobTitle: SITE_AUTHOR.role,
      description: SITE_AUTHOR.bio,
      url: 'https://colorpixo.com/about',
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Breadcrumbs items={[{ label: 'About' }]} />

      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About ColorPixo.Com</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Modern Color Tools Engineered for Creators.
        </h1>
        <p className="text-base font-semibold bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#06B6D4] bg-clip-text text-transparent">
          Pick. Explore. Create.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          ColorPixo.Com is an independent, free online suite of color pickers, palette generators, gradient builders, and accessibility tools built for digital designers, frontend engineers, artists, and creators.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            In-Browser Local Processing.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Image and pixel analysis tools process files locally in your browser. Uploaded images are never sent to or stored on ColorPixo servers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Instant Zero-Latency Speed.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Built with modern Next.js and Tailwind CSS. No bloated trackers, no forced delays, and no server roundtrips for mathematical conversions.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Accessibility by Default.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Strict adherence to WCAG 2.1 Level AA and AAA relative luminance formulas, empowering digital teams to build inclusive products for all users.
          </p>
        </div>
      </div>

      {/* Why ColorPixo Was Created */}
      <section className="space-y-4 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Why ColorPixo.Com Was Created.
        </h2>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Digital product designers and frontend developers frequently juggle multiple disparate websites just to complete routine color tasks: one site to pick a HEX code, another to test contrast accessibility, a third to generate Tailwind shades, and a fourth to extract hues from an image.
          </p>
          <p>
            Many legacy color sites are plagued by slow load times, invasive screen-takeover advertisements, and outdated color spaces. ColorPixo was built to solve this problem: a single, unified, privacy-first platform where every major color tool operates instantaneously, seamlessly, and cleanly.
          </p>
        </div>
      </section>

      {/* Services and Tools Provided */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Services & Tools We Provide.
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ColorPixo features 13 specialized browser-based tools organized into focused creative workflows:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">1. Picking & Extraction</strong>
            <p className="text-slate-500 dark:text-slate-400">2D Precision Color Picker, Image Color Picker, Eyedropper sampling, and Color Name Finder.</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">2. Palettes & Harmonies</strong>
            <p className="text-slate-500 dark:text-slate-400">Color Palette Generator, 360° Color Harmony Wheel, Random Color Generator, and AI Palette Assistant.</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">3. Accessibility & Vision</strong>
            <p className="text-slate-500 dark:text-slate-400">WCAG 2.1 Contrast Checker (AA & AAA thresholds) and Color Blindness Simulator (Protanopia, Deuteranopia, Tritanopia).</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">4. Code & Tokens</strong>
            <p className="text-slate-500 dark:text-slate-400">Multi-Space Color Converter (HEX, RGB, HSL, HSV, CMYK), CSS Gradient Generator, Shade & Tint Generator, and CSS Variable tokens.</p>
          </div>
        </div>
      </section>

      {/* Who the Website is For & How Tools Work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3>Who ColorPixo Is For.</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>UI/UX Designers:</strong> Building consistent, accessible design systems and cohesive brand palettes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Frontend Developers:</strong> Exporting CSS custom properties, Tailwind 50-950 scales, and verified HEX/RGB codes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Students & Educators:</strong> Learning foundational color theory, harmonic intervals, and accessibility standards.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3>Technology & Privacy Approach.</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            All color math, spatial clustering, and contrast calculations execute entirely on client-side CPU/GPU threads within your browser sandbox. We do not require accounts, we do not store your images, and we do not profile your behavior.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            All color tokens, swatches, and palettes generated through our tools are 100% free for both personal and commercial use without attribution.
          </p>
        </div>
      </div>

      {/* Creator & Author Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Founder & Lead Author Portrait Frame */}
          <FounderPhotoCard authorName={SITE_AUTHOR.name} photoSrc={founderPhoto} />

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Founder & Lead Author
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {SITE_AUTHOR.name}.
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Founder of ColorPixo.Com
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {SITE_AUTHOR.bio}
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Standards & Fact-Checking */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Editorial Standards & Verification.
          </h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Every guide, tutorial, and technical reference published on ColorPixo.Com undergoes rigorous editorial review and empirical testing before release. Our editorial principles are anchored in three pillars:
          </p>
          <ul className="space-y-2 text-xs list-disc list-inside text-slate-600 dark:text-slate-300 pl-1">
            <li><strong>Mathematical Verification:</strong> All color transformation equations, matrix multipliers (sRGB to CIELAB, XYZ, and CMYK), and relative luminance formulas are validated directly against W3C Recommendation specifications and CIE standards.</li>
            <li><strong>Original Content Only:</strong> We do not publish automated AI summaries or syndicated promotional articles. Every guide is written from practical engineering experience with real-world HEX values and code snippets.</li>
            <li><strong>Continuous Updates:</strong> Web standards evolve rapidly. We regularly review our accessibility guides, CSS color specifications, and contrast advisories to align with the latest WCAG 2.1 / 2.2 updates and browser rendering behaviors. Each guide displays a clear publication and last-updated date.</li>
            <li><strong>Corrections Policy:</strong> If a reader spots a numerical inaccuracy, formula discrepancy, or broken link, our team reviews and corrects the content within 48 business hours upon notification at <a href="mailto:contact@colorpixo.com" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">contact@colorpixo.com</a>.</li>
          </ul>
        </div>
      </section>

      {/* How ColorPixo Makes Money */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            How ColorPixo Makes Money.
          </h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            We believe that essential creative tools and digital accessibility checkers should be universally accessible to everyone—regardless of budget, location, or team size.
          </p>
          <p>
            ColorPixo.Com is funded exclusively through digital advertising served via Google AdSense and certified programmatic partners. This advertising model allows us to:
          </p>
          <ul className="space-y-2 text-xs list-disc list-inside text-slate-600 dark:text-slate-300 pl-1">
            <li>Keep all 13 color utilities, palette generators, and WCAG checkers <strong>100% free forever</strong> with unlimited usage.</li>
            <li>Eliminate paid subscriptions, credit card prompts, and gated &ldquo;pro&rdquo; tiers.</li>
            <li>Avoid paid affiliate endorsements, sponsored product placements, or commercial bias in our color evaluations.</li>
          </ul>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            We adhere to strict ad quality standards: advertisements are always clearly labeled as &ldquo;Advertisement&rdquo; and never placed over interactive controls, buttons, or color canvases.
          </p>
        </div>
      </section>

      {/* Official Contact & Feedback */}
      <section className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Official Contact & Inquiries.</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          ColorPixo is actively maintained by our dedicated editorial and software engineering team. If you discover a bug, have an accessibility inquiry, or want to suggest a new tool:
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
          <a
            href="mailto:contact@colorpixo.com"
            className="font-mono text-purple-600 dark:text-purple-400 hover:underline font-semibold"
          >
            contact@colorpixo.com
          </a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link href="/contact" className="text-slate-600 dark:text-slate-300 hover:underline font-semibold">
            Contact Form &rarr;
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link href="/tools" className="text-slate-600 dark:text-slate-300 hover:underline font-semibold">
            Explore All 13 Tools &rarr;
          </Link>
        </div>
      </section>

      {/* CTA */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
        <span className="text-xs text-slate-400">Ready to build your next palette?</span>
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
        >
          <span>Explore All 13 Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
