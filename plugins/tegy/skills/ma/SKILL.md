---
name: ma
description: Run an explicit M&A strategy request through Tegy's M&A capability and return only real durable Tegy output.
argument-hint: "[M&A strategy request]"
disable-model-invocation: true
allowed-tools: mcp__tegy__get_account mcp__tegy__create_chat mcp__tegy__start_turn mcp__tegy__get_turn mcp__tegy__continue_turn mcp__tegy__cancel_turn mcp__tegy__get_usage mcp__tegy__get_chat
disallowed-tools: Bash Write Edit NotebookEdit Read Glob Grep WebSearch WebFetch
---

# Tegy M&A strategy

Treat `$ARGUMENTS` as the exact user instruction for Tegy.

If `$ARGUMENTS` is blank, ask for the M&A question and stop. Do not start paid
work.

1. Call `mcp__tegy__get_account`. Stop on an account action or authentication
   error and show its exact recovery URL.
2. Create a durable Tegy chat with a unique opaque idempotency key retained for
   identical retries.
3. Start one turn with `capability: "ma"` and `text` equal to `$ARGUMENTS`
   exactly. The explicit `/tegy:ma` command is the capability selection; never
   route from keywords.
4. Poll `mcp__tegy__get_turn` using its cursor until terminal or
   `waiting_for_user`.
5. Present any questionnaire exactly and wait for explicit user answers before
   calling `mcp__tegy__continue_turn`.
6. Return only real Tegy assistant content, faithfully attributed, with
   chat/turn ids, runtime provenance, usage when present, and resource links.
   Preserve and accurately label useful `partial` output.

Do not forward local files, unrelated Claude transcript, or implicit context.
Do not silently summarize, rewrite, or fabricate Tegy output.

On `usage_limit_reached`, stop retries and report the exact reset and recovery
details. Keep provider billing, throttling, service capacity, authentication,
and user allowance failures distinct.
