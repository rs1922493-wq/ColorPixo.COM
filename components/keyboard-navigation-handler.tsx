'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TOOLS } from '@/lib/config/site';
import { useToast } from './toast-context';
import { useToolAdTransition } from './tool-ad-transition';
import { KeyboardShortcutsModal } from './keyboard-shortcuts-modal';

const STORAGE_KEY = 'colorpixo_shortcuts_enabled';

export function KeyboardNavigationHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { launchTool } = useToolAdTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Initialize preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsEnabled(stored === 'true');
      }
    } catch {
      // Ignore localStorage read errors in private browsing
    }
  }, []);

  const handleToggleEnabled = useCallback((value: boolean) => {
    setIsEnabled(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // Ignore
    }
    showToast(
      value ? 'Keyboard shortcuts enabled' : 'Keyboard shortcuts paused',
      'info'
    );
  }, [showToast]);

  // Listen for custom trigger to open shortcuts modal (e.g. from header button)
  useEffect(() => {
    const handleOpenEvent = () => setIsModalOpen(true);
    window.addEventListener('open-keyboard-shortcuts', handleOpenEvent);
    return () => window.removeEventListener('open-keyboard-shortcuts', handleOpenEvent);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Help cheat sheet: '?' or 'Shift + /'
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        const isTyping =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable ||
            target.getAttribute('role') === 'textbox');

        if (!isTyping) {
          e.preventDefault();
          setIsModalOpen((prev) => !prev);
          return;
        }
      }

      // If shortcuts are toggled off, ignore navigation shortcuts
      if (!isEnabled) return;

      // Never intercept standard browser combinations like Cmd+C, Cmd+P, Ctrl+C, Ctrl+P, Alt+..., etc.
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Never trigger while the user is actively typing in a field
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          target.getAttribute('role') === 'textbox');

      if (isTyping) return;

      // If modal is open, let Esc handle it in the modal, ignore navigation
      if (isModalOpen) return;

      const key = e.key.toLowerCase();

      // Check Global shortcuts
      if (key === 'h') {
        e.preventDefault();
        if (pathname === '/') {
          showToast('Already on Home Page [H]', 'info');
        } else {
          router.push('/');
          showToast('Navigating to Home [H]', 'info');
        }
        return;
      }

      if (key === 'f') {
        e.preventDefault();
        if (pathname === '/favorites') {
          showToast('Already on Saved Favorites [F]', 'info');
        } else {
          router.push('/favorites');
          showToast('Opening Saved Favorites [F]', 'info');
        }
        return;
      }

      // Check tool shortcuts
      const matchedTool = TOOLS.find((t) => t.shortcut?.toLowerCase() === key);
      if (matchedTool) {
        e.preventDefault();
        const shortcutKey = matchedTool.shortcut?.toUpperCase();
        if (pathname === matchedTool.path) {
          showToast(`Already on ${matchedTool.name} [${shortcutKey}]`, 'info');
        } else {
          launchTool(matchedTool.path, matchedTool.name, matchedTool.description);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, isModalOpen, pathname, router, showToast, launchTool]);

  return (
    <KeyboardShortcutsModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      isEnabled={isEnabled}
      onToggleEnabled={handleToggleEnabled}
    />
  );
}
