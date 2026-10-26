# InfoGenius v5.2 — Agent Instructions

Canonical Google AI Studio React Application for InfoGenius v5.2 (`frankxai/infogenius`).

## Scope & Architecture
- **Research Engine**: `services/geminiService.ts` (`researchTopicForPrompt` with Google Search grounding).
- **Image Engine**: `gemini-3-pro-image-preview` (1K / 2K / 4K) with 10 visual styles including `Glassmorphic (3D Dark Luxury)` and `Editorial Luxury (Premium)`.
- **Multimodal Extensions**: Veo 3.1 (`veo-3.1-fast-generate-preview`) 7s motion video and Gemini 2.5 Flash TTS (`Kore` voice) narration.
- **Credential Resolution**: Production builds are BYOK only: the visitor's key lives in their browser's localStorage. `vite.config.ts` passes `GEMINI_API_KEY` from `.env.local` or the shell to the dev server only, because anything in `define` is inlined into the public bundle. Never inject a key into `vite build`, and never hardcode keys in source.

## Verification
- Run `npm run build` (`vite build`) before pushing or opening a draft PR.
