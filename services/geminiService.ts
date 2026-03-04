
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, ComplexityLevel, VisualStyle, ResearchResult, SearchResultItem, Language } from "../types";

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

export const researchTopicForPrompt = async (
  topic: string, 
  level: ComplexityLevel, 
  style: VisualStyle,
  language: Language,
  aspectRatio: AspectRatio
): Promise<ResearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

export const generateInfographicImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio, imageSize: "1K" } }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
  throw new Error("Image generation failed. Ensure your selected API key has billing enabled.");
};

export const generateInfographicVideo = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

export const generateNarration = async (facts: string[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Read the following facts clearly and professionally: ${facts.join(". ")}`;
  const response = await ai.models.generateContent({
    model: TTS_MODEL,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");
  return `data:audio/wav;base64,${base64Audio}`; 
};
