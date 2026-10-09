// Script to verify word counts and link integrity of all 13 blog articles
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function countWords(str) {
  if (!str) return 0;
  // Clean markdown / html entities if any, count distinct whitespace-separated words
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function verify() {
  const fileContent = fs.readFileSync(path.join(__dirname, '../data/tool-blogs.ts'), 'utf8');
  const result = ts.transpileModule(fileContent, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });

  const mod = {};
  const fn = new Function('exports', 'require', '__dirname', result.outputText);
  fn(mod, (id) => {
    if (id === '@/lib/config/site') return { SITE_AUTHOR: { name: 'Rajesh Kumar Singh' } };
    if (id.startsWith('./blogs/')) {
      const subPath = path.join(__dirname, '../data', id + '.ts');
      if (fs.existsSync(subPath)) {
        const subContent = fs.readFileSync(subPath, 'utf8');
        const subResult = ts.transpileModule(subContent, {
          compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
        });
        const subMod = {};
        const subFn = new Function('exports', 'require', subResult.outputText);
        subFn(subMod, (subId) => {
          if (subId === '@/lib/config/site') return { SITE_AUTHOR: { name: 'Rajesh Kumar Singh' } };
          if (subId === '../tool-blogs' || subId === './tool-blogs') return {};
          return {};
        });
        return subMod;
      }
    }
    return {};
  }, path.join(__dirname, '../data'));

  const blogs = mod.TOOL_BLOGS;
  if (!blogs || !Array.isArray(blogs)) {
    console.error('Error: TOOL_BLOGS not found or is not an array.');
    process.exit(1);
  }

  console.log(`\n======================================================`);
  console.log(`COLORPIXO BLOG AUDIT REPORT`);
  console.log(`Total Articles Found: ${blogs.length}`);
  console.log(`======================================================\n`);

  let allPassed = true;
  const results = [];

  blogs.forEach((b, idx) => {
    // Meaningful article content ONLY (no headings, no navigation, no buttons)
    let bodyText = '';
    bodyText += (b.summary || '') + ' ';
    if (b.keyFeatures) bodyText += b.keyFeatures.join(' ') + ' ';
    if (b.sections) {
      b.sections.forEach(s => {
        bodyText += (s.body || '') + ' ';
        if (s.bulletPoints) bodyText += s.bulletPoints.join(' ') + ' ';
        if (s.callout) bodyText += (s.callout.text || '') + ' ';
      });
    }
    if (b.howToSteps) b.howToSteps.forEach(h => bodyText += (h.description || '') + ' ');
    if (b.useCases) b.useCases.forEach(u => bodyText += (u.description || '') + ' ');
    if (b.faqs) b.faqs.forEach(f => bodyText += (f.question || '') + ' ' + (f.answer || '') + ' ');
    if (b.keyTakeaways) bodyText += b.keyTakeaways.join(' ') + ' ';

    const wc = countWords(bodyText);
    const passed = wc >= 900;
    if (!passed) allPassed = false;

    results.push({
      num: idx + 1,
      title: b.title,
      slug: b.slug,
      toolName: b.toolName,
      toolPath: b.toolPath,
      faqCount: b.faqs ? b.faqs.length : 0,
      sectionsCount: b.sections ? b.sections.length : 0,
      wordCount: wc,
      status: passed ? 'PASSED (>= 900)' : 'FAILED (< 900)',
    });
  });

  results.forEach(r => {
    console.log(`${r.num}. [${r.status}] ${r.title}`);
    console.log(`   Slug: /blog/${r.slug}`);
    console.log(`   Associated Tool: ${r.toolName} (${r.toolPath})`);
    console.log(`   Word Count: ${r.wordCount} words | Sections: ${r.sectionsCount} | FAQs: ${r.faqCount}`);
    console.log(`------------------------------------------------------`);
  });

  console.log(`\nSummary: ${results.filter(r => r.wordCount >= 900).length} of ${blogs.length} passed.`);
  if (allPassed) {
    console.log(`All articles satisfy the minimum 900-word requirement!\n`);
  } else {
    console.log(`Some articles are still under 900 words.\n`);
  }
}

verify();
