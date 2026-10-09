const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../data/guides-data-new.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Expand 60-30-10-color-rule with Worked E-Commerce Example
const ecommerce603010 = `      {
        heading: '6. Worked Example: E-Commerce Product Layout using 60-30-10',
        body: 'To see the 60-30-10 rule in action on a commercial website, consider a modern DTC skincare product page:\\n\\n• 60% Dominant Canvas: Soft Alabaster off-white (#FAF8F5) covers the wide page background, generous hero whitespace, and padding gutters, providing an organic, clean aesthetic without harsh digital glare.\\n\\n• 30% Structural UI & Text: Crisp pure white card containers (#FFFFFF) frame the product gallery, deep charcoal typography (#1C1917) renders ingredient lists and customer reviews, and subtle warm dividers (#E7E5E4) organize product specs into clear sections.\\n\\n• 10% High-Conversion Accent: Warm Terracotta Orange (#C2410C) is reserved exclusively for the "Add to Cart" button, the floating mobile sticky checkout bar, and the active star rating badge.\\n\\nBecause terracotta appears on less than 10% of total viewport pixels, shoppers never hesitate or wonder where to click to purchase.',
      },
      {
        heading: '7. Auditing Visual Proportions with Chromatic Heatmaps',
        body: 'If you are unsure whether your design respects the 60-30-10 balance, take a full-page screenshot and run it through a blur or pixelation filter (e.g. 20px Gaussian blur). Step back from your display: can you immediately identify the single primary conversion accent? If your eyes dart across multiple competing color patches of equal size, reduce the footprint of secondary colors until the primary accent commands clear prominence.',
      },`;

content = content.replace(
  `      {\n        heading: '6. Common Mistakes When Implementing 60-30-10',`,
  ecommerce603010 + `\n      {\n        heading: '8. Common Mistakes When Implementing 60-30-10',`
);
content = content.replace(
  `      {\n        heading: '7. Frequently Asked Questions About the 60-30-10 Rule',`,
  `      {\n        heading: '9. Frequently Asked Questions About the 60-30-10 Rule',`
);

// 2. Expand designing-for-color-blindness with Windows High Contrast & Line Chart Strategies
const cvdSections = `      {
        heading: '5. Windows High Contrast Mode and CSS Forced-Colors',
        body: 'Beyond biological color vision deficiencies, millions of low-vision users rely on Windows High Contrast Mode (also known as Contrast Themes) to browse the web. When High Contrast Mode is active, the operating system overrides author CSS colors with a restricted, high-contrast system palette (Canvas, CanvasText, Highlight, ButtonText).\\n\\nWeb designers often inadvertently break high contrast mode by using CSS background colors to draw custom checkboxes or icon buttons without borders. When the system strips background colors, borderless buttons vanish entirely.\\n\\nAlways include a transparent 1px border on interactive elements: \`border: 1px solid transparent;\`. Under standard viewing, the border is invisible. Under forced-colors mode, the operating system renders the border using the system ButtonBorder color, keeping the element visible.',
      },
      {
        heading: '6. Accessible Data Visualization and Multi-Series Chart Patterns',
        body: 'When building analytical dashboards, line charts, and bar graphs, color vision deficiencies cause severe data misinterpretation if series rely on red-versus-green keys. In standard line charts, "churned accounts" (red) and "active accounts" (green) appear as virtually identical yellow-brown lines to deuteranopes.\\n\\nImplement these three inclusive visualization rules:\\n1. High-Contrast Hue Pairing: Pair deep cobalt blue (#1D4ED8) with vibrant warm amber (#D97706) or rich magenta (#C026D3). These hues remain distinct across all deficiency categories.\\n2. Direct Inline Labeling: Place text labels directly at the end of chart lines rather than forcing users to match colored dots across an external legend box.\\n3. Distinct Stroke Dash Patterns: Style primary series with solid lines, comparison series with dashed lines (\`stroke-dasharray="6, 4"\`), and benchmarks with dotted lines.',
      },`;

