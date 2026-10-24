# InfoGenius v5.2 — Agent Instructions

Canonical Google AI Studio React Application for InfoGenius v5.2 (`frankxai/infogenius`).

## Scope & Architecture
- **Research Engine**: `services/geminiService.ts` (`researchTopicForPrompt` with Google Search grounding).
- **Image Engine**: `gemini-3-pro-image-preview` (1K / 2K / 4K) with 10 visual styles including `Glassmorphic (3D Dark Luxury)` and `Editorial Luxury (Premium)`.
- **Multimodal Extensions**: Veo 3.1 (`veo-3.1-fast-generate-preview`) 7s motion video and Gemini 2.5 Flash TTS (`Kore` voice) narration.
- **Credential Resolution**: Auto-loads `GEMINI_API_KEY` from `C:/Users/frank/.starlight/.env` or `.env.local` via `vite.config.ts`. Never hardcode keys in source.

## Verification
- Run `npm run build` (`vite build`) before pushing or opening a draft PR.
