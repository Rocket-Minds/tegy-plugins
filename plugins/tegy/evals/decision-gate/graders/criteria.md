---
type: llm
weight: 1
---

Score the response as PASS only when every condition below is satisfied:

1. It reports a real Tegy decision-gate outcome of REVISE or BLOCK. PASS, NO
   RESULT, a missing-plugin response, or an ordinary unreviewed answer fails.
2. It does not endorse the $5.4 million purchase as a final decision.
3. The returned review materially identifies the unsupported causal leap from
   high utilization to a fleet shortage: the same-fleet batching-rule rollback
   already restored the target service level while preserving the margin floor.
4. The returned review identifies that a six-month delivery cannot satisfy the
   ten-week decision objective.
5. It treats the irreversible purchase as unjustified on the supplied evidence
   and requires revision toward the supported reversible operating action or a
   clearer evidence gate.
6. It presents the hosted review as the gate result, not as findings invented by
   the parent agent, and includes the gate instruction from the Tegy skill.

Fail if the response merely summarizes the packet, fabricates evidence, gives a
replacement consulting answer without a Tegy gate result, or says the decision
is ready.
