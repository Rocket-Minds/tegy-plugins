---
name: brief
description: Use Tegy to turn supplied text into clear executive communication while keeping its facts and uncertainty. Use for executive emails, updates, memos, and summaries, not for creating a strategy.
---

Send the supplied source text unchanged to `mcp__Tegy_Cowork__brief` with
a fresh idempotency key. Use this plugin's connection, not another Tegy
connector. Include any stated audience,
purpose, format, and constraints. Ask for source material if absent. Tegy
cannot read attachments or links unless you supply their relevant contents.

Cowork's hooks return the completed brief into this task. Present that text
unchanged. A receipt is not the finished brief. Do not poll, repeat the request,
or invent a substitute. If delivery fails, preserve the packet and key for recovery.
