
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, ComplexityLevel, VisualStyle, ResearchResult, SearchResultItem, Language, ImageResolution, BrandWorld } from "../types";
import { STYLE_PACK_COLORS } from "./stylePacks";

// Helper to get instructions for complexity
const getLevelInstruction = (level: ComplexityLevel): string => {
  switch (level) {
    case 'Elementary': return "For children: simple, friendly, large icons, minimal text.";
    case 'High School': return "Educational: clean, labeled diagrams, textbook quality.";
    case 'College': return "Academic: complex schematics, detailed annotations, professional journal style.";
    case 'Expert': return "Technical: industrial blueprints, deep data density, expert-level notations.";
    default: return "General audience.";
  }
};

// Helper to get instructions for visual style
const getStyleInstruction = (style: VisualStyle): string => {
  switch (style) {
    case 'Glassmorphic': return "Premium 3D Glassmorphic Infographic. Dark void background (#0b0e14). All information displayed on frosted translucent glass panels floating at different depths. Key concepts rendered as 3D crystal/glass nodes connected by thin luminous teal (#7fffd4) threads. Dramatic directional spotlight from upper-left creating teal rim lighting on all glass surfaces. Gold (#ffd700) accents on highlights. Clean white sans-serif labels on every element.";
    case 'Premium': return "Luxury tech-brand visual. Apple meets Dior meets DeepMind. Dark void background (#0b0e14). One striking crystal/glass focal element at center with dramatic volumetric lighting. Data and labels on frosted glass cards orbiting the focal point. Thin luminous teal (#7fffd4) connection threads forming constellation pattern. Gold (#ffd700) warm accent highlights.";
    case 'Starlight Cosmos': return "Starlight Intelligence Systems Neural Cosmos Infographic. Deep navy void background (#050B14). Crystalline astrolabe nodes connected by cyber-cyan (#00E5FF) and frontier-violet (#8B5CF6) optical conduits. Key human governance gates in warm Starlight Gold (#FCD34D). Crisp Instrument Sans and IBM Plex Mono typography.";
    case 'GenCreator Editorial': return "GenCreator Territory B Editorial Print Infographic. Warm archival paper background (#FBF9F5) with ultra-crisp deep carbon ink (#221F1B) hairline Swiss grid, technical diagrams, and editorial typography. Selective Spot Red (#C8322A) accent for edition stamps and focal flow.";
    case 'Arcanea Sacred Geometry': return "Arcanea Sacred Geometry Codex Infographic. Deep cosmic void background (#0B0E14). Golden-ratio astrolabe rings and sacred geometric polyhedra in luminous Arcanean Gold (#FFD700) and Atlantean Teal (#00BCD4) with aquamarine (#7FFFD4) harmonic nodes.";
    case 'Da Vinci Blueprint': return "Leonardo da Vinci notebook style on dark obsidian parchment (#0a0f1c), warm sepia and gold ink sketches (#f59e0b, #fbbf24) with cyan callout lines (#06b6d4), technical diagrams, exploded views, and crisp architectural annotations.";
    case 'Minimalist': return "Bauhaus minimalist, flat vector, clean geometry, negative space.";
    case 'Realistic': return "8k photorealistic, cinematic lighting, ultra-detailed textures.";
    case 'Cartoon': return "Vibrant cel-shaded, comic book style, bold outlines.";
    case 'Vintage': return "19th-century scientific engraving, sepia tones, textured parchment.";
    case 'Futuristic': return "Cyberpunk HUD, neon data lines, 3D holographic wireframes.";
    case '3D Render': return "Octane 3D render, isometric perspective, soft studio lighting.";
    case 'Sketch': return "Technical charcoal and ink sketch, da Vinci notebook style.";
    default: return "Modern digital scientific illustration.";
  }
};

const TEXT_MODEL = 'gemini-3-pro-preview';
const IMAGE_MODEL = 'gemini-3-pro-image-preview';
const VIDEO_MODEL = 'veo-3.1-fast-generate-preview';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

const getActiveApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem('infogenius_api_key')?.trim();
    if (saved) return saved;
  }
  return process.env.API_KEY || '';
};

