import type { BrandWorld } from '../types';

// From frankxai/starlight-design-intelligence@851a11b,
// brand-image-system/runtime/brands/<brand>/brand-pack.json. The skill's
// .claude/skills/infogenius/packs/*.md carry the same values; change both
// together when the pinned pack moves.
export interface StylePackColors {
  ground: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  muted: string;
  isLight: boolean;
}

export const STYLE_PACK_COLORS: Record<BrandWorld, StylePackColors> = {
  frankx: {
    ground: '#0a0a0b',
    surface: '#141416',
    primary: '#10b981',
    secondary: '#f59e0b',
    text: '#f3efe7',
    muted: '#a8a29e',
    isLight: false,
  },
  starlight: {
    ground: '#0a0a0b',
    surface: '#111113',
    primary: '#6366f1',
    secondary: '#a5b4fc',
    text: '#f9fafb',
    muted: '#9ca3af',
    isLight: false,
  },
  gencreator: {
    ground: '#fbf9f5',
    surface: '#f3efe6',
    primary: '#c8322a',
    secondary: '#221f1b',
    text: '#221f1b',
    muted: '#6e665e',
    isLight: true,
  },
  arcanea: {
    ground: '#0a0d18',
    surface: '#111a2e',
    primary: '#ffd700',
    secondary: '#00bcd4',
    text: '#f4ece1',
    muted: '#94a3b8',
    isLight: false,
  },
};
