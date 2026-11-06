# Tegy for Claude Code

Install `tegy@tegy` from the Rocket-Minds/tegy-plugins marketplace. In `/mcp`, authenticate the `tegy` server.

Claude Code install: `/plugin install tegy --marketplace Rocket-Minds/tegy-plugins`.

Commands: `/tegy:review, /tegy:solve, /tegy:brief`. Review needs an original brief and complete draft;
Solve needs a business problem; Brief (Executive Summary) needs source text.
Only explicitly supplied material is sent. No ambient files, conversation
history, local code, hooks, Execute operation, or result card is required.

The connection uses `https://mcp.tegy.io/mcp?integration=openai&delivery=text&wait=complete`
and requests exactly `tegy:review:run`, `tegy:brief:run`, and `tegy:solve:run`.
After upgrading from Review-only, reauthenticate and confirm the three
permissions. Old jobs stay isolated to their original connection.

For each new operation, the host obtains a server-issued key through
`prepare_request`, then submits the selected material on that same connection.
It waits silently and returns Tegy's complete original text. Normal execution
does not require a Continue message. If an accepted receipt is returned, the
host awaits the same job through `read_result`; retrieval creates no second
operation.

After a user pause or permission denial, calls stop. Continue recovers the
accepted job, or retries the identical packet and key when its receipt is
unavailable. An interrupted host call does not establish whether the server
accepted it. Missing recovery information, a conflict or a terminal failure
is explained without silently starting replacement work. Changed input is new
work. The host controls tool permissions and does not substitute its own answer
for an unfinished Tegy result.

Operated by **MGMJ Innovation Group LLC (Tegy)**. Eligible account access is
required; Review and Solve use account allowance. Executive Summary does not
consume a customer session allowance. See the [full guide](https://github.com/Rocket-Minds/tegy-plugins#readme),
[connection guide](https://app.tegy.io/mcp), [help](https://help.tegy.io),
[privacy notice](https://tegy.io/privacy), and [terms](https://tegy.io/terms).