content = content.replace(
  `      {\n        heading: '5. Simulation Algorithms: Brettel-Viénot-Mollon Math',`,
  cvdSections + `\n      {\n        heading: '7. Simulation Algorithms: Brettel-Viénot-Mollon Math',`
);
content = content.replace(
  `      {\n        heading: '6. Frequently Asked Questions About CVD Design',`,
  `      {\n        heading: '8. Frequently Asked Questions About CVD Design',`
);

// 3. Expand dark-mode-color-design-mistakes with Dual-Theme Token Swapping and OLED guidelines
const darkThemeSections = `      {
        heading: '5. Dual-Theme Design Token Swapping Architecture',
        body: 'A maintainable dark mode implementation relies on semantic CSS custom properties rather than scattered \`.dark\` overrides in every component file. Define your semantic roles once, then swap values at the root selector:\\n\\n\`\`\`css\\n:root {\\n  --surface-page: #f8fafc; /* Slate-50 */\\n  --surface-card: #ffffff; /* White */\\n  --text-main:    #0f172a; /* Slate-900 */\\n  --border-card:  #e2e8f0; /* Slate-200 */\\n}\\n\\n[data-theme="dark"] {\\n  --surface-page: #0b0f19; /* Slate-950 */\\n  --surface-card: #141a26; /* Elevated Slate */\\n  --text-main:    #f1f5f9; /* Slate-100 */\\n  --border-card:  #1e293b; /* Slate-800 */\\n}\\n\`\`\`\\n\\nBy targeting semantic variables, your buttons, navigation bars, and modals automatically transition between themes with zero component-level styling changes.',
      },
      {
        heading: '6. Managing Image Brightness and Media in Dark Themes',
        body: 'A frequently overlooked dark mode defect is dazzling photography. When a user browses a soothing dark theme at night and encounters an uncalibrated stock photo with a brilliant white studio background, the sudden burst of white pixels blinds the user.\\n\\nIn dark themes, apply a subtle CSS brightness and contrast filter to embedded user imagery and external media:\\n\\n\`\`\`css\\n[data-theme="dark"] img:not([src*=".svg"]) {\\n  filter: brightness(0.85) contrast(1.05);\\n  transition: filter 300ms ease;\\n}\\n[data-theme="dark"] img:hover {\\n  filter: brightness(1) contrast(1);\\n}\\n\`\`\`\\n\\nThis reduces harsh luminance flashes while allowing users to inspect full-color photography on hover.',
      },`;

content = content.replace(
  `      {\n        heading: '5. Mistake 4: Harsh Pure White (#FFFFFF) Typography',`,
  darkThemeSections + `\n      {\n        heading: '7. Mistake 4: Harsh Pure White (#FFFFFF) Typography',`
);
content = content.replace(
  `      {\n        heading: '6. Frequently Asked Questions About Dark Mode Design',`,
  `      {\n        heading: '8. Frequently Asked Questions About Dark Mode Design',`
);

// 4. Expand how-to-build-brand-color-system with Optical Scale Curves and Tailwind Config
const brandSystemSections = `      {
        heading: '5. Generating 10-Step Luminance Ladders with Optical Curves',
        body: 'Building a production-grade 50 to 950 color ramp requires non-linear optical interpolation. If you interpolate linearly between pure white (#FFFFFF), your brand hue (#2563EB), and pure black (#000000), the intermediate steps often look washed out or muddy.\\n\\nProfessional design systems use perceptual curves (such as cubic bezier or OKLCH chroma curves):\\n• Steps 50–200: Drop chroma rapidly to create soft, pastel tints for backgrounds and notification pills without visual chalkiness.\\n• Steps 300–400: Maintain clear border and focus ring definition.\\n• Steps 500–600: Anchor your primary brand hue and its direct hover counterpart.\\n• Steps 700–950: Slightly shift hue temperature (e.g. warming blues toward deep navy) to prevent muddy black degradation.\\n\\nYou can generate these curves automatically using the ColorPixo /color-shades tool.',
      },
      {
        heading: '6. Tailwind CSS Theme Configuration Architecture',
        body: 'When integrating your brand color tokens into modern web applications using Tailwind CSS, map your semantic variables directly to the theme extension object:\\n\\n\`\`\`javascript\\n// tailwind.config.js\\nmodule.exports = {\\n  theme: {\\n    extend: {\\n      colors: {\\n        brand: {\\n          50: "var(--color-brand-50)",\\n          500: "var(--color-brand-500)",\\n          600: "var(--color-brand-600)",\\n          900: "var(--color-brand-900)",\\n        },\\n        surface: {\\n          page: "var(--surface-page)",\\n          card: "var(--surface-card)",\\n        },\\n      },\\n    },\\n  },\\n};\\n\`\`\`\\n\\nThis unlocks intuitive utility classes like \`bg-surface-card\` and \`text-brand-500\` that adapt seamlessly to theme toggles while maintaining full IDE autocomplete support.',
      },`;

