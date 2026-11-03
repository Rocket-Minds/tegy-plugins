---
tags: ["submission", "three-operations"]
max_turns: 12
timeout_seconds: 180
allowed_tools: [Skill, Agent]
---

Use Tegy Executive Summary to recover this interrupted request. Retry exactly once with its complete retained packet and identical key. Do not call read_result.

```json
{
  "source_text": "Twelve of twenty branches are live.\n\nEight await Maya’s security review — date unknown. Cap: €6,000.",
  "audience": "Board",
  "purpose": "Decide whether to continue the rollout.",
  "format": "memo",
  "constraints": "Preserve uncertainty and the €6,000 cap.",
  "idempotency_key": "brief-fidelity-20261102-4v8t1p6z"
}
```
