<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1J_GRCK3XaJ1_R9ysrzQg4SlxLyRwdXJn

## Claude Code Skill

This repo also includes a portable Claude Code workflow for `/infogenius`.

What is included:

- `.claude/skills/infogenius/SKILL.md` - the research-first visual generation skill
- `.claude/commands/infogenius.md` - the slash command wrapper
- `.claude/mcp.example.json` - example Gemini/Nano Banana MCP configuration without secrets

Install into Claude Code by copying the files into your Claude config:

```bash
cp -R .claude/skills/infogenius ~/.claude/skills/
cp .claude/commands/infogenius.md ~/.claude/commands/
```

On Windows PowerShell:

```powershell
Copy-Item -Recurse .claude\skills\infogenius $HOME\.claude\skills\
Copy-Item .claude\commands\infogenius.md $HOME\.claude\commands\
```

Then configure an image MCP such as Nano Banana with your own `GEMINI_API_KEY`. Use `.claude/mcp.example.json` as the template.

The Claude skill is intentionally generic. It does not depend on Arcanea lore, FrankX brand rules, or local machine paths. Arcanea-specific variants live in `frankxai/arcanea-infogenius`.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
