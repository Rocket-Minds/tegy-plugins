---
name: gtm
description: Run an explicit go-to-market request through Tegy's GTM capability and return only real durable Tegy output.
argument-hint: "[go-to-market request]"
disable-model-invocation: true
allowed-tools: mcp__tegy__get_account mcp__tegy__create_chat mcp__tegy__start_turn mcp__tegy__get_turn mcp__tegy__continue_turn mcp__tegy__cancel_turn mcp__tegy__get_usage mcp__tegy__get_chat
disallowed-tools: Bash Write Edit NotebookEdit Read Glob Grep WebSearch WebFetch
---

# Tegy GTM

Treat `$ARGUMENTS` as the exact user instruction for Tegy.

If `$ARGUMENTS` is blank, ask for the go-to-market question and stop. Do not
start paid work.

1. Call `mcp__tegy__get_account`. Stop on an account action or authentication
   error and show its exact recovery URL.
2. Create a durable Tegy chat. Generate and retain a unique opaque idempotency
   key; reuse it only for an identical retry. Invent the key directly; never
   call Bash, `uuidgen`, a file tool, or another non-Tegy tool to generate it.
3. Start one turn with `capability: "gtm"` and `text` equal to `$ARGUMENTS`
   exactly. Never select the capability from keyword matching: the user's
   `/tegy:gtm` invocation is the selector.
4. Poll `mcp__tegy__get_turn` using its cursor until terminal or
   `waiting_for_user`.
5. If Tegy asks a questionnaire, show the exact stable questions and stop.
   Continue only with answers explicitly supplied by the user.
6. Return real completed Tegy assistant text faithfully with its `chat_id`,
   `turn_id`, runtime version, usage receipt when present, and resource links.
   Do not rewrite, silently summarize, or fabricate it. Add no health claim,
   implementation detail, runtime label, or evaluation absent from the tool
   result.

Do not send local files, the surrounding Claude transcript, or implicit context
to Tegy. Only `$ARGUMENTS` is authorized for this turn.

For `usage_limit_reached`, stop automatic retries and show the exact reset and
recovery details. Do not label provider throttling, provider billing, or Tegy
capacity errors as user quota exhaustion. Preserve useful output from a
`partial` result and label it accurately.