content = content.replace(
  `      {\n        heading: '5. Exporting Tokens to Tailwind CSS and Modern Frameworks',`,
  brandSystemSections + `\n      {\n        heading: '7. Exporting Tokens to Tailwind CSS and Modern Frameworks',`
);
content = content.replace(
  `      {\n        heading: '6. Frequently Asked Questions About Brand Color Systems',`,
  `      {\n        heading: '8. Frequently Asked Questions About Brand Color Systems',`
);

// 5. Expand gradient-design-tips-modern-ui with Dithering & Directional Lighting
const gradientSections = `      {
        heading: '5. Preventing Color Banding on 8-Bit Monitors with Dithering',
        body: 'On standard 8-bit displays, subtle gradients that span across a narrow luminance range—such as a dark navy background fading from #0B0F19 to #1E293B across 1000 pixels—frequently display visible stepping rings known as color banding.\\n\\nThis banding occurs because 8-bit color channels provide only 256 discrete levels per channel, which is insufficient to render imperceptible steps over large physical distances.\\n\\nTechniques to Eliminate Banding:\\n• Add Subtle Noise / Dithering: Overlay a semi-translucent 1% SVG noise texture over the gradient container. The microscopic noise pattern dither-blends adjacent pixel rows, completely smoothing out visible bands.\\n• Widen the Color Delta: Increase the chromatic distance between gradient stops by at least 15% to provide enough mathematical headroom for smooth interpolation.\\n• Utilize CSS Radial Vignettes: Soft elliptical falloffs produce less visible linear stepping than broad linear angles.',
      },
      {
        heading: '6. Directional Lighting and Natural Cognitive Flow',
        body: 'In physical nature, illumination comes from above: the sun and overhead fixtures cast light downward. Humans have evolved to expect surfaces to be illuminated from the top and shaded toward the bottom.\\n\\nWhen styling buttons, cards, and modal dialogs, align your gradient angles with natural overhead lighting:\\n• Subtle Button Elevation: Set \`linear-gradient(to bottom, #7C3AED, #6D28D9)\`. The slightly lighter top edge mimics a natural specular highlight, while the darker bottom simulates a bevel.\\n• Inverted Depressed States: On active press, invert the gradient to \`linear-gradient(to bottom, #5B21B6, #6D28D9)\` to simulate an indented, clicked physical button.',
      },`;

content = content.replace(
  `      {\n        heading: '5. Ensuring Typography Contrast Over Dynamic Gradients',`,
  gradientSections + `\n      {\n        heading: '7. Ensuring Typography Contrast Over Dynamic Gradients',`
);
content = content.replace(
  `      {\n        heading: '6. Frequently Asked Questions About CSS Gradients',`,
  `      {\n        heading: '8. Frequently Asked Questions About CSS Gradients',`
);

