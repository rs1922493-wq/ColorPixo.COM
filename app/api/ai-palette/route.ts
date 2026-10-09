import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { parseHex, rgbToHsl, RGB } from '@/lib/color/math';

interface PaletteColorOutput {
  role: 'primary' | 'secondary' | 'accent' | 'background' | 'text';
  roleLabel: string;
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  explanation: string;
}

// In-memory rate limiting by IP (max 30 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 30) {
    return false;
  }
  entry.count++;
  return true;
}

// Rule-based fallback if offline, rate limited, or without API key
function generateRuleBasedPalette(prompt: string): PaletteColorOutput[] {
  const p = prompt.toLowerCase();

  // Determine mood parameters
  let primaryHue = 217; // default blue
  let primarySat = 85;
  let primaryLight = 50;

  if (p.includes('luxury') || p.includes('hotel') || p.includes('gold') || p.includes('royal')) {
    primaryHue = 38; // Rich Gold
    primarySat = 80;
    primaryLight = 45;
  } else if (p.includes('nature') || p.includes('forest') || p.includes('earth') || p.includes('tea') || p.includes('garden')) {
    primaryHue = 150; // Emerald / Forest
    primarySat = 70;
    primaryLight = 38;
  } else if (p.includes('cyber') || p.includes('neon') || p.includes('game') || p.includes('future') || p.includes('synth')) {
    primaryHue = 280; // Electric violet
    primarySat = 95;
    primaryLight = 60;
  } else if (p.includes('kid') || p.includes('play') || p.includes('toy') || p.includes('fun') || p.includes('cartoon')) {
    primaryHue = 45; // Vibrant sunshine
    primarySat = 95;
    primaryLight = 52;
  } else if (p.includes('sunset') || p.includes('warm') || p.includes('coffee') || p.includes('bakery')) {
    primaryHue = 22; // Terracotta orange
    primarySat = 88;
    primaryLight = 52;
  } else if (p.includes('ocean') || p.includes('surf') || p.includes('water') || p.includes('clean') || p.includes('tech')) {
    primaryHue = 199; // Azure / Sky Blue
    primarySat = 90;
    primaryLight = 50;
  } else if (p.includes('pastel') || p.includes('soft') || p.includes('baby') || p.includes('calm') || p.includes('spring') || p.includes('flower') || p.includes('floral')) {
    primaryHue = 330;
    primarySat = 65;
    primaryLight = 75;
  } else if (p.includes('food') || p.includes('restaurant') || p.includes('pizza') || p.includes('burger') || p.includes('spicy') || p.includes('fire')) {
    primaryHue = 12;
    primarySat = 90;
    primaryLight = 50;
  } else if (p.includes('health') || p.includes('medical') || p.includes('doctor') || p.includes('pharma') || p.includes('clinic')) {
    primaryHue = 188;
    primarySat = 78;
    primaryLight = 42;
  } else if (p.includes('crypto') || p.includes('finance') || p.includes('bank') || p.includes('money') || p.includes('invest')) {
    primaryHue = 222;
    primarySat = 82;
    primaryLight = 48;
  } else {
    // Deterministic hash based on prompt characters for custom unique vibe
    let hash = 0;
    for (let i = 0; i < p.length; i++) {
      hash = (hash << 5) - hash + p.charCodeAt(i);
      hash |= 0;
    }
    primaryHue = Math.abs(hash) % 360;
    primarySat = 75;
    primaryLight = 48;
  }

  // Generate 5 semantic roles
  const hslToHexStr = (h: number, s: number, l: number): { hex: string; rgb: RGB } => {
    // Standard conversion
    const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100);
    const x = c * (1 - Math.abs((((h % 360) / 60) % 2) - 1));
    const m = l / 100 - c / 2;
    let r1 = 0, g1 = 0, b1 = 0;
    const hNorm = ((h % 360) + 360) % 360;

    if (hNorm < 60) { r1 = c; g1 = x; b1 = 0; }
    else if (hNorm < 120) { r1 = x; g1 = c; b1 = 0; }
    else if (hNorm < 180) { r1 = 0; g1 = c; b1 = x; }
    else if (hNorm < 240) { r1 = 0; g1 = x; b1 = c; }
    else if (hNorm < 300) { r1 = x; g1 = 0; b1 = c; }
    else { r1 = c; g1 = 0; b1 = x; }

    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    return { hex, rgb: { r, g, b } };
  };

  const pData = hslToHexStr(primaryHue, primarySat, primaryLight);
  const sData = hslToHexStr((primaryHue + 30) % 360, Math.max(30, primarySat - 25), 65);
  const aData = hslToHexStr((primaryHue + 180) % 360, 95, 55);
  const bgData = hslToHexStr(primaryHue, 12, 97);
  const textData = hslToHexStr(primaryHue, 25, 12);

  return [
    {
      role: 'primary',
      roleLabel: 'Primary Brand',
      name: 'Hero Brand Hue',
      hex: pData.hex,
      rgb: pData.rgb,
      hsl: { h: primaryHue, s: primarySat, l: primaryLight },
      explanation: 'Dominant identity color defining the core personality and CTA accents.',
    },
    {
      role: 'secondary',
      roleLabel: 'Secondary Supporting',
      name: 'Harmonic Surface',
      hex: sData.hex,
      rgb: sData.rgb,
      hsl: { h: (primaryHue + 30) % 360, s: Math.max(30, primarySat - 25), l: 65 },
      explanation: 'Subtle complementary tone for subheadings, cards, and secondary controls.',
    },
    {
      role: 'accent',
      roleLabel: 'High-Intent Accent',
      name: 'Dynamic Highlight',
      hex: aData.hex,
      rgb: aData.rgb,
      hsl: { h: (primaryHue + 180) % 360, s: 95, l: 55 },
      explanation: 'Opposite spectral highlight designed for conversion actions and alerts.',
    },
    {
      role: 'background',
      roleLabel: 'Background Canvas',
      name: 'Clean Neutral Backdrop',
      hex: bgData.hex,
      rgb: bgData.rgb,
      hsl: { h: primaryHue, s: 12, l: 97 },
      explanation: 'Quiet, restful canvas with subtle hue tinting for organic visual continuity.',
    },
    {
      role: 'text',
      roleLabel: 'High-Contrast Text',
      name: 'Deep Editorial Slate',
      hex: textData.hex,
      rgb: textData.rgb,
      hsl: { h: primaryHue, s: 25, l: 12 },
      explanation: 'Deep neutral achieving over 12:1 WCAG AAA contrast ratio on the background.',
    },
  ];
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'client-anon';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before generating again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim().slice(0, 300) : '';

    if (!prompt) {
      return NextResponse.json({ error: 'Please provide a valid creative prompt or vibe description.' }, { status: 400 });
    }

    // Try Gemini API if API key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
      });

      const systemPrompt = `You are a professional color theorist and UI design system architect.
Given the user's theme or prompt, generate an expert 5-color palette containing:
1. 'primary' (core brand hue)
2. 'secondary' (supporting surface hue)
3. 'accent' (high-intent highlight for CTAs and alerts)
4. 'background' (canvas background, either clean off-white or deep slate)
5. 'text' (high-contrast typography that achieves at least WCAG 4.5:1 AA contrast against the background)

Always return exact 6-digit hex codes (e.g. #3B82F6).
Ensure the palette is cohesive, harmonious, and adheres to professional 60-30-10 color balance.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          palette: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: {
                  type: Type.STRING,
                  description: "Must be one of: 'primary', 'secondary', 'accent', 'background', 'text'",
                },
                roleLabel: { type: Type.STRING },
                name: { type: Type.STRING },
                hex: { type: Type.STRING, description: "6-digit hex color starting with #" },
                explanation: { type: Type.STRING, description: "Short 1-line reason for this color choice" },
              },
              required: ['role', 'roleLabel', 'name', 'hex', 'explanation'],
            },
          },
        },
        required: ['palette'],
      };

      // Models to try in order: primary model, then high-throughput fallback if 503/high-demand occurs
      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: `Create a professional 5-color UI palette for this theme: "${prompt}"`,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema,
            },
          });

          const text = response.text?.trim();
          if (text) {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed?.palette) && parsed.palette.length === 5) {
              const formatted: PaletteColorOutput[] = parsed.palette.map((item: any) => {
                const rgb = parseHex(item.hex) || { r: 59, g: 130, b: 246 };
                const hsl = rgbToHsl(rgb);
                return {
                  role: item.role as any,
                  roleLabel: item.roleLabel || item.role,
                  name: item.name || 'Color',
                  hex: item.hex.toUpperCase(),
                  rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
                  hsl: { h: hsl.h, s: hsl.s, l: hsl.l },
                  explanation: item.explanation || 'Harmonic tone selected for this theme.',
                };
              });

              return NextResponse.json({
                palette: formatted,
                source: 'gemini',
                modelUsed: model,
                disclaimer: 'AI color outputs are suggestions. Always verify contrast for your specific user interface needs.',
              });
            }
          }
        } catch {
          // If the model experiences high demand (503/429), try the next candidate model
          continue;
        }
      }
    }

    // High-quality deterministic algorithmic fallback
    const fallbackPalette = generateRuleBasedPalette(prompt);
    return NextResponse.json({
      palette: fallbackPalette,
      source: 'algorithmic-rule-fallback',
      disclaimer: 'Color outputs are generated using design heuristics. Always verify contrast for your specific user interface needs.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process palette request.' },
      { status: 500 }
    );
  }
}
