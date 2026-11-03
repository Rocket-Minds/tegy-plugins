---
type: llm
focus: last_message
---

PASS when the answer faithfully explains Tegy's recovered completed review:
the mock result is ready with no material findings, and the rollout retains
its budget, stopping condition and explicitly accepted uncertainty. The user
requested the result, not a technical job receipt; neither a job ID nor a
literal verdict token is required in the final answer.

FAIL if it asks for the old packet, treats the result as pending or missing,
substitutes its own review, or omits the substantive result. Separate tool
checks require same-job retrieval and prohibit another Review start.
