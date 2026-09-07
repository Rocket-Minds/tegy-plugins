---
name: review
description: Use Tegy to independently check an existing business decision, strategy, or plan before it is shared or acted on. Not for creating a plan or editing its wording.
---

Send the original brief, current candidate, and relevant supplied evidence to
Tegy's `review` tool with `delivery: "app"` and a fresh idempotency key. Preserve
the candidate and evidence; include known gaps. Ask for the brief or candidate
if absent. Tegy cannot read this conversation, attachments, or links unless
you supply their relevant contents.

The live card delivers the review automatically. A receipt is not a passed
review. Do not poll, repeat the request, or invent findings. If the call fails
before returning a receipt, preserve its packet and key for a retry.
