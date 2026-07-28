---
name: tegy-product
description: Run product strategy through the authenticated Tegy plugin when the user explicitly selects Tegy for product decisions, roadmaps, discovery, positioning, or product diligence.
metadata:
  short-description: Run durable product strategy through Tegy
---

# Tegy product strategy

Use the Tegy plugin's authenticated actions. A host may show them under `Tegy`
or the `tegy-mcp` MCP server; select each action by its final name below. The
explicit `tegy-product` workflow is the capability selector; do not select it
through keyword matching.

1. Call `get_account` and stop on authentication or an account action,
   showing the exact recovery URL.
2. Ask for the product-strategy request if it is missing.
3. Create one durable chat with `create_chat` and an opaque idempotency
   key retained only for an identical retry.
4. For evidence the user explicitly chose, follow
   [Evidence inputs](../../references/evidence-inputs.md).
5. Start one turn with `start_turn`, `capability: "product"`, the exact
   instruction, selected evidence ids, and a separate idempotency key.
6. Poll `get_turn` with its cursor. If Tegy asks questions, present them
   exactly and call `continue_turn` only after explicit answers.
7. Return real Tegy assistant content faithfully with chat and turn ids,
   runtime version, usage when present, and resource links. Do not silently
   rewrite, summarize, or fabricate the result.

Stop retries for `usage_limit_reached` and show the exact reset and recovery
details. Keep quota, provider, service, and authentication errors distinct.
Preserve and label useful real output from a `partial` result.
