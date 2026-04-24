# /infogenius

Research-grounded visual knowledge generation.

## Usage

```text
/infogenius "quantum computing" --style futuristic --audience college --aspect 16:9
/infogenius "how photosynthesis works" --style technical --audience highschool
/infogenius "AI agent architecture" --style premium
```

## Behavior

When invoked:

1. Parse the topic and options from the prompt.
2. Use the `infogenius` skill.
3. Research the topic before image generation.
4. Build a precise infographic prompt from sourced facts.
5. Generate with the configured Gemini/Nano Banana MCP if available.
6. Return the image or, if no image MCP is available, return the final grounded prompt.

## Options

- `--style`: `standard`, `minimalist`, `photorealistic`, `3d`, `technical`, `futuristic`, `vintage`, `cartoon`, `premium`
- `--audience`: `elementary`, `highschool`, `college`, `expert`, `general`
- `--aspect`: `16:9`, `1:1`, `9:16`
- `--language`: output language for labels and explanation

## MCP

Recommended MCP server name: `nano-banana`.

Expected generation capability:

```javascript
mcp__nano-banana__generate_image({
  prompt,
  aspect_ratio,
  model_tier: "pro",
  enable_grounding: true,
  thinking_level: "high",
  resolution: "high"
})
```

If that exact tool shape is not installed, use the closest available image generation tool and preserve research grounding in the prompt.