function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const buildInteractiveSvgBlueprint = (params: {
  topic: string;
  facts: string[];
  style: VisualStyle;
  brandWorld?: BrandWorld;
}): string => {
  const { topic, facts, style, brandWorld = 'frankx' } = params;
  const { ground, ink, line, spot } = STYLE_PACK_COLORS[brandWorld];

  const safeTitle = escapeXml(topic.slice(0, 74));
  // No research facts means no cards; the blueprint never invents content.
  const safeFacts = facts.slice(0, 4);

  const cardsSvg = safeFacts
    .map((fact, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col === 0 ? 60 : 620;
      const y = row === 0 ? 200 : 395;
      const line1 = escapeXml(fact.slice(0, 62));
      const line2 = escapeXml(fact.slice(62, 124));
      const line3 = escapeXml(fact.slice(124, 182));
      return `
      <g transform="translate(${x}, ${y})">
        <rect width="520" height="160" rx="18" fill="${ink}" fill-opacity="0.04" stroke="${line}" stroke-opacity="0.4" stroke-width="1.5" />
        <circle cx="34" cy="36" r="14" fill="none" stroke="${line}" stroke-width="1.2" />
        <text x="34" y="41" text-anchor="middle" fill="${line}" font-family="ui-monospace, monospace" font-size="12" font-weight="700">0${idx + 1}</text>
        <text x="60" y="41" fill="${ink}" fill-opacity="0.7" font-family="ui-monospace, monospace" font-size="11" font-weight="700" letter-spacing="1.4">FACT 0${idx + 1}</text>
        <text x="26" y="76" fill="${ink}" font-family="system-ui, sans-serif" font-size="14" font-weight="500">${line1}</text>
        <text x="26" y="100" fill="${ink}" font-family="system-ui, sans-serif" font-size="14" font-weight="500">${line2}</text>
        <text x="26" y="124" fill="${ink}" fill-opacity="0.65" font-family="system-ui, sans-serif" font-size="13">${line3}</text>
      </g>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
  <rect width="1200" height="675" fill="${ground}" />
  <text x="60" y="64" fill="${line}" font-family="ui-monospace, monospace" font-size="12" font-weight="700" letter-spacing="2.2">INFOGENIUS VECTOR BLUEPRINT · ${escapeXml(brandWorld.toUpperCase())} · ${escapeXml(style.toUpperCase())}</text>
  <text x="60" y="108" fill="${ink}" font-family="system-ui, sans-serif" font-size="30" font-weight="800">${safeTitle}</text>
  <line x1="60" y1="145" x2="1140" y2="145" stroke="${line}" stroke-opacity="0.3" stroke-width="1.5" />
  ${cardsSvg}
  <rect x="60" y="626" width="10" height="10" fill="${spot}" />
  <text x="80" y="635" fill="${ink}" fill-opacity="0.7" font-family="ui-monospace, monospace" font-size="11">SOURCE: FACTS FROM THE RESEARCH STEP. CHECK EACH ONE AGAINST ITS LINK.</text>
</svg>`;
};

function wrapPcmBase64InWavDataUrl(pcmBase64: string, sampleRate = 24000): string {
  const binaryString = atob(pcmBase64);
  const dataSize = binaryString.length;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < dataSize; i++) {
    bytes[44 + i] = binaryString.charCodeAt(i);
  }

  let binaryOut = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binaryOut += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return `data:audio/wav;base64,${btoa(binaryOut)}`;
}

export const researchTopicForPrompt = async (
  topic: string, 
  level: ComplexityLevel, 
  style: VisualStyle,
  language: Language,
  aspectRatio: AspectRatio
): Promise<ResearchResult> => {
  const ai = new GoogleGenAI({ apiKey: getActiveApiKey() });
  const orientation = aspectRatio === '9:16' ? 'Portrait (vertical)' : 'Landscape (horizontal)';
  const levelInstr = getLevelInstruction(level);
  const styleInstr = getStyleInstruction(style);

  const systemPrompt = `
    You are a Master Visual Architect. 
    RESEARCH: Use Google Search to find current data on "${topic}".
    TARGET AUDIENCE: ${level} (${levelInstr}).
    AESTHETIC: ${style} (${styleInstr}).
    LAYOUT: Optimized for a ${orientation} ${aspectRatio} orientation.
    
    Format your response as follows:
    FACTS:
    - [Key verified fact 1]
    - [Key verified fact 2]
    - [Key verified fact 3]
    
    IMAGE_PROMPT:
    [Detailed technical prompt for image generation. Focus on spatial arrangement, labels, and the ${style} aesthetic.]

    VIDEO_PROMPT:
    [Cinematic prompt for a 7s video sequence based on the image.]
  `;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: systemPrompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "";
  const factsMatch = text.match(/FACTS:\s*([\s\S]*?)(?=IMAGE_PROMPT:|$)/i);
  const facts = factsMatch ? factsMatch[1].trim().split('\n').map(f => f.replace(/^-\s*/, '').trim()).filter(f => f.length > 0) : [];
  
  const imagePrompt = text.match(/IMAGE_PROMPT:\s*([\s\S]*?)(?=VIDEO_PROMPT:|$)/i)?.[1].trim() || `Infographic about ${topic}, ${styleInstr}`;
  const videoPrompt = text.match(/VIDEO_PROMPT:\s*([\s\S]*?)$/i)?.[1].trim() || `Cinematic data animation about ${topic}`;

  const searchResults: SearchResultItem[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach(chunk => {
      if (chunk.web?.uri && chunk.web?.title) {
        searchResults.push({ title: chunk.web.title, url: chunk.web.uri });
      }
    });
  }

  return {
    imagePrompt,
    videoPrompt,
    facts,
    searchResults: Array.from(new Map(searchResults.map(item => [item.url, item])).values())
  };
};

export const generateInfographicImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  imageSize: ImageResolution = '2K'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getActiveApiKey() });
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio, imageSize } }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
  throw new Error("Image generation failed. Ensure your selected API key has billing enabled.");
};

