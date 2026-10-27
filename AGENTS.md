# InfoGenius: agent instructions

`frankxai/infogenius` is the product home for InfoGenius (`product_infogenius` in the agentic-ops registry, brand GenCreator): the standalone BYOK web app, the Claude Code skill and the style packs. The MCP server lives in `frankxai/arcanea-infogenius`. frankx.ai only links here.

## Scope & Architecture
- **Research Engine**: `services/geminiService.ts` (`researchTopicForPrompt` with Google Search grounding).
- **Image Engine**: `gemini-3-pro-image-preview` (1K / 2K / 4K).
- **Multimodal Extensions**: Veo 3.1 (`veo-3.1-fast-generate-preview`) motion video and Gemini 2.5 Flash TTS narration.
- **Style packs**: `services/stylePacks.ts` (app) and `.claude/skills/infogenius/packs/*.md` (skill), both from `frankxai/starlight-design-intelligence@851a11b`. Change them together, and only from that source.
- **Credential Resolution**: Production builds are BYOK only: the visitor's key lives in their browser's localStorage. `vite.config.ts` passes `GEMINI_API_KEY` from `.env.local` or the shell to the dev server only, because anything in `define` is inlined into the public bundle. Never inject a key into `vite build`, and never hardcode keys in source.

## Claims
Every number, price or capability shown in the UI must be true of this repo today. No prices until Frank sets them. No "verified" label on anything the code does not verify.

## Verification
- Run `npx tsc --noEmit` and `npm run build` (`vite build`) before pushing or opening a draft PR.
- After touching a style pack: `node scripts/check-style-packs.mjs . <path-to-starlight-design-intelligence>` (exit 1 if any hex is not in the pinned brand pack).
