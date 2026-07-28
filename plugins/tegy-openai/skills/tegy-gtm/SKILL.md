---
name: tegy-gtm
description: Run go-to-market analysis through the authenticated Tegy plugin when the user explicitly selects Tegy GTM work, channel strategy, positioning, launch, or commercial planning.
metadata:
  short-description: Run durable GTM analysis through Tegy
---

# Tegy go-to-market analysis

Use the Tegy plugin's authenticated actions. A host may show them under `Tegy`
or the `tegy-mcp` MCP server; select each action by its final name below. The
explicit `tegy-gtm` workflow is the capability selector; never route to GTM by
matching words in an unrelated request.

1. Call `get_account` and stop on an account action or authentication
   error, showing its exact recovery URL.
2. Ask for the GTM question if it is missing. Do not start paid work without
   the request.
3. Create a durable chat with `create_chat` and an opaque idempotency key
   retained only for an identical retry.
4. For evidence the user explicitly chose, follow
   [Evidence inputs](../../references/evidence-inputs.md).
5. Call `start_turn` with `capability: "gtm"`, the exact instruction,
   selected evidence ids, and a separate retained idempotency key.
6. Poll `get_turn` with its cursor. Present a returned questionnaire exactly
   and wait for explicit answers before `continue_turn`.
7. Return real Tegy assistant content faithfully with chat and turn ids,
   runtime provenance, usage when present, and resource links. Do not silently
   summarize or fabricate it.

Stop automatic retries for `usage_limit_reached` and report the exact reset and
recovery details. Keep quota, provider, service, and authentication failures
distinct. Preserve and label useful real output from a `partial` result.
