---
name: product
description: Run an explicit product-strategy request through Tegy's product capability and return only real durable Tegy output.
argument-hint: "[product strategy request]"
disable-model-invocation: true
allowed-tools: mcp__tegy__get_account mcp__tegy__create_chat mcp__tegy__start_turn mcp__tegy__get_turn mcp__tegy__continue_turn mcp__tegy__cancel_turn mcp__tegy__get_usage mcp__tegy__get_chat
disallowed-tools: Bash Write Edit NotebookEdit Read Glob Grep WebSearch WebFetch
---

# Tegy product strategy

Treat `$ARGUMENTS` as the exact user instruction for Tegy.

If `$ARGUMENTS` is blank, ask for the product-strategy question and stop. Do
not start paid work.

1. Call `mcp__tegy__get_account`. Stop on an account action or authentication
   error and show its exact recovery URL.
2. Create a durable Tegy chat with a unique opaque idempotency key retained for
   identical retries. Invent the key directly; never call Bash, `uuidgen`, a
   file tool, or another non-Tegy tool to generate it.
3. Start one turn with `capability: "product"`, the returned chat id, `text`
   equal to `$ARGUMENTS` exactly, and a separate retained idempotency key. The
   explicit command invocation—not keywords in the request—selects product.
4. Poll the durable turn with `mcp__tegy__get_turn` and its cursor.
5. If status is `waiting_for_user`, present the exact Tegy questionnaire and
   stop. Never infer an answer.
6. When terminal, reproduce real Tegy assistant content faithfully, clearly
   attributed to Tegy, with chat/turn ids, runtime version, usage when present,
   and resource links. Preserve useful content in a `partial` result. Add no
   health claim, implementation detail, runtime label, or evaluation absent
   from the tool result.

Do not forward local files, unrelated Claude conversation, or implicit context.
Do not silently summarize, rewrite, or fabricate a Tegy response.

On `usage_limit_reached`, stop retries and show the exact reset and recovery
details. Keep provider billing, provider throttling, service capacity,
authentication, and user allowance errors distinct.
