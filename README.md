# Tegy plugins

Tegy gives Claude Code three consulting commands backed by
[Tegy](https://app.tegy.io/mcp):

- **Solve** (`/tegy:solve`): Solve a hard strategic problem from end to end.
- **Review** (`/tegy:review`): Make an existing plan or analysis materially stronger.
- **Brief** (`/tegy:brief`): Communicate the thinking as an executive summary.

Claude may select each skill automatically from its description. Solve is for
making a decision, Review is for gating an existing candidate, and Brief is for
rewriting existing material without changing the underlying strategy.

## Claude Desktop

The Desktop package in `plugins/tegy-desktop` contains three skills
and one hosted connection. It has no local executable or terminal setup.
Download [Desktop v6.1.1](https://github.com/Rocket-Minds/tegy-plugins/releases/download/desktop-v6.1.1/tegy-desktop-6.1.1.zip).

Upload its ZIP in **Customize > Plugins**, open the plugin's **Connectors** tab,
select **Connect**, and review the requested access. The package uses Review
and Brief; a shared Claude connector may also request Solve permission even
though this plugin does not call it. On Team plans, an Owner
must first register the package's `https://mcp.tegy.io/mcp?delivery=app` connection.
An existing connector with a different URL does not register this connection.

Solve follows the same interview and independent-review sequence as Claude Code:
Claude asks decision-changing questions and builds the candidate, then sends
one frozen packet to hosted Review. It does not call hosted Solve. Desktop Chat
does not run plugin subagents, so its skill calls Review directly. Review and
Brief use live result cards; only these hosted calls consume Tegy allowance.

An accepted receipt is not a review. When the card is ready, select **Discuss
result** to bring the completed review into Claude. In the tested Desktop Chat host,
this fills an unsent draft: send it so Claude can apply the findings and finish
the recommendation. Other hosts may send the message immediately. If the host
lacks that action, paste the completed review.
The card can finish after Claude stops responding, but does not automatically
resume Claude's reasoning. Never treat a pending review as approval.

Only supplied packet content reaches Tegy. To use a link or attachment, Claude
must read it and include the relevant content. The hosted tools cannot fetch it.
This package is separate from the Claude Code package and requires MCP Apps.

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

The plugin is declarative: three skills, two tool runners, and one hosted MCP
connection. It ships no executable, hook, dependency, or install script.

## Privacy and validation

Review sends only its frozen decision packet. Brief sends only its labelled
source packet. The plugin does not silently forward conversation history or
ambient files.

Validate locally with:

```bash
claude plugin validate ./plugins/tegy --strict
python3 /path/to/plugin-creator/scripts/validate_plugin.py ./plugins/tegy-openai
node tests/validate-structure.mjs
```

See [app.tegy.io/mcp](https://app.tegy.io/mcp) for installation and connection
management.
