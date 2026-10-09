const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// 1. Expand how-to-choose-website-colors in data/guides-data-existing.ts
const existingPath = path.join(__dirname, '../data/guides-data-existing.ts');
let existingContent = fs.readFileSync(existingPath, 'utf8');

// Ensure how-to-choose-website-colors has comprehensive section on contrast testing and real-world conversion funnel
const additionalSectionColors = `      {
        heading: '6. Conversion Rate Optimization: Where and How to Place Accent Colors',
        body: 'A common misconception is that certain colors possess mystical psychological powers that force users to convert. In reality, conversion rate optimization (CRO) studies demonstrate that visual contrast and spatial isolation—known as the Von Restorff effect—are the true drivers of call-to-action engagement.\\n\\nWhen assembling your page layout, reserve your high-intent accent hue exclusively for high-value user actions. If an accent color is used on social media icons, non-clickable pill badges, and background gradient headers, users quickly develop banner blindness. By keeping all secondary elements neutral and giving your primary conversion trigger exclusive chromatic contrast, users instantly perceive what step to take next.',
      },
      {
        heading: '7. Step-by-Step UI/UX Color Selection Checklist',
        body: '1. Establish brand personality and industry context (e.g. calm slate-blue for healthcare, vibrant violet for AI).\\n2. Select your primary anchor hue and verify it achieves 4.5:1 against dark backgrounds or white cards.\\n3. Build a 5-step neutral scale for canvas, surface, borders, body copy, and titles.\\n4. Pick a high-contrast accent using complementary or split-complementary color harmony.\\n5. Define four standardized semantic status indicators (Success, Warning, Error, Info) with text labels.\\n6. Test your layout in grayscale to ensure visual hierarchy remains obvious without color.',
      },`;

// Replace section 6 in how-to-choose-website-colors
existingContent = existingContent.replace(
  `      {\n        heading: '6. Practical Tips, Grayscale Audits and FAQ',`,
  additionalSectionColors + `\n      {\n        heading: '8. Practical Tips, Grayscale Audits and FAQ',`
);

// In hex-vs-rgb-vs-hsl, add a section on Modern CSS Color Mix and Alpha Compositing
const additionalSectionHexVsRgb = `      {
        heading: '6. Modern CSS color-mix() and Runtime Channel Blending',
        body: 'With CSS Color Module Level 4, developers can dynamically mix colors at runtime without preprocessing scripts or complex HSL calculations. The color-mix() function allows you to blend any format (HEX, RGB, or HSL) within a specified color space:\\n\\n\`background-color: color-mix(in srgb, var(--brand-primary) 85%, black);\`\\n\\nThis creates a 15% darker shade for hover states while preserving clean code. Blending with transparent creates semi-translucent pill badges without reducing the opacity of foreground text:\\n\\n\`background-color: color-mix(in srgb, var(--brand-primary) 12%, transparent);\`\\n\\nWhether your source token is declared as a hex code or RGB triplet, modern browsers handle the interpolation smoothly.',
      },`;

existingContent = existingContent.replace(
  `      {\n        heading: '6. The Perceptual Flaw of Standard HSL (and Why OKLCH Is Emerging)',`,
  additionalSectionHexVsRgb + `\n      {\n        heading: '7. The Perceptual Flaw of Standard HSL (and Why OKLCH Is Emerging)',`
);
existingContent = existingContent.replace(
  `      {\n        heading: '7. Summary Decision Matrix & FAQ',`,
  `      {\n        heading: '8. Summary Decision Matrix & FAQ',`
);

fs.writeFileSync(existingPath, existingContent, 'utf8');
console.log('Updated guides-data-existing.ts');
