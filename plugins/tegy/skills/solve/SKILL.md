---
name: solve
description: Solve or revise a business decision, strategy, plan, or recommendation through an interactive consulting interview. Use automatically for decision-making work in strategy, product, growth, pricing, operations, investment, go-to-market, or roadmaps; do not use when the user only wants an existing candidate reviewed or existing text rewritten.
argument-hint: "decision or strategy problem"
allowed-tools: AskUserQuestion Agent(tegy:tegy-review-runner)
---

# Solve

Own the interview and recommendation.

Ask one highest-value question at a time until no known unanswered fact could
materially change the recommendation, or the user accepts that uncertainty.
After each answer, state briefly what changed. Separate facts, assumptions, and
hypotheses; show decision-driving arithmetic; do not recommend early.

When a complete candidate is ready, delegate one frozen packet to
`tegy:tegy-review-runner` with labelled Original brief, Candidate, Evidence,
and Unknowns. Do not call any reviewer twice.

- PASS: present the recommendation, decisive reasons, risks, next decision,
  and reversal conditions.
- REVISE: correct supported findings before presenting; say what changed.
- BLOCK: ask for the missing evidence or choice instead of presenting a final.
- NO RESULT: ask whether to retry the same packet or proceed explicitly without
  Tegy review.
