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

> Independently review a supplied strategy draft against its original brief.
> Tegy returns prioritized, anchored findings without rewriting the draft or
> accessing ambient conversation or files.

## Starter prompts

1. Review this strategy draft against its original brief.
2. Find the material gaps in my go-to-market plan.
3. Pressure-test this recommendation before I send it.

## Release notes

Review-only MVP. Tegy provides one authenticated remote-MCP tool and one
focused skill for independently reviewing a supplied strategy draft. The
service accepts only the original brief, immutable draft, and optionally
supplied review criteria or evidence. It returns only real hosted reviewer
output with a verdict and prioritized, anchored findings; it does not rewrite
the draft, create a new strategy, or access ambient context.

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
- Enter the two positive and three negative cases from `test-cases.json`.
- Select only countries where Tegy's terms and support process are ready.
- Enter the release notes above and complete policy attestations.
- Submit for review. Approval does not publish automatically; publish the
  approved version separately.

No credential, access token, private strategy content, or upload URL belongs in
this repository or in public issue/PR text.
