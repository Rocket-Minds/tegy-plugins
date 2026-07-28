---
name: tegy-handoff
description: Create a portable handoff from completed durable Tegy analysis when the user supplies the Tegy chat id, downstream task, and explicit locked decisions or says there are none.
metadata:
  short-description: Create a portable handoff from completed Tegy work
---

# Tegy portable handoff

Use the Tegy plugin's authenticated actions. A host may show them under `Tegy`
or the `tegy-mcp` MCP server; select each action by its final name below.
Require all three inputs:

1. the completed Tegy chat id;
2. the exact downstream task;
3. the locked decisions, or an explicit statement that there are none.

If any input is absent or ambiguous, ask for it and stop. Do not infer the task
or decisions from the chat or surrounding conversation.

1. Call `get_account`; stop on authentication or an account action and
   show the exact recovery URL.
2. Call `get_chat` for the supplied chat id. If a turn is active, report
   that state and stop until the user asks to retry after it is terminal.
3. Call `create_handoff` with the exact chat id, downstream task, only the
   explicitly supplied locked decisions (or an empty array when the user said
   none), and one opaque idempotency key retained for identical retries.
4. Return the handoff id, protected resource URI, byte count, MIME type,
   SHA-256, runtime version, and request id. Fetch or reproduce the full
   protected handoff only when the user explicitly asks.

Never substitute a recap, raw transcript, inferred decision log, or fabricated
output. Surface `turn_still_active`, `analysis_not_complete`,
`handoff_too_large`, authentication, and service errors exactly.
