'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Globe, Check, Search, X, ChevronDown, Share2 } from 'lucide-react';
import { PrivacyModal } from './privacy-modal';
import { ShareModal } from './share-modal';
import { SITE_CONFIG } from '@/lib/config/site';
import { useToolAdTransition } from './tool-ad-transition';
import { ALL_LANGUAGES, type LanguageItem, getSavedLanguage, setSiteLanguage } from '@/lib/translation/languages';

export { ALL_LANGUAGES, type LanguageItem };

export function Footer() {
  const { launchTool } = useToolAdTransition();
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageItem>(
    ALL_LANGUAGES.find((l) => l.code === 'EN') || ALL_LANGUAGES[4]
  );
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load language preference from localStorage / cookies
  useEffect(() => {
    try {
      const found = getSavedLanguage();
      if (found) setSelectedLang(found);
    } catch {
      // ignore
    }

    const handleLangEvent = (e: Event) => {
      const customEvent = e as CustomEvent<LanguageItem>;
      if (customEvent.detail) {
        setSelectedLang(customEvent.detail);
      }
    };
    window.addEventListener('colorpixo-lang-changed', handleLangEvent);
    return () => window.removeEventListener('colorpixo-lang-changed', handleLangEvent);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isLangMenuOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isLangMenuOpen]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ALL_LANGUAGES;
    return ALL_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectLanguage = (lang: LanguageItem) => {
    setSelectedLang(lang);
    setIsLangMenuOpen(false);
    setSiteLanguage(lang);
  };

  return (
    <>
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070A12] transition-colors mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            {/* Column 1: Brand Info */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] via-[#EC4899] to-[#06B6D4] p-[1px] flex items-center justify-center shadow-xs">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[7px] flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                      <div className="rounded-tl-[2px] bg-[#7C3AED]" />
                      <div className="rounded-tr-[2px] bg-[#EC4899]" />
                      <div className="rounded-bl-[2px] bg-[#06B6D4]" />
                      <div className="rounded-br-[2px] bg-[#10B981]" />
                    </div>
                  </div>
                </div>
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  ColorPixo.Com
                </span>
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                <strong>{SITE_CONFIG.tagline}</strong> — {SITE_CONFIG.description}
              </p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>
                  Privacy notice: Image and pixel analysis tools process files locally in your browser and do not upload image data to ColorPixo servers.
                </span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-purple-700 dark:text-purple-300 transition-colors shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Share ColorPixo with Friends</span>
                </button>
              </div>
            </div>

            {/* Column 2: Core Tools */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Core Tools.
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/color-picker"
                    onClick={(e) => {
                      e.preventDefault();
                      launchTool('/color-picker', 'Color Picker');
                    }}
                    className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
                  >
                    Color Picker
                  </Link>
                </li>
                <li>
                  <Link
                    href="/color-converter"
                    onClick={(e) => {
                      e.preventDefault();
                      launchTool('/color-converter', 'Color Converter');
                    }}
                    className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
                  >
                    Color Converter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/palette-generator"
                    onClick={(e) => {
                      e.preventDefault();
                      launchTool('/palette-generator', 'Palette Generator');
                    }}
                    className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
                  >
                    Palette Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gradient-generator"
                    onClick={(e) => {
                      e.preventDefault();
                      launchTool('/gradient-generator', 'Gradient Generator');
                    }}
                    className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
                  >
                    Gradient Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/color-shades"
                    onClick={(e) => {
                      e.preventDefault();
                      launchTool('/color-shades', 'Color Shades & Tints');
                    }}
                    className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
                  >
                    Color Shades & Tints
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contrast-checker"
                    onClick={(e) => {
                      e.preventDefault();
                      launchTool('/contrast-checker', 'Contrast Checker (WCAG)');
                    }}
                    className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
                  >
                    Contrast Checker (WCAG)
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                    View all 13 tools &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Explore */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Explore.
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/palettes" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Curated Palettes
                  </Link>
                </li>
                <li>
                  <Link href="/gradients" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Modern CSS Gradients
                  </Link>
                </li>
                <li>
                  <Link href="/colors" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Popular Color Guides
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Recent Color History
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Saved Favorites
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors font-medium">
                    Tool Blogs & Guides
                  </Link>
                </li>
                <li>
                  <Link href="/html-sitemap" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    HTML Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Trust & Legal */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Trust & Legal.
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/about" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    About ColorPixo.Com
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link href="/advertising-policy" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Advertising Policy
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility-statement" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Accessibility Statement
                  </Link>
                </li>
                <li>
                  <Link href="/data-usage" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    Data Usage & Architecture
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors">
                    FAQ (Frequently Asked Questions)
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors text-left flex items-center gap-1.5 font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Privacy Choices</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR MATCHING EXACT SCREENSHOT DESIGN */}
        <div className="w-full bg-[#050811] text-slate-300 py-3 sm:py-3.5 px-4 sm:px-8 border-t border-slate-800/80 relative">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-[13px]">
            {/* Left Side: Copyright & Made with Heart */}
            <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
              <Link
                href="/"
                className="text-white hover:text-slate-200 transition-colors hover:underline font-normal"
              >
                Copyright © 2026 - colorpixo.com
              </Link>
              <span className="text-slate-600 select-none">•</span>
              <span className="text-slate-300 inline-flex items-center gap-1">
                Made with <span className="text-sm leading-none" role="img" aria-label="sparkling heart">💖</span>
              </span>
            </div>

            {/* Right Side: Version & Language Pill */}
            <div className="flex items-center gap-3.5 sm:gap-4 flex-wrap justify-center sm:justify-end">
              <span className="font-mono text-[11px] sm:text-[11.5px] text-slate-400 tracking-tight select-all">
                V:0v1_zRHewE27yvUA_SpwY
              </span>

              {/* Language Selector Pill & Popup */}
              <div className="relative notranslate" ref={langDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  aria-expanded={isLangMenuOpen}
                  aria-label="Select Language"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A2333]/90 hover:bg-[#232F45] border border-slate-700/80 text-white text-xs font-bold transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 notranslate"
                >
                  <span className="text-sm leading-none">{selectedLang.flag}</span>
                  <span className="tracking-wide text-xs">{selectedLang.code}</span>
                  <Globe className="w-3.5 h-3.5 text-slate-300" />
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 30+ Languages Dropdown Menu with Search (Exact Match with Uploaded Image) */}
                {isLangMenuOpen && (
                  <div
                    role="dialog"
                    aria-label="Language Selector"
                    className="absolute right-0 bottom-full mb-3 w-[calc(100vw-2rem)] sm:w-[540px] md:w-[580px] max-w-[580px] rounded-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-slate-700/90 shadow-2xl p-4 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 notranslate"
                  >
                    {/* Search Bar matching screenshot */}
                    <div className="relative mb-3.5">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search language..."
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#1E293B]/90 border border-slate-700/80 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                          aria-label="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Language Grid: 2 columns on desktop / tablet, 1 column on small phones */}
                    <div className="max-h-[340px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                      {filteredLanguages.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
                          {filteredLanguages.map((lang) => {
                            const isSelected = selectedLang.code === lang.code;
                            return (
                              <button
                                key={lang.code}
                                type="button"
                                onClick={() => handleSelectLanguage(lang)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                                  isSelected
                                    ? 'bg-purple-600/20 text-purple-300 font-bold border border-purple-500/40 shadow-xs'
                                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                                }`}
                              >
                                <span className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-base leading-none shrink-0" role="img" aria-label={lang.name}>
                                    {lang.flag}
                                  </span>
                                  <span className="truncate text-xs">
                                    {lang.name} <span className="text-slate-400 font-normal">({lang.code})</span>
                                  </span>
                                </span>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 ml-1.5" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          No languages matching &ldquo;{searchQuery}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Footer note in modal */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>32 languages supported</span>
                      <button
                        type="button"
                        onClick={() => setIsLangMenuOpen(false)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </>
  );
}
