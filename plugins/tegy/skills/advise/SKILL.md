---
name: advise
description: Run an explicit general strategy request through the authenticated Tegy service and return only real durable Tegy output.
argument-hint: "[strategy request]"
disable-model-invocation: true
allowed-tools: mcp__tegy__get_account mcp__tegy__create_chat mcp__tegy__start_turn mcp__tegy__get_turn mcp__tegy__continue_turn mcp__tegy__cancel_turn mcp__tegy__get_usage mcp__tegy__get_chat
disallowed-tools: Bash Write Edit NotebookEdit Read Glob Grep WebSearch WebFetch
---

# Tegy strategy advice

Treat `$ARGUMENTS` as the exact user instruction for Tegy.

If `$ARGUMENTS` is blank, ask the user for the strategy question and stop. Do
not start paid work.

1. Call `mcp__tegy__get_account`.
2. If it returns `account_action_required`, show the supplied completion URL and
   stop. If authentication is unavailable, tell the user to connect
   `https://mcp.tegy.io/mcp` and stop.
3. Create a new durable chat with `mcp__tegy__create_chat`. Generate one opaque
   idempotency key, retain it in this conversation, and reuse it only when
   retrying the identical call. Invent the key directly; do not call Bash,
   `uuidgen`, a file tool, or any non-Tegy tool to generate it.
4. Call `mcp__tegy__start_turn` with:
   - the returned `chat_id`;
   - `capability: "advise"`;
   - `text` equal to `$ARGUMENTS` exactly;
   - a new retained idempotency key.
5. Poll `mcp__tegy__get_turn` with its cursor. Stop when status is
   `completed`, `partial`, `failed`, `cancelled`, or `waiting_for_user`.
6. When `waiting_for_user`, present the exact questionnaire and stop. After the
   user supplies answers, continue the same turn with
   `mcp__tegy__continue_turn`; do not infer missing answers.
7. On completion, label the returned assistant text as a real Tegy response and
   reproduce it faithfully. Include the `chat_id`, `turn_id`, runtime version,
   usage receipt when present, and resource links. Do not silently summarize,
   rewrite, or fabricate Tegy output. Add no health claim, implementation
   detail, runtime label, or evaluation that was not present in the tool result.

Never forward the surrounding Claude conversation, local files, or other
context unless the user explicitly supplies that material to Tegy. Never choose
a different capability from words in the request.

For typed errors:

- `usage_limit_reached`: stop retries; show the plan, limit kind, reset time,
  and recovery URL.
- `waiting_for_user`: ask the exact Tegy questions.
- `partial`: preserve and label the useful real output, then explain the
  failure.
- `provider_rate_limited` or `service_busy`: show the retry guidance without
  claiming the user's allowance is exhausted.
- authentication or reauthorization errors: direct the user to reconnect Tegy.
