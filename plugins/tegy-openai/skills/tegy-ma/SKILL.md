---
name: tegy-ma
description: Run M&A strategy through the authenticated Tegy plugin when the user explicitly selects Tegy for acquisition theses, target assessment, diligence framing, integration, or transaction strategy.
metadata:
  short-description: Run durable M&A strategy through Tegy
---

# Tegy M&A strategy

Use the Tegy plugin's authenticated actions. A host may show them under `Tegy`
or the `tegy-mcp` MCP server; select each action by its final name below. The
explicit `tegy-ma` workflow is the capability selector; never infer M&A routing
from keywords in another request.

1. Call `get_account` and stop on authentication or an account action,
   showing the exact recovery URL.
2. Ask for the M&A strategy request if it is missing.
3. Create a durable chat with `create_chat` and an opaque idempotency key
   retained only for an identical retry.
4. For evidence the user explicitly chose, follow
   [Evidence inputs](../../references/evidence-inputs.md).
5. Start one turn with `start_turn`, `capability: "ma"`, the exact
   instruction, selected evidence ids, and a separate idempotency key.
6. Poll `get_turn` with its cursor. Present any questionnaire exactly and wait
   for explicit answers before `continue_turn`.
7. Return only real Tegy assistant content, faithfully attributed, with chat
   and turn ids, runtime provenance, usage when present, and resource links.
   Do not fabricate or silently rewrite it.

Stop retries for `usage_limit_reached` and report the exact reset and recovery
details. Keep user quota, provider, service, and authentication failures
distinct. Preserve and accurately label useful `partial` output.
