
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export type AspectRatio = '16:9' | '9:16' | '1:1';

export type ImageResolution = '1K' | '2K' | '4K';

export type BrandWorld = 'frankx' | 'starlight' | 'gencreator' | 'arcanea';

export type ComplexityLevel = 'Elementary' | 'High School' | 'College' | 'Expert';

export type VisualStyle =
  | 'Glassmorphic'
  | 'Premium'
  | 'Starlight Cosmos'
  | 'GenCreator Editorial'
  | 'Arcanea Sacred Geometry'
  | 'Da Vinci Blueprint'
  | 'Default'
  | 'Minimalist'
  | 'Realistic'
  | 'Cartoon'
  | 'Vintage'
  | 'Futuristic'
  | '3D Render'
  | 'Sketch';

export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Mandarin' | 'Japanese' | 'Hindi' | 'Arabic' | 'Portuguese' | 'Russian';

export interface GeneratedAsset {
  id: string;
  data: string; // Base64 image data URL
  svgBlueprint?: string; // Deterministic 1200x675 Vector SVG Blueprint
  videoUrl?: string; // Video URL from Veo
  audioUrl?: string; // WAV Data URL from TTS
  audioTranscript?: string; // Solo or 2-Speaker Dialogue transcript
  prompt: string;
  timestamp: number;
  level: ComplexityLevel;
  style: VisualStyle;
  language: Language;
  aspectRatio: AspectRatio;
  imageSize?: ImageResolution;
  brandWorld?: BrandWorld;
  facts: string[];
}

export interface SearchResultItem {
  title: string;
  url: string;
}

export interface ResearchResult {
  imagePrompt: string;
  videoPrompt: string;
  facts: string[];
  searchResults: SearchResultItem[];
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  // Present only when the app runs inside Google AI Studio.
  interface Window {
    aistudio?: AIStudio;
  }
}
