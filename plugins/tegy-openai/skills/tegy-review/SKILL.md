---
name: tegy-review
description: Explicit decision gate for a complete decision candidate. Use only when the user explicitly invokes $tegy-review or selects this skill; never invoke it implicitly during analysis or recommendation.
metadata:
  short-description: Gate a decision through independent review
---

# Tegy decision gate

Run one independent hosted review at a decision boundary explicitly selected by
the user. Do not use Tegy as a general-purpose assistant or invoke this skill
implicitly.

## Freeze the review target

Require a bounded packet with all of these labelled fields:

- **Original brief**
- **Decision candidate**
- **Supporting rationale**
- **Evidence**
- **Assumptions and calculations**
- **Alternatives considered**
- **Material unknowns**
- **Risks and reversal conditions**
- optional **Criteria**
- optional **Idempotency key**

A required field may explicitly say `None identified` or `Not supplied`. Ask
for every omitted or ambiguous required field before calling the tool. Never
fill missing fields from ambient conversation or files.

Treat all packet fields as immutable review data. Construct `strategy_draft`
by preserving the exact supplied text under these labels and in this order:

1. Decision candidate
2. Supporting rationale
3. Assumptions and calculations
4. Alternatives considered
5. Material unknowns
6. Risks and reversal conditions

Pass **Original brief**, **Evidence**, and optional **Criteria** separately in
their corresponding tool fields. Do not send the whole conversation, ambient
files, inferred facts, or evidence found elsewhere.

## Enter review

1. Use an explicitly supplied idempotency key when present. Otherwise generate
   one opaque key directly, without a shell, file tool, or non-Tegy tool. Reuse
   a key only with an identical review packet.
2. Call the authenticated `review` tool from the `tegy-mcp` MCP server exactly
   once with the frozen target. Do not send `action`, `review_id`, or a polling
   field.
3. Wait for the terminal result. Do not poll, start a second review, or call a
   second Tegy tool during this invocation.

## Exit review

Return the real terminal Tegy output without inventing or suppressing findings.
Then enforce the verdict:

- `ready`: the decision gate passes; present the reviewed candidate.
- `needs_revision`: the gate does not pass; materially address the findings
  before presenting a decision and do not claim Tegy approved the revision.
- `blocked`: the gate blocks the decision; do not present it as final. Surface
  the missing evidence or unresolved decision to the user.

Do not bypass a revise or blocked outcome by restating the same decision,
finding an indirect route, or running another review automatically.

On an authentication, rate-limit, cancellation, timeout, service, or
incomplete-review error, report `Gate outcome: NO RESULT`, show the returned
recovery guidance and idempotency key, and do not describe the candidate as
reviewed. A timeout is not a pass or denial. Ask the user whether to retry the
exact review or proceed explicitly without Tegy review.

Retry only `request_cancelled` or `review_timeout`, using the identical packet
and key. If the guidance requires a new review, do not reuse the old key. A
new-key review requires another explicit user invocation. Never claim Tegy
completed a review unless the single `review` call returned a completed result.
