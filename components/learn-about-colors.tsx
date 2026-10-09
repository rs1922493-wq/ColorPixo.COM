'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Hash,
  Monitor,
  Compass,
  Palette,
  Eye,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  content: React.ReactNode;
}

export function LearnAboutColors({ className = '' }: { className?: string }) {
  const [activeTopicId, setActiveTopicId] = useState<string>('hex');

  const topics: Topic[] = [
    {
      id: 'hex',
      title: 'HEX Color Format',
      badge: 'Web Standard',
      icon: Hash,
      summary: 'Base-16 hexadecimal codes representing Red, Green, Blue, and Alpha transparency.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Hexadecimal (HEX) notation is the foundational color syntax of the web. It uses base-16 numerals (
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">0–9</code> and{' '}
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">A–F</code>) to represent the intensity of three primary optical color channels: <strong>Red</strong>, <strong>Green</strong>, and <strong>Blue</strong>.
          </p>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-1">
            <div className="text-slate-900 dark:text-white font-bold"># R R G G B B [A A]</div>
            <div className="text-slate-500 dark:text-slate-400">
              #7C (Red: 124) + 3A (Green: 58) + ED (Blue: 237) = ColorPixo.Com Purple
            </div>
          </div>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong>6-digit HEX:</strong> Each pair of characters represents a channel value from <code className="font-mono">00</code> (0) to <code className="font-mono">FF</code> (255).
            </li>
            <li>
              <strong>3-digit shorthand:</strong> <code className="font-mono">#RGB</code> expands to <code className="font-mono">#RRGGBB</code> (e.g. <code className="font-mono">#F0A</code> becomes <code className="font-mono">#FF00AA</code>).
            </li>
            <li>
              <strong>8-digit alpha:</strong> An optional fourth byte denotes opacity from <code className="font-mono">00</code> (0% transparent) to <code className="font-mono">FF</code> (100% opaque).
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'rgb',
      title: 'RGB & RGBA',
      badge: 'Additive Optical',
      icon: Monitor,
      summary: 'Screen subpixel mixing from 0 to 255 creating 16.78 million potential hues.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            RGB is an <strong>additive color model</strong> based on how electronic displays emit light. Red, green, and blue phosphors or LEDs illuminate at varying power levels from 0 (off) to 255 (maximum emission).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
              <div className="font-bold">Red Channel</div>
              <div>0 to 255 bits</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300">
              <div className="font-bold">Green Channel</div>
              <div>0 to 255 bits</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300">
              <div className="font-bold">Blue Channel</div>
              <div>0 to 255 bits</div>
            </div>
          </div>
          <p>
            When all three channels hit maximum (<code className="font-mono">rgb(255, 255, 255)</code>), the eye perceives pure white light. When all channels are zero (<code className="font-mono">rgb(0, 0, 0)</code>), the result is true black. The combination yields exactly 256³ = <strong>16,777,216 distinct colors</strong>.
          </p>
        </div>
      ),
    },
    {
      id: 'hsl',
      title: 'HSL & HSV Models',
      badge: 'Human Perceptual',
      icon: Compass,
      summary: 'Hue angle, Saturation purity, and Lightness/Value representing human intuition.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            While RGB corresponds to screen hardware, <strong>HSL (Hue, Saturation, Lightness)</strong> was designed to mirror human color perception. It organizes colors along a 360-degree cylindrical wheel:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong>Hue (0° to 360°):</strong> The base wavelength angle on the color wheel (0° = Red, 120° = Green, 240° = Blue).
            </li>
            <li>
              <strong>Saturation (0% to 100%):</strong> Purity or vividness. 0% is completely grayscale gray, while 100% is vibrant and fully saturated.
            </li>
            <li>
              <strong>Lightness (0% to 100%):</strong> Luminosity. 0% is pitch black, 50% is the true pure hue, and 100% is pure white.
            </li>
          </ul>
          <p className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs">
            <strong>Pro Tip:</strong> When building UI color systems or dark mode variants, adjusting HSL Lightness by ±10% preserves hue identity while creating cohesive hover states and disabled states.
          </p>
        </div>
      ),
    },
    {
      id: 'harmonies',
      title: 'Color Harmonies & Theory',
      badge: 'Design Foundations',
      icon: Palette,
      summary: 'Mathematical geometry on the color wheel: complementary, analogous, and triadic.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Harmonious palettes are formed through geometric angle relationships on the color circle:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                Complementary (180° Offset)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Colors sitting directly opposite one another (e.g. Blue & Orange). Provides the highest visual contrast and energy, well-suited for call-to-action buttons.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                Analogous (±30° to 45° Offset)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Colors adjacent on the wheel (e.g. Purple, Pink, and Rose). Creates serene, unified aesthetics seen in nature and premium gradients.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                Triadic (120° Spacing)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Three hues equidistant on the wheel (e.g. Violet, Amber, and Cyan). Highly vibrant yet balanced when one hue dominates and two serve as accents.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                Tetradic / Square (90° Spacing)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Four colors configured in two complementary pairs. Rich and varied, ideal for complex dashboards with multifaceted categorical data.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tints-shades',
      title: 'Tints, Shades & Tones',
      badge: 'Scale Generation',
      icon: Layers,
      summary: 'Systematically blending pure hues with White, Black, or Gray for cohesive scales.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Design tokens like Tailwind’s <code className="font-mono">50–950</code> scales are mathematically generated through tints, shades, and tones:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">Tint (+ White)</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created by mixing pure hue with increasing amounts of pure white. Used for subtle alert backgrounds, tag pills, and hover states.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">Shade (+ Black)</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created by mixing pure hue with pure black. Increases visual depth; essential for active button states, dark mode borders, and high-contrast typography.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">Tone (+ Gray)</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created by adding pure neutral gray (50% lightness). Moderates saturation without altering lightness drastically, preventing eye strain.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'contrast',
      title: 'Color Contrast & WCAG',
      badge: 'Accessibility Law',
      icon: Eye,
      summary: 'Relative luminance mathematics and international accessibility standards (WCAG 2.1).',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            The Web Content Accessibility Guidelines (WCAG 2.1 / 2.2) require sufficient luminance contrast between foreground text and its background surface to protect individuals with visual impairments or working under glare:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="font-bold text-xs text-emerald-900 dark:text-emerald-300">
                WCAG Level AA (Minimum Standard)
              </div>
              <ul className="text-xs text-emerald-800 dark:text-emerald-400 space-y-1 list-disc pl-4">
                <li><strong>4.5 : 1</strong> for standard body text (&lt; 18pt or &lt; 14pt bold).</li>
                <li><strong>3.0 : 1</strong> for large text (≥ 18pt or ≥ 14pt bold).</li>
                <li><strong>3.0 : 1</strong> for UI components, form borders, and meaningful icons.</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
              <div className="font-bold text-xs text-blue-900 dark:text-blue-300">
                WCAG Level AAA (Enhanced Standard)
              </div>
              <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-disc pl-4">
                <li><strong>7.0 : 1</strong> for standard body text.</li>
                <li><strong>4.5 : 1</strong> for large text headings.</li>
                <li>Recommended for government, medical, and high-readability digital products.</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Contrast is calculated using the relative luminance formula: <code className="font-mono font-bold">(L1 + 0.05) / (L2 + 0.05)</code>, where L1 is the lighter color and L2 is the darker color.
          </p>
        </div>
      ),
    },
    {
      id: 'selection',
      title: 'Website Color Selection',
      badge: 'Practical UX Guide',
      icon: Sparkles,
      summary: 'The proven 60-30-10 rule and crafting ergonomic dual-theme palettes.',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Selecting a digital product palette requires balancing visual hierarchy, usability, and brand personality. Professional UI engineers utilize the <strong>60-30-10 Rule</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-0.5">60% Dominant Neutral</div>
              <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold mb-1">Canvas & Backdrop</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clean off-white (#F7F8FC) in light mode or deep obsidian (#0B0F19) in dark mode. Sets the mood without causing ocular fatigue.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-0.5">30% Structural Secondary</div>
              <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold mb-1">Cards & Dividers</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Card surfaces (#FFFFFF / #141A26), sidebars, tables, and borders (#E2E8F0 / #273244) providing spatial structure and hierarchy.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <div className="font-bold text-xs text-slate-900 dark:text-white mb-0.5">10% Vibrant Accent</div>
              <div className="text-[11px] font-mono text-pink-600 dark:text-pink-400 font-semibold mb-1">Focal CTAs & Links</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Brand accent (#7C3AED / #EC4899) reserved strictly for primary buttons, active links, progress badges, and critical interactive targets.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentTopic = topics.find((t) => t.id === activeTopicId) || topics[0];

  return (
    <section className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Academy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Learn About Colors.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            In-depth engineering and design reference covering color mathematics, digital models, accessibility thresholds, and UI palette architecture.
          </p>
        </div>

        <Link
          href="/guides"
          className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
        >
          <span>View All 10 Deep Guides</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Topics Grid & Interactive Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar List */}
        <div className="lg:col-span-5 space-y-2">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isActive = topic.id === activeTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-white dark:bg-slate-850 border-purple-500 shadow-md ring-2 ring-purple-500/20'
                    : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-950/50 group-hover:text-purple-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {topic.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {topic.summary}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-purple-600 translate-x-0.5' : 'text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Content Viewer Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {currentTopic.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
                {currentTopic.title.endsWith('.') ? currentTopic.title : `${currentTopic.title}.`}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Standards</span>
            </div>
          </div>

          {/* Render Active Topic Content */}
          <div>{currentTopic.content}</div>

          {/* Quick Deep Link */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Master modern digital color systems.</span>
            <Link
              href="/contrast-checker"
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Test with Live Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
