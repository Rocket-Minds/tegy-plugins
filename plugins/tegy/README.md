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

Review and Solve return a completed result or an accepted job ID. Retrieve
that ID through the same connection, up to 24 reads per invocation. A receipt
is not completion. Executive Summary returns text directly; retry the exact
packet and key to recover it. Keep the complete packet/key returned after a
failure or denial. Do not replace a conflicting key or claim an edited draft
inherits Review approval. The host controls tool permissions.

Operated by **MGMJ Innovation Group LLC (Tegy)**. Eligible account access is
required; Review and Solve use account allowance. Executive Summary does not
consume a customer session allowance. See the [full guide](https://github.com/Rocket-Minds/tegy-plugins#readme),
[connection guide](https://app.tegy.io/mcp), [help](https://help.tegy.io),
[privacy notice](https://tegy.io/privacy), and [terms](https://tegy.io/terms).
