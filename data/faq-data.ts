export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'tools' | 'privacy' | 'wcag' | 'export';
  keywords: string[];
  relatedToolPath?: string;
  relatedToolName?: string;
}

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General & Platform' },
  { id: 'tools', label: 'Color Tools & Features' },
  { id: 'privacy', label: 'Privacy & Security' },
  { id: 'wcag', label: 'Accessibility & WCAG' },
  { id: 'export', label: 'Export & Code Tokens' },
] as const;

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'what-is-colorpixo',
    question: 'What is ColorPixo.Com and what tools are included?',
    answer:
      'ColorPixo.Com is an all-in-one modern online color toolkit designed for frontend developers, UI/UX designers, and digital creators. It includes 13+ precision tools including a 2D Canvas Color Picker, Multi-Space Color Converter (HEX, RGB, HSL, HSV, CMYK), Harmonic Palette Generator, CSS Gradient Generator, Color Shades & Tints scale maker, Image Color Picker, WCAG Contrast Checker, Color Blindness Simulator, and more.',
    category: 'general',
    keywords: ['colorpixo', 'tools', 'features', 'overview', 'converter', 'palette', 'designer'],
    relatedToolPath: '/tools',
    relatedToolName: 'Explore All Tools',
  },
  {
    id: 'is-colorpixo-free',
    question: 'Is ColorPixo.Com free for commercial and personal use?',
    answer:
      'Yes, ColorPixo.Com is 100% free to use for both personal and commercial projects. You do not need to register an account or subscribe to generate palettes, convert color codes, test WCAG contrast ratios, or export production code for your websites and apps.',
    category: 'general',
    keywords: ['free', 'cost', 'pricing', 'commercial', 'license', 'subscription'],
  },
  {
    id: 'image-privacy-security',
    question: 'Are my uploaded images or color palettes stored on external servers?',
    answer:
      'No. Image and pixel analysis tools (such as the Image Color Picker, Image Extractor, and Color Blindness Simulator) process files locally in your browser using HTML5 Canvas and Web APIs. Your uploaded images are never transmitted to, inspected by, or stored on ColorPixo servers.',
    category: 'privacy',
    keywords: ['privacy', 'security', 'upload', 'images', 'server', 'client-side', 'safe'],
    relatedToolPath: '/image-color-picker',
    relatedToolName: 'Image Color Picker',
  },
  {
    id: 'supported-color-formats',
    question: 'Which color spaces and formats are supported for conversion?',
    answer:
      'ColorPixo supports all standard digital design color formats: 6-digit & 8-digit Hexadecimal (HEX / HEXA), Red-Green-Blue (RGB & RGBA), Hue-Saturation-Lightness (HSL & HSLA), Hue-Saturation-Value (HSV/HSB), and Cyan-Magenta-Yellow-Key (CMYK) for print. Conversions are calculated in real time using standardized color space transfer matrix equations.',
    category: 'tools',
    keywords: ['formats', 'hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'alpha', 'conversion'],
    relatedToolPath: '/color-converter',
    relatedToolName: 'Color Converter',
  },
  {
    id: 'wcag-contrast-calculation',
    question: 'How does the WCAG Color Contrast Checker verify accessibility?',
    answer:
      'Our Contrast Checker implements the official W3C Web Content Accessibility Guidelines (WCAG 2.1) relative luminance formula (L = 0.2126 * R + 0.7152 * G + 0.0722 * B). It evaluates contrast ratios against standard thresholds: 4.5:1 for normal body text (Level AA), 3:1 for large text and graphical UI components, and 7:1 for enhanced contrast (Level AAA). It also features an auto-tuner to suggest passing shades.',
    category: 'wcag',
    keywords: ['wcag', 'contrast', 'accessibility', 'aa', 'aaa', 'luminance', 'compliance'],
    relatedToolPath: '/contrast-checker',
    relatedToolName: 'Contrast Checker',
  },
  {
    id: 'color-harmony-schemes',
    question: 'What color harmony schemes are available in the Palette Generator?',
    answer:
      'The Palette Generator supports 7 classical color theory schemes based on geometric intervals on the 360° color wheel: Monochromatic (varied lightness and saturation of one hue), Complementary (direct 180° opposite), Analogous (adjacent 30° hues), Triadic (three equidistant 120° hues), Split-Complementary (base plus two hues adjacent to its complement), and Tetradic / Square (90° four-point rectangles).',
    category: 'tools',
    keywords: ['harmony', 'palette', 'complementary', 'analogous', 'triadic', 'tetradic', 'wheel'],
    relatedToolPath: '/palette-generator',
    relatedToolName: 'Palette Generator',
  },
  {
    id: 'exporting-tokens-tailwind',
    question: 'Can I export colors and gradients directly into Tailwind CSS or CSS variables?',
    answer:
      'Yes! Every tool includes 1-click export utilities. You can export color palettes as CSS custom properties (:root variables), Tailwind CSS color extension config (tailwind.config.js / v4 format), SCSS variables, JSON design tokens, SVG files, or high-resolution PNG swatch sheets for Figma and Sketch.',
    category: 'export',
    keywords: ['export', 'tailwind', 'css', 'variables', 'json', 'tokens', 'figma', 'scss'],
    relatedToolPath: '/color-shades',
    relatedToolName: 'Color Shades Generator',
  },
  {
    id: 'color-blindness-simulation',
    question: 'How does the Color Blindness Simulator emulate visual deficiencies?',
    answer:
      'The simulator utilizes biologically modeled Brettel/Vienot LMS matrix algorithms to accurately emulate anomalous trichromacy and dichromacy: Protanopia/Protanomaly (red-weak/red-blind), Deuteranopia/Deuteranomaly (green-weak/green-blind), Tritanopia/Tritanomaly (blue-weak/blue-blind), and Achromatopsia (monochromacy/complete grayscale). This ensures your UI is legible to everyone.',
    category: 'wcag',
    keywords: ['color blindness', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia', 'vision'],
    relatedToolPath: '/color-blindness-simulator',
    relatedToolName: 'Color Blindness Simulator',
  },
  {
    id: 'local-history-favorites',
    question: 'Where is my color history and saved favorites stored?',
    answer:
      'Your color history and bookmarked favorites are saved locally in your browser using the HTML5 localStorage API. They remain instantly accessible on your machine without requiring a user login or transmitting cookies, and you can clear your history anytime with a single click.',
    category: 'privacy',
    keywords: ['history', 'favorites', 'localstorage', 'browser', 'offline', 'storage'],
    relatedToolPath: '/history',
    relatedToolName: 'Color History',
  },
  {
    id: 'browser-compatibility',
    question: 'Which web browsers and devices are supported by ColorPixo.Com?',
    answer:
      'ColorPixo is fully responsive and optimized for all modern web browsers, including Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and Opera on desktop, tablet, and mobile devices (iOS & Android). It also supports hardware Eyedropper API where available on Chromium browsers.',
    category: 'general',
    keywords: ['browser', 'chrome', 'safari', 'mobile', 'ios', 'android', 'eyedropper', 'compatibility'],
  },
  {
    id: 'how-to-copy-values',
    question: 'How do I quickly copy color codes to my clipboard?',
    answer:
      'Simply click on any color card, format pill, or HEX code across the website. The color value is instantly copied to your operating system clipboard with a toast notification confirmation. You can also press Spacebar in the Palette Generator to generate random combinations.',
    category: 'tools',
    keywords: ['copy', 'clipboard', 'shortcut', 'toast', 'quick', 'hotkey'],
    relatedToolPath: '/color-picker',
    relatedToolName: 'Advanced Color Picker',
  },
  {
    id: 'what-is-hex',
    question: 'What is a HEX color code and how does it work?',
    answer:
      'A HEX color code is a 6-digit (or 8-digit with alpha) hexadecimal representation of red, green, and blue light components, preceded by a hash symbol (#). Each pair of hexadecimal digits (00 to FF) defines an intensity from 0 to 255. For example, #FF0000 represents pure red, #00FF00 pure green, and #0000FF pure blue. 8-digit HEX codes append an additional two digits for opacity/alpha transparency.',
    category: 'tools',
    keywords: ['hex', 'hexadecimal', 'color code', 'alpha', 'web color'],
    relatedToolPath: '/color-picker',
    relatedToolName: 'Color Picker',
  },
  {
    id: 'what-is-rgb',
    question: 'What is the RGB color model?',
    answer:
      'RGB stands for Red, Green, and Blue. It is an additive color model used for digital screens and electronic displays where red, green, and blue light beams are combined in varying proportions to create millions of colors. In CSS, RGB is specified as rgb(r, g, b) where each channel ranges from 0 to 255, or rgba(r, g, b, a) when an alpha transparency channel (0 to 1) is included.',
    category: 'tools',
    keywords: ['rgb', 'rgba', 'additive', 'color model', 'screen'],
    relatedToolPath: '/color-converter',
    relatedToolName: 'Color Converter',
  },
  {
    id: 'what-is-hsl',
    question: 'What is HSL and why do designers prefer it over RGB?',
    answer:
      'HSL stands for Hue, Saturation, and Lightness. Unlike RGB which reflects hardware light channels, HSL reflects how human beings perceive color. Hue is an angle on the color circle (0° to 360°), Saturation represents color purity or vibrancy (0% grayscale to 100% full color), and Lightness indicates illumination (0% black to 100% white). Designers prefer HSL because creating accessible shades, tints, and visual hierarchies is as simple as tweaking the Lightness slider.',
    category: 'tools',
    keywords: ['hsl', 'hue', 'saturation', 'lightness', 'designer color model'],
    relatedToolPath: '/color-converter',
    relatedToolName: 'Color Converter',
  },
  {
    id: 'how-does-advertising-work',
    question: 'How does advertising work on ColorPixo.Com?',
    answer:
      'ColorPixo displays digital advertisements through Google AdSense to fund ongoing server hosting, development, and maintenance while keeping all 13 tools 100% free for everyone. Advertisements are clearly labeled with an "Advertisement" disclosure and are never disguised as navigation, download links, or tool buttons. Advertisers have zero influence over our mathematical algorithms, and you can manage your advertising personalization preferences at any time via the "Privacy Choices" link in our footer.',
    category: 'general',
    keywords: ['advertising', 'adsense', 'funding', 'free', 'transparency', 'privacy choices'],
    relatedToolPath: '/advertising-policy',
    relatedToolName: 'Advertising Policy',
  },
  {
    id: 'dark-mode-theme',
    question: 'Does ColorPixo support Dark Mode and system theme preferences?',
    answer:
      'Yes, ColorPixo has first-class dark mode and light mode support with high-contrast surfaces engineered to reduce eye strain. You can toggle between themes at any time using the Sun/Moon icon in the top header navigation.',
    category: 'general',
    keywords: ['dark mode', 'theme', 'light mode', 'contrast', 'ui'],
  },
];
