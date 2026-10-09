export interface BlogSection {
  heading: string;
  subheading?: string;
  body: string;
  bulletPoints?: string[];
  codeExample?: { language: string; code: string };
  callout?: { title: string; text: string };
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  readTime: string;
  publishedDate: string;
  lastUpdated: string;
  author: string;
  authorRole: string;
  toolId: string;
  toolSlug: string;
  toolName: string;
  toolPath: string;
  category: 'picker' | 'palette' | 'convert' | 'accessibility' | 'code' | 'ai';
  categoryLabel: string;
  tags: string[];
  keyFeatures: string[];
  sections: BlogSection[];
  howToSteps: { step: number; title: string; description: string }[];
  useCases: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  keyTakeaways: string[];
  relatedToolSlugs: string[];
}

import { articleColorPicker } from './blogs/color-picker';
import { articleImageColorPicker } from './blogs/image-color-picker';
import { articlePaletteGenerator } from './blogs/palette-generator';
import { articleGradientGenerator } from './blogs/gradient-generator';
import { articleColorConverter } from './blogs/color-converter';
import { articleContrastChecker } from './blogs/contrast-checker';
import { articleColorBlindness } from './blogs/color-blindness';
import { articleColorNameFinder } from './blogs/color-name-finder';
import { articleColorShades } from './blogs/color-shades';
import { articleRandomColor } from './blogs/random-color';
import { articleCssColor } from './blogs/css-color';
import { articleAiPalette } from './blogs/ai-palette';
import { articleColorHarmony } from './blogs/color-harmony';

export const TOOL_BLOGS: BlogArticle[] = [
  articleColorPicker,
  articleImageColorPicker,
  articlePaletteGenerator,
  articleGradientGenerator,
  articleColorConverter,
  articleContrastChecker,
  articleColorBlindness,
  articleColorNameFinder,
  articleColorShades,
  articleRandomColor,
  articleCssColor,
  articleAiPalette,
  articleColorHarmony,
];
