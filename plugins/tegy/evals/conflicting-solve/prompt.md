---
tags: ["submission", "three-operations"]
max_turns: 12
timeout_seconds: 180
allowed_tools: [Skill, Agent]
---

Use Tegy Solve to retry this retained request with the same key. Stop on a conflict; never create a replacement key.

```json
{
  "problem": "Choose the €6,000 pilot — without assuming demand.",
  "context": "Twelve branches are live.\nEight await security review.",
  "constraints": "Keep cash above €50,000.\nNo new funding is committed.",
  "success_criteria": "Name the owner, gates and reversal conditions.",
  "idempotency_key": "solve-fidelity-20261102-4v8t1p6z"
}
```
