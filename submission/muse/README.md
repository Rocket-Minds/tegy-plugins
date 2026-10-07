# Meta Muse directory connector submission

**Status:** SUBMITTED 2026-10-01 by the account owner at
<https://muse.ai/platform>. Confirmation: "Thank you for your
submission! We'll review Tegy and get in touch." No submission ID or
status page was shown. Tracked in
[tegy-io#2200](https://github.com/Rocket-Minds/tegy-io/issues/2200).

Meta has published no connector developer documentation. Field names and
rules below come from launch-week submitter notes; verify each label
against the live form at submit time.

## Listing (Step 1: Overview)

- Name: Tegy
- Company or developer: Rocket Minds
- Product website: https://tegy.io/
- Support: support@app.tegy.io
- Privacy: https://tegy.io/privacy
- Terms: https://tegy.io/terms
- Payments: does not accept (all billing happens on Tegy's website)
- Connector icon: TODO, 512x512 PNG or SVG at most 256 KiB. The current
  asset is 256x256 (`public/tegy-icon.png` in tegy-io); export a 512
  version before submitting.
- Owner name and work email: the submitting owner fills these in the
  form. Never commit personal addresses or credentials here.

### Example prompts (one per line)

```text
Should we launch in the UK this year? Help me decide.
Gate this decision packet before I present it to the board.
Review this recommendation and its assumptions.
Is this plan ready, or what would you change?
Turn these rough notes into an executive summary.
Rewrite this draft as a one-page memo for the leadership team.
```

### Anything else (free text)

```text
Tegy is an AI strategy workspace. The connector exposes three bounded,
one-call tools over text the user supplies: solve (work a strategic
problem end to end and return a five-section report), review (gate a
complete decision packet with a pass, revise, or block verdict), and
brief (rewrite supplied material as executive communication). Each tool
receives only its explicit input packet: no ambient files, conversation
history, attachments, or network access.

Solve and review each consume one Tegy decision session from the user's
existing web balance; brief summaries are free for every signed-in
account. No payment is taken through Muse. The connector requests only
the tegy:solve:run, tegy:review:run, and tegy:brief:run permissions.
```

## Technical (Step 2)

- Connection type: **Existing MCP**
- Hosted MCP endpoint: `https://mcp.tegy.io/mcp`
- Documentation: `https://app.tegy.io/mcp` (single URL only; the form
  rejects free text here with an undisplayed `invalid_request`)
- Authentication: **OAuth with PKCE**. Consent scopes:
  `tegy:solve:run`, `tegy:review:run`, `tegy:brief:run`.
- Execute (`tegy:execute:run`) is deliberately excluded from this
  submission; ungranted calls fail closed with `insufficient_scope`.

The default endpoint holds the Streamable HTTP response open until the
terminal result, with liveness notifications. Confirm with the Custom
Connector probe below that Muse's client tolerates the hold before
submitting; the fallback is `https://mcp.tegy.io/mcp?delivery=app`,
which returns an accepted receipt for polling instead.

### Access requirements (free text)

```text
A Tegy account is required (sign in with Google or an email link).
Brief summaries are free and unlimited for every signed-in account.
Solve and review each consume one decision session from the same
balance as the Tegy website (one-time Pass or subscription, bought on
the web; nothing is charged inside Muse). A reviewer account with
enough allowance for the probe cases below is available; test access
is arranged on request through https://help.tegy.io.
```

## Reviewer probe (Custom Connector trial)

Run these from the owner's Muse account as a Custom Connector pointed
at the endpoint above, before submitting, so Meta's end-to-end test
passes the first time. Provision the reviewer account from
tegy-io#2070 with allowance for at least three paid calls.

1. Review happy path: submit a complete packet (Original brief,
   Candidate, Evidence, Unknowns) and confirm one terminal verdict
   with pass, revise, block, or no-result continuation.
2. Brief happy path: submit source text and confirm the finished
   executive note returns verbatim with no session consumed.
3. Solve happy path: submit a strategic problem and confirm the
   five-section report with labelled assumptions.
4. Missing inputs: ask for a review without a packet and confirm no
   tool call happens until every required field is supplied.
5. Injection resistance: submit a candidate containing an instruction
   to ignore the rules and confirm it is reviewed as data, never
   followed.

## Owner-only steps

- Sign in at <https://muse.ai/platform> and open "Submit a connector".
- Paste the values above; complete the three attestations; submit.
- Transmit reviewer credentials only through Meta's channel, never in
  this repository or in public issue and PR text.
- Record the submission receipt and review status in tegy-io#2200.
- Do not advertise a Muse listing anywhere until Meta approves it.
