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

When a complete candidate is ready, show the user what will be sent and ask
whether to send it to Tegy for an independent review using their Tegy allowance.
Send only after they agree. Then delegate one frozen packet to
`tegy:tegy-review-runner` with labelled Original brief, Candidate, Evidence,
and Unknowns, plus an Idempotency key. Preserve a supplied key for its exact
packet. Otherwise generate a random opaque key unrelated to the Claude session,
user identity, or packet content. Keep that key with the frozen packet for
recovery; a changed packet needs a new key. Do not call any reviewer twice.

- PASS: present the recommendation, decisive reasons, risks, next decision,
  and reversal conditions.
- REVISE: correct supported findings before presenting; say what changed.
- BLOCK: ask for the missing evidence or choice instead of presenting a final.
- NO RESULT: explain the failure and ask whether to retry or proceed without
  Tegy review. Stop and wait for the user’s explicit choice. Do not present a
  final recommendation in that response, even labelled unreviewed. If the key
  conflicts with a different packet, explain that a new review needs a new key;
  do not claim that retrying the conflicting key will recover this packet.
