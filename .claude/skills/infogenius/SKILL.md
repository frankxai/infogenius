---
name: "InfoGenius"
description: "Research-grounded infographic and knowledge-visual generation for Claude Code. Use when the user asks for /infogenius, infographics, visual explainers, technical diagrams, educational images, or image prompts that should be factually grounded before generation. Uses Google Search/WebSearch plus a Gemini image MCP such as nano-banana."
---

# InfoGenius

Create knowledge-first visuals: research the topic, convert the facts into a precise image prompt, generate with Gemini image tools, then report sources and key facts.

## When To Use

Use this skill for:

- `/infogenius ...`
- Infographics, diagrams, explainers, visual summaries, technical architecture visuals
- Educational visuals where factual accuracy matters
- Prompt generation for Gemini/Nano Banana/Imagen when no image MCP is available

Do not use this for character art, photorealistic marketing photography, or purely decorative images unless the user explicitly asks.

## Inputs

Parse the user request into:

- `topic`: required
- `style`: default `standard`
- `audience`: default `general`
- `aspect_ratio`: default `16:9`
- `language`: default `English`

Supported styles:

- `standard`: clean modern scientific illustration
- `minimalist`: Bauhaus flat vector, 2-3 colors, strong negative space
- `photorealistic`: cinematic realistic composite with annotation overlays
- `3d`: isometric 3D render, clay/glass/plastic materials, studio light
- `technical`: Da Vinci notebook / technical blueprint, ink annotations
- `futuristic`: restrained HUD/data visualization, luminous lines
- `vintage`: 19th-century scientific lithograph
- `cartoon`: educational comic for younger audiences
- `premium`: luxury knowledge visual with glass, titanium, light, and negative space

Supported audiences:

- `elementary`: ages 6-10, 3-4 visual elements, minimal text
- `highschool`: textbook clarity, 5-8 elements
- `college`: academic detail, data-rich labels
- `expert`: dense technical schematic with precise annotations

## Workflow

1. Clarify only if the topic is missing or the request is too ambiguous to execute.
2. Research current facts with WebSearch/search tools. For stable evergreen topics, still collect 3-5 reliable facts.
3. Extract:
   - 3-5 key facts
   - 3-6 visual elements
   - short labels that should appear in the image
   - source URLs or source names
4. Compose a single detailed image prompt using the template below.
5. Generate with the available image MCP. Prefer `mcp__nano-banana__generate_image` with grounding/high quality if available.
6. If no image MCP exists, return the finished prompt and source grounding clearly.
7. Present the result with style, audience, aspect ratio, facts used, and sources.

## Image Prompt Template

```text
Create a {aspect_ratio} {style} infographic about {topic}.

AUDIENCE:
{audience instruction}

FACTUAL CONTENT TO VISUALIZE:
- {fact 1 as a concrete visual element}
- {fact 2 as a concrete visual element}
- {fact 3 as a concrete visual element}

VISUAL STRUCTURE:
- Clear central model of {topic}
- Labeled parts with large, legible text
- Directional arrows or numbered sequence where useful
- Use only accurate labels from the research

STYLE:
{style instruction}

QUALITY REQUIREMENTS:
- Publication quality, sharp detail
- No unreadable microtext
- No invented statistics or unsupported claims
- Keep the layout scannable and educational
```

## Preferred MCP Call

If the `nano-banana` MCP is available, use:

```javascript
mcp__nano-banana__generate_image({
  prompt: imagePrompt,
  aspect_ratio: aspectRatio,
  model_tier: "pro",
  enable_grounding: true,
  thinking_level: "high",
  resolution: "high"
})
```

If the installed MCP exposes a different schema, adapt to its available fields while preserving: prompt, aspect ratio, Gemini Pro/high quality, and search grounding when supported.

## Response Template

```markdown
## InfoGenius: {topic}

Style: {style} | Audience: {audience} | Aspect: {aspect_ratio}

Key facts used:
1. ...
2. ...
3. ...

Sources:
- ...

Generated output:
{image or prompt, depending on available tools}
```

## Quality Bar

Before finalizing, check:

- The visual teaches the topic, not just decorates it.
- Labels are specific and source-grounded.
- The style supports comprehension.
- Any time-sensitive facts were searched during this session.
- The user can regenerate from the prompt without hidden local context.
