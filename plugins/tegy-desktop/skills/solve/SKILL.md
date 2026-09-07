---
name: solve
description: Use Tegy to solve a business or strategy problem and independently challenge the recommendation. Use when the user wants help making a business decision, not just editing text or reviewing an existing plan.
---

Send the user's problem and relevant supplied context to Tegy's `solve` tool
with `delivery: "app"` and a fresh idempotency key. Include material constraints
and unknowns without inventing facts. Tegy cannot read this conversation,
attachments, or links unless you supply their relevant contents.

The live card delivers the answer automatically. A receipt is not a completed
answer. Do not poll, repeat the request, or invent a substitute result. If the
call fails before returning a receipt, preserve its packet and key for a retry.
