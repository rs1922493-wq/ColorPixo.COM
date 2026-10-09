'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { ALL_LANGUAGES, getSavedLanguage } from '@/lib/translation/languages';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
            layout?: unknown;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export function GoogleTranslateManager() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const initTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronize document direction and language on mount
  useEffect(() => {
    if (!mounted) return;
    const current = getSavedLanguage();
    if (current && current.gtCode !== 'en') {
      document.documentElement.setAttribute('lang', current.gtCode);
      if (current.dir === 'rtl') {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }
    }
  }, [mounted]);

  // Re-apply translation on client-side route transitions
  useEffect(() => {
    if (!mounted) return;
    const current = getSavedLanguage();
    if (current && current.gtCode !== 'en') {
      // Re-trigger translation for newly mounted DOM elements
      const timers = [
        setTimeout(() => {
          const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
          if (combo && combo.value !== current.gtCode) {
            combo.value = current.gtCode;
            combo.dispatchEvent(new Event('change'));
          }
        }, 150),
        setTimeout(() => {
          const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
          if (combo && combo.value !== current.gtCode) {
            combo.value = current.gtCode;
            combo.dispatchEvent(new Event('change'));
          }
        }, 400),
      ];

      return () => {
        timers.forEach((t) => clearTimeout(t));
      };
    }
  }, [pathname, mounted]);

  // Clean up any stray timers safely
  useEffect(() => {
    const timer = initTimerRef.current;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!mounted) return null;

  const includedLangs = ALL_LANGUAGES.map((l) => l.gtCode).join(',');

  return (
    <>
      {/* Hidden translation container */}
      <div
        id="google_translate_element"
        style={{ display: 'none', position: 'absolute', top: -9999, left: -9999 }}
        className="notranslate"
        aria-hidden="true"
      />

      {/* Google Translate Init Script */}
      <Script
        id="google-translate-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.googleTranslateElementInit = function() {
              try {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: '${includedLangs}',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              } catch(e) {
                console.warn('Google Translate init', e);
              }
            };
          `,
        }}
      />

      {/* Official Google Translate Script */}
      <Script
        id="google-translate-script"
        strategy="lazyOnload"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
    </>
  );
}
