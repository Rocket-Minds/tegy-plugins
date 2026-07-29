---
name: handoff
description: Create a durable portable handoff from a completed Tegy chat using only the downstream task and locked decisions explicitly supplied by the user.
argument-hint: "[chat_id] [downstream task] [explicit locked decisions or none]"
disable-model-invocation: true
allowed-tools: mcp__tegy__get_account mcp__tegy__get_chat mcp__tegy__get_turn mcp__tegy__create_handoff
disallowed-tools: Bash Write Edit NotebookEdit Read Glob Grep WebSearch WebFetch
---

# Tegy portable handoff

`$ARGUMENTS` must explicitly contain:

1. the completed Tegy `chat_id`;
2. the downstream task;
3. the locked decisions, or an explicit statement that there are none.

If any item is absent or ambiguous, ask for it and stop. Do not infer a task or
decision from the chat, from prose, or from the surrounding Claude
conversation.

If `mcp__tegy__get_account` is absent from the available tools or authentication
cannot start in this session, the Tegy command pack is installed but the Tegy
connector is not usable here. Tell the user to:

1. open [Connect Tegy](https://claude.ai/new?modal=add-custom-connector&connectorName=Tegy&connectorUrl=https%3A%2F%2Fmcp.tegy.io%2Fmcp#settings/customize-connectors);
2. add Tegy, select **Connect**, then sign in to Tegy and allow access;
3. enable Tegy in the Claude conversation;
4. retry this command in a new session if the tools are still absent.

Stop without claiming that Tegy ran.

1. Call `mcp__tegy__get_account` and stop on authentication or account action,
   showing the exact recovery URL. For authentication or reauthorization, use
   the **Connect Tegy** recovery steps above.
2. Call `mcp__tegy__get_chat` for the explicit chat id. If a turn is active,
   report its resource and stop until the user asks to retry after it is
   terminal.
3. Call `mcp__tegy__create_handoff` with:
   - the exact chat id;
   - the exact downstream task supplied by the user;
   - only the explicitly supplied locked decisions, or an empty array when the
     user explicitly said none;
   - one opaque idempotency key retained for identical retries. Invent it
     directly; never call Bash, `uuidgen`, a file tool, or another non-Tegy
     tool to generate it.
4. Return the handoff id, protected resource URI, byte count, MIME type,
   SHA-256, runtime version, and request id. Do not fetch or reproduce the full
   handoff unless the user explicitly asks. Add no health claim, implementation
   detail, runtime label, or evaluation absent from the tool result.

Never claim a handoff exists unless the Tegy tool returns success. Never create
a recap, raw transcript, inferred decision log, or fabricated Tegy output in
place of the protected resource. Surface `turn_still_active`,
`analysis_not_complete`, `handoff_too_large`, authentication, and service errors
exactly; do not retry them as paid analysis.
