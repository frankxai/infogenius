---
type: tool_used
tool: Skill
input_match: '"skill"\s*:\s*"(?:[\w-]+:)?infogenius"'
min: 0
max: 0
arm: both
---

The infogenius skill is not invoked for a request that is not about a visual. Scored on both arms, so a false trigger lowers the score instead of being reported as an unscored indicator.
