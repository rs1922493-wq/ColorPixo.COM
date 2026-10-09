'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Sun,
  Moon,
  Bookmark,
  Menu,
  X,
  ChevronDown,
  Pipette,
  Palette,
  Sparkles,
  Eye,
  RefreshCw,
  Code,
  Wand2,
  BookOpen,
  Newspaper,
  Keyboard,
  Share2,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { GlobalSearchModal } from './global-search-modal';
import { ShareModal } from './share-modal';
import { getStoredFavorites } from '@/lib/storage/store';
import { TOOLS } from '@/lib/config/site';
import { useToolAdTransition } from './tool-ad-transition';

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme, mounted: themeMounted } = useTheme();
  const { launchTool } = useToolAdTransition();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Sync favorites badge count
  useEffect(() => {
    const updateCount = () => {
      const favs = getStoredFavorites();
      setFavoriteCount((favs.colors?.length || 0) + (favs.palettes?.length || 0));
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    const interval = setInterval(updateCount, 2500);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsToolsDropdownOpen(false);
  }, [pathname]);

  const navItems = [
    { label: 'Palettes', href: '/palettes' },
    { label: 'Gradients', href: '/gradients' },
    { label: 'Guides', href: '/guides' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            >
              {/* Distinctive Geometric Swatch Logo */}
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#EC4899] to-[#06B6D4] p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                  <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                    <div className="rounded-tl-[3px] bg-[#7C3AED]" />
                    <div className="rounded-tr-[3px] bg-[#EC4899]" />
                    <div className="rounded-bl-[3px] bg-[#06B6D4]" />
                    <div className="rounded-br-[3px] bg-[#10B981]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent text-center leading-tight">
                  ColorPixo.Com
                </span>
                <span className="text-[8.5px] sm:text-[9px] font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400 text-center w-full block -mt-0.5">
                  PICK.EXPLORE.CREATE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              {/* Tools Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  onMouseEnter={() => setIsToolsDropdownOpen(true)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith('/tools')
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-expanded={isToolsDropdownOpen}
                >
                  <span>Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {/* Dropdown Menu */}
                {isToolsDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsToolsDropdownOpen(false)}
                    className="absolute top-full left-0 mt-1 w-[480px] p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="col-span-2 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span>Featured Color Tools</span>
                      <Link
                        href="/tools"
                        onClick={() => setIsToolsDropdownOpen(false)}
                        className="text-blue-600 dark:text-blue-400 hover:underline capitalize text-xs"
                      >
                        View all 13 &rarr;
                      </Link>
                    </div>
                    {TOOLS.slice(0, 8).map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.path}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsToolsDropdownOpen(false);
                          launchTool(tool.path, tool.name, tool.description);
                        }}
                        className="flex items-start justify-between gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Pipette className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                              {tool.name}
                              {tool.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {tool.description}
                            </div>
                          </div>
                        </div>
                        {tool.shortcut && (
                          <kbd className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-slate-700 uppercase shrink-0 mt-0.5">
                            {tool.shortcut}
                          </kbd>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Bar */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-between gap-2.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-750 rounded-xl border border-slate-200/80 dark:border-slate-700/80 transition-all shadow-2xs hover:shadow-sm w-36 sm:w-56 md:w-64"
              aria-label="Search tools, colors, and palettes"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-slate-400 dark:text-slate-500" />
                <span className="truncate font-medium text-slate-500 dark:text-slate-400">
                  Search tools, colors...
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Favorites link with badge */}
            <Link
              href="/favorites"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Saved Favorites"
            >
              <Bookmark className="w-4 h-4" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {favoriteCount > 9 ? '9+' : favoriteCount}
                </span>
              )}
            </Link>

            {/* Share with Friends */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 rounded-xl border border-purple-200/80 dark:border-purple-800/60 transition-all shadow-2xs hover:shadow-xs active:scale-95"
              aria-label="Share website URL"
              title="Share URL with friends"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Keyboard Shortcuts Dialog Trigger */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-keyboard-shortcuts'))}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
              aria-label="Keyboard Shortcuts (?)"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {!themeMounted ? (
                <span className="w-4 h-4 block" aria-hidden="true" />
              ) : resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 animate-in fade-in duration-150">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
              Main Menu
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Link
                href="/tools"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                <Pipette className="w-4 h-4 text-blue-500" /> All 13 Tools
              </Link>
              <Link
                href="/palettes"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                <Palette className="w-4 h-4 text-rose-500" /> Palettes
              </Link>
              <Link
                href="/gradients"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                <Sparkles className="w-4 h-4 text-purple-500" /> Gradients
              </Link>
              <Link
                href="/colors"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                <Eye className="w-4 h-4 text-amber-500" /> Colors
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                <Newspaper className="w-4 h-4 text-indigo-500" /> Tool Blogs
              </Link>
              <Link
                href="/guides"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                <BookOpen className="w-4 h-4 text-emerald-500" /> Guides & Articles
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                <Sparkles className="w-4 h-4 text-purple-500" /> About Us
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                <Eye className="w-4 h-4 text-cyan-500" /> Contact
              </Link>
            </div>

            {/* Mobile Share Action */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsShareModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Share ColorPixo</span>
                </span>
                <span className="text-[10px] bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-md font-bold">
                  Share
                </span>
              </button>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 pt-2">
              Popular Tools
            </div>
            <div className="space-y-1">
              {TOOLS.slice(0, 5).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    launchTool(tool.path, tool.name, tool.description);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span>{tool.name}</span>
                  {tool.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {tool.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Share URL Modal for Testing & Friends */}
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </>
  );
}
