export interface HistoryItem {
  hex: string;
  ts: number;
}

export interface FavoriteColor {
  hex: string;
  ts: number;
}

export interface FavoritePalette {
  id: string;
  name: string;
  colors: string[];
  ts: number;
}

export interface StorageSettings {
  v: number;
  theme: 'system' | 'light' | 'dark';
}

export interface StorageHistory {
  v: number;
  items: HistoryItem[];
}

export interface StorageFavorites {
  v: number;
  colors: FavoriteColor[];
  palettes: FavoritePalette[];
}

const SETTINGS_KEY = 'colorpixo.settings';
const HISTORY_KEY = 'colorpixo.history';
const FAVORITES_KEY = 'colorpixo.favorites';

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__colorpixo_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// In-memory fallbacks if localStorage is disabled
const memoryStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  if (isStorageAvailable()) {
    try {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
      // Backward compatibility check for legacy storage keys
      const legacyKey = key.replace('colorpixo.', 'ch.');
      if (legacyKey !== key) {
        return window.localStorage.getItem(legacyKey);
      }
      return null;
    } catch {
      return memoryStore[key] || null;
    }
  }
  return memoryStore[key] || null;
}

function safeSet(key: string, value: string): void {
  memoryStore[key] = value;
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore quota exceeded or storage blocked
    }
  }
}

// Settings
export function getStoredSettings(): StorageSettings {
  const raw = safeGet(SETTINGS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.v === 'number') {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  return { v: 1, theme: 'system' };
}

export function saveStoredSettings(settings: Partial<StorageSettings>): void {
  const current = getStoredSettings();
  const updated: StorageSettings = { ...current, ...settings, v: 1 };
  safeSet(SETTINGS_KEY, JSON.stringify(updated));
}

// History (recent colors, capped at 50)
export function getStoredHistory(): HistoryItem[] {
  const raw = safeGet(HISTORY_KEY);
  if (raw) {
    try {
      const parsed: StorageHistory = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        return parsed.items;
      }
    } catch {
      // ignore
    }
  }
  return [];
}

export function addHistoryColor(hex: string): void {
  if (!hex || !/^#[0-9a-fA-F]{3,8}$/.test(hex)) return;
  const normalized = hex.toUpperCase();
  const current = getStoredHistory();
  // Filter out duplicate if existing to move to top
  const filtered = current.filter(item => item.hex.toUpperCase() !== normalized);
  filtered.unshift({ hex: normalized, ts: Date.now() });
  const capped = filtered.slice(0, 50);
  safeSet(HISTORY_KEY, JSON.stringify({ v: 1, items: capped }));
}

export function removeHistoryItem(hex: string): void {
  const current = getStoredHistory();
  const filtered = current.filter(item => item.hex.toUpperCase() !== hex.toUpperCase());
  safeSet(HISTORY_KEY, JSON.stringify({ v: 1, items: filtered }));
}

export function clearHistory(): void {
  safeSet(HISTORY_KEY, JSON.stringify({ v: 1, items: [] }));
}

// Favorites
export function getStoredFavorites(): StorageFavorites {
  const raw = safeGet(FAVORITES_KEY);
  if (raw) {
    try {
      const parsed: StorageFavorites = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.colors) && Array.isArray(parsed.palettes)) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  return { v: 1, colors: [], palettes: [] };
}

export function toggleFavoriteColor(hex: string): boolean {
  if (!hex) return false;
  const normalized = hex.toUpperCase();
  const current = getStoredFavorites();
  const exists = current.colors.some(c => c.hex.toUpperCase() === normalized);

  let updatedColors: FavoriteColor[];
  if (exists) {
    updatedColors = current.colors.filter(c => c.hex.toUpperCase() !== normalized);
  } else {
    updatedColors = [{ hex: normalized, ts: Date.now() }, ...current.colors];
  }

  const updated: StorageFavorites = {
    v: 1,
    colors: updatedColors,
    palettes: current.palettes,
  };
  safeSet(FAVORITES_KEY, JSON.stringify(updated));
  return !exists;
}

export function isColorFavorite(hex: string): boolean {
  if (!hex) return false;
  const current = getStoredFavorites();
  return current.colors.some(c => c.hex.toUpperCase() === hex.toUpperCase());
}

export function saveFavoritePalette(
  nameOrObj: string | { id?: string; name: string; colors: string[]; createdAt?: number },
  colorsArg?: string[]
): FavoritePalette {
  const current = getStoredFavorites();
  let name = '';
  let colors: string[] = [];
  let customId: string | undefined;

  if (typeof nameOrObj === 'object') {
    name = nameOrObj.name;
    colors = nameOrObj.colors;
    customId = nameOrObj.id;
  } else {
    name = nameOrObj;
    colors = colorsArg || [];
  }

  const newPalette: FavoritePalette = {
    id: customId || `pal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || `Palette ${current.palettes.length + 1}`,
    colors: colors.map(c => c.toUpperCase()),
    ts: Date.now(),
  };

  const updated: StorageFavorites = {
    v: 1,
    colors: current.colors,
    palettes: [newPalette, ...current.palettes.filter(p => p.id !== newPalette.id)],
  };
  safeSet(FAVORITES_KEY, JSON.stringify(updated));
  return newPalette;
}

export function removeFavoritePalette(id: string): void {
  const current = getStoredFavorites();
  const updated: StorageFavorites = {
    v: 1,
    colors: current.colors,
    palettes: current.palettes.filter(p => p.id !== id),
  };
  safeSet(FAVORITES_KEY, JSON.stringify(updated));
}

export function getFavoriteColors(): string[] {
  return getStoredFavorites().colors.map((c) => c.hex);
}

export function getFavoritePalettes(): FavoritePalette[] {
  return getStoredFavorites().palettes;
}

export function removeFavoriteColor(hex: string): void {
  toggleFavoriteColor(hex);
}

export function getHistoryColors(): string[] {
  return getStoredHistory().map((i) => i.hex);
}

export function removeHistoryColor(hex: string): void {
  removeHistoryItem(hex);
}

export function clearHistoryColors(): void {
  clearHistory();
}
