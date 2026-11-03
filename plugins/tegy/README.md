# Tegy for Claude Code

Install `tegy@tegy` from the Rocket-Minds/tegy-plugins marketplace. In `/mcp`, authenticate the `tegy` server.

Claude Code install: `/plugin install tegy --marketplace Rocket-Minds/tegy-plugins`.

Commands: `/tegy:review, /tegy:solve, /tegy:brief`. Review needs an original brief and complete draft;
Solve needs a business problem; Brief (Executive Summary) needs source text.
Only explicitly supplied material is sent. No ambient files, conversation
history, local code, hooks, Execute operation, or result card is required.

The connection uses `https://mcp.tegy.io/mcp?integration=openai&delivery=text`
and requests exactly `tegy:review:run`, `tegy:brief:run`, and `tegy:solve:run`.
After upgrading from Review-only, reauthenticate and confirm the three
permissions. Old jobs stay isolated to their original connection.

Review and Solve return a completed answer or an accepted job. The host
retrieves that same job and presents Tegy's finished result faithfully. If it
is still running when waiting pauses, the host gives a brief status update;
ask to continue the same request later. A pending receipt is not failure or a
completed answer, and retrieval creates no second operation.

Executive Summary returns text directly. An explicit retry after interruption
uses the complete retained packet and identical key. After denial, failure or
a conflict, the host explains the next step naturally and keeps the exact
request for recovery, without a default full-JSON dump or an automatic new
request. A changed draft does not retain its earlier Review assessment. The
host controls tool permissions; it does not substitute its own answer for an
unfinished Tegy result.

Operated by **MGMJ Innovation Group LLC (Tegy)**. Eligible account access is
required; Review and Solve use account allowance. Executive Summary does not
consume a customer session allowance. See the [full guide](https://github.com/Rocket-Minds/tegy-plugins#readme),
[connection guide](https://app.tegy.io/mcp), [help](https://help.tegy.io),
[privacy notice](https://tegy.io/privacy), and [terms](https://tegy.io/terms).
