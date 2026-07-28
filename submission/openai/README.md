# OpenAI public plugin submission

This directory is the review packet for the initial Tegy skills-plus-MCP
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

> Run durable general strategy, GTM, product, and M&A work through Tegy. Attach
> only evidence you choose, see real usage and reset information, and create a
> portable handoff from completed analysis.

## Starter prompts

1. Pressure-test this strategic decision with Tegy.
2. Build a GTM recommendation from my evidence.
3. Create a portable handoff from my completed analysis.

## Release notes

Initial submission. Tegy provides an authenticated remote MCP service plus five
focused skills for general strategy, GTM, product, M&A, and portable handoff.
The service keeps chat state durable, reports exact user allowance and reset
information, supports explicit evidence inputs, and returns only real hosted
Tegy assistant output.

## Reviewer setup

The portal must receive a dedicated reviewer account that can complete all
cases in `test-cases.json` without MFA, SMS, email confirmation, or a private
network. Credentials must be provisioned and transmitted only through the
submission portal; they must never be committed here.

Before submission, prepare one completed chat owned by that reviewer and place
its id only in the portal's private reviewer notes. Give the account enough
allowance for the positive cases, then verify the exhausted-usage behavior
with a separate limited fixture or a deterministic review environment.

## Portal-only checks

- Confirm the submitter has Apps Management write access.
- Complete Rocket Minds developer or business identity verification.
- Scan the production MCP metadata and review the resulting tool snapshot.
- Enter the five positive and three negative cases from `test-cases.json`.
- Select only countries where Tegy's terms and support process are ready.
- Enter the release notes above and complete policy attestations.
- Submit for review. Approval does not publish automatically; publish the
  approved version separately.

No credential, access token, private strategy content, or upload URL belongs in
this repository or in public issue/PR text.
