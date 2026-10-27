import type { BrandWorld } from '../types';

// Every hex here appears in frankxai/starlight-design-intelligence@851a11b,
// brand-image-system/runtime/brands/<brand>/brand-pack.json, and nowhere else.
// Tints (card surfaces, muted text) are opacity over `ink`, never new colors.
// The skill's .claude/skills/infogenius/packs/*.md carry the same values;
// change both together when the pinned pack moves.
export interface StylePackColors {
  /** Background. */
  ground: string;
  /** Text and, at reduced opacity, card surfaces and muted copy. */
  ink: string;
  /** Strokes, rules and indices. */
  line: string;
  /** Drawn once per composition: the source or edition mark. */
  spot: string;
  isLight: boolean;
  /** False where the pack lists colors as references with no approved placement. */
  placementApproved: boolean;
}

export const STYLE_PACK_COLORS: Record<BrandWorld, StylePackColors> = {
  // ink #0a0a0b, paper #f3efe7, tech #10b981, soul #f59e0b
  frankx: {
    ground: '#0a0a0b',
    ink: '#f3efe7',
    line: '#10b981',
    spot: '#f59e0b',
    isLight: false,
    placementApproved: true,
  },
  // void #0a0a0b, space #111113, signal #6366f1, evidence #a5b4fc (operator mode)
  starlight: {
    ground: '#0a0a0b',
    ink: '#a5b4fc',
    line: '#6366f1',
    spot: '#a5b4fc',
    isLight: false,
    placementApproved: true,
  },
  // paper #fbf9f5, ink #221f1b, signal #c8322a once per object
  gencreator: {
    ground: '#fbf9f5',
    ink: '#221f1b',
    line: '#221f1b',
    spot: '#c8322a',
    isLight: true,
    placementApproved: true,
  },
  // atlanteanTeal #00bcd4, cosmicBlue #0d47a1, arcaneanGold #ffd700: references
  // only; the pack approves no placement yet, so the Arcanea owner reconciles it.
  arcanea: {
    ground: '#0d47a1',
    ink: '#ffd700',
    line: '#00bcd4',
    spot: '#ffd700',
    isLight: false,
    placementApproved: false,
  },
};
