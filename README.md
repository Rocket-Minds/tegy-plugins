# Tegy plugins

Tegy gives Claude Code three consulting commands backed by
[Tegy](https://app.tegy.io/mcp):

- **Solve** (`/tegy:solve`): Solve a hard strategic problem from end to end.
- **Review** (`/tegy:review`): Make an existing plan or analysis materially stronger.
- **Brief** (`/tegy:brief`): Communicate the thinking as an executive summary.

Claude may select each skill automatically from its description. Solve is for
making a decision, Review is for gating an existing candidate, and Brief is for
rewriting existing material without changing the underlying strategy.

## Claude Cowork

Use the Desktop package in `plugins/tegy-desktop` in **Cowork**, not Chat.
It has three skills, one hosted connection, and native delivery hooks.
There is no terminal setup or local consulting process.
Download the [Tegy plugin](https://github.com/Rocket-Minds/tegy-plugins/releases/download/desktop-v6.2.0/tegy-desktop-6.2.0.zip).

1. In Claude Desktop, select **Cowork** and upload the ZIP in **Customize > Plugins**.
2. Open the plugin's **Connectors** tab, select **Connect**, and sign in to Tegy.
3. Open the **Tegy Cowork** connector. Set **Receive Tegy result** to **Always allow**. Keep approval for Review and Brief separate if you want to approve each request.
4. Start a new Cowork task, type `/`, and select **Solve**, **Review**, or **Brief** from the menu.

Keep Cowork open while Tegy works. The plugin waits for the result and returns
it to Claude without a follow-up message. Claude applies Review findings before
finishing the recommendation. Brief returns the hosted text unchanged.
A receipt is not a passed review. If the connection fails or access is denied,
Claude must say that no review was received, not invent one.

On Team and Enterprise plans, an Owner or Primary Owner must first register
**Tegy Cowork** at
`https://mcp.tegy.io/mcp?delivery=app&integration=cowork`.
Keep this connection name: the hooks use it. An older Tegy connection with a
different URL does not replace this one. The package requests Review and Brief;
Claude's shared connector may also request Solve permission.

Solve asks decision-changing questions and builds a candidate in Claude, then
sends one frozen packet to hosted Review. It does not call hosted Solve.
Only hosted calls consume Tegy allowance under the user's plan. Receiving an
accepted result does not start or charge for another session.

Only supplied packet content reaches Tegy. Claude must read links or attachments
and include their relevant content. The hosted tools cannot fetch them.

### Limits

Automatic delivery requires Cowork hooks and an allowed, connected receiver.
It cannot resume a closed host or bypass the host's continuation limits.
The live card and an identical-request retry provide recovery without starting
the same work twice. Do not retry a failed request with changed content under
its old key.

Desktop Chat does not run these hooks. A direct connector still offers a live
result card, but the user must select **Discuss result** and send its draft to
continue. Use Cowork for the automatic review gate.

## Install in Claude Code

In a new Claude Code session:

```text
/plugin marketplace add Rocket-Minds/tegy-plugins
/plugin install tegy@tegy
/reload-plugins
```

Open `/mcp`, select the plugin-provided `tegy` server, and complete Tegy OAuth.
Allow the requested access. After connecting, the `/` picker shows
`/tegy:solve`, `/tegy:review`, and `/tegy:brief`.

Review and Brief consume Tegy allowance when their hosted tool runs. Solve asks
questions without spending review allowance; it uses one Review only when a
complete decision candidate is ready.

### Upgrading from older versions

Older setup instructions added a separate MCP server named `tegy`. That entry
can hide the plugin-provided server. Run `claude mcp remove tegy` in the scope
where it was added, reload plugins, then authenticate the plugin-provided Tegy
server in `/mcp`.

## Command behavior

### Solve

Use for a business decision, strategy, plan, or recommendation. Claude asks one
decision-changing question at a time, distinguishes evidence from assumptions,
updates its hypothesis, and avoids a premature recommendation. At the decision
boundary, it freezes the brief, candidate, evidence, and unknowns for one
independent Review. A PASS may be presented; REVISE is corrected; BLOCK returns
to the missing evidence or choice.

### Review

Use when a complete candidate already exists. Supply:

```text
Original brief: ...
Candidate: ...
Evidence: ...
Unknowns: ...
Criteria: ...        # optional
Idempotency key: ... # optional; reuse only for identical recovery
```

The isolated runner makes one hosted Review call and returns its terminal result
with PASS, REVISE, BLOCK, or NO RESULT. It does not poll or silently start a
second paid review.

### Brief

Use to edit analysis, notes, technical prose, or an AI draft into an executive
note, email, memo, status update, or slide-ready message. Supply Source text and
optionally Purpose, Audience, Format, Constraints, and an Idempotency key. The
isolated runner makes one hosted Brief call and returns only the finished
communication.

## Other clients

The Codex package remains the explicit `$tegy-review` decision gate. Add this
marketplace with `codex plugin marketplace add Rocket-Minds/tegy-plugins`, then
install `tegy-openai@tegy`.

Claude.ai and ChatGPT can connect directly to `https://mcp.tegy.io/mcp`, but a
raw connector does not install the Claude Code skills.

## Developer notes

The Claude Code plugin requests Review and Brief permissions. This supports all
three commands: `/tegy:solve` works through the problem in Claude, then calls
hosted `review`. It does not call the separate hosted `solve` tool. Do not add
`tegy:solve:run` to fix a supposed missing permission in this plugin.

A direct MCP client that calls hosted `solve` does need that permission. Request
only the scopes for the hosted tools your integration uses. See the
[authorization contract](https://github.com/Rocket-Minds/tegy-io/blob/main/docs/mcp-bounded-commands.md#authorization).

The Claude Code plugin is declarative: three skills, two tool runners, and one
hosted MCP connection. It ships no executable, hook, dependency, or install
script. The Cowork package uses skill-scoped native MCP hooks for delivery.

## Privacy and validation

Review sends only its frozen decision packet. Brief sends only its labelled
source packet. The plugin does not silently forward conversation history or
ambient files.

Validate locally with:

```bash
claude plugin validate ./plugins/tegy --strict
python3 /path/to/plugin-creator/scripts/validate_plugin.py ./plugins/tegy-openai
node tests/validate-structure.mjs
node tests/validate-desktop.mjs
claude plugin validate ./plugins/tegy-desktop --strict
```

See [app.tegy.io/mcp](https://app.tegy.io/mcp) for installation and connection
management.