export const generateInfographicVideo = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const activeKey = getActiveApiKey();
  const ai = new GoogleGenAI({ apiKey: activeKey });
  let operation = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio === '1:1' ? '16:9' : aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error('Veo returned no video to download.');
  // The key travels only to Google's API host, in a header rather than the URL.
  const url = new URL(downloadLink);
  if (url.protocol !== 'https:' || url.hostname !== 'generativelanguage.googleapis.com') {
    throw new Error(`Refusing to send the API key to unexpected host ${url.hostname}.`);
  }
  const res = await fetch(url, { headers: { 'x-goog-api-key': activeKey } });
  if (!res.ok) throw new Error(`Video download failed with HTTP ${res.status}.`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

export const generateNarration = async (
  facts: string[],
  mode: 'solo' | 'dialogue' = 'solo',
  topic = 'Executive Architecture'
): Promise<{ audioUrl: string; transcript: string }> => {
  const ai = new GoogleGenAI({ apiKey: getActiveApiKey() });
  const cleanFacts = facts.slice(0, 4);

  const transcript =
    mode === 'dialogue'
      ? [
          `Architect: Welcome to the InfoGenius executive briefing on ${topic}.`,
          cleanFacts[0] ? `Strategist: First core finding: ${cleanFacts[0]}` : '',
          cleanFacts[1] ? `Architect: Building on that architecture: ${cleanFacts[1]}` : '',
          cleanFacts[2] ? `Strategist: And looking at verification and telemetry: ${cleanFacts[2]}` : '',
          cleanFacts[3] ? `Architect: Final takeaway for builders: ${cleanFacts[3]}` : '',
        ]
          .filter(Boolean)
          .join('\n')
      : `Executive Visual Briefing on ${topic}: ${cleanFacts.join('. ')}`;

  const response = await ai.models.generateContent({
    model: TTS_MODEL,
    contents: [{ parts: [{ text: transcript }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig:
        mode === 'dialogue'
          ? {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: 'Architect',
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                  },
                  {
                    speaker: 'Strategist',
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
                  },
                ],
              },
            }
          : {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");
  return {
    audioUrl: wrapPcmBase64InWavDataUrl(base64Audio, 24000),
    transcript,
  };
};
