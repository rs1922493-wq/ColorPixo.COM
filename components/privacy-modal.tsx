'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, Check, ExternalLink } from 'lucide-react';
import { useToast } from './toast-context';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & {
      requestNonPersonalizedAds?: number;
    };
  }
}

export function applyAdSenseConsent(personalization: boolean) {
  if (typeof window !== 'undefined') {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.requestNonPersonalizedAds = personalization ? 0 : 1;

    // Google Consent Mode v2 signal update
    try {
      const win = window as any;
      if (typeof win.gtag === 'function') {
        win.gtag('consent', 'update', {
          ad_storage: personalization ? 'granted' : 'denied',
          ad_user_data: personalization ? 'granted' : 'denied',
          ad_personalization: personalization ? 'granted' : 'denied',
          analytics_storage: personalization ? 'granted' : 'denied',
        });
      }
    } catch {
      // ignore
    }
  }
}

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const { showToast } = useToast();
  const [personalizationEnabled, setPersonalizationEnabled] = useState(false);
  const [hasGoogleFc, setHasGoogleFc] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const win = window as any;
        if (win.googlefc && typeof win.googlefc.showRevocationMessage === 'function') {
          setHasGoogleFc(true);
        }

        const saved =
          window.localStorage.getItem('colorpixo.privacy_consent') ||
          window.localStorage.getItem('ch.privacy_consent');
        if (saved) {
          const parsed = JSON.parse(saved);
          const isPersonalization = !!parsed.personalization;
          setPersonalizationEnabled(isPersonalization);
          applyAdSenseConsent(isPersonalization);
        } else {
          // Default to non-personalized until user explicitly opts in
          applyAdSenseConsent(false);
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  const handleOpenGoogleFc = () => {
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.googlefc && typeof win.googlefc.showRevocationMessage === 'function') {
        win.googlefc.showRevocationMessage();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          'colorpixo.privacy_consent',
          JSON.stringify({
            personalization: personalizationEnabled,
            timestamp: Date.now(),
          })
        );
        applyAdSenseConsent(personalizationEnabled);
      } catch {
        // ignore
      }
    }
    showToast('Privacy preferences saved successfully.', 'success');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Privacy Choices"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Privacy Choices & Site Preferences.
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your local storage preferences and advertising signals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Highlight Banner */}
          <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 text-xs leading-relaxed">
            <strong>In-Browser Processing:</strong> Image extraction and color simulation tools process files strictly within your local browser memory using HTML5 Canvas APIs. Uploaded images are never sent to or stored on ColorPixo servers.
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Essential Local Storage */}
            <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <span>Essential Local Storage</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 font-mono">
                    <Lock className="w-2.5 h-2.5" /> REQUIRED
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  Stores your display theme preference (dark/light) and saved color favorites in your browser local storage (`colorpixo.favorites`, `colorpixo.settings`) so you don&apos;t lose your work.
                </p>
              </div>
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  aria-label="Essential local storage (always required)"
                  className="w-4 h-4 rounded text-purple-600 bg-slate-200 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Personalized Ad Controls */}
            <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="space-y-1">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Advertising Personalization Signal
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  Sets the client-side non-personalized ads signal (`requestNonPersonalizedAds`) for Google AdSense. When toggled off (default), ads request contextual non-personalized delivery.
                </p>
                <div className="pt-1">
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <span>Google Ads Settings</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={personalizationEnabled}
                  onChange={(e) => setPersonalizationEnabled(e.target.checked)}
                  aria-label="Enable personalized advertising signal"
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          {/* Google CMP & Regional Regulations Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Notice on Certified CMP Requirements:</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
              This dialog manages local site preferences and dispatches the in-browser non-personalized advertising signal. It is not a Google-certified Consent Management Platform (CMP). For traffic originating from the EEA, UK, and Switzerland, Google AdSense requires consent collected through a Google-certified CMP configured via Google Privacy &amp; Messaging (OWNER ACTION REQUIRED once your AdSense account is approved). When a certified CMP banner is active, its consent choices govern advertising according to TCF v2.2 specifications.
            </p>
            {hasGoogleFc && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenGoogleFc}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Change Google CMP Consent Choices</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.98] rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
