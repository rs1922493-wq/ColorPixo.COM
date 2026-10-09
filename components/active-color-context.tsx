'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredHistory } from '@/lib/storage/store';

interface ActiveColorContextType {
  activeColor: string;
  setActiveColor: (hex: string) => void;
}

const STORAGE_KEY = 'colorpixo.active_color';
const EVENT_NAME = 'colorpixo:colorchange';
const DEFAULT_COLOR = '#3B82F6';

const ActiveColorContext = createContext<ActiveColorContextType>({
  activeColor: DEFAULT_COLOR,
  setActiveColor: () => {},
});

export function broadcastActiveColor(hex: string) {
  if (typeof window === 'undefined' || !hex) return;
  const cleanHex = hex.trim().toUpperCase();
  if (!/^#[0-9A-F]{3,8}$/.test(cleanHex)) return;
  try {
    localStorage.setItem(STORAGE_KEY, cleanHex);
  } catch {
    // Ignore storage issues
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { hex: cleanHex } }));
}

export function ActiveColorProvider({ children }: { children: React.ReactNode }) {
  const [activeColor, setActiveColorState] = useState<string>(DEFAULT_COLOR);

  useEffect(() => {
    // Initialize from localStorage or most recent history color
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && /^#[0-9A-F]{3,8}$/i.test(stored)) {
        setActiveColorState(stored.toUpperCase());
        return;
      }
    } catch {
      // ignore
    }

    const history = getStoredHistory();
    if (history.length > 0 && history[0].hex) {
      setActiveColorState(history[0].hex.toUpperCase());
    }
  }, []);

  const setActiveColor = useCallback((hex: string) => {
    if (!hex) return;
    const cleanHex = hex.trim().toUpperCase();
    if (!/^#[0-9A-F]{3,8}$/.test(cleanHex)) return;
    setActiveColorState(cleanHex);
    broadcastActiveColor(cleanHex);
  }, []);

  useEffect(() => {
    const handleColorEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ hex: string }>;
      if (customEvent.detail && customEvent.detail.hex) {
        setActiveColorState(customEvent.detail.hex.toUpperCase());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setActiveColorState(e.newValue.toUpperCase());
      }
    };

    window.addEventListener(EVENT_NAME, handleColorEvent);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, handleColorEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <ActiveColorContext.Provider value={{ activeColor, setActiveColor }}>
      {children}
    </ActiveColorContext.Provider>
  );
}

export function useActiveColor() {
  return useContext(ActiveColorContext);
}
