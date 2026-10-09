export interface LanguageItem {
  code: string;
  name: string;
  flag: string;
  gtCode: string;
  dir?: 'ltr' | 'rtl';
}

export const ALL_LANGUAGES: LanguageItem[] = [
  // Column 1
  { code: 'PS', name: 'Pashto', flag: '🇦🇫', gtCode: 'ps', dir: 'rtl' },
  { code: 'AR', name: 'Arabic', flag: '🇸🇦', gtCode: 'ar', dir: 'rtl' },
  { code: 'BN', name: 'Bengali', flag: '🇧🇩', gtCode: 'bn' },
  { code: 'ZH', name: 'Chinese', flag: '🇨🇳', gtCode: 'zh-CN' },
  { code: 'EN', name: 'English', flag: '🇺🇸', gtCode: 'en' },
  { code: 'FR', name: 'French', flag: '🇫🇷', gtCode: 'fr' },
  { code: 'DE', name: 'German', flag: '🇩🇪', gtCode: 'de' },
  { code: 'GU', name: 'Gujarati', flag: '🇮🇳', gtCode: 'gu' },
  { code: 'HI', name: 'Hindi', flag: '🇮🇳', gtCode: 'hi' },
  { code: 'HE', name: 'Hebrew', flag: '🇮🇱', gtCode: 'iw', dir: 'rtl' },
  { code: 'IT', name: 'Italian', flag: '🇮🇹', gtCode: 'it' },
  { code: 'JA', name: 'Japanese', flag: '🇯🇵', gtCode: 'ja' },
  { code: 'KN', name: 'Kannada', flag: '🇮🇳', gtCode: 'kn' },
  { code: 'KO', name: 'Korean', flag: '🇰🇷', gtCode: 'ko' },
  { code: 'MR', name: 'Marathi', flag: '🇮🇳', gtCode: 'mr' },
  { code: 'ML', name: 'Malayalam', flag: '🇮🇳', gtCode: 'ml' },

  // Column 2
  { code: 'NE', name: 'Nepali', flag: '🇳🇵', gtCode: 'ne' },
  { code: 'NL', name: 'Dutch', flag: '🇳🇱', gtCode: 'nl' },
  { code: 'PL', name: 'Polish', flag: '🇵🇱', gtCode: 'pl' },
  { code: 'PT', name: 'Portuguese', flag: '🇵🇹', gtCode: 'pt' },
  { code: 'RU', name: 'Russian', flag: '🇷🇺', gtCode: 'ru' },
  { code: 'SI', name: 'Sinhala', flag: '🇱🇰', gtCode: 'si' },
  { code: 'ES', name: 'Spanish', flag: '🇪🇸', gtCode: 'es' },
  { code: 'SW', name: 'Swahili', flag: '🇹🇿', gtCode: 'sw' },
  { code: 'TA', name: 'Tamil', flag: '🇮🇳', gtCode: 'ta' },
  { code: 'TE', name: 'Telugu', flag: '🇮🇳', gtCode: 'te' },
  { code: 'TH', name: 'Thai', flag: '🇹🇭', gtCode: 'th' },
  { code: 'TR', name: 'Turkish', flag: '🇹🇷', gtCode: 'tr' },
  { code: 'UK', name: 'Ukrainian', flag: '🇺🇦', gtCode: 'uk' },
  { code: 'VI', name: 'Vietnamese', flag: '🇻🇳', gtCode: 'vi' },
  { code: 'PA', name: 'Punjabi', flag: '🇮🇳', gtCode: 'pa' },
  { code: 'UR', name: 'Urdu', flag: '🇵🇰', gtCode: 'ur', dir: 'rtl' },
];

export function getSavedLanguage(): LanguageItem {
  if (typeof window === 'undefined') {
    return ALL_LANGUAGES.find((l) => l.code === 'EN') || ALL_LANGUAGES[4];
  }
  try {
    const savedCode = localStorage.getItem('colorpixo_lang');
    if (savedCode) {
      const match = ALL_LANGUAGES.find((l) => l.code.toUpperCase() === savedCode.toUpperCase());
      if (match) return match;
    }
    // Check googtrans cookie if present
    const cookieMatch = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
    if (cookieMatch && cookieMatch[1]) {
      const gt = cookieMatch[1];
      const match = ALL_LANGUAGES.find((l) => l.gtCode.toLowerCase() === gt.toLowerCase());
      if (match) return match;
    }
  } catch {
    // fallback
  }
  return ALL_LANGUAGES.find((l) => l.code === 'EN') || ALL_LANGUAGES[4];
}

export function setSiteLanguage(lang: LanguageItem) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('colorpixo_lang', lang.code);
  } catch {
    // ignore
  }

  // Handle English (revert to original source language)
  if (lang.gtCode === 'en') {
    clearGoogleTranslateCookie();
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');

    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo && combo.value !== 'en') {
      combo.value = 'en';
      combo.dispatchEvent(new Event('change'));
      setTimeout(() => {
        window.location.reload();
      }, 150);
    } else {
      window.location.reload();
    }
    return;
  }

  // Set Google Translate cookie
  setGoogleTranslateCookie(lang.gtCode);

  // Set direction and lang attributes
  document.documentElement.setAttribute('lang', lang.gtCode);
  if (lang.dir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }

  const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (combo) {
    combo.value = lang.gtCode;
    combo.dispatchEvent(new Event('change'));
    window.dispatchEvent(new CustomEvent('colorpixo-lang-changed', { detail: lang }));
  } else {
    // If combo is not yet loaded, reload with the cookie set to trigger immediate translation
    window.location.reload();
  }
}

function setGoogleTranslateCookie(gtCode: string) {
  const cookieVal = `/en/${gtCode}`;
  const now = new Date();
  now.setFullYear(now.getFullYear() + 1);
  const expires = now.toUTCString();

  document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/; SameSite=Lax`;
  document.cookie = `googtrans=${cookieVal}; expires=${expires}; domain=${window.location.hostname}; path=/; SameSite=Lax`;

  const hostParts = window.location.hostname.split('.');
  if (hostParts.length > 2) {
    const parentDomain = hostParts.slice(-2).join('.');
    document.cookie = `googtrans=${cookieVal}; expires=${expires}; domain=.${parentDomain}; path=/; SameSite=Lax`;
  }
}

function clearGoogleTranslateCookie() {
  const past = 'Thu, 01 Jan 1970 00:00:00 UTC';
  document.cookie = `googtrans=; expires=${past}; path=/;`;
  document.cookie = `googtrans=; expires=${past}; domain=${window.location.hostname}; path=/;`;

  const hostParts = window.location.hostname.split('.');
  if (hostParts.length > 2) {
    const parentDomain = hostParts.slice(-2).join('.');
    document.cookie = `googtrans=; expires=${past}; domain=.${parentDomain}; path=/;`;
  }
}
