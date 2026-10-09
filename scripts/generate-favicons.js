const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Exact ColorPixo Brand Mark SVG
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brandBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="50%" stop-color="#EC4899" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
  </defs>

  <!-- Outer Gradient Border -->
  <rect x="16" y="16" width="480" height="480" rx="112" fill="url(#brandBorder)" />

  <!-- Inner Dark Surface -->
  <rect x="36" y="36" width="440" height="440" rx="92" fill="#0B0F19" />

  <!-- 2x2 Swatch Grid -->
  <!-- Top Left: Purple #7C3AED -->
  <rect x="100" y="100" width="144" height="144" rx="28" fill="#7C3AED" />

  <!-- Top Right: Pink #EC4899 -->
  <rect x="268" y="100" width="144" height="144" rx="28" fill="#EC4899" />

  <!-- Bottom Left: Cyan #06B6D4 -->
  <rect x="100" y="268" width="144" height="144" rx="28" fill="#06B6D4" />

  <!-- Bottom Right: Emerald #10B981 -->
  <rect x="268" y="268" width="144" height="144" rx="28" fill="#10B981" />
</svg>
`;

async function generate() {
  const publicDir = path.join(__dirname, '../public');
  const svgBuffer = Buffer.from(svgIcon);

  // Generate PNG buffers for 16, 32, 48, 192, 512, 180
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  // Save standalone PNGs
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);

  // Build standard multi-resolution ICO file containing 16, 32, 48 PNG-compressed frames
  const images = [
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 },
  ];

  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO image type (1)
  header.writeUInt16LE(count, 4); // number of images

  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.size, 0); // width
    entry.writeUInt8(img.size, 1); // height
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image data size
    entry.writeUInt32LE(offset, 12); // image data offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...images.map(img => img.buffer)
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Successfully generated public/favicon.ico, icon-192.png, icon-512.png, and apple-touch-icon.png');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
