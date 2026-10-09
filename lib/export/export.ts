export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(content: string, filename: string, mimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  downloadBlob(blob, filename);
}

// Export single color swatch as PNG
export function exportSwatchPng(hex: string, name?: string): void {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 600, 480);

  // Label footer
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 480, 600, 120);

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(hex.toUpperCase(), 36, 540);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '20px system-ui, -apple-system, sans-serif';
  const label = name ? `${name} • ColorPixo.Com` : 'ColorPixo.Com';
  ctx.fillText(label, 36, 575);

  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, `color-${hex.replace('#', '')}.png`);
  }, 'image/png');
}

// Export palette as clean PNG card
export function exportPalettePng(colors: string[], title = 'ColorPixo Palette'): void {
  const width = 1200;
  const height = 630;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, width, height);

  // Header Title
  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
  ctx.fillText(title, 60, 70);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '18px system-ui, -apple-system, sans-serif';
  ctx.fillText('ColorPixo.Com • Exported Color Palette', 60, 105);

  // Palette swatches
  const count = colors.length;
  const padX = 60;
  const startY = 140;
  const swatchHeight = 360;
  const totalWidth = width - padX * 2;
  const swatchWidth = (totalWidth - (count - 1) * 16) / count;

  colors.forEach((col, idx) => {
    const x = padX + idx * (swatchWidth + 16);
    // Swatch box
    ctx.fillStyle = col;
    // Rounded rect
    const r = 16;
    ctx.beginPath();
    ctx.roundRect(x, startY, swatchWidth, swatchHeight, [r, r, 0, 0]);
    ctx.fill();

    // Swatch info footer
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(x, startY + swatchHeight, swatchWidth, 75, [0, 0, r, r]);
    ctx.fill();

    // Color text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(col.toUpperCase(), x + swatchWidth / 2, startY + swatchHeight + 44);
    ctx.textAlign = 'left';
  });

  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, `palette-${Date.now()}.png`);
  }, 'image/png');
}

// Export gradient to PNG
export function exportGradientPng(
  type: 'linear' | 'radial' | 'conic',
  stops: { color: string; offset: number }[],
  angle = 90
): void {
  const width = 1200;
  const height = 800;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (type === 'linear') {
    const rad = ((angle - 90) * Math.PI) / 180;
    const x1 = width / 2 - (Math.cos(rad) * width) / 2;
    const y1 = height / 2 - (Math.sin(rad) * height) / 2;
    const x2 = width / 2 + (Math.cos(rad) * width) / 2;
    const y2 = height / 2 + (Math.sin(rad) * height) / 2;

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    stops.forEach((s) => grad.addColorStop(s.offset / 100, s.color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (type === 'radial') {
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      10,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    );
    stops.forEach((s) => grad.addColorStop(s.offset / 100, s.color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Conic gradient
    const grad = ctx.createConicGradient((angle * Math.PI) / 180, width / 2, height / 2);
    stops.forEach((s) => grad.addColorStop(s.offset / 100, s.color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, `gradient-${type}-${Date.now()}.png`);
  }, 'image/png');
}

// Generate CSS root variables string
export function generateCssVariables(colors: { name: string; hex: string }[]): string {
  const lines = colors.map((c) => `  --${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`);
  return `:root {\n${lines.join('\n')}\n}`;
}

// Web Share or Clipboard
export async function shareOrCopy(title: string, text: string, url?: string): Promise<boolean> {
  const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url: targetUrl });
      return true;
    } catch {
      // User cancelled or unsupported, fallback to copy
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
