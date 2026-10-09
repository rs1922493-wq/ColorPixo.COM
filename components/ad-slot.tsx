'use client';

import React, { useEffect, useRef } from 'react';
import { SITE_CONFIG } from '@/lib/config/site';
import { isValidAdSenseClient, isValidAdSenseSlot } from '@/lib/adsense';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'leaderboard' | 'banner';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & {
      requestNonPersonalizedAds?: number;
    };
  }
}

/**
 * AdSlot Component:
 * Real Google AdSense unit compliant with Google AdSense Policies.
 *
 * GOOGLE ADSENSE IS 100% OPTIONAL:
 * - When NEXT_PUBLIC_ADSENSE_CLIENT is missing, empty, or unapproved, this component
 *   safely returns null immediately without rendering any empty containers, labels, or layout gaps.
 * - Only renders and requests ads when a verified Google AdSense Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 *   and valid numeric slot ID are configured.
 * - Never renders fake ads, placeholder banners, or dummy elements.
 */
export function AdSlot({ slotId, format = 'auto', className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  const rawClient = SITE_CONFIG.adsense.client;
  const isClientValid = isValidAdSenseClient(rawClient);
  const normalizedClient = isClientValid
    ? rawClient.startsWith('ca-pub-')
      ? rawClient
      : `ca-pub-${rawClient.replace(/^pub-/, '')}`
    : '';

  // Resolve numeric slot ID: prefer direct valid slotId prop, otherwise fallback to site-wide slotId env var
  const effectiveSlot = isValidAdSenseSlot(slotId)
    ? slotId!
    : isValidAdSenseSlot(SITE_CONFIG.adsense.slotId)
    ? SITE_CONFIG.adsense.slotId
    : null;

  useEffect(() => {
    // Only request ad when both client and slot ID are strictly valid and not already pushed
    if (isClientValid && effectiveSlot && !isPushed.current) {
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isPushed.current = true;
        }
      } catch (err) {
        // Silently handle if AdSense script is blocked or delayed
      }
    }
  }, [isClientValid, effectiveSlot]);

  // If AdSense is not configured, not approved, or credentials are absent, return null cleanly
  if (!isClientValid || !effectiveSlot) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto my-6 flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <span className="text-[10px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1.5 select-none">
        Advertisement
      </span>
      <div className="w-full flex justify-center min-h-[90px]">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={normalizedClient}
          data-ad-slot={effectiveSlot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