// 6. Expand print-vs-screen-colors-rgb-cmyk with Pantone Spot Colors & Prepress Proofing
const printSections = `      {
        heading: '5. Pantone Matching System (PMS) Spot Colors vs Process CMYK',
        body: 'When standard four-color process CMYK printing cannot accurately reproduce a high-vibrancy brand hue, commercial packaging designers turn to Pantone Matching System (PMS) spot colors.\\n\\nUnlike process CMYK—which mixes tiny dots of four standard inks on paper—a spot color is an exact custom chemical ink formula mixed prior to printing and applied via a dedicated press plate. Pantone spot colors can reproduce vivid oranges, radiant violets, metallic golds, and fluorescent neons that are physically impossible in standard CMYK.\\n\\nIf your brand identity demands an unmistakable, vibrant signature color across both digital apps and physical retail boxes, specify an official Pantone spot color alongside your digital HEX code.',
      },
      {
        heading: '6. Digital Prepress Soft-Proofing and Paper Stock Calibration',
        body: 'Before sending files to a commercial printer, always perform soft-proofing in design software like Adobe Illustrator or Photoshop using the printer ICC color profile (e.g. GRACoL or ISO Coated v2).\\n\\nFurthermore, account for paper stock absorption:\\n• Coated / Glossy Paper: The smooth surface prevents ink absorption, keeping colors crisper and closer to digital previews.\\n• Uncoated / Matte Paper: The porous paper fibers absorb liquid ink, causing dot gain and shifting colors noticeably darker and less saturated. When printing on uncoated stock, lighten your CMYK target values by 10% to compensate.',
      },`;

content = content.replace(
  `      {\n        heading: '5. Best Practices for Seamless Brand Translation Across Media',`,
  printSections + `\n      {\n        heading: '7. Best Practices for Seamless Brand Translation Across Media',`
);
content = content.replace(
  `      {\n        heading: '6. Frequently Asked Questions About RGB vs CMYK',`,
  `      {\n        heading: '8. Frequently Asked Questions About RGB vs CMYK',`
);

// 7. Expand accessible-button-and-link-colors with Touch Targets & Non-Text Controls
const buttonSections = `      {
        heading: '5. Non-Text Contrast (SC 1.4.11) for Toggles, Radios and Checkboxes',
        body: 'Web accessibility is not limited to text contrast. Under WCAG 2.1 Success Criterion 1.4.11, the visual boundaries of user interface components and graphical objects must achieve at least a 3.0:1 contrast ratio against adjacent background surfaces.\\n\\nThis rule applies directly to:\\n• Unchecked Checkbox Borders: A light gray border like #E2E8F0 on a white #FFFFFF card has only a 1.2:1 ratio, failing SC 1.4.11. Darken the resting border to at least Slate-400 (#94A3B8, 3.1:1).\\n• Toggle Switch Tracks: The inactive track of a toggle switch must remain visible to low-vision users before it is clicked.\\n• Radio Button Rings: Ensure both the outer selection ring and the inner selected dot maintain 3:1 luminance contrast against the form container.',
      },
      {
        heading: '6. Touch Target Sizing and Interactive Spacing (WCAG 2.2 SC 2.5.8)',
        body: 'Color contrast is closely coupled with physical target ergonomics. A high-contrast button that is too small for human thumbs causes misclicks and user frustration.\\n\\nUnder WCAG 2.2 Success Criterion 2.5.8, interactive targets must have a minimum bounding size of at least 24 by 24 CSS pixels, with Apple iOS and Google Material Design recommending at least 44 by 44 pixels for touch screens. Ensure that buttons, icon links, and pagination numbers combine compliant contrast with generous touch padding.',
      },`;

content = content.replace(
  `      {\n        heading: '5. Disabled Button States Without Hurting Usability',`,
  buttonSections + `\n      {\n        heading: '7. Disabled Button States Without Hurting Usability',`
);
content = content.replace(
  `      {\n        heading: '6. Frequently Asked Questions About Interactive State Contrast',`,
  `      {\n        heading: '8. Frequently Asked Questions About Interactive State Contrast',`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully expanded all 7 guides in guides-data-new.ts');
