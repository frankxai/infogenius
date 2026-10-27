// Fails if any hex in the app module or skill packs is absent from the pinned brand pack.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [worktree, sdiRepo] = process.argv.slice(2);
const REF = '851a11b';
const brands = { frankx: 'frankx', starlight: 'sis', gencreator: 'gencreator', arcanea: 'arcanea' };
const hexes = (text) => new Set((text.match(/#[0-9a-fA-F]{6}\b/g) ?? []).map((h) => h.toLowerCase()));

const moduleSrc = fs.readFileSync(path.join(worktree, 'services', 'stylePacks.ts'), 'utf8');
let failures = 0;

for (const [packId, brandId] of Object.entries(brands)) {
  const json = execFileSync('git', ['-C', sdiRepo, 'show', `${REF}:brand-image-system/runtime/brands/${brandId}/brand-pack.json`], { encoding: 'utf8' });
  const allowed = hexes(json);

  const block = moduleSrc.match(new RegExp(`\\n  ${packId}: \\{([\\s\\S]*?)\\n  \\},`));
  if (!block) throw new Error(`no module block for ${packId}`);
  const mdText = fs.readFileSync(path.join(worktree, '.claude', 'skills', 'infogenius', 'packs', `${packId}.md`), 'utf8');

  for (const [where, found] of [['stylePacks.ts', hexes(block[1])], [`packs/${packId}.md`, hexes(mdText)]]) {
    const extra = [...found].filter((h) => !allowed.has(h));
    console.log(`${packId.padEnd(10)} ${where.padEnd(22)} ${found.size} hexes, ${extra.length} not in source${extra.length ? ': ' + extra.join(' ') : ''}`);
    failures += extra.length;
  }
}
process.exit(failures ? 1 : 0);
