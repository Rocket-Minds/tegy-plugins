---
name: tegy-advise
description: Run a general strategy request through the authenticated Tegy plugin when the user explicitly asks for Tegy, strategy consulting, decision pressure-testing, or a durable Tegy analysis.
metadata:
  short-description: Run durable general strategy work through Tegy
---

# Tegy strategy advice

Use the Tegy plugin's authenticated actions. A host may show them under `Tegy`
or the `tegy-mcp` MCP server; select each action by its final name below. Treat
the user's explicit strategy request as the exact instruction for Tegy. Do not
silently add surrounding conversation, local files, or inferred context.

1. Call `get_account`. If it returns an account action or authentication
   error, show the exact recovery URL and stop.
2. If the strategy request is missing, ask for it before creating paid work.
3. Create one durable chat with `create_chat`. Generate an opaque
   idempotency key directly and retain it only for an identical retry.
4. If the user explicitly selected evidence, follow
   [Evidence inputs](../../references/evidence-inputs.md) and retain the
   returned context or attachment identifiers.
5. Call `start_turn` with `capability: "advise"`, the exact user
   instruction, the chat id, the selected evidence identifiers, and a separate
   retained idempotency key. Never choose another capability from keywords.
6. Poll `get_turn` with `after_sequence` until the turn is `completed`,
   `partial`, `failed`, `cancelled`, or `waiting_for_user`.
7. If Tegy returns a questionnaire, present its exact stable questions and
   stop. Continue with `continue_turn` only after the user supplies the
   answers.
8. Reproduce the real Tegy assistant output faithfully and label it as Tegy
   output. Include the chat id, turn id, runtime version, usage receipt when
   present, and resource links. Do not fabricate, silently rewrite, or add
   evaluation that is absent from the tool result.

On `usage_limit_reached`, stop retries and show the exact limit, reset, and
recovery details. Keep user allowance, provider billing, provider throttling,
authentication, and service capacity errors distinct. Preserve and accurately
label useful real output from a `partial` result.
