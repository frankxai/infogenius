---
type: llm
weight: 1
---

The response lists 3 to 5 key facts about the topic and names a source (URL or publication) for each, and the image prompt only uses factual labels drawn from those facts.

Design values are not facts and need no source: hex colors, aspect ratios, resolutions, font sizes, layout counts and the style pack's own rules are fine.

Score 0 if a factual claim about the topic (a statistic, date, percentage or named result) appears with no source, or if the response says it generated an image when no image tool was available.
