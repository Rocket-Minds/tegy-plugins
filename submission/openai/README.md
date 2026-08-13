# OpenAI public plugin submission

This directory is the review packet for Tegy's review-only skills-plus-MCP
submission.

## Listing

- Name: Tegy
- Publisher: Rocket Minds
- Category: Business & Operations
- Website: https://tegy.io/
- Setup and support: https://app.tegy.io/mcp and https://app.tegy.io/support
- Privacy: https://app.tegy.io/privacy
- Terms: https://app.tegy.io/terms
- Production MCP: https://mcp.tegy.io/mcp

Suggested summary:

> Gate an explicit decision candidate through one independent hosted review.
> Tegy returns a pass, revise, or block verdict with prioritized findings
> before the client presents the decision.

## Starter prompts

1. Gate this complete decision packet before I present it.
2. Review this recommendation and its assumptions.
3. Check whether this decision is ready, needs revision, or is blocked.

## Release notes

Explicit decision-gate release. Tegy provides one authenticated remote-MCP tool
for reviewing a frozen decision packet. The client enters the gate explicitly,
makes one long-running call without polling, waits for the terminal result, and
enforces pass, revise, block, or no-result continuation behavior. The skill is
not implicitly invoked during ordinary analysis or recommendations.

## Reviewer setup

The portal must receive a dedicated reviewer account that can complete all
cases in `test-cases.json` without MFA, SMS, email confirmation, or a private
network. Credentials must be provisioned and transmitted only through the
submission portal; they must never be committed here.

Give the reviewer account enough allowance for the positive cases and make
sure the remote MCP connection can complete OAuth consent with the sole
`tegy:review:run` scope.

## Portal-only checks

- Confirm the submitter has Apps Management write access.
- Complete Rocket Minds developer or business identity verification.
- Scan the production MCP metadata and verify that its tool snapshot contains
  only `review`.
- Enter the two positive and four negative cases from `test-cases.json`.
- Select only countries where Tegy's terms and support process are ready.
- Enter the release notes above and complete policy attestations.
- Submit for review. Approval does not publish automatically; publish the
  approved version separately.

No credential, access token, private strategy content, or upload URL belongs in
this repository or in public issue/PR text.
