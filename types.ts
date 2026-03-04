
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export type AspectRatio = '16:9' | '9:16' | '1:1';

export type ComplexityLevel = 'Elementary' | 'High School' | 'College' | 'Expert';

export type VisualStyle = 'Default' | 'Minimalist' | 'Realistic' | 'Cartoon' | 'Vintage' | 'Futuristic' | '3D Render' | 'Sketch';

export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Mandarin' | 'Japanese' | 'Hindi' | 'Arabic' | 'Portuguese' | 'Russian';

export interface GeneratedAsset {
  id: string;
  data: string; // Base64 image data URL
  videoUrl?: string; // Video URL from Veo
  audioUrl?: string; // Blob URL from TTS
  prompt: string;
  timestamp: number;
  level: ComplexityLevel;
  style: VisualStyle;
  language: Language;
  aspectRatio: AspectRatio;
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
}
