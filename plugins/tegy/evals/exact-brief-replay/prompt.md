---
tags: [submission, packet-fidelity]
max_turns: 8
timeout_seconds: 180
allowed_tools: [Skill, Agent]
---

Use Tegy Brief to retry this retained request once. I approve sending it unchanged. Preserve every field and the same key, including punctuation and line breaks. Do not create a new request.

```json
{
  "source_text": "The pilot passed on 12 October.\nMaya owns the €6,000 decision; retention is unknown.",
  "audience": "Leadership",
  "purpose": "Decide whether to continue.",
  "constraints": "Format: one short paragraph.\nPreserve “unknown”; do not invent dates.",
  "idempotency_key": "brf-fidelity-20261020-7q3k9x2m"
}
```
