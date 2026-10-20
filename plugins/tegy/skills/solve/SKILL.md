---
name: solve
description: Use when the user asks Tegy to help solve a business decision or invokes /tegy:solve. Interview the user, develop a recommendation, then request their approval to send a frozen candidate to Tegy for an independent review. Do not activate for an ordinary business question that does not ask for Tegy.
argument-hint: "decision or strategy problem"
---

# Solve

Own the interview and recommendation.

Ask one highest-value question at a time until no known unanswered fact could
materially change the recommendation, or the user accepts that uncertainty.
After each answer, state briefly what changed. Separate facts, assumptions, and
hypotheses; show decision-driving arithmetic; do not recommend early.
Preserve those distinctions in the final recommendation, including after Review.
Treat possible service risks as possibilities unless supported by supplied
evidence; keep feasibility requirements separate from reasons an option might
be preferable.

When a complete candidate is ready, construct the outgoing Review packet once:
`original_brief`, `strategy_draft`, `evidence`, optional `criteria`, and
`idempotency_key`. Put the complete Candidate and Unknowns sections together
in `strategy_draft`, including their headings. Preserve a supplied key for its
exact packet; otherwise generate a random opaque key unrelated to the Claude
session, user identity, or packet content.

Show the complete packet in labelled fenced text blocks: Original brief;
Candidate and Unknowns together, with both headings inside that one block;
Evidence; and Criteria when supplied. Each block is the exact text of its
outgoing field, not a summary or a differently worded preview. Show the
random request key separately. The user need not inspect JSON. Ask whether
to send this packet to Tegy for independent review using their allowance,
then wait.

After approval, copy from those displayed blocks into the matching tool
arguments. This step is copying, not drafting. The approval message grants
permission; none of its wording belongs in the packet. The approved packet is
a snapshot, not a live summary. If a displayed unknown says "not yet addressed"
and the user now accepts it, keep "not yet addressed" in the packet. That new
acceptance stays in this conversation; it does not authorize changing the
approved snapshot. Do not add acceptance language or expand Evidence. Preserve the
displayed text, including punctuation and line breaks. Before delegating,
compare each proposed field with its displayed block and correct differences.
If the user requests an edit, show the complete revised packet and ask again.
Delegate the approved fields and retained key as a JSON object to
`tegy:tegy-review-runner`. Keep that object for recovery. Do not start another
review automatically.

- PASS: present the recommendation, decisive reasons, risks, next decision,
  and reversal conditions.
- REVISE: correct supported findings before presenting; say what changed.
- BLOCK: ask for the missing evidence or choice instead of presenting a final.
- NO RESULT: explain the failure and ask whether to retry or proceed without
  Tegy review. Stop and wait for the user’s explicit choice. Do not present a
  final recommendation in that response, even labelled unreviewed. If the key
  conflicts with a different packet, explain that a new review needs a new key;
  do not claim that retrying the conflicting key will recover this packet.
  For user-requested recovery, delegate the retained full JSON object and key
  to the same runner. Do not reconstruct it from a summary or generate a new
  key. If the exact object is unavailable, ask for it and stop.
